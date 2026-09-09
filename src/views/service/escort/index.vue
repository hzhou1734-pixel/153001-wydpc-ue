<template>
    <div class="service-escort">
        <el-card class="!border-none" shadow="never">
            <template #header>
                <div class="flex items-center justify-between">
                    <span class="card-title">陪诊服务单价</span>
                    <el-button type="primary" :loading="priceSaving" @click="savePrice">保存设置</el-button>
                </div>
            </template>
            <el-form :model="priceForm" label-width="130px" class="max-w-[720px]">
                <el-form-item label="服务单价" required>
                    <el-input-number v-model="priceForm.hour_price" :min="0" :precision="2" class="!w-[220px]" />
                    <span class="ml-2 text-tx-secondary">元 / 小时</span>
                </el-form-item>
                <el-form-item label="最低计费时长">
                    <el-input-number v-model="priceForm.min_hours" :min="1" :precision="0" class="!w-[220px]" />
                    <span class="ml-2 text-tx-secondary">小时（不足按最低时长计费）</span>
                </el-form-item>
                <el-form-item label="计费说明">
                    <el-input v-model="priceForm.remark" placeholder="请输入计费说明" />
                </el-form-item>
            </el-form>
        </el-card>

        <el-card class="!border-none mt-4" shadow="never" v-loading="pager.loading">
            <template #header>
                <div class="flex items-center justify-between">
                    <span class="card-title">陪诊服务项目</span>
                    <el-button type="primary" @click="openAdd">
                        <el-icon><Plus /></el-icon>新增服务
                    </el-button>
                </div>
            </template>
            <el-table :data="pager.lists">
                <el-table-column label="封面" width="90">
                    <template #default="{ row }">
                        <el-image :src="row.cover" fit="cover" class="w-14 h-14 rounded-md" :preview-src-list="[row.cover]" preview-teleported />
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="服务名称" min-width="140" show-overflow-tooltip />
                <el-table-column label="价格（元/小时）" width="130">
                    <template #default="{ row }">
                        <span class="text-orange-500 font-bold">¥{{ row.price }}</span><span class="text-xs text-gray-400">/小时</span>
                    </template>
                </el-table-column>
                <el-table-column prop="desc" label="服务描述" min-width="180" show-overflow-tooltip />
                <el-table-column prop="sort" label="排序" width="80" />
                <el-table-column label="状态" width="90">
                    <template #default="{ row }">
                        <el-switch v-model="row.status" :active-value="1" :inactive-value="0" @change="toggleStatus(row)" />
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150" fixed="right">
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

        <el-dialog v-model="showEdit" :title="editTitle" width="520px">
            <el-form :model="editForm" label-width="90px">
                <el-form-item label="服务名称" required>
                    <el-input v-model="editForm.name" placeholder="请输入服务名称" />
                </el-form-item>
                <el-form-item label="价格（元/小时）" required>
                    <el-input-number v-model="editForm.price" :min="0" :precision="2" class="!w-full" />
                </el-form-item>
                <el-form-item label="服务描述">
                    <el-input v-model="editForm.desc" type="textarea" :rows="3" placeholder="请输入服务描述" />
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

<script setup lang="ts" name="serviceEscort">
import { getEscortPriceSetting, getEscortServiceList, saveEscortPriceSetting } from '@/mock/api'
import { usePaging } from '@/hooks/usePaging'
import { Plus } from '@element-plus/icons-vue'

const { pager, getLists } = usePaging({ fetchFun: getEscortServiceList, firstLoading: true })

const priceForm = reactive({ hour_price: 0, min_hours: 2, remark: '' })
const priceSaving = ref(false)

const getPrice = async () => {
    const res: any = await getEscortPriceSetting()
    Object.assign(priceForm, { ...res, hour_price: Number(res.hour_price) || 0 })
}

const savePrice = async () => {
    if (!priceForm.hour_price) return ElMessage.warning('请设置陪诊服务单价')
    priceSaving.value = true
    await saveEscortPriceSetting({ ...priceForm, hour_price: Number(priceForm.hour_price).toFixed(2) })
    priceSaving.value = false
    ElMessage.success('单价设置已保存')
}

const showEdit = ref(false)
const editTitle = ref('')
const editForm = reactive({
    id: 0, name: '', price: 0, unit: '小时', desc: '', cover: '', sort: 0, status: 1
})

const openAdd = () => {
    editTitle.value = '新增陪诊服务'
    Object.assign(editForm, { id: 0, name: '', price: 0, unit: '小时', desc: '', cover: '', sort: 0, status: 1 })
    showEdit.value = true
}

const openEdit = (row: any) => {
    editTitle.value = '编辑陪诊服务'
    Object.assign(editForm, row)
    showEdit.value = true
}

const submitEdit = () => {
    if (!editForm.name) return ElMessage.warning('请输入服务名称')
    if (editForm.id === 0) {
        pager.lists.unshift({ ...editForm, id: Date.now(), cover: editForm.cover || 'https://picsum.photos/seed/ghj-escort-new/400/300' })
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

onMounted(() => {
    getLists()
    getPrice()
})
</script>
