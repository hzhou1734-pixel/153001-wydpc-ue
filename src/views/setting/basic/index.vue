<!-- 基础设置 -->
<template>
    <div>
        <el-form
            ref="formRef"
            :model="formData"
            label-width="150px"
            class="ls-form"
            scroll-to-error
        >
            <el-card shadow="never" class="!border-none">
                <div class="text-xl font-medium mb-[20px]">基础设置</div>
                <el-alert
                    type="primary"
                    :closable="false"
                    show-icon
                    title="顾好家币为社区内通用积分，授信额度指物业为该功能授予用户的可透支 / 可消费上限。"
                    class="mb-4"
                />
                <el-form-item label="顾好家币授信额度" prop="coin_credit_limit">
                    <div>
                        <div class="flex items-center">
                            <el-input-number
                                v-model="formData.coin_credit_limit"
                                :min="0"
                                :max="999999"
                                :precision="2"
                                :step="100"
                                :controls="true"
                                class="!w-[220px]"
                            />
                            <span class="ml-2 text-tx-secondary text-sm">顾好家币</span>
                        </div>
                        <div class="form-tips">设置后，用户顾好家币账户可用额度上限将以此为准</div>
                    </div>
                </el-form-item>
            </el-card>
        </el-form>
        <footer-btns v-perms="['setting.basic/set']">
            <el-button type="primary" @click="handleSubmit">保存</el-button>
        </footer-btns>
    </div>
</template>

<script lang="ts" setup name="settingBasic">
import type { FormInstance } from 'element-plus'

import { getBasicSetting, setBasicSetting } from '@/mock/api'

const formRef = ref<FormInstance>()

const formData = reactive({
    coin_credit_limit: 0,
})

const getData = async () => {
    const data = await getBasicSetting()
    formData.coin_credit_limit = Number(data.coin_credit_limit) || 0
}

const handleSubmit = async () => {
    await formRef.value?.validate().catch(() => {})
    await setBasicSetting({ coin_credit_limit: formData.coin_credit_limit })
    ElMessage.success('保存成功')
    getData()
}

getData()
</script>

<style lang="scss" scoped></style>
