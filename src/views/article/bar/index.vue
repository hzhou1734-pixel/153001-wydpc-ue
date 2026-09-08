<template>
    <div class="article-bar" v-loading="pager.loading">
        <el-card class="!border-none" shadow="never">
            <template #header>
                <div class="flex items-center justify-between">
                    <span class="card-title">邻里圈帖子</span>
                    <el-input v-model="queryKw" placeholder="搜索标题 / 作者 / 小区" clearable style="width: 240px"
                        :prefix-icon="Search" @input="getLists" />
                </div>
            </template>
            <el-table :data="filteredList" stripe>
                <el-table-column label="封面" width="90">
                    <template #default="{ row }">
                        <el-image :src="row.cover" :preview-src-list="[row.cover]" preview-teleported
                            fit="cover" class="w-14 h-10 rounded" />
                    </template>
                </el-table-column>
                <el-table-column prop="title" label="帖子标题" min-width="220" show-overflow-tooltip />
                <el-table-column prop="author" label="作者" width="100" />
                <el-table-column prop="community" label="所属小区" min-width="130" show-overflow-tooltip />
                <el-table-column prop="views" label="浏览量" width="90" sortable />
                <el-table-column prop="replies" label="评论数" width="90" sortable />
                <el-table-column label="状态" width="90">
                    <template #default="{ row }">
                        <el-switch v-model="row.status" :active-value="1" :inactive-value="0"
                            @change="toggleStatus(row)" />
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="发布时间" width="160" />
                <el-table-column label="操作" width="130" fixed="right">
                    <template #default="{ row }">
                        <el-button size="small" type="primary" plain link @click="viewDetail(row)">详情</el-button>
                        <el-button size="small" type="danger" plain link @click="delRow(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="flex justify-end mt-4">
                <el-pagination v-model:current-page="pager.page" v-model:page-size="pager.size" :total="pager.count"
                    layout="total, prev, pager, next" @current-change="getLists" />
            </div>
        </el-card>

        <!-- 详情弹窗 -->
        <el-dialog v-model="showDetail" title="帖子详情" width="480px">
            <el-descriptions :column="1" border v-if="detailRow">
                <el-descriptions-item label="封面">
                    <el-image :src="detailRow.cover" :preview-src-list="[detailRow.cover]" preview-teleported
                        fit="cover" class="w-32 h-24 rounded" />
                </el-descriptions-item>
                <el-descriptions-item label="标题">{{ detailRow.title }}</el-descriptions-item>
                <el-descriptions-item label="作者">{{ detailRow.author }}</el-descriptions-item>
                <el-descriptions-item label="所属小区">{{ detailRow.community }}</el-descriptions-item>
                <el-descriptions-item label="浏览 / 评论">{{ detailRow.views }} / {{ detailRow.replies }}</el-descriptions-item>
                <el-descriptions-item label="状态">{{ detailRow.status === 1 ? '已发布' : '已下架' }}</el-descriptions-item>
                <el-descriptions-item label="发布时间">{{ detailRow.create_time }}</el-descriptions-item>
            </el-descriptions>
        </el-dialog>
    </div>
</template>

<script setup lang="ts" name="articleBar">
import { getBarList } from '@/mock/api'
import { usePaging } from '@/hooks/usePaging'
import { Search } from '@element-plus/icons-vue'

const { pager, getLists } = usePaging({ fetchFun: getBarList, firstLoading: true })

const queryKw = ref('')
const filteredList = computed(() => {
    if (!queryKw.value) return pager.lists
    const kw = queryKw.value.toLowerCase()
    return pager.lists.filter((i: any) => i.title.toLowerCase().includes(kw) || i.author.includes(kw) || i.community.includes(kw))
})

const toggleStatus = (row: any) => {
    ElMessage.success(`已${row.status === 1 ? '恢复展示' : '下架'}帖子`)
}

// ---- 详情 ----
const showDetail = ref(false)
const detailRow = ref<any>(null)
const viewDetail = (row: any) => {
    detailRow.value = row
    showDetail.value = true
}

// ---- 删除 ----
const delRow = (row: any) => {
    ElMessageBox.confirm(`确定删除帖子「${row.title}」吗？删除后不可恢复。`, '删除确认', { type: 'warning' }).then(() => {
        const idx = pager.lists.findIndex((i: any) => i.id === row.id)
        if (idx > -1) pager.lists.splice(idx, 1)
        ElMessage.success('删除成功')
    }).catch(() => { })
}

onMounted(getLists)
</script>
