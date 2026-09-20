<template>
    <div class="service-helper">
        <el-card class="!border-none" shadow="never">
            <template #header>
                <div class="flex items-center justify-between">
                    <span class="card-title">生活帮手</span>
                    <el-button type="primary" @click="openAdd">
                        <el-icon class="mr-1"><Plus /></el-icon>添加生活帮手
                    </el-button>
                </div>
            </template>

            <!-- 筛选搜索 -->
            <el-form inline class="mb-2">
                <el-form-item label="服务标题">
                    <el-input v-model="queryParams.keyword" placeholder="请输入生活帮手标题" clearable class="!w-60"
                        :prefix-icon="Search" @keyup.enter="onSearch" />
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="queryParams.status" placeholder="请选择" clearable class="!w-32">
                        <el-option label="显示" :value="1" />
                        <el-option label="隐藏" :value="0" />
                    </el-select>
                </el-form-item>
                <el-form-item label="添加时间">
                    <el-date-picker v-model="createRange" type="daterange" range-separator="至" start-placeholder="开始日期"
                        end-placeholder="结束日期" value-format="YYYY-MM-DD" class="!w-60" />
                </el-form-item>
                <el-form-item>
                    <el-button @click="resetQuery">重置</el-button>
                    <el-button type="primary" @click="onSearch">查询</el-button>
                </el-form-item>
            </el-form>

            <el-table :data="pager.lists" stripe v-loading="pager.loading">
                <el-table-column label="封面图" min-width="90">
                    <template #default="{ row }">
                        <el-image :src="row.cover" :preview-src-list="[row.cover]" preview-teleported fit="cover"
                            class="w-14 h-10 rounded" />
                    </template>
                </el-table-column>
                <el-table-column prop="title" label="生活帮手标题" min-width="200" show-overflow-tooltip />
                <el-table-column label="价格" min-width="140" align="right">
                    <template #default="{ row }">
                        <el-popover v-if="(row.specs || []).length > 1" placement="top" width="260" trigger="hover">
                            <template #reference>
                                <span class="text-orange-500 font-bold cursor-pointer">¥{{ minPrice(row) }} 起</span>
                            </template>
                            <div class="text-xs">
                                <div v-for="spec in row.specs" :key="spec.name"
                                    class="flex items-center justify-between py-1">
                                    <span>{{ spec.name }}</span>
                                    <span class="text-orange-500 font-bold">¥{{ money(spec.price) }}</span>
                                </div>
                            </div>
                        </el-popover>
                        <span v-else class="text-orange-500 font-bold">¥{{ minPrice(row) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="销量" min-width="90" align="center">
                    <template #default="{ row }">{{ row.sales ?? 0 }}</template>
                </el-table-column>
                <el-table-column label="状态" min-width="90">
                    <template #default="{ row }">
                        <el-switch :model-value="row.status" :active-value="1" :inactive-value="0"
                            @change="toggleShow(row)" />
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="排序" min-width="80" show-overflow-tooltip />
                <el-table-column prop="create_time" label="添加时间" min-width="170" show-overflow-tooltip />
                <el-table-column label="操作" width="130" fixed="right">
                    <template #default="{ row }">
                        <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
                        <el-button link type="danger" @click="delRow(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="flex justify-end mt-4">
                <el-pagination v-model:current-page="pager.page" v-model:page-size="pager.size" :total="pager.count"
                    layout="total, prev, pager, next" @current-change="getLists" />
            </div>
        </el-card>

        <!-- 添加 / 编辑弹窗 -->
        <el-dialog v-model="editVisible" :title="editForm.id ? '编辑生活帮手' : '添加生活帮手'" width="760px" top="5vh"
            destroy-on-close>
            <el-form :model="editForm" label-width="110px">
                <el-form-item label="服务标题" required>
                    <el-input v-model="editForm.title" placeholder="请输入生活帮手标题" maxlength="20" show-word-limit />
                </el-form-item>
                <el-form-item label="封面图" required>
                    <ImageUpload v-model="editForm.cover" :width="160" :height="100"
                        tip="建议尺寸 400×300，支持 jpg/png/webp，5MB 以内" />
                </el-form-item>
                <el-form-item label="规格类型" required>
                    <el-radio-group v-model="editForm.spec_type">
                        <el-radio :value="1">单规格</el-radio>
                        <el-radio :value="2">多规格</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="editForm.spec_type === 1" label="服务价格" required>
                    <el-input-number v-model="editForm.single_price" :min="0" :precision="2" :step="1" />
                    <span class="ml-2 text-xs text-tx-secondary">元</span>
                </el-form-item>
                <el-form-item v-else label="多规格价格" required>
                    <div class="w-full">
                        <div v-for="(spec, index) in editForm.specs" :key="index" class="flex items-center mb-2">
                            <el-input v-model="spec.name" placeholder="规格名称，如：空调维修" class="!w-56 mr-2"
                                maxlength="20" />
                            <el-input-number v-model="spec.price" :min="0" :precision="2" :step="1" class="mr-2" />
                            <span class="text-xs text-tx-secondary mr-2">元</span>
                            <el-button link type="danger" :disabled="editForm.specs.length <= 1"
                                @click="removeSpec(index)">删除</el-button>
                        </div>
                        <el-button link type="primary" @click="addSpec">
                            <el-icon class="mr-1"><Plus /></el-icon>添加规格
                        </el-button>
                        <div class="text-xs text-tx-secondary mt-1">至少保留 1 个规格，多个规格时列表价格展示为「最低价 起」</div>
                    </div>
                </el-form-item>
                <el-form-item label="详情介绍">
                    <Editor v-model="editForm.detail" height="300px" class="!w-full" />
                </el-form-item>
                <el-form-item label="排序">
                    <el-input-number v-model="editForm.sort" :min="0" :max="9999" />
                    <span class="ml-2 text-xs text-tx-secondary">数值越小越靠前</span>
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio-group v-model="editForm.status">
                        <el-radio :value="1">显示</el-radio>
                        <el-radio :value="0">隐藏</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="editVisible = false">取消</el-button>
                <el-button type="primary" @click="submitEdit">保存</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts" name="serviceHelper">
import { helperServices } from '@/mock/data_service'
import { usePaging } from '@/hooks/usePaging'
import { Search, Plus } from '@element-plus/icons-vue'
import Editor from '@/components/editor/index.vue'
import ImageUpload from '@/components/image-upload/index.vue'

const money = (val: any) => Number(val || 0).toFixed(2)
const minPrice = (row: any) => {
    const specs = row.specs || []
    if (!specs.length) return '0.00'
    return money(Math.min(...specs.map((i: any) => Number(i.price) || 0)))
}

const nowTimeStr = () => {
    const d = new Date()
    const p = (n: number) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

// ==================== 列表 ====================
const queryParams = reactive({ keyword: '', status: '' as '' | 0 | 1, start_time: '', end_time: '' })
const createRange = ref<string[]>([])

const getHelperList = (params: any = {}) => {
    const { page_no = 1, page_size = 15, keyword = '', status = '', start_time = '', end_time = '' } = params
    let lists: any[] = [...helperServices]
    if (keyword) lists = lists.filter((i) => i.title.includes(keyword))
    if (status !== '' && status !== undefined && status !== null) {
        lists = lists.filter((i) => i.status === Number(status))
    }
    if (start_time) lists = lists.filter((i) => String(i.create_time).slice(0, 10) >= start_time)
    if (end_time) lists = lists.filter((i) => String(i.create_time).slice(0, 10) <= end_time)
    const start = (Number(page_no) - 1) * Number(page_size)
    return Promise.resolve({ count: lists.length, lists: lists.slice(start, start + Number(page_size)) })
}

const { pager, getLists } = usePaging({ fetchFun: getHelperList, params: queryParams, firstLoading: true })

const onSearch = () => {
    queryParams.start_time = createRange.value?.[0] || ''
    queryParams.end_time = createRange.value?.[1] || ''
    pager.page = 1
    getLists()
}
const resetQuery = () => {
    queryParams.keyword = ''
    queryParams.status = ''
    createRange.value = []
    onSearch()
}

// ==================== 添加 / 编辑 ====================
const editVisible = ref(false)
const editForm = reactive({
    id: 0,
    title: '',
    cover: '',
    spec_type: 1 as 1 | 2,
    single_price: 0,
    specs: [] as { name: string; price: number }[],
    detail: '',
    sort: 0,
    status: 1
})

const addSpec = () => {
    editForm.specs.push({ name: '', price: 0 })
}
const removeSpec = (index: number) => {
    if (editForm.specs.length <= 1) return
    editForm.specs.splice(index, 1)
}

const openAdd = () => {
    Object.assign(editForm, {
        id: 0, title: '', cover: '', spec_type: 1, single_price: 0,
        specs: [{ name: '', price: 0 }], detail: '', sort: helperServices.length + 1, status: 1
    })
    editVisible.value = true
}
const openEdit = (row: any) => {
    const specs = (row.specs || []).map((i: any) => ({ name: i.name, price: Number(i.price) || 0 }))
    Object.assign(editForm, {
        id: row.id,
        title: row.title,
        cover: row.cover || '',
        spec_type: specs.length > 1 ? 2 : 1,
        single_price: specs.length ? specs[0].price : 0,
        specs: specs.length ? specs : [{ name: '', price: 0 }],
        detail: row.detail || '',
        sort: row.sort ?? 0,
        status: row.status
    })
    editVisible.value = true
}
const submitEdit = () => {
    if (!editForm.title.trim()) return ElMessage.warning('请输入生活帮手标题')
    if (!editForm.cover) return ElMessage.warning('请上传封面图')
    let specs: { name: string; price: number }[] = []
    if (editForm.spec_type === 1) {
        if (!(Number(editForm.single_price) > 0)) return ElMessage.warning('请设置服务价格')
        specs = [{ name: '单规格', price: Number(editForm.single_price) }]
    } else {
        if (!editForm.specs.length) return ElMessage.warning('请至少添加一个规格')
        const invalid = editForm.specs.findIndex((i) => !i.name.trim() || !(Number(i.price) > 0))
        if (invalid > -1) return ElMessage.warning(`第 ${invalid + 1} 个规格的名称或价格未填写完整`)
        specs = editForm.specs.map((i) => ({ name: i.name.trim(), price: Number(i.price) }))
    }
    const payload = {
        title: editForm.title.trim(),
        cover: editForm.cover,
        specs,
        detail: editForm.detail,
        sort: Number(editForm.sort) || 0,
        status: editForm.status
    }
    if (editForm.id) {
        const row = helperServices.find((i: any) => i.id === editForm.id)
        if (row) Object.assign(row, payload)
        ElMessage.success('保存成功')
    } else {
        helperServices.unshift({ id: Date.now(), ...payload, sales: 0, create_time: nowTimeStr() })
        ElMessage.success('添加成功')
    }
    editVisible.value = false
    getLists()
}

// ==================== 显示 / 隐藏 ====================
const toggleShow = (row: any) => {
    row.status = row.status === 1 ? 0 : 1
    ElMessage.success(row.status === 1 ? '已显示，前端可查看该服务项目' : '已隐藏，前端不再显示该服务项目')
}

// ==================== 删除 ====================
const delRow = (row: any) => {
    ElMessageBox.confirm(`确定删除生活帮手「${row.title}」吗？删除后前端不再显示。`, '删除确认', { type: 'warning' })
        .then(() => {
            const idx = helperServices.findIndex((i: any) => i.id === row.id)
            if (idx > -1) helperServices.splice(idx, 1)
            ElMessage.success('删除成功')
            getLists()
        })
        .catch(() => { })
}

onMounted(getLists)
</script>
