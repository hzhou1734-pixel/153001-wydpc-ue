<template>
    <div class="service-meal">
        <el-card class="!border-none" shadow="never">
            <template #header>
                <div class="flex items-center justify-between">
                    <span class="card-title">膳食服务</span>
                    <span class="text-xs text-tx-secondary">菜单每日更新，请提前一天完成明日菜单配置</span>
                </div>
            </template>

            <el-alert type="info" :closable="false" class="mb-4">
                <template #title>
                    <div class="leading-6">
                        每天都需要对菜单进行实时更新，按照「今日菜单」「明日菜单」分别配置早餐、午餐、晚餐。例如今日 9 月 15 号，今日菜单是由 14 号配置，到了 15 号凌晨
                        00:00:01 自动同步为 9 月 15 号的菜单，同时明日菜单变为 9 月 16 号的菜单配置，自动被清空需要重新上传 9 月 16 号的菜单信息。
                    </div>
                </template>
            </el-alert>

            <el-tabs v-model="activeTab">
                <el-tab-pane :label="`今日菜单（${menus.today.date}）`" name="today" />
                <el-tab-pane :label="`明日菜单（${menus.tomorrow.date}）`" name="tomorrow" />
            </el-tabs>

            <el-card v-for="meal in mealTypes" :key="meal.key" class="!border-none mt-4" shadow="never">
                <template #header>
                    <div class="flex items-center justify-between">
                        <span class="card-title">{{ meal.label }}</span>
                        <el-button type="primary" @click="openAdd(meal.key)">
                            <el-icon class="mr-1"><Plus /></el-icon>添加
                        </el-button>
                    </div>
                </template>
                <el-table :data="currentMenu[meal.key]" stripe>
                    <el-table-column label="图片" min-width="100">
                        <template #default="{ row }">
                            <el-image :src="row.image" :preview-src-list="[row.image]" preview-teleported fit="cover"
                                class="w-14 h-10 rounded" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="text" label="菜品名称" min-width="260" show-overflow-tooltip />
                    <el-table-column label="价格" min-width="120" align="right">
                        <template #default="{ row }">
                            <span class="text-orange-500 font-bold">¥{{ money(row.price) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="130" fixed="right">
                        <template #default="{ row }">
                            <el-button link type="primary" @click="openEdit(meal.key, row)">编辑</el-button>
                            <el-button link type="danger" @click="delRow(meal.key, row)">删除</el-button>
                        </template>
                    </el-table-column>
                    <template #empty>
                        <span class="text-tx-secondary">暂无{{ meal.label }}内容，点击右上角「添加」上传</span>
                    </template>
                </el-table>
            </el-card>
        </el-card>

        <!-- 添加 / 编辑弹窗 -->
        <el-dialog v-model="editVisible" :title="`${editTitle} - ${currentMealLabel}`" width="600px" top="8vh"
            destroy-on-close>
            <el-form :model="form" label-width="90px">
                <el-form-item label="文字" required>
                    <el-input v-model="form.text" placeholder="请输入菜品名称或菜单文字" maxlength="40" show-word-limit />
                </el-form-item>
                <el-form-item label="图片">
                    <ImageUpload v-model="form.image" :width="160" :height="100"
                        tip="建议尺寸 400×300，支持 jpg/png/webp，5MB 以内" />
                </el-form-item>
                <el-form-item label="价格" required>
                    <el-input-number v-model="form.price" :min="0" :precision="2" :step="1" />
                    <span class="ml-2 text-xs text-tx-secondary">元</span>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="editVisible = false">取消</el-button>
                <el-button type="primary" @click="submitForm">保存</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts" name="serviceMeal">
import { mealMenus } from '@/mock/data_service'
import { Plus } from '@element-plus/icons-vue'
import ImageUpload from '@/components/image-upload/index.vue'

type DayKey = 'today' | 'tomorrow'
type MealKey = 'breakfast' | 'lunch' | 'dinner'

const money = (val: any) => Number(val || 0).toFixed(2)

const menus = reactive(mealMenus)
const activeTab = ref<DayKey>('today')
const mealTypes: { key: MealKey; label: string }[] = [
    { key: 'breakfast', label: '早餐' },
    { key: 'lunch', label: '午餐' },
    { key: 'dinner', label: '晚餐' }
]

const currentMenu = computed(() => menus[activeTab.value])
const currentMealLabel = computed(
    () => mealTypes.find((i) => i.key === form.meal)?.label || ''
)

// ==================== 添加 / 编辑 ====================
const editVisible = ref(false)
const editTitle = ref('添加内容')
const form = reactive({
    id: 0,
    meal: 'breakfast' as MealKey,
    text: '',
    image: '',
    price: 0
})

const getLists = (meal: MealKey) => currentMenu.value[meal] as any[]

const openAdd = (meal: MealKey) => {
    editTitle.value = '添加内容'
    Object.assign(form, { id: 0, meal, text: '', image: '', price: 0 })
    editVisible.value = true
}
const openEdit = (meal: MealKey, row: any) => {
    editTitle.value = '编辑内容'
    Object.assign(form, { id: row.id, meal, text: row.text, image: row.image || '', price: Number(row.price) || 0 })
    editVisible.value = true
}
const submitForm = () => {
    if (!form.text.trim()) return ElMessage.warning('请输入文字内容')
    const lists = getLists(form.meal)
    const payload = {
        text: form.text.trim(),
        image: form.image || `https://picsum.photos/seed/ghj-meal-${Date.now() % 1000}/400/300`,
        price: Number(form.price) || 0
    }
    if (form.id) {
        const row = lists.find((i: any) => i.id === form.id)
        if (row) Object.assign(row, payload)
        ElMessage.success('保存成功')
    } else {
        lists.push({ id: Date.now(), ...payload })
        ElMessage.success('添加成功')
    }
    editVisible.value = false
}

// ==================== 删除 ====================
const delRow = (meal: MealKey, row: any) => {
    ElMessageBox.confirm(`确定删除「${row.text}」吗？`, '删除确认', { type: 'warning' })
        .then(() => {
            const lists = getLists(meal)
            const idx = lists.findIndex((i: any) => i.id === row.id)
            if (idx > -1) lists.splice(idx, 1)
            ElMessage.success('删除成功')
        })
        .catch(() => { })
}
</script>
