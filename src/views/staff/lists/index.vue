<script setup lang="ts" name="staffLists">
import { getStaffList, getBuildingTree } from '@/mock/api'
import { usePaging } from '@/hooks/usePaging'

const roleOptions = [
    { value: 1, label: '楼栋管理员' },
    { value: 2, label: '保安' },
    { value: 3, label: '保洁' }
]
const communityOptions = ['颐景园·江南里', '绿城·桂语江南', '保利·天悦湾', '万科·未来城三期', '融创·金成府']
// 社区名 → 小区ID 映射（用于负责楼栋联动过滤）
const communityIdMap: Record<string, number> = {
    '颐景园·江南里': 1,
    '绿城·桂语江南': 2,
    '保利·天悦湾': 3,
    '万科·未来城三期': 4,
    '融创·金成府': 5
}

const searchParams = reactive({ keyword: '', role_id: '', status: '', create_time: [] as any })
const { pager, getLists, resetPage } = usePaging({ fetchFun: getStaffList, params: searchParams, firstLoading: true })

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

const handleSearch = () => resetPage()
const handleReset = () => {
    searchParams.keyword = ''
    searchParams.role_id = ''
    searchParams.status = ''
    searchParams.create_time = []
    resetPage()
}

// 新增/编辑
const showEdit = ref(false)
const editTitle = ref('添加员工')
const editingId = ref<number | null>(null)
const editForm = reactive({
    name: '',
    avatar: '',
    mobile: '',
    role_id: 2,
    community: '',
    buildings: [] as string[],
    status: 1
})

// 负责楼栋选项：仅取楼栋层级，并按所属社区联动过滤
const buildingOptions = computed(() => {
    const cid = communityIdMap[editForm.community]
    if (!cid) return []
    return buildingTreeData.value
        .filter((item: any) => item.community_id === cid)
        .map((item: any) => ({ value: item.name, label: item.name }))
})

function onCommunityChange() {
    editForm.buildings = []
}

