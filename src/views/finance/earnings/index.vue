<template>
    <div class="finance-earnings">
        <el-card class="!border-none" shadow="never">
            <el-form :model="queryParams" inline class="mb--4">
                <el-form-item label="角色">
                    <el-select v-model="queryParams.role_id" placeholder="全部" clearable class="!w-[150px]">
                        <el-option v-for="item in roleOptions" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="添加时间">
                    <el-date-picker
                        v-model="timeRange"
                        type="daterange"
                        value-format="YYYY-MM-DD"
                        range-separator="~"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        class="!w-[240px]"
                    />
                </el-form-item>
                <el-form-item>
                    <el-input
                        v-model="queryParams.keyword"
                        placeholder="员工名称/手机号码"
                        clearable
                        class="!w-[240px]"
                        @keyup.enter="resetPage"
                    />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="resetPage">查询</el-button>
                    <el-button @click="resetParamsHandler">重置</el-button>
                    <el-button type="primary" plain @click="openAdd">添加收益</el-button>
                    <el-button type="success" @click="handleExport">收益导出</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <el-card class="!border-none mt-4" shadow="never" v-loading="pager.loading">
            <el-table :data="pager.lists" stripe>
                <el-table-column label="员工名称" min-width="160">
                    <template #default="{ row }">
                        <div class="flex items-center">
                            <el-avatar :size="32" :src="row.avatar" />
                            <span class="ml-2">{{ row.name }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="mobile" label="手机号" min-width="130" />
                <el-table-column label="角色" width="120">
                    <template #default="{ row }">
                        <el-tag size="small" :type="roleTag(row.role_id)">{{ row.role }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="单次收益总金额" min-width="140" align="right">
                    <template #default="{ row }">
                        <span class="text-green-600 font-medium">¥{{ row.total_income }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="陪诊收益" min-width="120" align="right">
                    <template #default="{ row }">¥{{ row.escort_income }}</template>
                </el-table-column>
                <el-table-column label="配送收益" min-width="120" align="right">
                    <template #default="{ row }">¥{{ row.delivery_income }}</template>
                </el-table-column>
                <el-table-column label="托管收益" min-width="120" align="right">
                    <template #default="{ row }">¥{{ row.nursing_income }}</template>
                </el-table-column>
                <el-table-column prop="create_time" label="添加时间" min-width="170" />
            </el-table>
            <div class="flex justify-end mt-4">
                <el-pagination
                    v-model:current-page="pager.page"
                    v-model:page-size="pager.size"
                    :page-sizes="[10, 15, 20, 50]"
                    :total="pager.count"
                    layout="total, sizes, prev, pager, next, jumper"
                    @current-change="getLists"
                    @size-change="resetPage"
                />
            </div>
        </el-card>

        <!-- 添加收益 -->
        <el-dialog v-model="addState.show" title="添加收益" width="560px">
            <el-form ref="formRef" :model="addForm" :rules="rules" label-width="120px">
                <el-form-item label="选择员工" prop="staff_id">
                    <el-select
                        v-model="addForm.staff_id"
                        filterable
                        placeholder="输入员工名称或手机号码快速搜索"
                        class="!w-full"
                        @change="onStaffChange"
                    >
                        <el-option
                            v-for="item in staffOptions"
                            :key="item.id"
                            :label="`${item.name}（${item.mobile}）`"
                            :value="item.id"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="员工角色">
                    <el-tag v-if="addForm.role" size="small">{{ addForm.role }}</el-tag>
                    <span v-else class="text-tx-secondary">请先选择员工</span>
                </el-form-item>
                <el-form-item label="陪诊收益" prop="escort_income">
                    <el-input-number v-model="addForm.escort_income" :min="0" :precision="2" class="!w-[200px]" />
                    <span class="ml-2 text-tx-secondary">元</span>
                </el-form-item>
                <el-form-item label="配送收益" prop="delivery_income">
                    <el-input-number v-model="addForm.delivery_income" :min="0" :precision="2" class="!w-[200px]" />
                    <span class="ml-2 text-tx-secondary">元</span>
                </el-form-item>
                <el-form-item label="托管收益" prop="nursing_income">
                    <el-input-number v-model="addForm.nursing_income" :min="0" :precision="2" class="!w-[200px]" />
                    <span class="ml-2 text-tx-secondary">元</span>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="addState.show = false">取消</el-button>
                <el-button type="primary" :loading="addState.saving" @click="submitAdd">确定添加</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts" name="financeEarnings">
import { addStaffEarning, getStaffEarnings, getStaffEarningsAll } from '@/mock/api'
import { usePaging } from '@/hooks/usePaging'
import { exportCsv } from '@/utils/export'
import { staffList } from '@/mock/data'

const queryParams = reactive({ keyword: '', role_id: '', start_time: '', end_time: '' })
const timeRange = ref<any[]>([])

const { pager, getLists, resetPage } = usePaging({
    fetchFun: getStaffEarnings,
    params: queryParams,
    firstLoading: true
})

const roleOptions = [
    { label: '托管员', value: 1 },
    { label: '配送员', value: 2 },
    { label: '陪诊员', value: 3 },
    { label: '楼栋管理员', value: 4 }
]

const staffOptions = staffList

const addState = reactive({ show: false, saving: false })
const formRef = shallowRef()
const addForm = reactive({
    staff_id: '',
    name: '',
    role: '',
    escort_income: 0,
    delivery_income: 0,
    nursing_income: 0
})

const rules = {
    staff_id: [{ required: true, message: '请选择员工', trigger: 'change' }]
}

watch(timeRange, () => {
    queryParams.start_time = timeRange.value?.[0] || ''
    queryParams.end_time = timeRange.value?.[1] || ''
    resetPage()
})
watch(() => queryParams.role_id, () => resetPage())

const resetParamsHandler = () => {
    Object.assign(queryParams, { keyword: '', role_id: '', start_time: '', end_time: '' })
    timeRange.value = []
    resetPage()
}

const roleTag = (roleId: number) => (roleId === 1 ? 'success' : roleId === 2 ? 'warning' : roleId === 3 ? 'primary' : 'info')

const onStaffChange = (id: any) => {
    const staff: any = staffList.find((item: any) => Number(item.id) === Number(id))
    addForm.name = staff?.name || ''
    addForm.role = staff?.role || ''
}

const openAdd = () => {
    Object.assign(addForm, {
        staff_id: '',
        name: '',
        role: '',
        escort_income: 0,
        delivery_income: 0,
        nursing_income: 0
    })
    addState.show = true
}

const submitAdd = async () => {
    await formRef.value?.validate()
    if (!addForm.escort_income && !addForm.delivery_income && !addForm.nursing_income) {
        return ElMessage.warning('请至少填写一项收益金额')
    }
    addState.saving = true
    try {
        await addStaffEarning({ ...addForm })
        ElMessage.success('收益添加成功')
        addState.show = false
        getLists()
    } finally {
        addState.saving = false
    }
}

const handleExport = async () => {
    const rows: any[] = await getStaffEarningsAll({ ...queryParams })
    exportCsv(`员工收益_${new Date().toLocaleDateString('zh-CN')}`, [
        { label: '员工名称', prop: 'name' },
        { label: '手机号', prop: 'mobile' },
        { label: '角色', prop: 'role' },
        { label: '单次收益总金额', prop: 'total_income' },
        { label: '陪诊收益', prop: 'escort_income' },
        { label: '配送收益', prop: 'delivery_income' },
        { label: '托管收益', prop: 'nursing_income' },
        { label: '添加时间', prop: 'create_time' }
    ], rows)
}

onMounted(getLists)
</script>
