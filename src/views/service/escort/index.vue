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
    </div>
</template>

<script setup lang="ts" name="serviceEscort">
import { getEscortPriceSetting, saveEscortPriceSetting } from '@/mock/api'

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

onMounted(() => {
    getPrice()
})
</script>
