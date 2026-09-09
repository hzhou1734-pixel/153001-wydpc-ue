<template>
    <div class="image-upload">
        <div
            v-if="modelValue"
            class="image-upload__item"
            :style="{ width: realWidth, height: realHeight }"
        >
            <el-image
                :src="modelValue"
                :preview-src-list="[modelValue]"
                :initial-index="0"
                fit="cover"
                preview-teleported
                hide-on-click-modal
                class="image-upload__img"
            />
            <div class="image-upload__mask">
                <el-icon title="重新上传" @click.stop="trigger"><RefreshRight /></el-icon>
                <el-icon title="删除" @click.stop="handleRemove"><Delete /></el-icon>
            </div>
        </div>
        <div
            v-else
            class="image-upload__add"
            :style="{ width: realWidth, height: realHeight }"
            @click="trigger"
        >
            <el-icon><Plus /></el-icon>
            <span class="image-upload__text">{{ text }}</span>
        </div>
        <input
            ref="inputRef"
            type="file"
            accept="image/jpeg,image/png,image/jpg,image/webp,image/gif"
            style="display: none"
            @change="handleChange"
        />
        <div v-if="tip" class="image-upload__tip">{{ tip }}</div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Delete, Plus, RefreshRight } from '@element-plus/icons-vue'

const props = withDefaults(
    defineProps<{
        modelValue?: string
        /** 正方形边长（宽高一致时使用） */
        size?: number
        width?: string | number
        height?: string | number
        /** 空态提示文案 */
        text?: string
        /** 底部说明 */
        tip?: string
        /** 单张大小上限（MB） */
        maxSize?: number
    }>(),
    { modelValue: '', size: 100, text: '上传图片', maxSize: 5 }
)

const emit = defineEmits<{ 'update:modelValue': [string]; change: [string] }>()

const inputRef = ref<HTMLInputElement>()

const fmt = (v?: string | number) => (typeof v === 'number' ? `${v}px` : v || '')
const realWidth = computed(() => fmt(props.width) || fmt(props.size))
const realHeight = computed(() => fmt(props.height) || fmt(props.size))

const trigger = () => inputRef.value?.click()

const handleRemove = () => {
    emit('update:modelValue', '')
    emit('change', '')
}

/** 读取图片：超过 1MB 自动压缩到最长边 1200，避免 base64 过大 */
const readFile = (file: File) =>
    new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
            const dataUrl = reader.result as string
            if (file.size <= 1024 * 1024) return resolve(dataUrl)
            const img = new Image()
            img.onload = () => {
                const maxSide = 1200
                const scale = Math.min(1, maxSide / Math.max(img.width, img.height))
                const width = Math.round(img.width * scale)
                const height = Math.round(img.height * scale)
                const canvas = document.createElement('canvas')
                canvas.width = width
                canvas.height = height
                const ctx = canvas.getContext('2d')
                if (!ctx) return resolve(dataUrl)
                ctx.drawImage(img, 0, 0, width, height)
                resolve(canvas.toDataURL('image/jpeg', 0.85))
            }
            img.onerror = () => resolve(dataUrl)
            img.src = dataUrl
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
    })

const handleChange = async (e: Event) => {
    const input = e.target as HTMLInputElement
    const file = input.files?.[0]
    input.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) return ElMessage.warning('请选择图片文件')
    if (file.size > props.maxSize * 1024 * 1024) {
        return ElMessage.warning(`图片大小不能超过 ${props.maxSize}MB`)
    }
    const url = await readFile(file)
    emit('update:modelValue', url)
    emit('change', url)
}
</script>

<style scoped lang="scss">
.image-upload {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    &__item {
        position: relative;
        overflow: hidden;
        border: 1px solid var(--el-border-color);
        border-radius: 6px;
        background: var(--el-fill-color-light);
    }
    &__img {
        width: 100%;
        height: 100%;
        display: block;
    }
    &__mask {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        background: rgba(0, 0, 0, 0.45);
        opacity: 0;
        transition: opacity 0.2s;
        pointer-events: none;
        color: #fff;
        font-size: 18px;
        :deep(.el-icon) {
            pointer-events: auto;
            cursor: pointer;
            &:hover {
                color: var(--el-color-primary-light-3);
            }
        }
    }
    &__item:hover &__mask {
        opacity: 1;
    }
    &__add {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 4px;
        border: 1px dashed var(--el-border-color);
        border-radius: 6px;
        background: var(--el-fill-color-lighter);
        cursor: pointer;
        color: var(--el-text-color-secondary);
        font-size: 20px;
        transition: border-color 0.2s;
        &:hover {
            border-color: var(--el-color-primary);
            color: var(--el-color-primary);
        }
    }
    &__text {
        font-size: 12px;
    }
    &__tip {
        margin-top: 6px;
        font-size: 12px;
        color: var(--el-text-color-secondary);
        line-height: 1.5;
    }
}
</style>
