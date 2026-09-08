<template>
    <div class="service-meal" v-loading="pager.loading">
        <el-card class="!border-none" shadow="never">
            <template #header>
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <span class="card-title">送餐服务</span>
                        <el-radio-group v-model="queryCategory" size="small" @change="getLists">
                            <el-radio-button value="">全部</el-radio-button>
                            <el-radio-button value="早餐">早餐</el-radio-button>
                            <el-radio-button value="午餐">午餐</el-radio-button>
                            <el-radio-button value="晚餐">晚餐</el-radio-button>
                        </el-radio-group>
                    </div>
                    <el-button type="primary" @click="openAdd">
                        <el-icon><Plus /></el-icon>新增餐品
                    </el-button>
                </div>
            </template>
            <el-row :gutter="16">
                <el-col v-for="item in pager.lists" :key="item.id" :span="8" class="mb-4">
                    <el-card shadow="hover" class="service-card">
                        <div class="flex gap-3">
                            <el-image :src="item.cover" fit="cover" class="w-24 h-24 rounded-lg shrink-0" />
                            <div class="flex-1 min-w-0">
                                <div class="flex items-center gap-2 mb-1">
                                    <span class="font-bold text-base truncate">{{ item.name }}</span>
                                    <el-tag size="small" :type="categoryTag(item.category)">{{ item.category }}</el-tag>
                                </div>
                                <div class="text-orange-500 font-bold mb-1">¥{{ item.price }}</div>
                                <div class="text-xs text-gray-500 mb-1 truncate">规格：{{ item.spec }}</div>
                                <div class="text-xs text-gray-400 truncate">供应商：{{ item.vendor }}</div>
                            </div>
                        </div>
                        <div class="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                            <div class="flex items-center gap-2 text-xs text-gray-500">
                                <span>排序：{{ item.sort }}</span>
                                <el-switch v-model="item.status" :active-value="1" :inactive-value="0" size="small" @change="toggleStatus(item)" />
                            </div>
                            <div>
                                <el-button size="small" @click="openEdit(item)">编辑</el-button>
                                <el-button size="small" type="danger" plain @click="handleDelete(item)">删除</el-button>
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
            <div class="flex justify-end mt-2">
                <el-pagination v-model:current-page="pager.page" v-model:page-size="pager.size" :total="pager.count"
                    layout="total, prev, pager, next" @current-change="getLists" />
            </div>
        </el-card>

        <el-dialog v-model="showEdit" :title="editTitle" width="520px">
            <el-form :model="editForm" label-width="90px">
                <el-form-item label="餐品名称" required>
                    <el-input v-model="editForm.name" placeholder="请输入餐品名称" />
                </el-form-item>
                <el-form-item label="餐品分类" required>
                    <el-select v-model="editForm.category" placeholder="请选择分类" class="!w-full">
                        <el-option label="早餐" value="早餐" />
                        <el-option label="午餐" value="午餐" />
                        <el-option label="晚餐" value="晚餐" />
                    </el-select>
                </el-form-item>
                <el-form-item label="价格（元）" required>
                    <el-input-number v-model="editForm.price" :min="0" :precision="2" class="!w-full" />
                </el-form-item>
                <el-form-item label="规格">
                    <el-input v-model="editForm.spec" placeholder="如：一份/500g" />
                </el-form-item>
                <el-form-item label="供应商">
                    <el-input v-model="editForm.vendor" placeholder="请输入供应商名称" />
                </el-form-item>
                <el-form-item label="封面图">
                    <el-input v-model="editForm.cover" placeholder="请输入封面图地址" />
                </el-form-item>
                <el-form-item label="排序">
                    <el-input-number v-model="editForm.sort" :min="0" />
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio-group v-model="editForm.status">
                        <el-radio :value="1">启用</el-radio>
                        <el-radio :value="0">停用</el-radio>
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

<script setup lang="ts" name="serviceMeal">
import { getMealServiceList } from '@/mock/api'
import { usePaging } from '@/hooks/usePaging'
import { Plus } from '@element-plus/icons-vue'

const { pager, getLists } = usePaging({
    fetchFun: getMealServiceList,
    params: computed(() => ({ category: queryCategory.value })),
    firstLoading: true
})

const queryCategory = ref('')

const showEdit = ref(false)
const editTitle = ref('')
const editForm = reactive({
    id: 0, name: '', category: '午餐', price: 0, spec: '', vendor: '', cover: '', sort: 0, status: 1
})

const categoryTag = (c: string) => {
    const map: Record<string, string> = { '早餐': 'warning', '午餐': 'success', '晚餐': 'primary' }
    return map[c] || 'info'
}

const openAdd = () => {
    editTitle.value = '新增餐品'
    Object.assign(editForm, { id: 0, name: '', category: '午餐', price: 0, spec: '', vendor: '', cover: '', sort: 0, status: 1 })
    showEdit.value = true
}

const openEdit = (row: any) => {
    editTitle.value = '编辑餐品'
    Object.assign(editForm, row)
    showEdit.value = true
}

const submitEdit = () => {
    if (!editForm.name) return ElMessage.warning('请输入餐品名称')
    if (editForm.id === 0) {
        pager.lists.unshift({ ...editForm, id: Date.now(), cover: editForm.cover || 'https://picsum.photos/seed/ghj-meal-new/400/300' })
    } else {
        const idx = pager.lists.findIndex((i: any) => i.id === editForm.id)
        if (idx > -1) Object.assign(pager.lists[idx], editForm)
    }
    ElMessage.success(editTitle.value.includes('新增') ? '新增成功' : '保存成功')
    showEdit.value = false
}

const toggleStatus = (row: any) => {
    ElMessage.success(row.status === 1 ? '已启用' : '已停用')
}

const handleDelete = (row: any) => {
    ElMessageBox.confirm(`确定删除餐品「${row.name}」吗？`, '提示', { type: 'warning' }).then(() => {
        const idx = pager.lists.findIndex((i: any) => i.id === row.id)
        if (idx > -1) pager.lists.splice(idx, 1)
        ElMessage.success('删除成功')
    }).catch(() => {})
}

onMounted(getLists)
</script>
