<template>
    <div class="article-hr" v-loading="pager.loading">
        <el-card class="!border-none" shadow="never">
            <template #header>
                <div class="flex items-center justify-between">
                    <span class="card-title">招聘求职</span>
                    <el-input v-model="queryKw" placeholder="搜索标题 / 公司 / 联系人" clearable style="width: 240px"
                        :prefix-icon="Search" @input="getLists" />
                </div>
            </template>
            <el-table :data="filteredList" stripe>
                <el-table-column prop="title" label="标题" min-width="220" show-overflow-tooltip />
                <el-table-column label="类型" width="90">
                    <template #default="{ row }">
                        <el-tag size="small" :type="row.type === '招聘' ? 'primary' : 'success'">{{ row.type }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="salary" label="薪资" width="140" show-overflow-tooltip />
                <el-table-column prop="company" label="公司 / 发布者" min-width="150" show-overflow-tooltip />
                <el-table-column prop="contact" label="联系人" width="100" />
                <el-table-column label="状态" width="90">
                    <template #default="{ row }">
                        <el-switch v-model="row.status" :active-value="1" :inactive-value="0"
                            @change="toggleStatus(row)" />
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="发布时间" width="160" />
                <el-table-column label="操作" width="110" fixed="right">
                    <template #default="{ row }">
                        <el-button size="small" type="primary" plain link @click="openEdit(row)">编辑</el-button>
                        <el-button size="small" type="danger" plain link @click="delRow(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="flex justify-end mt-4">
                <el-pagination v-model:current-page="pager.page" v-model:page-size="pager.size" :total="pager.count"
                    layout="total, prev, pager, next" @current-change="getLists" />
            </div>
        </el-card>

        <!-- 编辑弹窗 -->
        <el-dialog v-model="showEdit" title="编辑招聘求职信息" width="520px">
            <el-form :model="editForm" label-width="90px">
                <el-form-item label="标题" required>
                    <el-input v-model="editForm.title" placeholder="请输入标题" />
                </el-form-item>
                <el-form-item label="类型">
                    <el-radio-group v-model="editForm.type">
                        <el-radio label="招聘">招聘</el-radio>
                        <el-radio label="求职">求职</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="薪资">
                    <el-input v-model="editForm.salary" placeholder="如：4500-6000元/月" />
                </el-form-item>
                <el-form-item label="公司/发布者">
                    <el-input v-model="editForm.company" />
                </el-form-item>
                <el-form-item label="联系人">
                    <el-input v-model="editForm.contact" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="showEdit = false">取消</el-button>
                <el-button type="primary" @click="submitEdit">保存</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts" name="articleHr">
import { getHrList } from '@/mock/api'
import { usePaging } from '@/hooks/usePaging'
import { Search } from '@element-plus/icons-vue'

const { pager, getLists } = usePaging({ fetchFun: getHrList, firstLoading: true })

const queryKw = ref('')
const filteredList = computed(() => {
    if (!queryKw.value) return pager.lists
    const kw = queryKw.value.toLowerCase()
    return pager.lists.filter((i: any) => i.title.toLowerCase().includes(kw) || i.company.includes(kw) || i.contact.includes(kw))
})

const toggleStatus = (row: any) => {
    ElMessage.success(`已${row.status === 1 ? '上架' : '下架'}：${row.title}`)
}

// ---- 编辑 ----
const showEdit = ref(false)
const editForm = reactive({ id: 0, title: '', type: '招聘', salary: '', company: '', contact: '' })
const openEdit = (row: any) => {
    Object.assign(editForm, row)
    showEdit.value = true
}
const submitEdit = () => {
    if (!editForm.title.trim()) return ElMessage.warning('请输入标题')
    const target = pager.lists.find((i: any) => i.id === editForm.id)
    if (target) Object.assign(target, editForm)
    ElMessage.success('保存成功')
    showEdit.value = false
}

// ---- 删除 ----
const delRow = (row: any) => {
    ElMessageBox.confirm(`确定删除「${row.title}」吗？`, '删除确认', { type: 'warning' }).then(() => {
        const idx = pager.lists.findIndex((i: any) => i.id === row.id)
        if (idx > -1) pager.lists.splice(idx, 1)
        ElMessage.success('删除成功')
    }).catch(() => { })
}

onMounted(getLists)
</script>
