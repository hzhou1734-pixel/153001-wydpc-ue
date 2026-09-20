<template>
    <el-card class="!border-none" shadow="never">
        <template #header>
            <div class="flex items-center justify-between">
                <span class="card-title">管理员管理</span>
                <el-button type="primary" @click="openAdd">添加管理员</el-button>
            </div>
        </template>

        <el-form :model="searchParams" inline class="mb-2">
            <el-form-item label="关键词">
                <el-input v-model="searchParams.keyword" placeholder="管理员账号 / 登录账号" clearable class="!w-[240px]" />
            </el-form-item>
            <el-form-item label="所属角色">
                <el-select v-model="searchParams.role" placeholder="请选择" clearable class="!w-[150px]">
                    <el-option v-for="item in roleOptions" :key="item" :label="item" :value="item" />
                </el-select>
            </el-form-item>
            <el-form-item label="账号状态">
                <el-select v-model="searchParams.status" placeholder="请选择" clearable class="!w-[120px]">
                    <el-option label="启用" :value="1" />
                    <el-option label="禁用" :value="0" />
                </el-select>
            </el-form-item>
            <el-form-item label="创建时间">
                <el-date-picker
                    v-model="searchParams.create_time"
                    type="daterange"
                    value-format="YYYY-MM-DD"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    class="!w-[240px]"
                />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getLists">查询</el-button>
                <el-button @click="handleReset">重置</el-button>
            </el-form-item>
        </el-form>

        <el-table :data="pager.lists" v-loading="pager.loading">
            <el-table-column prop="nickname" label="管理员账号" min-width="140" />
            <el-table-column prop="username" label="登录账号" min-width="140" />
            <el-table-column prop="role" label="所属角色" min-width="130">
                <template #default="{ row }">
                    <el-tag size="small" type="warning">{{ row.role }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="账号状态" min-width="90">
                <template #default="{ row }">
                    <el-switch :model-value="row.status" :active-value="1" :inactive-value="0" @change="(val: any) => onStatusChange(row, val)" />
                </template>
            </el-table-column>
            <el-table-column prop="create_time" label="创建时间" min-width="170" show-overflow-tooltip />
            <el-table-column label="操作" width="130" fixed="right">
                <template #default="{ row }">
                    <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
                    <el-button link type="danger" :disabled="row.username === 'admin'" @click="handleDelete(row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="flex justify-end mt-4">
            <el-pagination
                v-model:current-page="pager.page"
                v-model:page-size="pager.size"
                :total="pager.count"
                layout="total, prev, pager, next"
                @current-change="getLists"
            />
        </div>
    </el-card>

    <el-dialog v-model="editVisible" :title="editForm.id ? '编辑管理员' : '添加管理员'" width="480">
        <el-form :model="editForm" label-width="100">
            <el-form-item label="管理员账号" required>
                <el-input v-model="editForm.nickname" placeholder="请输入管理员账号（昵称）" />
            </el-form-item>
            <el-form-item label="登录账号" required>
                <el-input v-model="editForm.username" placeholder="请输入登录账号" />
            </el-form-item>
            <el-form-item label="登录密码" required>
                <el-input v-model="editForm.password" type="password" show-password placeholder="请输入登录密码" />
            </el-form-item>
            <el-form-item label="所属角色" required>
                <el-select v-model="editForm.role" class="!w-full">
                    <el-option v-for="item in roleOptions" :key="item" :label="item" :value="item" />
                </el-select>
            </el-form-item>
            <el-form-item label="账号状态">
                <el-radio-group v-model="editForm.status">
                    <el-radio :value="1">启用</el-radio>
                    <el-radio :value="0">禁用</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <div class="text-xs text-tx-secondary ml-4">账号状态为启用时该账号可正常登录管理后台，禁用时无法正常登录</div>
        <template #footer>
            <el-button @click="editVisible = false">取消</el-button>
            <el-button type="primary" @click="saveEdit">保存</el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts" name="settingAdmin">
import { getAdminList } from '@/mock/api'
import { adminList } from '@/mock/data'
import { usePaging } from '@/hooks/usePaging'

const roleOptions = ['超级管理员', '物业经理', '财务专员', '楼栋管理员']

const searchParams = reactive({ keyword: '', role: '', status: '', create_time: [] as any })

const fetchAdmin = async (params: any) => {
    const { page_no = 1, page_size = 15, keyword, role, status, create_time } = params
    let list: any[] = adminList
    if (keyword) {
        const kw = String(keyword)
        list = list.filter((item: any) => item.username.includes(kw) || item.nickname.includes(kw))
    }
    if (role) list = list.filter((item: any) => item.role === role)
    if (status !== '' && status !== undefined && status !== null) list = list.filter((item: any) => item.status === Number(status))
    if (create_time?.length === 2) {
        list = list.filter(
            (item: any) =>
                String(item.create_time).slice(0, 10) >= create_time[0] && String(item.create_time).slice(0, 10) <= create_time[1]
        )
    }
    return { count: list.length, lists: list.slice((page_no - 1) * page_size, page_no * page_size) }
}

const { pager, getLists } = usePaging({ fetchFun: fetchAdmin, params: searchParams, firstLoading: true })

const handleReset = () => {
    searchParams.keyword = ''
    searchParams.role = ''
    searchParams.status = ''
    searchParams.create_time = []
    pager.page = 1
    getLists()
}

const editVisible = ref(false)
const editForm = reactive({ id: 0, nickname: '', username: '', password: '', role: '', status: 1 })

const onStatusChange = (row: any, val: any) => {
    row.status = Number(val)
    ElMessage.success(row.status === 1 ? `已启用账号「${row.username}」` : `已禁用账号「${row.username}」`)
}

const openAdd = () => {
    Object.assign(editForm, { id: 0, nickname: '', username: '', password: '', role: '物业经理', status: 1 })
    editVisible.value = true
}

const openEdit = (row: any) => {
    Object.assign(editForm, { id: row.id, nickname: row.nickname, username: row.username, password: '', role: row.role, status: row.status })
    editVisible.value = true
}

const saveEdit = () => {
    if (!editForm.nickname.trim()) return ElMessage.warning('请输入管理员账号')
    if (!editForm.username.trim()) return ElMessage.warning('请输入登录账号')
    if (!editForm.id && !editForm.password.trim()) return ElMessage.warning('请输入登录密码')
    if (!editForm.role) return ElMessage.warning('请选择所属角色')
    if (editForm.id) {
        const row = adminList.find((item: any) => item.id === editForm.id)
        if (row) {
            row.nickname = editForm.nickname
            row.username = editForm.username
            row.role = editForm.role
            row.status = editForm.status
        }
    } else {
        adminList.push({
            id: Date.now(),
            username: editForm.username,
            nickname: editForm.nickname,
            role: editForm.role,
            mobile: '',
            last_login: '',
            status: editForm.status,
            create_time: new Date().toLocaleString('zh-CN', { hour12: false }).replaceAll('/', '-')
        } as any)
    }
    ElMessage.success('保存成功')
    editVisible.value = false
    getLists()
}

const handleDelete = (row: any) => {
    ElMessageBox.confirm(`确定删除管理员「${row.nickname}」吗？`, '提示', { type: 'warning' })
        .then(() => {
            const index = adminList.findIndex((item: any) => item.id === row.id)
            if (index > -1) adminList.splice(index, 1)
            ElMessage.success('删除成功')
            getLists()
        })
        .catch(() => {})
}

onMounted(getLists)
</script>
