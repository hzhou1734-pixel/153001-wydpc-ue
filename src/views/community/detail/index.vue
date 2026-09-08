<script setup lang="ts" name="communityDetail">
import { getCommunityList } from '@/mock/api'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const detail = ref<any>({})
const activeTab = ref('info')

const getInfo = async () => {
    loading.value = true
    try {
        const res: any = await getCommunityList({ page_no: 1, page_size: 100 })
        detail.value = res.lists.find((item: any) => String(item.id) === String(route.query.id)) || res.lists[0] || {}
    } finally {
        loading.value = false
    }
}

const infoItems = computed(() => [
    { label: '小区名称', value: detail.value.name },
    { label: '小区地址', value: detail.value.address },
    { label: '楼栋数', value: `${detail.value.buildings ?? '-'} 栋` },
    { label: '房屋数', value: `${detail.value.houses ?? '-'} 套` },
    { label: '已认证住户', value: `${detail.value.certified ?? '-'} 人` },
    { label: '注册用户', value: `${detail.value.users ?? '-'} 人` },
    { label: '状态', value: detail.value.status === 1 ? '营业中' : '已停用' },
    { label: '创建时间', value: detail.value.create_time }
])

const tabStats = ref([
    { label: '楼栋', value: 0, icon: 'el-icon-OfficeBuilding', color: '#409eff' },
    { label: '房屋', value: 0, icon: 'el-icon-House', color: '#67c23a' },
    { label: '认证住户', value: 0, icon: 'el-icon-Postcard', color: '#e6a23c' },
    { label: '注册用户', value: 0, icon: 'el-icon-User', color: '#f56c6c' }
])

watch(detail, (val) => {
    tabStats.value[0].value = val.buildings ?? 0
    tabStats.value[1].value = val.houses ?? 0
    tabStats.value[2].value = val.certified ?? 0
    tabStats.value[3].value = val.users ?? 0
})

const back = () => router.back()

onMounted(getInfo)
</script>

<template>
    <div class="community-detail" v-loading="loading">
        <el-card class="!border-none" shadow="never">
            <template #header>
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <el-button link @click="back">
                            <icon name="el-icon-Back" :size="16" class="mr-1" />
                            返回
                        </el-button>
                        <span class="card-title ml-3">小区详情</span>
                    </div>
                </div>
            </template>
            <!-- 顶部概览 -->
            <div class="flex gap-6 mb-6">
                <el-image :src="detail.cover" fit="cover" class="w-64 h-36 rounded-lg shrink-0" />
                <div class="flex-1">
                    <div class="flex items-center gap-3">
                        <span class="text-xl font-bold">{{ detail.name }}</span>
                        <el-tag :type="detail.status === 1 ? 'success' : 'info'" size="small">
                            {{ detail.status === 1 ? '营业中' : '已停用' }}
                        </el-tag>
                    </div>
                    <div class="text-tx-secondary text-sm mt-3 flex items-center">
                        <icon name="el-icon-Location" :size="14" class="mr-1" />
                        {{ detail.address }}
                    </div>
                    <div class="flex mt-4 gap-8">
                        <div v-for="stat in tabStats" :key="stat.label" class="flex items-center gap-2">
                            <icon :name="stat.icon" :size="28" :color="stat.color" />
                            <div>
                                <div class="font-bold text-lg">{{ stat.value }}</div>
                                <div class="text-tx-secondary text-xs">{{ stat.label }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Tab 详情 -->
            <el-tabs v-model="activeTab">
                <el-tab-pane label="基本信息" name="info">
                    <el-descriptions :column="2" border>
                        <el-descriptions-item v-for="item in infoItems" :key="item.label" :label="item.label">
                            {{ item.value }}
                        </el-descriptions-item>
                    </el-descriptions>
                </el-tab-pane>
                <el-tab-pane label="楼栋房屋" name="building">
                    <el-table :data="[]" border empty-text="楼栋房屋数据请前往「楼栋房屋管理」页面维护">
                        <el-table-column prop="name" label="楼栋" />
                        <el-table-column prop="unit" label="单元" />
                        <el-table-column prop="room" label="房号" />
                        <el-table-column prop="owner" label="业主" />
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="认证住户" name="certify">
                    <el-table :data="[]" border empty-text="认证住户数据请前往「住户认证」页面查看">
                        <el-table-column prop="nickname" label="姓名" />
                        <el-table-column prop="type" label="认证类型" />
                        <el-table-column prop="room" label="房屋" />
                        <el-table-column prop="status" label="状态" />
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>
