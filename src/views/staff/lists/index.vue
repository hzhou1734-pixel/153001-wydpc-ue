<script setup lang="ts" name="staffLists">
import { getStaffList, getBuildingTree } from '@/mock/api'
import { usePaging } from '@/hooks/usePaging'

const roleOptions = [
    { value: 1, label: '托管员' },
    { value: 2, label: '配送员' },
    { value: 3, label: '陪诊员' },
    { value: 4, label: '楼栋管理员' }
]
const communityOptions = ['颐景园·江南里', '绿城·桂语江南', '保利·天悦湾', '万科·未来城三期']
// 社区名 → 小区ID 映射（用于负责楼栋联动过滤）
const communityIdMap: Record<string, number> = {
    '颐景园·江南里': 1,
    '绿城·桂语江南': 2,
    '保利·天悦湾': 3,
    '万科·未来城三期': 4
}

const { pager, getLists, resetPage } = usePaging({ fetchFun: getStaffList, firstLoading: true })

// 楼栋树（用于楼栋管理员选择）
const buildingTreeData = ref<any[]>([])
onMounted(async () => {
    getLists()
    try {
        buildingTreeData.value = await getBuildingTree()
    } catch (e) {
        buildingTreeData.value = []
    }
})

// 新增/编辑
const showEdit = ref(false)
const editTitle = ref('新增员工')
const editingId = ref<number | null>(null)
const editForm = reactive({
    name: '',
    avatar: '',
    mobile: '',
    role_id: 1,
    community: '',
    buildings: [] as string[],
    status: 1
})

// 负责楼栋选项：仅取楼栋层级（不含单元），并按所属社区联动过滤
const buildingOptions = computed(() => {
    const cid = communityIdMap[editForm.community]
    if (!cid) return []
    return buildingTreeData.value
        .filter((item: any) => item.community_id === cid)
        .map((item: any) => ({ value: item.name, label: item.name }))
})

function onCommunityChange() {
    // 切换所属社区后清空已选楼栋，避免跨社区脏数据
    editForm.buildings = []
}

// 头像编辑：本地选择图片 → 居中裁剪为正方形 → 压缩为 200x200 base64（纯前端，mock 项目无上传接口）
const avatarInputRef = ref<HTMLInputElement>()
function triggerAvatarUpload() {
    avatarInputRef.value?.click()
}
function onAvatarFileChange(e: Event) {
    const input = e.target as HTMLInputElement
    const file = input.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
        ElMessage.warning('请选择图片文件')
        input.value = ''
        return
    }
    if (file.size > 5 * 1024 * 1024) {
        ElMessage.warning('图片大小不能超过 5MB')
        input.value = ''
        return
    }
    const reader = new FileReader()
    reader.onload = () => {
        const img = new Image()
        img.onload = () => {
            const size = 200
            const canvas = document.createElement('canvas')
            canvas.width = size
            canvas.height = size
            const ctx = canvas.getContext('2d')
            if (!ctx) return
            // 居中裁剪为正方形
            const side = Math.min(img.width, img.height)
            const sx = (img.width - side) / 2
            const sy = (img.height - side) / 2
            ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size)
            editForm.avatar = canvas.toDataURL('image/jpeg', 0.85)
            ElMessage.success('头像已更新')
        }
        img.src = reader.result as string
    }
    reader.readAsDataURL(file)
    input.value = ''
}

function openAdd() {
    editTitle.value = '新增员工'
    editingId.value = null
    Object.assign(editForm, { name: '', avatar: '', mobile: '', role_id: 1, community: '', buildings: [], status: 1 })
    showEdit.value = true
}

function openEdit(row: any) {
    editTitle.value = '编辑员工'
    editingId.value = row.id
    Object.assign(editForm, {
        name: row.name,
        avatar: row.avatar,
        mobile: row.mobile,
        role_id: row.role_id,
        community: row.community,
        buildings: row.buildings && row.buildings !== '-' ? row.buildings.split('、') : [],
        status: row.status
    })
    showEdit.value = true
}

function submitEdit() {
    if (!editForm.name) return ElMessage.warning('请输入员工姓名')
    if (!editForm.mobile) return ElMessage.warning('请输入联系手机号')
    if (editForm.role_id === 4 && !editForm.buildings.length) return ElMessage.warning('楼栋管理员必须选择负责楼栋')
    const list = pager.lists as any[]
    const roleName = roleOptions.find((r) => r.value === editForm.role_id)?.label || ''
    // 仅楼栋管理员保存楼栋，其他角色强制清空
    const buildingStr = editForm.role_id === 4 ? editForm.buildings.join('、') || '-' : '-'
    if (editingId.value === null) {
        list.unshift({
            id: Date.now(),
            name: editForm.name,
            avatar: editForm.avatar || `https://picsum.photos/seed/ghj-staff-${Date.now() % 100}/100/100`,
            mobile: editForm.mobile,
            role: roleName,
            role_id: editForm.role_id,
            community: editForm.community || communityOptions[0],
            buildings: buildingStr,
            orders: 0,
            earnings: '0.00',
            status: editForm.status,
            create_time: new Date().toLocaleDateString('zh-CN')
        })
        ElMessage.success('新增成功')
    } else {
        const row = list.find((i) => i.id === editingId.value)
        if (row) {
            row.name = editForm.name
            row.avatar = editForm.avatar || `https://picsum.photos/seed/ghj-staff-${Date.now() % 100}/100/100`
            row.mobile = editForm.mobile
            row.role = roleName
            row.role_id = editForm.role_id
            row.community = editForm.community
            row.buildings = buildingStr
            row.status = editForm.status
        }
        ElMessage.success('保存成功')
    }
    showEdit.value = false
}

