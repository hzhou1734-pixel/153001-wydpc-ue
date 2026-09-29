<template>
    <div class="items-editor w-full">
        <!-- 工具栏 -->
        <div class="mb-2 flex items-center justify-between">
            <span class="text-tx-secondary">共 {{ model?.length || 0 }} 条明细</span>
            <div class="flex">
                <el-button type="primary" plain @click="addRow">
                    <el-icon class="mr-1"><Plus /></el-icon>添加明细
                </el-button>
                <el-button plain @click="openImport">
                    <el-icon class="mr-1"><Upload /></el-icon>导入 Excel
                </el-button>
            </div>
        </div>

        <!-- 表头 -->
        <div v-if="model && model.length" class="ie-row ie-head">
            <span>明细名称</span>
            <span>类型</span>
            <span>金额（元）</span>
            <span>凭证图片</span>
            <span></span>
        </div>

        <!-- 明细行 -->
        <div v-for="(it, idx) in model" :key="it.id" class="ie-row ie-item">
            <el-input v-model="it.name" placeholder="如：物业费收入" clearable />
            <el-select v-model="it.type">
                <el-option label="收入" :value="1" />
                <el-option label="支出" :value="2" />
            </el-select>
            <el-input-number
                v-model="it.amount"
                :min="0"
                :precision="2"
                :controls="false"
                placeholder="0.00"
                class="!w-full"
            />
            <ImageUpload v-model="it.voucher" :width="84" :height="56" text="凭证" />
            <el-button
                type="danger"
                link
                :disabled="(model?.length || 0) <= minRows"
                @click="model?.splice(idx, 1)"
            >
                <el-icon><Delete /></el-icon>
            </el-button>
        </div>

        <!-- 空态 -->
        <div
            v-if="!model || !model.length"
            class="rounded-lg border border-dashed border-gray-300 py-8 text-center text-tx-secondary"
        >
            暂无明细，请点击「添加明细」或「导入 Excel」
        </div>

        <!-- 导入 Excel 弹窗 -->
        <el-dialog v-model="importShow" title="从 Excel 导入收支明细" width="520px" append-to-body>
            <div class="mb-3 rounded-lg bg-gray-50 px-4 py-3 text-sm leading-6 text-tx-secondary">
                ① Excel 表头需包含：<span class="font-medium">明细名称、类型（收入/支出）、金额</span><br />
                ② 凭证图片不支持随 Excel 导入，导入后请在明细行中逐条上传凭证
            </div>
            <el-upload
                drag
                accept=".xlsx,.xls,.csv"
                :auto-upload="false"
                :show-file-list="false"
                :on-change="onFileChange"
            >
                <el-icon class="text-3xl text-tx-secondary"><UploadFilled /></el-icon>
                <div class="mt-2 text-sm">拖拽文件到此处，或<em>点击选择文件</em></div>
                <template #tip>
                    <div class="mt-1 text-center text-xs text-tx-secondary">支持 .xlsx / .xls / .csv</div>
                </template>
            </el-upload>
            <div v-if="parsed.length || parsedBad" class="mt-3 text-sm">
                <template v-if="parsed.length">
                    已解析 <span class="font-medium">{{ parsed.length }}</span> 条有效明细
                    （收入 {{ parsedIncomeCount }} 条 / 支出 {{ parsedExpenseCount }} 条）
                    <span v-if="parsedBad" class="text-tx-secondary">，{{ parsedBad }} 条无效行已忽略</span>
                </template>
                <span v-else class="text-red-500">未解析到有效明细行，请检查表头与数据格式</span>
            </div>
            <template #footer>
                <el-button @click="importShow = false">取消</el-button>
                <el-button type="primary" :disabled="!parsed.length" @click="applyImport">
                    导入{{ parsed.length ? ` ${parsed.length} 条` : '' }}
                </el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts" name="walletItemsEditor">
import type { WalletItem } from '@/mock/data_finance'
import ImageUpload from '@/components/image-upload/index.vue'
import { Plus, Delete, Upload, UploadFilled } from '@element-plus/icons-vue'
import * as XLSX from 'xlsx'

