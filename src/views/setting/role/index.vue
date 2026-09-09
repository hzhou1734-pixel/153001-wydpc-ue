<template>
    <el-card class="!border-none" shadow="never">
        <template #header>
            <div class="flex items-center justify-between">
                <span class="card-title">角色管理</span>
                <div class="flex gap-3">
                    <el-input v-model="keyword" placeholder="搜索角色名称" :prefix-icon="Search" clearable class="!w-60" />
                    <el-button type="primary" @click="openAdd">新增角色</el-button>
                </div>
            </div>
        </template>
        <el-table :data="filteredList" stripe>
            <el-table-column prop="name" label="角色名称" min-width="140">
                <template #default="{ row }">
                    <el-tag size="small" type="primary">{{ row.name }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="desc" label="角色描述" min-width="240" show-overflow-tooltip />
            <el-table-column prop="members" label="成员数量" width="110" sortable  show-overflow-tooltip />
            <el-table-column label="权限数量" width="110">
                <template #default="{ row }">
                    <span>{{ permCountMap[row.id] ?? 0 }} 项</span>
                </template>
            </el-table-column>
            <el-table-column prop="create_time" label="创建时间" width="160" show-overflow-tooltip />
            <el-table-column label="操作" width="210" fixed="right">
                <template #default="{ row }">
                    <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
                    <el-button link type="success" @click="openAuth(row)">分配权限</el-button>
                    <el-button link type="danger" :disabled="row.members > 0" @click="handleDelete(row)">删除</el-button>
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

    <el-dialog v-model="visible" :title="form.id ? '编辑角色' : '新增角色'" width="500px">
        <el-form :model="form" label-width="90px">
            <el-form-item label="角色名称" required>
                <el-input v-model="form.name" maxlength="20" show-word-limit placeholder="请输入角色名称" />
            </el-form-item>
            <el-form-item label="角色描述" required>
                <el-input
                    v-model="form.desc"
                    type="textarea"
                    :rows="3"
                    maxlength="100"
                    show-word-limit
                    placeholder="说明该角色的职责与权限范围"
                />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="visible = false">取消</el-button>
            <el-button type="primary" @click="save">保存</el-button>
        </template>
    </el-dialog>

    <auth-popup ref="authRef" @success="onAuthSuccess" />
</template>

<script setup lang="ts" name="settingRole">
import { getPermTree, getRoleList, getRolePerms } from '@/mock/api'
import { rolePerms } from '@/mock/perms'
import { usePaging } from '@/hooks/usePaging'
import { Search } from '@element-plus/icons-vue'
import AuthPopup from './auth.vue'

const { pager, getLists } = usePaging({ fetchFun: getRoleList, firstLoading: true })
const keyword = ref('')
const visible = ref(false)
const form = reactive({ id: 0, name: '', desc: '' })
const authRef = shallowRef<InstanceType<typeof AuthPopup>>()
const permCountMap = ref<Record<number, number>>({})

const filteredList = computed(() => {
    const kw = keyword.value.trim()
    return kw ? pager.lists.filter((item: any) => item.name?.includes(kw)) : pager.lists
})

/** 统计各角色已分配的权限数量 */
const loadPermCount = async () => {
    const tree: any = await getPermTree()
    const leafKeys: string[] = []
    const walk = (list: any[]) => {
        list.forEach((item) => {
            if (item.children?.length) walk(item.children)
            else leafKeys.push(item.key)
        })
    }
    walk(tree || [])
    const map: Record<number, number> = {}
    const ids = pager.lists.map((item: any) => item.id)
    await Promise.all(
        ids.map(async (id: number) => {
            const res: any = await getRolePerms({ id })
            map[id] = (res?.perms || []).filter((k: string) => leafKeys.includes(k)).length
        })
    )
    permCountMap.value = map
}

const openAdd = () => {
    Object.assign(form, { id: 0, name: '', desc: '' })
    visible.value = true
}
const openEdit = (row: any) => {
    Object.assign(form, { id: row.id, name: row.name, desc: row.desc })
    visible.value = true
}
const openAuth = (row: any) => {
    authRef.value?.open(row)
}
const onAuthSuccess = () => {
    loadPermCount()
}
const save = () => {
    if (!form.name.trim() || !form.desc.trim()) return ElMessage.warning('请填写角色名称和角色描述')
    const target = pager.lists.find((item: any) => item.id === form.id)
    if (target) Object.assign(target, form)
    else {
        pager.lists.unshift({
            ...form,
            id: Date.now(),
            members: 0,
            create_time: new Date().toLocaleString('zh-CN', { hour12: false }).replaceAll('/', '-')
        })
        pager.count++
    }
    visible.value = false
    ElMessage.success('保存成功')
    loadPermCount()
}
const handleDelete = (row: any) => {
    ElMessageBox.confirm(`确认删除角色「${row.name}」吗？`, '提示', { type: 'warning' })
        .then(() => {
            const index = pager.lists.findIndex((item: any) => item.id === row.id)
            if (index > -1) {
                pager.lists.splice(index, 1)
                pager.count--
            }
            delete rolePerms[row.id]
            ElMessage.success('删除成功')
        })
        .catch(() => {})
}

onMounted(async () => {
    await getLists()
    loadPermCount()
})
</script>
