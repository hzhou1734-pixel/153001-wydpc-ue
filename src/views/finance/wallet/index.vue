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
                        <el-table-column prop="month" label="所属月份" width="110" />
                        <el-table-column prop="title" label="钱袋子标题" min-width="240" show-overflow-tooltip />
                        <el-table-column label="支出金额" min-width="120" align="right">
                            <template #default="{ row }">
                                <span class="text-red-500 font-medium">¥{{ row.expense_amount }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="支出凭证" width="120" align="center">
                            <template #default="{ row }">
                                <el-image
                                    v-if="row.expense_voucher"
                                    :src="row.expense_voucher"
                                    :preview-src-list="[row.expense_voucher]"
                                    preview-teleported
                                    fit="cover"
                                    class="w-20 h-12 rounded"
                                />
                                <span v-else class="text-tx-secondary">-</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="收入金额" min-width="120" align="right">
                            <template #default="{ row }">
                                <span class="text-green-600 font-medium">¥{{ row.income_amount }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="收入凭证" width="120" align="center">
                            <template #default="{ row }">
                                <el-image
                                    v-if="row.income_voucher"
                                    :src="row.income_voucher"
                                    :preview-src-list="[row.income_voucher]"
                                    preview-teleported
                                    fit="cover"
                                    class="w-20 h-12 rounded"
                                />
                                <span v-else class="text-tx-secondary">-</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="结余金额" min-width="120" align="right">
                            <template #default="{ row }">
                                <span class="font-medium">¥{{ row.balance_amount }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="create_time" label="上传时间" width="160" />
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
                        <el-table-column prop="month" label="所属月份" width="110" />
                        <el-table-column prop="title" label="钱袋子标题" min-width="240" show-overflow-tooltip />
                        <el-table-column label="订单数量" width="100" align="center">
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
                        <el-table-column label="结算凭证" width="120" align="center">
                            <template #default="{ row }">
                                <el-image
                                    v-if="row.voucher"
                                    :src="row.voucher"
                                    :preview-src-list="[row.voucher]"
                                    preview-teleported
                                    fit="cover"
                                    class="w-20 h-12 rounded"
                                />
                                <span v-else class="text-tx-secondary">-</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="create_time" label="上传时间" width="160" />
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
                        <el-table-column prop="month" label="所属月份" width="110" />
                        <el-table-column prop="title" label="钱袋子标题" min-width="240" show-overflow-tooltip />
                        <el-table-column label="订单数量" width="100" align="center">
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
                        <el-table-column label="结算凭证" width="120" align="center">
                            <template #default="{ row }">
                                <el-image
                                    v-if="row.voucher"
                                    :src="row.voucher"
                                    :preview-src-list="[row.voucher]"
                                    preview-teleported
                                    fit="cover"
                                    class="w-20 h-12 rounded"
                                />
                                <span v-else class="text-tx-secondary">-</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="create_time" label="上传时间" width="160" />
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

        <!-- 添加数据 -->
        <el-dialog v-model="addState.show" :title="addState.title" width="620px">
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

                <template v-if="addState.tab === 'property'">
                    <el-form-item label="支出金额">
                        <el-input-number v-model="form.expense_amount" :min="0" :precision="2" class="!w-[220px]" />
                        <span class="ml-2 text-tx-secondary">元</span>
                    </el-form-item>
                    <el-form-item label="收入金额">
                        <el-input-number v-model="form.income_amount" :min="0" :precision="2" class="!w-[220px]" />
                        <span class="ml-2 text-tx-secondary">元</span>
                    </el-form-item>
                    <el-form-item label="结余金额">
                        <el-input-number v-model="form.balance_amount" :precision="2" class="!w-[220px]" />
                        <span class="ml-2 text-tx-secondary">元</span>
                    </el-form-item>
                    <el-form-item label="支出凭证">
                        <ImageUpload v-model="form.expense_voucher" :width="160" :height="100" text="上传支出凭证" />
                    </el-form-item>
                    <el-form-item label="收入凭证">
                        <ImageUpload v-model="form.income_voucher" :width="160" :height="100" text="上传收入凭证" />
                    </el-form-item>
                </template>

                <template v-else>
                    <el-form-item label="订单数量">
                        <el-input-number v-model="form.order_count" :min="0" :precision="0" class="!w-[220px]" />
                        <span class="ml-2 text-tx-secondary">单</span>
                    </el-form-item>
                    <el-form-item label="每单单价">
                        <el-input-number v-model="form.unit_price" :min="0" :precision="2" class="!w-[220px]" />
                        <span class="ml-2 text-tx-secondary">元</span>
                    </el-form-item>
                    <el-form-item label="预收金额">
                        <span class="font-medium">¥{{ computedPrepay }}</span>
                        <span class="ml-2 text-xs text-tx-secondary">预收 = 订单数量 × 每单单价，自动计算</span>
                    </el-form-item>
                    <el-form-item label="成本金额">
                        <el-input-number v-model="form.cost_amount" :min="0" :precision="2" class="!w-[220px]" />
                        <span class="ml-2 text-tx-secondary">元</span>
                    </el-form-item>
                    <el-form-item label="结算凭证">
                        <ImageUpload v-model="form.voucher" :width="160" :height="100" text="上传结算凭证" />
                    </el-form-item>
                </template>
            </el-form>
            <template #footer>
                <el-button @click="addState.show = false">取消</el-button>
                <el-button type="primary" :loading="addState.saving" @click="submitAdd">确定添加</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts" name="financeWallet">
import { walletMeal, walletNursing, walletProperty } from '@/mock/data_finance'
import { usePaging } from '@/hooks/usePaging'
import ImageUpload from '@/components/image-upload/index.vue'
import { Plus } from '@element-plus/icons-vue'

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

const addState = reactive({ show: false, tab: 'property', title: '添加物业钱袋子数据', saving: false })
const form = reactive({
    title: '',
    month: '',
    expense_amount: 0,
    income_amount: 0,
    balance_amount: 0,
    expense_voucher: '',
    income_voucher: '',
    order_count: 0,
    unit_price: 0,
    cost_amount: 0,
    voucher: ''
})

const money = (v: number) => Number(v || 0).toFixed(2)
/** 预收金额 = 订单数量 × 每单单价 */
const computedPrepay = computed(() => money(Number(form.order_count) * Number(form.unit_price)))

const nowTimeStr = () => {
    const d = new Date()
    const p = (n: number) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

const openAdd = (tab: string) => {
    Object.assign(form, {
        title: '',
        month: '',
        expense_amount: 0,
        income_amount: 0,
        balance_amount: 0,
        expense_voucher: '',
        income_voucher: '',
        order_count: 0,
        unit_price: 0,
        cost_amount: 0,
        voucher: ''
    })
    addState.tab = tab
    addState.title = `添加${tabNames[tab]}数据`
    addState.show = true
}

const submitAdd = () => {
    if (!form.title.trim()) return ElMessage.warning('请输入钱袋子标题')
    if (!form.month) return ElMessage.warning('请选择所属月份')
    addState.saving = true
    try {
        if (addState.tab === 'property') {
            if (!form.expense_voucher) return ElMessage.warning('请上传支出凭证')
            if (!form.income_voucher) return ElMessage.warning('请上传收入凭证')
            walletProperty.unshift({
                id: Date.now(),
                title: form.title.trim(),
                month: form.month,
                expense_amount: money(form.expense_amount),
                income_amount: money(form.income_amount),
                expense_voucher: form.expense_voucher,
                income_voucher: form.income_voucher,
                balance_amount: money(form.balance_amount),
                create_time: nowTimeStr()
            })
            propertyGetLists()
        } else {
            if (!form.voucher) return ElMessage.warning('请上传结算凭证')
            const row = {
                id: Date.now(),
                title: form.title.trim(),
                month: form.month,
                order_count: Number(form.order_count) || 0,
                unit_price: money(form.unit_price),
                cost_amount: money(form.cost_amount),
                voucher: form.voucher,
                prepay_amount: computedPrepay.value,
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

onMounted(() => {
    propertyGetLists()
    nursingGetLists()
    mealGetLists()
})
</script>
