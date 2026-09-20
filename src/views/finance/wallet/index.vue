<template>
    <div class="finance-wallet">
        <el-tabs v-model="activeTab">
            <!-- 物业钱袋子 -->
            <el-tab-pane label="物业钱袋子" name="property">
                <el-card class="!border-none" shadow="never" v-loading="propertyPager.loading">
                    <template #header>
                        <div class="flex items-center justify-between">
                            <span class="card-title">物业钱袋子</span>
                            <el-button type="primary" @click="openAdd('property')">
                                <el-icon class="mr-1"><Plus /></el-icon>添加数据
                            </el-button>
                        </div>
                    </template>
                    <el-table :data="propertyPager.lists" stripe>
                        <el-table-column prop="month" label="所属月份" min-width="110" />
                        <el-table-column prop="title" label="钱袋子标题" min-width="240" show-overflow-tooltip />
                        <el-table-column label="收入金额" min-width="120" align="right">
                            <template #default="{ row }">
                                <span class="text-green-600 font-medium">¥{{ row.income_amount }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="支出金额" min-width="120" align="right">
                            <template #default="{ row }">
                                <span class="text-red-500 font-medium">¥{{ row.expense_amount }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="结余金额" min-width="120" align="right">
                            <template #default="{ row }">
                                <span class="font-medium">¥{{ row.balance_amount }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="收支明细" min-width="100" align="center">
                            <template #default="{ row }">{{ (row.items || []).length }} 条</template>
                        </el-table-column>
                        <el-table-column prop="create_time" label="上传时间" min-width="170" />
                        <el-table-column label="操作" width="110" fixed="right">
                            <template #default="{ row }">
                                <el-button type="primary" link @click="openEditItems(row, 'property')">编辑明细</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="flex justify-end mt-4">
                        <el-pagination
                            v-model:current-page="propertyPager.page"
                            v-model:page-size="propertyPager.size"
                            :total="propertyPager.count"
                            layout="total, prev, pager, next"
                            @current-change="propertyGetLists"
                        />
                    </div>
                </el-card>
            </el-tab-pane>

            <!-- 托管钱袋子 -->
            <el-tab-pane label="托管钱袋子" name="nursing">
                <el-card class="!border-none" shadow="never" v-loading="nursingPager.loading">
                    <template #header>
                        <div class="flex items-center justify-between">
                            <span class="card-title">托管钱袋子</span>
                            <el-button type="primary" @click="openAdd('nursing')">
                                <el-icon class="mr-1"><Plus /></el-icon>添加数据
                            </el-button>
                        </div>
                    </template>
                    <el-table :data="nursingPager.lists" stripe>
                        <el-table-column prop="month" label="所属月份" min-width="110" />
                        <el-table-column prop="title" label="钱袋子标题" min-width="240" show-overflow-tooltip />
                        <el-table-column label="订单数量" min-width="100" align="center">
                            <template #default="{ row }">{{ row.order_count }} 单</template>
                        </el-table-column>
                        <el-table-column label="预收金额" min-width="120" align="right">
                            <template #default="{ row }">
                                <span class="font-medium">¥{{ row.prepay_amount }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="成本金额" min-width="120" align="right">
                            <template #default="{ row }">
                                <span class="text-orange-500 font-medium">¥{{ row.cost_amount }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="每单单价" min-width="120" align="right">
                            <template #default="{ row }">¥{{ row.unit_price }}</template>
                        </el-table-column>
                        <el-table-column label="收支明细" min-width="100" align="center">
                            <template #default="{ row }">{{ (row.items || []).length }} 条</template>
                        </el-table-column>
                        <el-table-column prop="create_time" label="上传时间" min-width="170" />
                        <el-table-column label="操作" width="110" fixed="right">
                            <template #default="{ row }">
                                <el-button type="primary" link @click="openEditItems(row, 'nursing')">编辑明细</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="flex justify-end mt-4">
                        <el-pagination
                            v-model:current-page="nursingPager.page"
                            v-model:page-size="nursingPager.size"
                            :total="nursingPager.count"
                            layout="total, prev, pager, next"
                            @current-change="nursingGetLists"
                        />
                    </div>
                </el-card>
            </el-tab-pane>

            <!-- 膳食钱袋子 -->
            <el-tab-pane label="膳食钱袋子" name="meal">
                <el-card class="!border-none" shadow="never" v-loading="mealPager.loading">
                    <template #header>
                        <div class="flex items-center justify-between">
                            <span class="card-title">膳食钱袋子</span>
                            <el-button type="primary" @click="openAdd('meal')">
                                <el-icon class="mr-1"><Plus /></el-icon>添加数据
                            </el-button>
                        </div>
                    </template>
                    <el-table :data="mealPager.lists" stripe>
                        <el-table-column prop="month" label="所属月份" min-width="110" />
                        <el-table-column prop="title" label="钱袋子标题" min-width="240" show-overflow-tooltip />
                        <el-table-column label="订单数量" min-width="100" align="center">
                            <template #default="{ row }">{{ row.order_count }} 单</template>
                        </el-table-column>
                        <el-table-column label="预收金额" min-width="120" align="right">
                            <template #default="{ row }">
                                <span class="font-medium">¥{{ row.prepay_amount }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="成本金额" min-width="120" align="right">
                            <template #default="{ row }">
                                <span class="text-orange-500 font-medium">¥{{ row.cost_amount }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="每单单价" min-width="120" align="right">
                            <template #default="{ row }">¥{{ row.unit_price }}</template>
                        </el-table-column>
                        <el-table-column label="收支明细" min-width="100" align="center">
                            <template #default="{ row }">{{ (row.items || []).length }} 条</template>
                        </el-table-column>
                        <el-table-column prop="create_time" label="上传时间" min-width="170" />
                        <el-table-column label="操作" width="110" fixed="right">
                            <template #default="{ row }">
                                <el-button type="primary" link @click="openEditItems(row, 'meal')">编辑明细</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="flex justify-end mt-4">
                        <el-pagination
                            v-model:current-page="mealPager.page"
                            v-model:page-size="mealPager.size"
                            :total="mealPager.count"
                            layout="total, prev, pager, next"
                            @current-change="mealGetLists"
                        />
                    </div>
                </el-card>
            </el-tab-pane>
        </el-tabs>

        <!-- 添加数据：收支明细以多条记录形式上传，每条单独填写名称/金额/凭证 -->
        <el-dialog v-model="addState.show" :title="addState.title" width="820px">
            <el-form label-width="120px">
                <el-form-item label="钱袋子标题">
                    <el-input v-model="form.title" placeholder="请输入钱袋子标题" clearable />
                </el-form-item>
                <el-form-item label="所属月份">
                    <el-date-picker
                        v-model="form.month"
                        type="month"
                        value-format="YYYY-MM"
                        placeholder="请选择所属月份"
                        class="!w-full"
                    />
                </el-form-item>
                <el-form-item v-if="addState.tab !== 'property'" label="订单数量">
                    <el-input-number v-model="form.order_count" :min="0" :precision="0" class="!w-[220px]" />
                    <span class="ml-2 text-tx-secondary">单</span>
                </el-form-item>
                <el-form-item label="收支明细">
                    <div class="w-full">
                        <div
                            v-for="(it, idx) in form.items"
                            :key="it.id"
                            class="flex items-center gap-2 mb-3"
                        >
                            <el-input v-model="it.name" placeholder="明细名称" class="!w-[170px]" />
                            <el-select v-model="it.type" class="!w-[90px]">
                                <el-option label="收入" :value="1" />
                                <el-option label="支出" :value="2" />
                            </el-select>
                            <el-input-number
                                v-model="it.amount"
                                :min="0"
                                :precision="2"
                                :controls="false"
                                placeholder="金额"
                                class="!w-[110px]"
                            />
                            <ImageUpload v-model="it.voucher" :width="104" :height="72" text="凭证" />
                            <el-button
                                type="danger"
                                link
                                :disabled="form.items.length <= 1"
                                @click="form.items.splice(idx, 1)"
                            >
                                <el-icon><Delete /></el-icon>
                            </el-button>
                        </div>
                        <el-button type="primary" plain @click="addDetailRow">
                            <el-icon class="mr-1"><Plus /></el-icon>添加明细
                        </el-button>
                    </div>
                </el-form-item>
            </el-form>
            <div class="flex items-center gap-6 mt-2 px-1 text-sm">
                <span>收入合计：<span class="text-green-600 font-medium">¥{{ money(addIncome) }}</span></span>
                <span>支出合计：<span class="text-red-500 font-medium">¥{{ money(addExpense) }}</span></span>
                <span v-if="addState.tab === 'property'">
                    结余金额：<span class="font-medium">¥{{ money(addIncome - addExpense) }}</span>
                    <span class="ml-1 text-xs text-tx-secondary">自动汇总</span>
                </span>
                <span v-else>
                    每单单价：<span class="font-medium">¥{{ addUnitPrice }}</span>
                    <span class="ml-1 text-xs text-tx-secondary">预收合计 ÷ 订单数量</span>
                </span>
            </div>
            <template #footer>
                <el-button @click="addState.show = false">取消</el-button>
                <el-button type="primary" :loading="addState.saving" @click="submitAdd">确定添加</el-button>
            </template>
        </el-dialog>

        <!-- 编辑明细：对每一条收支明细单独编辑名称 / 金额 / 凭证图片 -->
        <el-dialog v-model="editState.show" :title="editState.title" width="820px">
            <div class="flex items-center gap-6 mb-4 px-1 text-sm">
                <span>收入合计：<span class="text-green-600 font-medium">¥{{ money(editIncome) }}</span></span>
                <span>支出合计：<span class="text-red-500 font-medium">¥{{ money(editExpense) }}</span></span>
                <span v-if="editState.tab === 'property'">
                    结余金额：<span class="font-medium">¥{{ money(editIncome - editExpense) }}</span>
                </span>
                <span v-else>
                    每单单价：<span class="font-medium">¥{{ editUnitPrice }}</span>
                </span>
            </div>
            <div
                v-for="(it, idx) in editState.items"
                :key="it.id"
                class="flex items-center gap-2 mb-3"
            >
                <el-input v-model="it.name" placeholder="明细名称" class="!w-[170px]" />
                <el-select v-model="it.type" class="!w-[90px]">
                    <el-option label="收入" :value="1" />
                    <el-option label="支出" :value="2" />
                </el-select>
                <el-input-number
                    v-model="it.amount"
                    :min="0"
                    :precision="2"
                    :controls="false"
                    placeholder="金额"
                    class="!w-[110px]"
                />
                <ImageUpload v-model="it.voucher" :width="104" :height="72" text="凭证" />
                <el-button type="danger" link @click="editState.items.splice(idx, 1)">
                    <el-icon><Delete /></el-icon>
                </el-button>
            </div>
            <el-button type="primary" plain @click="addEditRow">
                <el-icon class="mr-1"><Plus /></el-icon>添加明细
            </el-button>
            <template #footer>
                <el-button @click="editState.show = false">取消</el-button>
                <el-button type="primary" :loading="editState.saving" @click="saveEditItems">保存明细</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts" name="financeWallet">
import { walletMeal, walletNursing, walletProperty } from '@/mock/data_finance'
import type { WalletItem } from '@/mock/data_finance'
import { usePaging } from '@/hooks/usePaging'
import ImageUpload from '@/components/image-upload/index.vue'
import { Plus, Delete } from '@element-plus/icons-vue'

const activeTab = ref('property')

/** 三个钱袋子共用一个本地分页读取逻辑 */
const createPaging = (source: () => any[]) => {
    const { pager, getLists } = usePaging({
        fetchFun: (params: Record<string, any>) =>
            Promise.resolve({
                count: source().length,
                lists: source().slice((params.page_no - 1) * params.page_size, params.page_no * params.page_size)
            }),
        params: {},
        firstLoading: true
    })
    return { pager, getLists }
}

const { pager: propertyPager, getLists: propertyGetLists } = createPaging(() => walletProperty)
const { pager: nursingPager, getLists: nursingGetLists } = createPaging(() => walletNursing)
const { pager: mealPager, getLists: mealGetLists } = createPaging(() => walletMeal)

const tabNames: Record<string, string> = {
    property: '物业钱袋子',
    nursing: '托管钱袋子',
    meal: '膳食钱袋子'
}

const money = (v: number) => Number(v || 0).toFixed(2)
/** 明细按类型汇总：type 1=收入 2=支出 */
const sumItems = (items: WalletItem[], type: 1 | 2) =>
    (items || []).filter((i) => i.type === type).reduce((s, i) => s + (Number(i.amount) || 0), 0)
/** 明细行统一校验：名称 / 金额 / 凭证图片 */
const validateItems = (items: WalletItem[]) => {
    if (!items.length) return '请至少添加一条收支明细'
    for (let i = 0; i < items.length; i++) {
        const it = items[i]
        if (!String(it.name || '').trim()) return `第 ${i + 1} 条明细请输入明细名称`
        if (!(Number(it.amount) > 0)) return `第 ${i + 1} 条明细请输入大于 0 的金额`
        if (!it.voucher) return `第 ${i + 1} 条明细请上传凭证图片`
    }
    return ''
}

let itemSeq = 1
const nextItemId = () => Date.now() + itemSeq++
const createRow = (): WalletItem => ({ id: nextItemId(), name: '', type: 1, amount: 0 as any, voucher: '' })

/* ==================== 添加数据 ==================== */
const addState = reactive({ show: false, tab: 'property', title: '添加物业钱袋子数据', saving: false })
const form = reactive({
    title: '',
    month: '',
    order_count: 0,
    items: [] as WalletItem[]
})

const addIncome = computed(() => sumItems(form.items, 1))
const addExpense = computed(() => sumItems(form.items, 2))
const addUnitPrice = computed(() =>
    money(Number(form.order_count) > 0 ? addIncome.value / Number(form.order_count) : 0)
)

const addDetailRow = () => form.items.push(createRow())

const openAdd = (tab: string) => {
    Object.assign(form, { title: '', month: '', order_count: 0, items: [createRow()] })
    addState.tab = tab
    addState.title = `添加${tabNames[tab]}数据`
    addState.show = true
}

const nowTimeStr = () => {
    const d = new Date()
    const p = (n: number) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

const submitAdd = () => {
    if (!form.title.trim()) return ElMessage.warning('请输入钱袋子标题')
    if (!form.month) return ElMessage.warning('请选择所属月份')
    const err = validateItems(form.items)
    if (err) return ElMessage.warning(err)
    addState.saving = true
    try {
        const items = form.items.map((it, i) => ({
            id: i + 1,
            name: String(it.name).trim(),
            type: it.type,
            amount: money(Number(it.amount)),
            voucher: it.voucher
        }))
        const income = sumItems(items, 1)
        const expense = sumItems(items, 2)
        let row: Record<string, any>
        if (addState.tab === 'property') {
            row = {
                id: Date.now(),
                title: form.title.trim(),
                month: form.month,
                items,
                income_amount: money(income),
                expense_amount: money(expense),
                balance_amount: money(income - expense),
                create_time: nowTimeStr()
            }
            walletProperty.unshift(row)
            propertyGetLists()
        } else {
            row = {
                id: Date.now(),
                title: form.title.trim(),
                month: form.month,
                order_count: Number(form.order_count) || 0,
                items,
                prepay_amount: money(income),
                cost_amount: money(expense),
                unit_price:
                    Number(form.order_count) > 0 ? money(income / Number(form.order_count)) : '0.00',
                create_time: nowTimeStr()
            }
            if (addState.tab === 'nursing') {
                walletNursing.unshift(row)
                nursingGetLists()
            } else {
                walletMeal.unshift(row)
                mealGetLists()
            }
        }
        ElMessage.success('添加成功')
        addState.show = false
    } finally {
        addState.saving = false
    }
}

/* ==================== 编辑明细 ==================== */
const editState = reactive({
    show: false,
    tab: 'property',
    title: '',
    saving: false,
    row: null as any,
    items: [] as WalletItem[]
})

const editIncome = computed(() => sumItems(editState.items, 1))
const editExpense = computed(() => sumItems(editState.items, 2))
const editUnitPrice = computed(() => {
    const count = Number(editState.row?.order_count) || 0
    return money(count > 0 ? editIncome.value / count : 0)
})

const openEditItems = (row: any, tab: string) => {
    editState.row = row
    editState.tab = tab
    editState.title = `编辑收支明细 - ${row.title}（${row.month}）`
    // 深拷贝副本编辑，保存时才写回主记录
    editState.items = (row.items || []).map((it: WalletItem) => ({
        ...it,
        amount: Number(it.amount) || 0
    })) as WalletItem[]
    editState.show = true
}

const addEditRow = () => editState.items.push(createRow())

const saveEditItems = () => {
    const err = validateItems(editState.items)
    if (err) return ElMessage.warning(err)
    editState.saving = true
    try {
        const row = editState.row
        const items = editState.items.map((it, i) => ({
            id: i + 1,
            name: String(it.name).trim(),
            type: it.type,
            amount: money(Number(it.amount)),
            voucher: it.voucher
        }))
        const income = sumItems(items, 1)
        const expense = sumItems(items, 2)
        row.items = items
        if (editState.tab === 'property') {
            row.income_amount = money(income)
            row.expense_amount = money(expense)
            row.balance_amount = money(income - expense)
        } else {
            row.prepay_amount = money(income)
            row.cost_amount = money(expense)
            const count = Number(row.order_count) || 0
            row.unit_price = count > 0 ? money(income / count) : '0.00'
        }
        propertyGetLists()
        nursingGetLists()
        mealGetLists()
        ElMessage.success('明细已保存')
        editState.show = false
    } finally {
        editState.saving = false
    }
}

onMounted(() => {
    propertyGetLists()
    nursingGetLists()
    mealGetLists()
})
</script>