function toggleStatus(row: any) {
    row.status = row.status === 1 ? 0 : 1
    ElMessage.success(row.status === 1 ? '已启用' : '已停用')
}

function handleDelete(row: any) {
    ElMessageBox.confirm(`确定删除员工「${row.name}」吗？删除后不可恢复。`, '删除确认', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
    })
        .then(() => {
            const list = pager.lists as any[]
            const idx = list.findIndex((i) => i.id === row.id)
            if (idx > -1) list.splice(idx, 1)
            ElMessage.success('删除成功')
        })
        .catch(() => {})
}
</script>

<template>
    <div class="staff-lists" v-loading="pager.loading">
        <el-card class="!border-none" shadow="never">
            <template #header>
                <div class="flex items-center justify-between">
                    <span class="card-title">员工列表</span>
                    <el-button type="primary" @click="openAdd">
                        <icon name="el-icon-Plus" :size="14" class="mr-1" />新增员工
                    </el-button>
                </div>
            </template>
            <el-table :data="pager.lists" stripe>
                <el-table-column label="员工" min-width="160">
                    <template #default="{ row }">
                        <div class="flex items-center">
                            <el-avatar :size="36" :src="row.avatar" />
                            <div class="ml-2 leading-tight">
                                <div class="font-medium">{{ row.name }}</div>
                                <div class="text-xs text-tx-secondary">{{ row.mobile }}</div>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="角色" width="120">
                    <template #default="{ row }">
                        <el-tag :type="[1, 2, 3, 4].includes(row.role_id) ? ['primary', 'success', 'warning', 'danger'][row.role_id - 1] : 'info'" effect="light">
                            {{ row.role }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="community" label="所属社区" min-width="130" show-overflow-tooltip />
                <el-table-column label="负责楼栋" min-width="150" show-overflow-tooltip>
                    <template #default="{ row }">
                        <span v-if="row.buildings === '-'" class="text-tx-secondary">--</span>
                        <span v-else>{{ row.buildings }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="orders" label="累计订单" width="110" align="center" />
                <el-table-column label="累计收益（元）" width="140" align="right">
                    <template #default="{ row }">¥{{ row.earnings }}</template>
                </el-table-column>
                <el-table-column label="状态" width="100" align="center">
                    <template #default="{ row }">
                        <el-switch :model-value="row.status === 1" @change="toggleStatus(row)" />
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="入职时间" width="150" />
                <el-table-column label="操作" width="160" fixed="right">
                    <template #default="{ row }">
                        <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
                        <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="flex justify-end mt-4">
                <el-pagination
                    v-model:current-page="pager.page"
                    v-model:page-size="pager.size"
                    :total="pager.count"
                    :page-sizes="[10, 15, 20]"
                    layout="total, sizes, prev, pager, next, jumper"
                    @current-change="getLists"
                    @size-change="resetPage"
                />
            </div>
        </el-card>

        <el-dialog v-model="showEdit" :title="editTitle" width="560px">
            <el-form label-width="90px">
                <el-form-item label="员工头像">
                    <div class="flex items-center">
                        <el-avatar :size="80" :src="editForm.avatar || undefined" />
                        <div class="ml-4">
                            <div class="flex flex-wrap gap-2">
                                <el-button @click="triggerAvatarUpload">上传头像</el-button>
                            </div>
                            <div class="mt-2 text-xs text-tx-secondary leading-relaxed">
                                支持 jpg/png 格式，5MB 以内<br />上传后自动居中裁剪为正方形
                            </div>
                        </div>
                    </div>
                    <input
                        ref="avatarInputRef"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        style="display: none"
                        @change="onAvatarFileChange"
                    />
                </el-form-item>
                <el-form-item label="员工姓名" required>
                    <el-input v-model="editForm.name" placeholder="请输入员工姓名" maxlength="20" />
                </el-form-item>
                <el-form-item label="联系手机" required>
                    <el-input v-model="editForm.mobile" placeholder="请输入联系手机号" maxlength="11" />
                </el-form-item>
                <el-form-item label="员工角色" required>
                    <el-select v-model="editForm.role_id" placeholder="请选择角色" class="w-full">
                        <el-option v-for="item in roleOptions" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="所属社区">
                    <el-select v-model="editForm.community" placeholder="请选择所属社区" class="w-full" @change="onCommunityChange">
                        <el-option v-for="item in communityOptions" :key="item" :label="item" :value="item" />
                    </el-select>
                </el-form-item>
                <el-form-item label="账号状态">
                    <el-radio-group v-model="editForm.status">
                        <el-radio :value="1">启用</el-radio>
                        <el-radio :value="0">停用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="editForm.role_id === 4" label="负责楼栋" required>
                    <el-select v-model="editForm.buildings" multiple placeholder="请选择负责楼栋（必选）" class="w-full">
                        <el-option v-for="item in buildingOptions" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="showEdit = false">取消</el-button>
                <el-button type="primary" @click="submitEdit">确定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<style lang="scss" scoped>
/* 加大单元格内边距，避免内容贴边显得拥挤 */
:deep(.el-table th.el-table__cell),
:deep(.el-table td.el-table__cell) {
    padding: 14px 0;
}
</style>
