<template>
    <div class="finance-profit">
        <el-card class="!border-none" shadow="never">
            <template #header>
                <span class="card-title">收益配置</span>
            </template>
            <el-alert
                class="mb-4"
                type="info"
                :closable="false"
                show-icon
                title="说明"
                description="员工收益依据此处配置的金额及完成的订单自动计算，保存后立即生效。"
            />
            <el-form label-width="180px" class="max-w-[720px]">
                <div class="section-title">托管接送</div>
                <el-form-item label="托管接送收益">
                    <el-input-number v-model="form.nursing_price" :min="0" :precision="2" class="!w-[220px]" />
                    <span class="ml-2 text-tx-secondary">元/趟</span>
                </el-form-item>
                <el-form-item label="单次最低收益金额">
                    <el-input-number v-model="form.nursing_min" :min="0" :precision="2" class="!w-[220px]" />
                    <span class="ml-2 text-tx-secondary">元</span>
                </el-form-item>
                <el-form-item label="单次最高收益金额">
                    <el-input-number v-model="form.nursing_max" :min="0" :precision="2" class="!w-[220px]" />
                    <span class="ml-2 text-tx-secondary">元</span>
                </el-form-item>

                <div class="section-title mt-4">膳食配送</div>
                <el-form-item label="膳食配送收益">
                    <el-input-number v-model="form.meal_price" :min="0" :precision="2" class="!w-[220px]" />
                    <span class="ml-2 text-tx-secondary">元/趟</span>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" :loading="saving" @click="handleSave">保存</el-button>
                    <el-button @click="handleReset">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script setup lang="ts" name="financeProfit">
import { profitConfig } from '@/mock/data_finance'

const saving = ref(false)

const form = reactive({
    nursing_price: Number(profitConfig.nursing_price),
    nursing_min: Number(profitConfig.nursing_min),
    nursing_max: Number(profitConfig.nursing_max),
    meal_price: Number(profitConfig.meal_price)
})

const handleReset = () => {
    Object.assign(form, {
        nursing_price: Number(profitConfig.nursing_price),
        nursing_min: Number(profitConfig.nursing_min),
        nursing_max: Number(profitConfig.nursing_max),
        meal_price: Number(profitConfig.meal_price)
    })
}

const handleSave = () => {
    if (Number(form.nursing_min) > Number(form.nursing_max)) {
        return ElMessage.warning('单次最低收益金额不能大于单次最高收益金额')
    }
    saving.value = true
    try {
        Object.assign(profitConfig, {
            nursing_price: Number(form.nursing_price).toFixed(2),
            nursing_min: Number(form.nursing_min).toFixed(2),
            nursing_max: Number(form.nursing_max).toFixed(2),
            meal_price: Number(form.meal_price).toFixed(2)
        })
        ElMessage.success('保存成功')
    } finally {
        saving.value = false
    }
}
</script>

<style lang="scss" scoped>
.section-title {
    @apply text-base font-medium mb-4 pl-2 border-l-4 border-primary;
}
</style>
