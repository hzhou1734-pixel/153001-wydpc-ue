<template>
    <div class="service-meal">
        <el-card class="!border-none" shadow="never">
            <el-tabs v-model="activeTab">
                <!-- 菜品管理 -->
                <el-tab-pane label="菜品管理" name="dishes">
                    <div class="flex items-center justify-between mb-4">
                        <span class="card-title">膳食菜品</span>
                        <el-button type="primary" @click="openDishAdd">
                            <el-icon><Plus /></el-icon>新增菜品
                        </el-button>
                    </div>
                    <el-table size="large" v-loading="pager.loading" :data="pager.lists">
                        <el-table-column label="菜品图片" width="100">
                            <template #default="{ row }">
                                <el-image :src="row.cover" fit="cover" class="w-14 h-14 rounded-md"
                                    :preview-src-list="[row.cover]" preview-teleported />
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" label="菜品名称" min-width="160" show-overflow-tooltip />
                        <el-table-column label="价格（元）" width="120" align="right">
                            <template #default="{ row }">
                                <span class="text-orange-500 font-bold">¥{{ row.price }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="sort" label="排序" width="80" show-overflow-tooltip />
                        <el-table-column label="状态" width="90">
                            <template #default="{ row }">
                                <el-switch v-model="row.status" :active-value="1" :inactive-value="0"
                                    @change="toggleDishStatus(row)" />
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="130" fixed="right">
                            <template #default="{ row }">
                                <el-button size="small" @click="openDishEdit(row)">编辑</el-button>
                                <el-button size="small" type="danger" plain @click="handleDishDelete(row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="flex justify-end mt-2">
                        <el-pagination v-model:current-page="pager.page" v-model:page-size="pager.size"
                            :total="pager.count" layout="total, prev, pager, next" @current-change="getLists" />
                    </div>
                </el-tab-pane>

                <!-- 套餐组合（固定组合价） -->
                <el-tab-pane label="套餐组合" name="combos">
                    <div class="flex items-center justify-between mb-4">
                        <span class="card-title">套餐组合价格</span>
                        <el-button type="primary" @click="openComboAdd">
                            <el-icon><Plus /></el-icon>新增组合
                        </el-button>
                    </div>
                    <el-alert class="mb-4" type="info" :closable="false"
                        title="膳食按「套餐组合」固定价售卖：不同菜品组合对应不同价格（如选 ABC 一个价、选 BCD 另一个价），组合价可低于菜品单价合计。" />
                    <el-table size="large" :data="comboLists">
                        <el-table-column prop="name" label="组合名称" min-width="180" show-overflow-tooltip />
                        <el-table-column label="包含菜品" min-width="260">
                            <template #default="{ row }">
                                <el-tag v-for="id in row.dish_ids" :key="id" size="small" effect="light" class="mr-1 mb-1">
                                    {{ dishName(id) }}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="菜品原价合计" width="130" align="right">
                            <template #default="{ row }">
                                <span class="text-gray-400 line-through">¥{{ originPrice(row) }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="组合价格" width="120" align="right">
                            <template #default="{ row }">
                                <span class="text-orange-500 font-bold">¥{{ row.price }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="sort" label="排序" width="80" show-overflow-tooltip />
                        <el-table-column label="状态" width="90">
                            <template #default="{ row }">
                                <el-switch :model-value="row.status" :active-value="1" :inactive-value="0" @change="toggleCombo(row)" />
                            </template>
                        </el-table-column>
                        <el-table-column prop="update_time" label="更新时间" width="160" show-overflow-tooltip />
                        <el-table-column label="操作" width="130" fixed="right">
                            <template #default="{ row }">
                                <el-button size="small" @click="openComboEdit(row)">编辑</el-button>
                                <el-button size="small" type="danger" plain @click="handleComboDelete(row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>

                <!-- 每日菜单 -->
                <el-tab-pane label="每日菜单" name="daily">
                    <div class="flex items-center justify-between mb-4">
                        <span class="card-title">每日菜品信息</span>
                        <el-button type="primary" :loading="menuSaving" @click="saveMenu">保存当日菜单</el-button>
                    </div>
                    <el-form label-width="90px" class="max-w-[900px]">
                        <el-form-item label="选择日期">
                            <el-date-picker v-model="menuDate" type="date" value-format="YYYY-MM-DD"
                                placeholder="请选择日期" class="!w-[220px]" @change="loadMenu" />
                        </el-form-item>
                        <el-form-item label="当日套餐">
                            <el-checkbox-group v-model="menuComboIds" class="flex flex-wrap">
                                <el-checkbox v-for="item in comboLists" :key="item.id" :value="item.id">
                                    {{ item.name }}（¥{{ item.price }}）
                                </el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-form>
                    <el-alert type="warning" :closable="false"
                        title="用户端按所选日期展示当日套餐，未勾选的套餐当天不提供下单。" />
                </el-tab-pane>
            </el-tabs>
        </el-card>

        <!-- 菜品编辑 -->
        <el-dialog v-model="showDishEdit" :title="dishTitle" width="760px" top="5vh">
            <el-form :model="dishForm" label-width="90px">
                <el-form-item label="菜品名称" required>
                    <el-input v-model="dishForm.name" placeholder="请输入菜品名称" />
                </el-form-item>
                <el-form-item label="价格（元）" required>
                    <el-input-number v-model="dishForm.price" :min="0" :precision="2" class="!w-full" />
                </el-form-item>
                <el-form-item label="菜品信息">
                    <Editor v-model="dishForm.detail" mode="simple" height="260px" class="!w-full" />
                </el-form-item>
                <el-form-item label="封面图">
                    <el-input v-model="dishForm.cover" placeholder="请输入封面图地址" />
                </el-form-item>
                <el-form-item label="排序">
                    <el-input-number v-model="dishForm.sort" :min="0" />
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio-group v-model="dishForm.status">
                        <el-radio :value="1">启用</el-radio>
                        <el-radio :value="0">停用</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="showDishEdit = false">取消</el-button>
                <el-button type="primary" @click="submitDish">确定</el-button>
            </template>
        </el-dialog>

        <!-- 套餐组合编辑 -->
        <el-dialog v-model="showComboEdit" :title="comboTitle" width="560px">
            <el-form :model="comboForm" label-width="100px">
                <el-form-item label="组合名称" required>
                    <el-input v-model="comboForm.name" placeholder="如：ABC 经典午餐组合" />
                </el-form-item>
                <el-form-item label="包含菜品" required>
                    <el-select v-model="comboForm.dish_ids" multiple placeholder="请选择该组合包含的菜品" class="!w-full">
                        <el-option v-for="item in pager.lists" :key="item.id" :label="`${item.name}（¥${item.price}）`"
                            :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="组合价格">
                    <el-input-number v-model="comboForm.price" :min="0" :precision="2" class="!w-[220px]" />
                    <span class="ml-2 text-tx-secondary">菜品原价合计 ¥{{ originPrice(comboForm) }}</span>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input-number v-model="comboForm.sort" :min="0" />
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio-group v-model="comboForm.status">
                        <el-radio :value="1">显示</el-radio>
                        <el-radio :value="0">隐藏</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="showComboEdit = false">取消</el-button>
                <el-button type="primary" @click="submitCombo">确定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts" name="serviceMeal">
import { getDailyMenu, getMealComboList, getMealServiceList, saveDailyMenu } from '@/mock/api'
import { usePaging } from '@/hooks/usePaging'
import { Plus } from '@element-plus/icons-vue'
import Editor from '@/components/editor/index.vue'

const activeTab = ref('dishes')

const { pager, getLists } = usePaging({ fetchFun: getMealServiceList, firstLoading: true })

/** 菜品名称映射（供套餐组合展示） */
const dishMap = computed(() => {
    const map: Record<number, any> = {}
    pager.lists.forEach((item: any) => (map[item.id] = item))
    return map
})
const dishName = (id: number) => dishMap.value[id]?.name || `菜品${id}`
const originPrice = (row: any) =>
    (row.dish_ids || []).reduce((sum: number, id: number) => sum + (Number(dishMap.value[id]?.price) || 0), 0).toFixed(2)

/* ============ 菜品 ============ */
const showDishEdit = ref(false)
const dishTitle = ref('')
const dishForm = reactive({
    id: 0, name: '', price: 0, detail: '', cover: '', sort: 0, status: 1
})

const openDishAdd = () => {
    dishTitle.value = '新增菜品'
    Object.assign(dishForm, { id: 0, name: '', price: 0, detail: '', cover: '', sort: 0, status: 1 })
    showDishEdit.value = true
}
const openDishEdit = (row: any) => {
    dishTitle.value = '编辑菜品'
    Object.assign(dishForm, row, { detail: row.detail || '' })
    showDishEdit.value = true
}
const submitDish = () => {
    if (!dishForm.name) return ElMessage.warning('请输入菜品名称')
    const payload = { ...dishForm, price: Number(dishForm.price).toFixed(2) }
    if (dishForm.id === 0) {
        pager.lists.unshift({ ...payload, id: Date.now(), cover: dishForm.cover || 'https://picsum.photos/seed/ghj-meal-new/400/300' })
    } else {
        const idx = pager.lists.findIndex((i: any) => i.id === dishForm.id)
        if (idx > -1) Object.assign(pager.lists[idx], payload)
    }
    ElMessage.success(dishTitle.value.includes('新增') ? '新增成功' : '保存成功')
    showDishEdit.value = false
}
const toggleDishStatus = (row: any) => {
    ElMessage.success(row.status === 1 ? '已启用' : '已停用')
}
const handleDishDelete = (row: any) => {
    ElMessageBox.confirm(`确定删除菜品「${row.name}」吗？`, '提示', { type: 'warning' }).then(() => {
        const idx = pager.lists.findIndex((i: any) => i.id === row.id)
        if (idx > -1) pager.lists.splice(idx, 1)
        ElMessage.success('删除成功')
    }).catch(() => {})
}

/* ============ 套餐组合 ============ */
const comboLists = ref<any[]>([])
const showComboEdit = ref(false)
const comboTitle = ref('')
const comboForm = reactive({
    id: 0, name: '', dish_ids: [] as number[], price: 0, sort: 0, status: 1, update_time: ''
})

const getCombos = async () => {
    const res: any = await getMealComboList({ page_no: 1, page_size: 100 })
    comboLists.value = res?.lists || []
}
const openComboAdd = () => {
    comboTitle.value = '新增组合'
    Object.assign(comboForm, { id: 0, name: '', dish_ids: [], price: 0, sort: 0, status: 1, update_time: '' })
    showComboEdit.value = true
}
const openComboEdit = (row: any) => {
    comboTitle.value = '编辑组合'
    Object.assign(comboForm, { ...row, dish_ids: [...row.dish_ids], price: Number(row.price) || 0 })
    showComboEdit.value = true
}
const nowText = () => {
    const d = new Date()
    const pad = (v: number) => String(v).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}
const submitCombo = () => {
    if (!comboForm.name) return ElMessage.warning('请输入组合名称')
    if (!comboForm.dish_ids.length) return ElMessage.warning('请选择该组合包含的菜品')
    const payload = {
        ...comboForm,
        dish_ids: [...comboForm.dish_ids],
        price: Number(comboForm.price).toFixed(2),
        update_time: nowText()
    }
    if (comboForm.id === 0) {
        comboLists.value.unshift({ ...payload, id: Date.now() })
    } else {
        const idx = comboLists.value.findIndex((i: any) => i.id === comboForm.id)
        if (idx > -1) Object.assign(comboLists.value[idx], payload)
    }
    ElMessage.success(comboTitle.value.includes('新增') ? '新增成功' : '保存成功')
    showComboEdit.value = false
}
const toggleCombo = (row: any) => {
    row.status = row.status ? 0 : 1
    ElMessage.success(row.status ? '已显示' : '已隐藏，用户端不再提供')
}
const handleComboDelete = (row: any) => {
    ElMessageBox.confirm(`确定删除组合「${row.name}」吗？`, '提示', { type: 'warning' }).then(() => {
        const idx = comboLists.value.findIndex((i: any) => i.id === row.id)
        if (idx > -1) comboLists.value.splice(idx, 1)
        ElMessage.success('删除成功')
    }).catch(() => {})
}

/* ============ 每日菜单 ============ */
const menuDate = ref('')
const menuComboIds = ref<number[]>([])
const menuSaving = ref(false)

const loadMenu = async () => {
    if (!menuDate.value) return
    const res: any = await getDailyMenu({ date: menuDate.value })
    menuComboIds.value = res?.combo_ids || []
}
const saveMenu = async () => {
    if (!menuDate.value) return ElMessage.warning('请选择日期')
    if (!menuComboIds.value.length) return ElMessage.warning('请勾选当日供应的套餐组合')
    menuSaving.value = true
    await saveDailyMenu({ date: menuDate.value, combo_ids: [...menuComboIds.value] })
    menuSaving.value = false
    ElMessage.success(`${menuDate.value} 当日菜单已保存`)
}

onMounted(async () => {
    await getLists()
    await getCombos()
    const d = new Date()
    const pad = (v: number) => String(v).padStart(2, '0')
    menuDate.value = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
    loadMenu()
})
</script>
