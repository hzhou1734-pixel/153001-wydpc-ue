<script setup lang="ts" name="communityLists">
import { getCommunityList } from '@/mock/api'
import { usePaging } from '@/hooks/usePaging'
import { useRouter } from 'vue-router'

const router = useRouter()

const { pager, getLists, resetPage } = usePaging({
    fetchFun: getCommunityList,
    firstLoading: true
})

// 新增/编辑弹窗
const showEdit = ref(false)
const editTitle = ref('新增小区')
const editForm = reactive({
    id: 0,
    name: '',
    address: '',
    buildings: 0,
    houses: 0,
    status: 1
})

const openAdd = () => {
    editTitle.value = '新增小区'
    Object.assign(editForm, { id: 0, name: '', address: '', buildings: 0, houses: 0, status: 1 })
    showEdit.value = true
}

const openEdit = (row: any) => {
    editTitle.value = '编辑小区'
    Object.assign(editForm, {
        id: row.id,
        name: row.name,
        address: row.address,
        buildings: row.buildings,
        houses: row.houses,
        status: row.status
    })
    showEdit.value = true
}

const submitEdit = () => {
    if (!editForm.name) {
        ElMessage.warning('请输入小区名称')
        return
    }
    if (!editForm.address) {
        ElMessage.warning('请输入小区地址')
        return
    }
    const row = pager.lists.find((item: any) => item.id === editForm.id)
    if (row) {
        Object.assign(row, {
            name: editForm.name,
            address: editForm.address,
            buildings: editForm.buildings,
            houses: editForm.houses,
            status: editForm.status
        })
    } else {
        pager.lists.unshift({
            id: Date.now(),
            name: editForm.name,
            address: editForm.address,
            cover: `https://picsum.photos/seed/ghj-community-${editForm.id || Date.now()}/400/200`,
            buildings: editForm.buildings,
            houses: editForm.houses,
            certified: 0,
            users: 0,
            status: editForm.status,
            create_time: '2026-09-08 10:30:00'
        })
    }
    ElMessage.success('保存成功')
    showEdit.value = false
}

// 启用/停用
const toggleStatus = (row: any) => {
    row.status = row.status === 1 ? 0 : 1
    ElMessage.success(row.status === 1 ? '已启用' : '已停用')
}

const goDetail = (row: any) => {
    router.push({ path: '/community/detail', query: { id: row.id } })
}

const handleDelete = (row: any) => {
    ElMessageBox.confirm('删除后不可恢复，确认删除该小区吗？', '提示', { type: 'warning' })
        .then(() => {
            const index = pager.lists.findIndex((item: any) => item.id === row.id)
            if (index > -1) pager.lists.splice(index, 1)
            ElMessage.success('删除成功')
        })
        .catch(() => {})
}

onMounted(getLists)
</script>

<template>
    <div class="community-lists" v-loading="pager.loading">
        <el-card class="!border-none" shadow="never">
            <template #header>
                <div class="flex items-center justify-between">
                    <span class="card-title">小区列表</span>
                    <el-button type="primary" @click="openAdd">
                        <icon name="el-icon-Plus" :size="14" class="mr-1" />
                        新增小区
                    </el-button>
                </div>
            </template>
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <div
                    v-for="item in pager.lists"
                    :key="item.id"
                    class="border border-br rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                    <el-image :src="item.cover" fit="cover" class="w-full h-36 block" />
                    <div class="p-4">
                        <div class="flex items-center justify-between">
                            <span class="font-bold text-base">{{ item.name }}</span>
                            <el-tag :type="item.status === 1 ? 'success' : 'info'" size="small">
                                {{ item.status === 1 ? '营业中' : '已停用' }}
                            </el-tag>
                        </div>
                        <div class="text-tx-secondary text-sm mt-2 flex items-center">
                            <icon name="el-icon-Location" :size="14" class="mr-1" />
                            {{ item.address }}
                        </div>
                        <div class="flex mt-3 text-center">
                            <div class="flex-1">
                                <div class="font-bold">{{ item.buildings }}</div>
                                <div class="text-tx-secondary text-xs">楼栋</div>
                            </div>
                            <div class="flex-1">
                                <div class="font-bold">{{ item.houses }}</div>
                                <div class="text-tx-secondary text-xs">房屋</div>
                            </div>
                            <div class="flex-1">
                                <div class="font-bold">{{ item.certified }}</div>
                                <div class="text-tx-secondary text-xs">已认证</div>
                            </div>
                            <div class="flex-1">
                                <div class="font-bold">{{ item.users }}</div>
                                <div class="text-tx-secondary text-xs">用户数</div>
                            </div>
                        </div>
                        <div class="flex mt-4 gap-2">
                            <el-button size="small" @click="goDetail(item)">详情</el-button>
                            <el-button size="small" type="primary" plain @click="openEdit(item)">编辑</el-button>
                            <el-button size="small" :type="item.status === 1 ? 'warning' : 'success'" plain @click="toggleStatus(item)">
                                {{ item.status === 1 ? '停用' : '启用' }}
                            </el-button>
                            <el-button size="small" type="danger" plain @click="handleDelete(item)">删除</el-button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex justify-end mt-4">
                <el-pagination
                    v-model:current-page="pager.page"
                    v-model:page-size="pager.size"
                    :total="pager.count"
                    :page-sizes="[10, 15, 20]"
                    layout="total, sizes, prev, pager, next, jumper"
                    @current-change="getLists"
                    @size-change="resetPage"
                />
            </div>
        </el-card>

        <el-dialog v-model="showEdit" :title="editTitle" width="520px">
            <el-form label-width="90px">
                <el-form-item label="小区名称" required>
                    <el-input v-model="editForm.name" placeholder="请输入小区名称" />
                </el-form-item>
                <el-form-item label="小区地址" required>
                    <el-input v-model="editForm.address" placeholder="请输入小区详细地址" />
                </el-form-item>
                <el-form-item label="楼栋数">
                    <el-input-number v-model="editForm.buildings" :min="0" />
                </el-form-item>
                <el-form-item label="房屋数">
                    <el-input-number v-model="editForm.houses" :min="0" />
                </el-form-item>
                <el-form-item label="状态">
                    <el-switch v-model="editForm.status" :active-value="1" :inactive-value="0" active-text="营业中" inactive-text="停用" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="showEdit = false">取消</el-button>
                <el-button type="primary" @click="submitEdit">确定</el-button>
            </template>
        </el-dialog>
    </div>
</template>
