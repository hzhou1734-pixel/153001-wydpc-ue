<template>
    <div class="service-nursing" v-loading="pager.loading">
        <el-card class="!border-none" shadow="never">
            <template #header>
                <div class="flex items-center justify-between">
                    <span class="card-title">养老服务</span>
                    <el-button type="primary" @click="openAdd">
                        <el-icon><Plus /></el-icon>新增服务
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
                                    <el-tag size="small" :type="typeTag(item.type)">{{ item.type }}</el-tag>
                                </div>
                                <div class="text-orange-500 font-bold mb-1">
                                    ¥{{ item.price }}<span class="text-xs text-gray-400 font-normal">/{{ item.unit }}</span>
                                </div>
                                <div class="text-xs text-gray-500 mb-1">时长：{{ item.duration }}</div>
                                <div class="text-xs text-gray-400 line-clamp-2">{{ item.desc }}</div>
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
                <el-form-item label="服务名称" required>
                    <el-input v-model="editForm.name" placeholder="请输入服务名称" />
                </el-form-item>
                <el-form-item label="服务类型" required>
                    <el-select v-model="editForm.type" placeholder="请选择服务类型" class="!w-full">
                        <el-option label="日常照料" value="日常照料" />
                        <el-option label="健康监测" value="健康监测" />
                        <el-option label="紧急呼叫" value="紧急呼叫" />
                    </el-select>
                </el-form-item>
                <el-form-item label="价格（元）" required>
                    <el-input-number v-model="editForm.price" :min="0" :precision="2" class="!w-full" />
                </el-form-item>
                <el-form-item label="计费单位" required>
                    <el-select v-model="editForm.unit" placeholder="请选择计费单位" class="!w-full">
                        <el-option label="次" value="次" />
                        <el-option label="月" value="月" />
                    </el-select>
                </el-form-item>
                <el-form-item label="服务时长">
                    <el-input v-model="editForm.duration" placeholder="如：60分钟" />
                </el-form-item>
                <el-form-item label="服务描述">
                    <el-input v-model="editForm.desc" type="textarea" :rows="3" placeholder="请输入服务描述" />
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

<script setup lang="ts" name="serviceNursing">
import { getNursingServiceList } from '@/mock/api'
import { usePaging } from '@/hooks/usePaging'
import { Plus } from '@element-plus/icons-vue'

const { pager, getLists } = usePaging({ fetchFun: getNursingServiceList, firstLoading: true })

const showEdit = ref(false)
const editTitle = ref('')
const editForm = reactive({
    id: 0, name: '', type: '日常照料', price: 0, unit: '次', duration: '', desc: '', sort: 0, status: 1
})

const typeTag = (type: string) => {
    const map: Record<string, string> = { '日常照料': 'success', '健康监测': 'warning', '紧急呼叫': 'danger' }
    return map[type] || 'info'
}

const openAdd = () => {
    editTitle.value = '新增养老服务'
    Object.assign(editForm, { id: 0, name: '', type: '日常照料', price: 0, unit: '次', duration: '', desc: '', sort: 0, status: 1 })
    showEdit.value = true
}

const openEdit = (row: any) => {
    editTitle.value = '编辑养老服务'
    Object.assign(editForm, row)
    showEdit.value = true
}

const submitEdit = () => {
    if (!editForm.name) return ElMessage.warning('请输入服务名称')
    if (editForm.id === 0) {
        pager.lists.unshift({ ...editForm, id: Date.now(), cover: 'https://picsum.photos/seed/ghj-nursing-new/400/300' })
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
    ElMessageBox.confirm(`确定删除服务「${row.name}」吗？`, '提示', { type: 'warning' }).then(() => {
        const idx = pager.lists.findIndex((i: any) => i.id === row.id)
        if (idx > -1) pager.lists.splice(idx, 1)
        ElMessage.success('删除成功')
    }).catch(() => {})
}

onMounted(getLists)
</script>
