<template>
    <div class="service-nursing">
        <el-card class="!border-none" shadow="never">
            <template #header>
                <div class="flex items-center justify-between">
                    <span class="card-title">托管服务</span>
                    <el-button type="primary" @click="openAdd">
                        <el-icon class="mr-1"><Plus /></el-icon>添加托管
                    </el-button>
                </div>
            </template>

            <!-- 筛选搜索 -->
            <el-form inline class="mb-2">
                <el-form-item label="服务标题">
                    <el-input v-model="queryParams.keyword" placeholder="请输入托管服务标题" clearable class="!w-60"
                        :prefix-icon="Search" @keyup.enter="onSearch" />
                </el-form-item>
                <el-form-item label="托管类型">
                    <el-select v-model="queryParams.type" placeholder="请选择" clearable class="!w-36">
                        <el-option v-for="item in nursingTypeOptions" :key="item" :label="item" :value="item" />
                    </el-select>
                </el-form-item>
                <el-form-item label="托管状态">
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
                <el-table-column label="托管服务标题" min-width="220" show-overflow-tooltip>
                    <template #default="{ row }">
                        <span>{{ row.name }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="价格" min-width="110" align="right">
                    <template #default="{ row }">
                        <span class="text-orange-500 font-bold">¥{{ money(row.price) }}</span>
                    </template>
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
        <el-dialog v-model="editVisible" :title="editForm.id ? '编辑托管' : '添加托管'" width="680px" top="6vh"
            destroy-on-close>
            <el-form :model="editForm" label-width="110px">
                <el-form-item label="托管服务标题" required>
                    <el-input v-model="editForm.name" placeholder="请输入托管服务标题" maxlength="30" show-word-limit />
                </el-form-item>
                <el-form-item label="托管类型" required>
                    <el-select v-model="editForm.type" placeholder="请选择托管类型" class="!w-full">
                        <el-option v-for="item in nursingTypeOptions" :key="item" :label="item" :value="item" />
                    </el-select>
                </el-form-item>
                <el-form-item label="价格" required>
                    <el-input-number v-model="editForm.price" :min="0" :precision="2" :step="1" />
                    <span class="ml-2 text-xs text-tx-secondary">元</span>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="editForm.desc" type="textarea" :rows="4" maxlength="200" show-word-limit
                        placeholder="请输入托管服务描述" />
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

<script setup lang="ts" name="serviceNursing">
import { nursingServices, nursingTypeOptions } from '@/mock/data_service'
import { usePaging } from '@/hooks/usePaging'
import { Search, Plus } from '@element-plus/icons-vue'

const money = (val: any) => Number(val || 0).toFixed(2)

const nowTimeStr = () => {
    const d = new Date()
    const p = (n: number) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

// ==================== 列表 ====================
const queryParams = reactive({ keyword: '', type: '', status: '' as '' | 0 | 1, start_time: '', end_time: '' })
const createRange = ref<string[]>([])

const getNursingList = (params: any = {}) => {
    const { page_no = 1, page_size = 15, keyword = '', type = '', status = '', start_time = '', end_time = '' } = params
    let lists: any[] = [...nursingServices]
    if (keyword) lists = lists.filter((i) => i.name.includes(keyword))
    if (type) lists = lists.filter((i) => i.type === type)
    if (status !== '' && status !== undefined && status !== null) {
        lists = lists.filter((i) => i.status === Number(status))
    }
    if (start_time) lists = lists.filter((i) => String(i.create_time).slice(0, 10) >= start_time)
    if (end_time) lists = lists.filter((i) => String(i.create_time).slice(0, 10) <= end_time)
    const start = (Number(page_no) - 1) * Number(page_size)
    return Promise.resolve({ count: lists.length, lists: lists.slice(start, start + Number(page_size)) })
}

const { pager, getLists } = usePaging({ fetchFun: getNursingList, params: queryParams, firstLoading: true })

const onSearch = () => {
    queryParams.start_time = createRange.value?.[0] || ''
    queryParams.end_time = createRange.value?.[1] || ''
    pager.page = 1
    getLists()
}
const resetQuery = () => {
    queryParams.keyword = ''
    queryParams.type = ''
    queryParams.status = ''
    createRange.value = []
    onSearch()
}

// ==================== 添加 / 编辑 ====================
const editVisible = ref(false)
const editForm = reactive({
    id: 0, name: '', type: nursingTypeOptions[0], price: 0, desc: '', sort: 0, status: 1
})

const openAdd = () => {
    Object.assign(editForm, {
        id: 0, name: '', type: nursingTypeOptions[0], price: 0,
        desc: '', sort: nursingServices.length + 1, status: 1
    })
    editVisible.value = true
}
const openEdit = (row: any) => {
    Object.assign(editForm, {
        id: row.id,
        name: row.name,
        type: row.type,
        price: Number(row.price) || 0,
        desc: row.desc || '',
        sort: row.sort ?? 0,
        status: row.status
    })
    editVisible.value = true
}
const submitEdit = () => {
    if (!editForm.name.trim()) return ElMessage.warning('请输入托管服务标题')
    if (!editForm.type) return ElMessage.warning('请选择托管类型')
    const payload = {
        name: editForm.name.trim(),
        type: editForm.type,
        price: Number(editForm.price) || 0,
        desc: editForm.desc,
        sort: Number(editForm.sort) || 0,
        status: editForm.status
    }
    if (editForm.id) {
        const row = nursingServices.find((i: any) => i.id === editForm.id)
        if (row) Object.assign(row, payload)
        ElMessage.success('保存成功')
    } else {
        nursingServices.unshift({ id: Date.now(), ...payload, create_time: nowTimeStr() })
        ElMessage.success('添加成功')
    }
    editVisible.value = false
    getLists()
}

// ==================== 显示 / 隐藏 ====================
const toggleShow = (row: any) => {
    row.status = row.status === 1 ? 0 : 1
    ElMessage.success(row.status === 1 ? '已显示，前端可查看该托管服务' : '已隐藏，前端不再显示该托管服务')
}

// ==================== 删除 ====================
const delRow = (row: any) => {
    ElMessageBox.confirm(`确定删除托管服务「${row.name}」吗？删除后前端不再显示。`, '删除确认', { type: 'warning' })
        .then(() => {
            const idx = nursingServices.findIndex((i: any) => i.id === row.id)
            if (idx > -1) nursingServices.splice(idx, 1)
            ElMessage.success('删除成功')
            getLists()
        })
        .catch(() => { })
}

onMounted(getLists)
</script>
