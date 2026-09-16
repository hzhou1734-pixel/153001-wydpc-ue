<template>
    <el-card class="!border-none" shadow="never">
        <template #header>
            <div class="flex items-center justify-between">
                <span class="card-title">物业信息</span>
                <span class="text-tx-secondary text-xs">以下资料由平台后台添加物业时配置，物业后台仅可查看，无法修改</span>
            </div>
        </template>
        <el-descriptions :column="2" border>
            <el-descriptions-item label="物业名称">{{ info.name }}</el-descriptions-item>
            <el-descriptions-item label="物业简称">{{ info.short_name }}</el-descriptions-item>
            <el-descriptions-item label="负责人">{{ info.contact }}</el-descriptions-item>
            <el-descriptions-item label="联系电话">{{ info.mobile }}</el-descriptions-item>
            <el-descriptions-item label="办公地址" :span="2">{{ info.address }}</el-descriptions-item>
            <el-descriptions-item label="统一社会信用代码">{{ info.credit_code || '-' }}</el-descriptions-item>
            <el-descriptions-item label="授权时间">{{ info.auth_time || '-' }}</el-descriptions-item>
            <el-descriptions-item label="服务小区数">{{ info.community_count ?? '-' }}</el-descriptions-item>
            <el-descriptions-item label="状态">
                <el-tag :type="info.status === 1 ? 'success' : 'info'" size="small">{{ info.status === 1 ? '已授权' : '未授权' }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="营业执照" :span="2">
                <el-image
                    v-if="info.license"
                    :src="info.license"
                    :preview-src-list="[info.license]"
                    preview-teleported
                    fit="cover"
                    class="w-40 h-28 rounded"
                />
                <span v-else>-</span>
            </el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ info.create_time }}</el-descriptions-item>
        </el-descriptions>
    </el-card>
</template>

<script setup lang="ts" name="settingProperty">
import { getPropertyInfo } from '@/mock/api'

const info = ref<Record<string, any>>({})

onMounted(async () => {
    const res = await getPropertyInfo()
    info.value = res as Record<string, any>
})
</script>
