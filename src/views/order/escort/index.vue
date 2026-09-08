<template>
    <div class="order-escort" v-loading="pager.loading">
        <el-card class="!border-none" shadow="never">
            <template #header>
                <div class="flex items-center justify-between">
                    <span class="card-title">陪诊服务订单</span>
                    <el-input v-model="querySn" placeholder="搜索订单号 / 用户名" clearable style="width: 240px"
                        :prefix-icon="Search" @input="getLists" />
                </div>
            </template>
            <el-table :data="filteredList" stripe>
                <el-table-column prop="sn" label="订单号" width="160" />
                <el-table-column prop="user" label="用户" width="90" />
                <el-table-column prop="community" label="所属小区" min-width="140" show-overflow-tooltip />
                <el-table-column prop="service" label="服务项目" min-width="110" show-overflow-tooltip />
                <el-table-column label="陪同时长" width="90">
                    <template #default="{ row }">
                        <span>{{ row.hours }}小时</span>
                    </template>
                </el-table-column>
                <el-table-column label="陪诊员工" width="100">
                    <template #default="{ row }">
                        <span v-if="row.staff">{{ row.staff }}</span>
                        <el-tag v-else size="small" type="info">未派单</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="金额" width="100">
                    <template #default="{ row }">
                        <span class="text-orange-500 font-bold">¥{{ row.amount }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="支付状态" width="90">
                    <template #default="{ row }">
                        <el-tag size="small" :type="row.pay_status === 1 ? 'success' : 'info'">
                            {{ row.pay_status === 1 ? '已支付' : '未支付' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="订单状态" width="90">
                    <template #default="{ row }">
                        <el-tag size="small" :type="statusTag(row.status)">{{ statusText(row.status) }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="下单时间" width="160" />
                <el-table-column label="操作" width="120" fixed="right">
                    <template #default="{ row }">
                        <el-button size="small" type="primary" :disabled="row.status !== 1"
                            @click="openDispatch(row)">派单</el-button>
                        <el-button size="small" type="primary" plain link
                            @click="viewDetail(row)">详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="flex justify-end mt-4">
                <el-pagination v-model:current-page="pager.page" v-model:page-size="pager.size" :total="pager.count"
                    layout="total, prev, pager, next" @current-change="getLists" />
            </div>
        </el-card>

        <!-- 派单弹窗 -->
        <el-dialog v-model="showDispatch" title="订单派单" width="420px">
            <el-form label-width="90px">
                <el-form-item label="订单号">
                    <span class="font-bold">{{ dispatchRow?.sn }}</span>
                </el-form-item>
                <el-form-item label="服务项目">
                    <span>{{ dispatchRow?.service }}（{{ dispatchRow?.hours }}小时）</span>
                </el-form-item>
                <el-form-item label="指派员工" required>
                    <el-select v-model="dispatchStaffId" placeholder="请选择陪诊员" class="!w-full">
                        <el-option v-for="s in staffOptions" :key="s.id" :label="`${s.name}（${s.role}）`"
                            :value="s.id" :disabled="s.status === 0" />
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="showDispatch = false">取消</el-button>
                <el-button type="primary" @click="submitDispatch">确认派单</el-button>
            </template>
        </el-dialog>

        <!-- 详情弹窗 -->
        <el-dialog v-model="showDetail" title="订单详情" width="460px">
            <el-descriptions :column="1" border v-if="detailRow">
                <el-descriptions-item label="订单号">{{ detailRow.sn }}</el-descriptions-item>
                <el-descriptions-item label="用户">{{ detailRow.user }}</el-descriptions-item>
                <el-descriptions-item label="所属小区">{{ detailRow.community }}</el-descriptions-item>
                <el-descriptions-item label="服务项目">{{ detailRow.service }}</el-descriptions-item>
                <el-descriptions-item label="陪同时长">{{ detailRow.hours }}小时</el-descriptions-item>
                <el-descriptions-item label="陪诊员工">{{ detailRow.staff || '未派单' }}</el-descriptions-item>
                <el-descriptions-item label="订单金额">¥{{ detailRow.amount }}</el-descriptions-item>
                <el-descriptions-item label="支付状态">{{ detailRow.pay_status === 1 ? '已支付' : '未支付' }}</el-descriptions-item>
                <el-descriptions-item label="订单状态">{{ statusText(detailRow.status) }}</el-descriptions-item>
                <el-descriptions-item label="下单时间">{{ detailRow.create_time }}</el-descriptions-item>
            </el-descriptions>
        </el-dialog>
    </div>
</template>

<script setup lang="ts" name="orderEscort">
import { getEscortOrderList } from '@/mock/api'
import { usePaging } from '@/hooks/usePaging'
import { Search } from '@element-plus/icons-vue'
import { staffList } from '@/mock/data'

const { pager, getLists } = usePaging({ fetchFun: getEscortOrderList, firstLoading: true })

const querySn = ref('')
const filteredList = computed(() => {
    if (!querySn.value) return pager.lists
    const kw = querySn.value.toLowerCase()
    return pager.lists.filter((i: any) => i.sn.toLowerCase().includes(kw) || i.user.includes(kw))
})

const statusText = (s: number) => ({ 0: '待支付', 1: '待派单', 2: '进行中', 3: '已完成' }[s] || '未知')
const statusTag = (s: number) => {
    const map: Record<number, string> = { 0: 'info', 1: 'warning', 2: 'primary', 3: 'success' }
    return map[s] || 'info'
}

// ---- 派单 ----
const showDispatch = ref(false)
const dispatchRow = ref<any>(null)
const dispatchStaffId = ref<number | undefined>()
// 仅陪诊员（role_id=3）可接陪诊订单
const staffOptions = staffList.filter((s: any) => s.role_id === 3)

const openDispatch = (row: any) => {
    dispatchRow.value = row
    dispatchStaffId.value = undefined
    showDispatch.value = true
}

const submitDispatch = () => {
    if (!dispatchStaffId.value) return ElMessage.warning('请选择指派员工')
    const staff: any = staffList.find((s: any) => s.id === dispatchStaffId.value)
    dispatchRow.value.staff = staff.name
    dispatchRow.value.status = 2
    ElMessage.success(`已派单给 ${staff.name}，订单进入进行中状态`)
    showDispatch.value = false
}

// ---- 详情 ----
const showDetail = ref(false)
const detailRow = ref<any>(null)
const viewDetail = (row: any) => {
    detailRow.value = row
    showDetail.value = true
}

onMounted(getLists)
</script>