// 头像编辑：本地选择图片 → 居中裁剪为正方形 → 压缩为 200x200 base64
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
    editTitle.value = '添加员工'
    editingId.value = null
    Object.assign(editForm, { name: '', avatar: '', mobile: '', role_id: 2, community: '', buildings: [], status: 1 })
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
    if (!editForm.mobile) return ElMessage.warning('请输入手机号码（登录账号）')
    if (editForm.role_id === 1 && !editForm.buildings.length) return ElMessage.warning('楼栋管理员必须选择负责楼栋')
    // 同一小区内一个楼栋只能有一个管理员
    if (editForm.role_id === 1) {
        const conflict = (pager.lists as any[]).find(
            (item: any) =>
                item.role_id === 1 &&
                item.community === editForm.community &&
                item.id !== editingId.value &&
                item.buildings &&
                item.buildings !== '-' &&
                item.buildings.split('、').some((b: string) => editForm.buildings.includes(b))
        )
        if (conflict) return ElMessage.warning(`该小区楼栋已被管理员「${conflict.name}」负责，请重新选择`)
    }
    const list = pager.lists as any[]
    const roleName = roleOptions.find((r) => r.value === editForm.role_id)?.label || ''
    const buildingStr = editForm.role_id === 1 ? editForm.buildings.join('、') || '-' : '-'
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
        ElMessage.success('添加成功')
    } else {
        const row = list.find((i) => i.id === editingId.value)
        if (row) {
            row.name = editForm.name
            row.avatar = editForm.avatar || row.avatar
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

// 修改角色（用户同时只能有 1 个角色）
const showRole = ref(false)
const roleRow = ref<any>(null)
const roleForm = reactive({ role_id: 1 })
const openChangeRole = (row: any) => {
    roleRow.value = row
    roleForm.role_id = row.role_id
    showRole.value = true
}
const submitRole = () => {
    const row = roleRow.value
    row.role_id = roleForm.role_id
    row.role = roleOptions.find((r) => r.value === roleForm.role_id)?.label || ''
    if (row.role_id !== 1) row.buildings = '-'
    ElMessage.success('角色修改成功')
    showRole.value = false
}

function toggleStatus(row: any) {
    row.status = row.status === 1 ? 0 : 1
    ElMessage.success(row.status === 1 ? '已启用' : '已停用，禁用后无法登录')
}
</script>

<template>
    <div class="staff-lists" v-loading="pager.loading">
        <el-card class="!border-none" shadow="never">
            <template #header>
                <div class="flex items-center justify-between">
                    <span class="card-title">员工列表</span>
                    <el-button type="primary" @click="openAdd">
                        <icon name="el-icon-Plus" :size="14" class="mr-1" />添加员工
                    </el-button>
                </div>
            </template>

            <el-form :model="searchParams" inline class="mb-2">
                <el-form-item label="关键词">
                    <el-input
                        v-model="searchParams.keyword"
                        placeholder="员工ID / 昵称 / 手机号码"
                        clearable
                        class="!w-[240px]"
                        @keyup.enter="handleSearch"
                    />
                </el-form-item>
                <el-form-item label="角色">
                    <el-select v-model="searchParams.role_id" placeholder="全部角色" clearable class="!w-[130px]">
                        <el-option v-for="item in roleOptions" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="账号状态">
                    <el-select v-model="searchParams.status" placeholder="全部状态" clearable class="!w-[120px]">
                        <el-option label="启用" :value="1" />
                        <el-option label="停用" :value="0" />
                    </el-select>
                </el-form-item>
                <el-form-item label="添加时间">
                    <el-date-picker
                        v-model="searchParams.create_time"
                        type="daterange"
                        value-format="YYYY-MM-DD"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        class="!w-[240px]"
                    />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSearch">查询</el-button>
                    <el-button @click="handleReset">重置</el-button>
                </el-form-item>
            </el-form>

            <el-table :data="pager.lists">
                <el-table-column prop="id" label="员工ID" width="80" />
                <el-table-column label="头像" width="80" align="center">
                    <template #default="{ row }"><el-avatar :size="36" :src="row.avatar" /></template>
                </el-table-column>
                <el-table-column prop="name" label="姓名" min-width="110" />
                <el-table-column prop="mobile" label="登录账号" width="120">
                    <template #default="{ row }">
                        <span>{{ row.mobile }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="角色" width="120">
                    <template #default="{ row }">
                        <el-tag :type="['primary', 'success', 'warning'][row.role_id - 1] || 'info'" effect="light">
                            {{ row.role }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="楼栋" min-width="150" show-overflow-tooltip>
                    <template #default="{ row }">
                        <span v-if="row.buildings === '-'" class="text-tx-secondary">--</span>
                        <span v-else>{{ row.buildings }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="累计收益" min-width="140" align="right">
                    <template #default="{ row }">¥{{ row.earnings }}</template>
                </el-table-column>
                <el-table-column label="账号状态" width="90" align="center">
                    <template #default="{ row }">
                        <el-switch :model-value="row.status === 1" @change="toggleStatus(row)" />
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="添加时间" width="160" show-overflow-tooltip />
                <el-table-column label="操作" width="190" fixed="right">
                    <template #default="{ row }">
                        <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
                        <el-button link type="primary" @click="openChangeRole(row)">修改角色</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="flex justify-end mt-4">
                <el-pagination
                    v-model:current-page="pager.page"
                    v-model:page-size="pager.size"
                    :total="pager.count"
                    layout="total, prev, pager, next"
                    @current-change="getLists"
                />
            </div>
        </el-card>

        <!-- 添加 / 编辑员工 -->
        <el-dialog v-model="showEdit" :title="editTitle" width="560px">
            <el-form label-width="100px">
                <el-form-item label="员工头像">
                    <div class="flex items-center">
                        <el-avatar :size="80" :src="editForm.avatar || undefined" />
                        <div class="ml-4">
                            <el-button @click="triggerAvatarUpload">上传头像</el-button>
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
                <el-form-item label="手机号码" required>
                    <el-input v-model="editForm.mobile" placeholder="请输入手机号码（作为登录账号）" maxlength="11" />
                </el-form-item>
                <el-form-item label="所属小区">
                    <el-select v-model="editForm.community" placeholder="请选择所属小区" class="w-full" @change="onCommunityChange">
                        <el-option v-for="item in communityOptions" :key="item" :label="item" :value="item" />
                    </el-select>
                </el-form-item>
                <el-form-item label="员工角色" required>
                    <el-select v-model="editForm.role_id" placeholder="请选择角色" class="w-full">
                        <el-option v-for="item in roleOptions" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="负责楼栋" :required="editForm.role_id === 1">
                    <el-select
                        v-model="editForm.buildings"
                        multiple
                        :placeholder="editForm.role_id === 1 ? '请选择负责楼栋（必选，可多选）' : '仅楼栋管理员可绑定楼栋'"
                        :disabled="editForm.role_id !== 1"
                        class="w-full"
                    >
                        <el-option v-for="item in buildingOptions" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                    <div class="text-xs text-tx-secondary mt-1">仅楼栋管理员需要绑定楼栋；同一小区内一个楼栋只能有一个管理员</div>
                </el-form-item>
                <el-form-item label="账号状态">
                    <el-radio-group v-model="editForm.status">
                        <el-radio :value="1">启用</el-radio>
                        <el-radio :value="0">停用</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="showEdit = false">取消</el-button>
                <el-button type="primary" @click="submitEdit">确定</el-button>
            </template>
        </el-dialog>

        <!-- 修改角色 -->
        <el-dialog v-model="showRole" title="修改角色" width="440px">
            <el-form label-width="90px">
                <el-form-item label="员工">
                    <span>{{ roleRow?.name }}（{{ roleRow?.mobile }}）</span>
                </el-form-item>
                <el-form-item label="员工角色" required>
                    <el-select v-model="roleForm.role_id" placeholder="请选择角色" class="w-full">
                        <el-option v-for="item in roleOptions" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
            </el-form>
            <div class="text-xs text-tx-secondary ml-2">修改角色后权限同步更新，用户同时只能有 1 个角色</div>
            <template #footer>
                <el-button @click="showRole = false">取消</el-button>
                <el-button type="primary" @click="submitRole">确定</el-button>
            </template>
        </el-dialog>
    </div>
</template>