const props = defineProps<{
    /** 最少保留行数（低于该数量禁用删除） */
    minRows?: number
}>()

const model = defineModel<WalletItem[]>()

const minRows = computed(() => props.minRows ?? 1)

let seq = 1
const nextId = () => Date.now() + seq++
const addRow = () => model.value?.push({ id: nextId(), name: '', type: 1, amount: 0 as any, voucher: '' })

/* ==================== Excel 导入 ==================== */
const importShow = ref(false)
const parsed = ref<{ name: string; type: 1 | 2; amount: number }[]>([])
const parsedBad = ref(0)

const parsedIncomeCount = computed(() => parsed.value.filter((p) => p.type === 1).length)
const parsedExpenseCount = computed(() => parsed.value.filter((p) => p.type === 2).length)

const openImport = () => {
    parsed.value = []
    parsedBad.value = 0
    importShow.value = true
}

/** 按别名列表从行对象中取值（表头兼容：明细名称/名称、类型/收支、金额/金额（元）等） */
const pick = (row: Record<string, any>, aliases: string[]) => {
    const keys = Object.keys(row)
    for (const alias of aliases) {
        const hit = keys.find((k) => String(k).trim() === alias)
        if (hit !== undefined) return row[hit]
    }
    for (const alias of aliases) {
        const hit = keys.find((k) => String(k).trim().includes(alias))
        if (hit !== undefined) return row[hit]
    }
    return ''
}

const onFileChange = async (uploadFile: any) => {
    const raw: File | undefined = uploadFile?.raw
    if (!raw) return
    try {
        const buf = await raw.arrayBuffer()
        const wb = XLSX.read(buf, { type: 'array' })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const rows = XLSX.utils.sheet_to_json<Record<string, any>>(ws, { defval: '' })
        const good: { name: string; type: 1 | 2; amount: number }[] = []
        let bad = 0
        for (const r of rows) {
            const name = pick(r, ['明细名称', '名称', '项目'])
            const typeTxt = String(pick(r, ['类型', '收支类型', '收支'])).trim()
            const amount = Number(String(pick(r, ['金额', '数额'])).replace(/[¥￥,，\s]/g, ''))
            let type: 1 | 2 = 1
            if (typeTxt.includes('支') || typeTxt === '2') type = 2
            else if (typeTxt.includes('收') || typeTxt === '1') type = 1
            else { bad++; continue }
            if (String(name).trim() && amount > 0) {
                good.push({ name: String(name).trim(), type, amount: Math.round(amount * 100) / 100 })
            } else {
                bad++
            }
        }
        parsed.value = good
        parsedBad.value = bad
    } catch (e) {
        parsed.value = []
        parsedBad.value = 0
        ElMessage.error('文件解析失败，请确认为 .xlsx / .xls / .csv 格式')
    }
}

const isEmptyRow = (it: WalletItem) =>
    !String(it.name || '').trim() && !(Number(it.amount) > 0) && !it.voucher

const applyImport = () => {
    if (!model.value || !parsed.value.length) return
    // 默认空行直接被导入数据替换
    if (model.value.length === 1 && isEmptyRow(model.value[0])) model.value.splice(0, 1)
    for (const p of parsed.value) {
        model.value.push({ id: nextId(), name: p.name, type: p.type, amount: p.amount as any, voucher: '' })
    }
    ElMessage.success(`已导入 ${parsed.value.length} 条明细，请逐条补充凭证图片`)
    importShow.value = false
}
</script>

<style scoped>
.ie-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 92px 132px 96px 32px;
    gap: 8px;
    align-items: center;
    padding: 8px 12px;
}
.ie-head {
    font-size: 12px;
    color: var(--el-text-color-secondary);
    line-height: 20px;
    padding-bottom: 2px;
}
.ie-item {
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 8px;
    margin-bottom: 8px;
    background: var(--el-fill-color-extra-light);
}
</style>
