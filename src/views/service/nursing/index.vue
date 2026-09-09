<template>
    <div class="service-nursing">
        <el-card class="!border-none" shadow="never">
            <el-form class="mb-[-16px]" :model="queryParams" :inline="true">
                <el-form-item class="w-[280px]" label="服务标题">
                    <el-input
                        v-model="queryParams.keyword"
                        placeholder="请输入托管服务标题"
                        clearable
                        @keyup.enter="handleQuery"
                    />
                </el-form-item>
                <el-form-item label="托管类型">
                    <el-select v-model="queryParams.type" class="w-[160px]" clearable placeholder="全部类型">
                        <el-option v-for="item in typeOptions" :key="item" :label="item" :value="item" />
                    </el-select>
                </el-form-item>
                <el-form-item label="托管状态">
                    <el-select v-model="queryParams.status" class="w-[140px]" clearable placeholder="全部状态">
                        <el-option label="显示" :value="1" />
                        <el-option label="隐藏" :value="0" />
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
                    <el-button type="primary" @click="handleQuery">查询</el-button>
                    <el-button @click="handleReset">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <el-card class="!border-none mt-4" shadow="never">
            <template #header>
                <div class="flex items-center justify-between">
                    <span class="card-title">托管服务</span>
                    <el-button type="primary" @click="openAdd">
                        <el-icon><Plus /></el-icon>添加托管
                    </el-button>
                </div>
            </template>
            <el-table size="large" v-loading="pager.loading" :data="pager.lists">
                <el-table-column label="托管服务标题" prop="name" min-width="180" show-overflow-tooltip />
                <el-table-column label="开始时间" prop="start_time" width="120" show-overflow-tooltip />
                <el-table-column label="结束时间" prop="end_time" width="120" show-overflow-tooltip />
                <el-table-column label="托管类型" width="130">
                    <template #default="{ row }">
                        <el-tag :type="typeTag(row.type)" effect="light">{{ row.type }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="托管价格" width="120" align="right">
                    <template #default="{ row }">
                        <span class="text-orange-500 font-bold">¥{{ row.price }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="报名人数" width="100" align="center">
                    <template #default="{ row }">{{ row.signup_count ?? 0 }} 人</template>
                </el-table-column>
                <el-table-column label="托管状态" width="90">
                    <template #default="{ row }">
                        <el-switch :model-value="row.status" :active-value="1" :inactive-value="0" @change="toggleShow(row)" />
                    </template>
                </el-table-column>
                <el-table-column label="添加时间" prop="create_time" width="160" show-overflow-tooltip />
                <el-table-column label="操作" width="130" fixed="right">
                    <template #default="{ row }">
                        <el-button size="small" @click="openEdit(row)">编辑</el-button>
                        <el-button size="small" type="danger" plain @click="handleDelete(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="flex justify-end mt-2">
                <el-pagination v-model:current-page="pager.page" v-model:page-size="pager.size" :total="pager.count"
                    layout="total, prev, pager, next" @current-change="getLists" />
            </div>
        </el-card>

        <el-dialog v-model="showEdit" :title="editTitle" width="560px">
            <el-form :model="editForm" label-width="110px">
                <el-form-item label="托管服务标题" required>
                    <el-input v-model="editForm.name" placeholder="请输入托管服务标题" />
                </el-form-item>
                <el-form-item label="托管类型" required>
                    <el-select v-model="editForm.type" placeholder="请选择托管类型" class="!w-full">
                        <el-option v-for="item in typeOptions" :key="item" :label="item" :value="item" />
                    </el-select>
                </el-form-item>
                <el-form-item label="托管价格（元）" required>
                    <el-input-number v-model="editForm.price" :min="0" :precision="2" class="!w-full" />
                </el-form-item>
                <el-form-item label="开始时间" required>
                    <el-date-picker v-model="editForm.start_time" type="date" value-format="YYYY-MM-DD"
                        placeholder="请选择开始时间" class="!w-full" />
                </el-form-item>
                <el-form-item label="结束时间" required>
                    <el-date-picker v-model="editForm.end_time" type="date" value-format="YYYY-MM-DD"
                        placeholder="请选择结束时间" class="!w-full" />
                </el-form-item>
                <el-form-item label="排序">
                    <el-input-number v-model="editForm.sort" :min="0" />
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio-group v-model="editForm.status">
                        <el-radio :value="1">显示</el-radio>
                        <el-radio :value="0">隐藏</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="showEdit = false">取消</el-button>
                <el-button type="primary" @click="submitEdit">确定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts" name="serviceNursing">
import { getNursingServiceList } from '@/mock/api'
import { usePaging } from '@/hooks/usePaging'
import { Plus } from '@element-plus/icons-vue'

const typeOptions = ['日托', '学期每日托', '学期周末托']
const typeTagMap: Record<string, string> = { '日托': 'success', '学期每日托': 'warning', '学期周末托': 'primary' }
const typeTag = (type: string) => typeTagMap[type] || 'info'

const queryParams = reactive({
    keyword: '',
    type: '',
    status: '' as '' | 0 | 1,
    start_time: '',
    end_time: ''
})
const timeRange = ref<string[]>([])

const { pager, getLists, resetPage, resetParams } = usePaging({
    fetchFun: getNursingServiceList,
    params: queryParams,
    firstLoading: true
})

const handleQuery = () => {
    queryParams.start_time = timeRange.value?.[0] || ''
    queryParams.end_time = timeRange.value?.[1] || ''
    resetPage()
}
const handleReset = () => {
    timeRange.value = []
    queryParams.start_time = ''
    queryParams.end_time = ''
    resetParams()
}

const showEdit = ref(false)
const editTitle = ref('')
const editForm = reactive({
    id: 0, name: '', type: '日托', price: 0, start_time: '', end_time: '', sort: 0, status: 1
})

const openAdd = () => {
    editTitle.value = '添加托管'
    Object.assign(editForm, {
        id: 0, name: '', type: '日托', price: 0, start_time: '', end_time: '', sort: 0, status: 1
    })
    showEdit.value = true
}

const openEdit = (row: any) => {
    editTitle.value = '编辑托管'
    Object.assign(editForm, { ...row, price: Number(row.price) || 0 })
    showEdit.value = true
}

const submitEdit = () => {
    if (!editForm.name) return ElMessage.warning('请输入托管服务标题')
    if (!editForm.start_time || !editForm.end_time) return ElMessage.warning('请选择开始时间与结束时间')
    if (editForm.start_time > editForm.end_time) return ElMessage.warning('结束时间不能早于开始时间')
    const payload = { ...editForm, price: Number(editForm.price).toFixed(2) }
    if (editForm.id === 0) {
        pager.lists.unshift({ ...payload, id: Date.now(), signup_count: 0, create_time: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-') })
    } else {
        const idx = pager.lists.findIndex((i: any) => i.id === editForm.id)
        if (idx > -1) Object.assign(pager.lists[idx], payload)
    }
    ElMessage.success(editTitle.value.includes('添加') ? '添加成功' : '保存成功')
    showEdit.value = false
}

const toggleShow = (row: any) => {
    row.status = row.status ? 0 : 1
    ElMessage.success(row.status ? '已显示，用户端可查看报名' : '已隐藏，用户端不再展示')
}

const handleDelete = (row: any) => {
    ElMessageBox.confirm(`确定删除托管服务「${row.name}」吗？`, '提示', { type: 'warning' }).then(() => {
        const idx = pager.lists.findIndex((i: any) => i.id === row.id)
        if (idx > -1) pager.lists.splice(idx, 1)
        ElMessage.success('删除成功')
    }).catch(() => {})
}

onMounted(getLists)
</script>
