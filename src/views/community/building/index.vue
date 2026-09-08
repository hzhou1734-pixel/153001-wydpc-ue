<script setup lang="ts" name="communityBuilding">
import { getBuildingTree, getRoomList, getCommunityList } from '@/mock/api'

const loading = ref(false)
const treeData = ref<any[]>([])
const treeRef = ref()
const roomLoading = ref(false)
const roomList = ref<any[]>([])
const currentUnit = ref<any>(null)
const communityOptions = ref<any[]>([])

// 加载楼栋树
const getTree = async () => {
    loading.value = true
    try {
        treeData.value = await getBuildingTree()
    } finally {
        loading.value = false
    }
}

// 加载房号列表
const getRooms = async () => {
    roomLoading.value = true
    try {
        roomList.value = await getRoomList()
    } finally {
        roomLoading.value = false
    }
}

// 加载小区下拉数据
const getCommunityOptions = async () => {
    const res = await getCommunityList({ page_size: 100 })
    communityOptions.value = res.lists || []
}

// 选中单元节点
const handleNodeClick = (data: any) => {
    currentUnit.value = data.type === 'unit' ? data : null
}

const filteredRooms = computed(() => {
    if (!currentUnit.value) return roomList.value
    return roomList.value.filter((item: any) => item.unit_id === currentUnit.value.id)
})

// 楼栋下拉（供新增单元使用）
const buildingOptions = computed(() => treeData.value.map((item: any) => ({ id: item.id, name: item.name })))

// 新增楼栋/单元（模拟）
const showAdd = ref(false)
const addForm = reactive({ type: 'building', name: '', community_id: '' as any, building_id: '' as any })
const openAdd = (type: string) => {
    addForm.type = type
    addForm.name = ''
    addForm.community_id = ''
    addForm.building_id = ''
    // 新增单元时，若左侧已选中某楼栋则默认预填
    if (type === 'unit') {
        const node = treeRef.value?.getCurrentNode()
        if (node && node.type !== 'unit') addForm.building_id = node.id
    }
    showAdd.value = true
}
const submitAdd = () => {
    if (!addForm.name) {
        ElMessage.warning('请输入名称')
        return
    }
    if (addForm.type === 'building') {
        if (!addForm.community_id) {
            ElMessage.warning('请选择所属小区')
            return
        }
        treeData.value.push({
            id: Date.now(),
            name: addForm.name,
            community_id: addForm.community_id,
            children: []
        })
    } else {
        if (!addForm.building_id) {
            ElMessage.warning('请选择所属楼栋')
            return
        }
        const building = treeData.value.find((item: any) => item.id === addForm.building_id)
        if (!building) {
            ElMessage.warning('所属楼栋不存在')
            return
        }
        building.children = building.children || []
        building.children.push({
            id: Date.now(),
            name: addForm.name,
            parent_id: building.id,
            type: 'unit'
        })
    }
    ElMessage.success('添加成功')
    showAdd.value = false
}

// 新增房号（小区-楼栋-单元级联，默认选中当前所在小区-楼栋-单元）
const showRoom = ref(false)
const roomForm = reactive({ community_id: '' as any, building_id: '' as any, unit_id: '' as any, name: '', owner: '', phone: '' })

// 楼栋下拉（随所选小区联动）
const roomBuildingOptions = computed(() => treeData.value.filter((item: any) => item.community_id === roomForm.community_id))
// 单元下拉（随所选楼栋联动）
const roomUnitOptions = computed(() => {
    const building = treeData.value.find((item: any) => item.id === roomForm.building_id)
    return building?.children || []
})

const openRoom = () => {
    roomForm.community_id = ''
    roomForm.building_id = ''
    roomForm.unit_id = ''
    roomForm.name = ''
    roomForm.owner = ''
    roomForm.phone = ''
    // 默认选中当前所在小区-楼栋-单元
    if (currentUnit.value) {
        const building = treeData.value.find((item: any) => item.children?.some((u: any) => u.id === currentUnit.value.id))
        if (building) {
            roomForm.building_id = building.id
            roomForm.community_id = building.community_id
            roomForm.unit_id = currentUnit.value.id
        }
    }
    showRoom.value = true
}

// 小区变化时清空楼栋/单元
const onRoomCommunityChange = () => {
    roomForm.building_id = ''
    roomForm.unit_id = ''
}

// 楼栋变化时清空单元
const onRoomBuildingChange = () => {
    roomForm.unit_id = ''
}

const submitRoom = () => {
    if (!roomForm.community_id) {
        ElMessage.warning('请选择所属小区')
        return
    }
    if (!roomForm.building_id) {
        ElMessage.warning('请选择所属楼栋')
        return
    }
    if (!roomForm.unit_id) {
        ElMessage.warning('请选择所属单元')
        return
    }
    if (!roomForm.name) {
        ElMessage.warning('请输入房号')
        return
    }
    roomList.value.push({
        id: Date.now(),
        name: roomForm.name,
        unit_id: roomForm.unit_id,
        building_id: roomForm.building_id,
        owner: roomForm.owner || '-',
        phone: roomForm.phone || '-',
        certified: 0
    })
    ElMessage.success('添加成功')
    showRoom.value = false
}

onMounted(() => {
    getTree()
    getRooms()
    getCommunityOptions()
})
</script>

<template>
    <div class="community-building" v-loading="loading">
        <el-card class="!border-none" shadow="never">
            <template #header>
                <div class="flex items-center justify-between">
                    <span class="card-title">楼栋房屋管理</span>
                    <div>
                        <el-button type="primary" plain size="small" @click="openAdd('building')">新增楼栋</el-button>
                        <el-button type="primary" size="small" @click="openAdd('unit')">新增单元</el-button>
                    </div>
                </div>
            </template>
            <div class="flex gap-4">
                <!-- 左侧楼栋树 -->
                <div class="w-64 shrink-0 border border-br rounded-lg p-3">
                    <div class="text-tx-secondary text-sm mb-2">楼栋结构（点击单元筛选房号）</div>
                    <el-tree
                        ref="treeRef"
                        :data="treeData"
                        node-key="id"
                        default-expand-all
                        highlight-current
                        :props="{ label: 'name', children: 'children' }"
                        @node-click="handleNodeClick"
                    />
                </div>
                <!-- 右侧房号表格 -->
                <div class="flex-1">
                    <div class="mb-3 flex items-center justify-between">
                        <span class="font-bold">
                            房号列表
                            <el-tag v-if="currentUnit" size="small" class="ml-2" closable @close="currentUnit = null">
                                {{ currentUnit.name }}
                            </el-tag>
                        </span>
                        <el-button size="small" type="primary" plain @click="openRoom">新增房号</el-button>
                    </div>
                    <el-table :data="filteredRooms" v-loading="roomLoading" border>
                        <el-table-column prop="name" label="房号" min-width="100" />
                        <el-table-column label="业主" min-width="160">
                            <template #default="{ row }">
                                <div class="flex items-center justify-between gap-2">
                                    <span>{{ row.owner }}</span>
                                    <el-tag :type="row.certified ? 'success' : 'info'" size="small">
                                        {{ row.certified ? '已认证' : '未认证' }}
                                    </el-tag>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="phone" label="联系电话" width="140" />
                        <el-table-column label="操作" width="140" fixed="right">
                            <template #default="{ row }">
                                <el-button link type="primary" size="small">编辑</el-button>
                                <el-button link type="danger" size="small">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </el-card>

        <!-- 新增楼栋/单元弹窗 -->
        <el-dialog v-model="showAdd" :title="addForm.type === 'building' ? '新增楼栋' : '新增单元'" width="420px">
            <el-form label-width="80px">
                <template v-if="addForm.type === 'building'">
                    <el-form-item label="所属小区" required>
                        <el-select v-model="addForm.community_id" placeholder="请选择所属小区" class="!w-full">
                            <el-option v-for="item in communityOptions" :key="item.id" :label="item.name" :value="item.id" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="楼栋名称" required>
                        <el-input v-model="addForm.name" placeholder="如：6栋" />
                    </el-form-item>
                </template>
                <template v-else>
                    <el-form-item label="所属楼栋" required>
                        <el-select v-model="addForm.building_id" placeholder="请选择所属楼栋" class="!w-full">
                            <el-option v-for="item in buildingOptions" :key="item.id" :label="item.name" :value="item.id" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="单元名称" required>
                        <el-input v-model="addForm.name" placeholder="如：1单元" />
                    </el-form-item>
                </template>
            </el-form>
            <template #footer>
                <el-button @click="showAdd = false">取消</el-button>
                <el-button type="primary" @click="submitAdd">确定</el-button>
            </template>
        </el-dialog>

        <!-- 新增房号弹窗 -->
        <el-dialog v-model="showRoom" title="新增房号" width="460px">
            <el-form label-width="80px">
                <el-form-item label="所属小区" required>
                    <el-select v-model="roomForm.community_id" placeholder="请选择小区" class="!w-full" @change="onRoomCommunityChange">
                        <el-option v-for="item in communityOptions" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="所属楼栋" required>
                    <el-select v-model="roomForm.building_id" placeholder="请选择楼栋" class="!w-full" @change="onRoomBuildingChange">
                        <el-option v-for="item in roomBuildingOptions" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="所属单元" required>
                    <el-select v-model="roomForm.unit_id" placeholder="请选择单元" class="!w-full">
                        <el-option v-for="item in roomUnitOptions" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="房号" required>
                    <el-input v-model="roomForm.name" placeholder="如：101" />
                </el-form-item>
                <el-form-item label="业主">
                    <el-input v-model="roomForm.owner" placeholder="业主姓名（选填）" />
                </el-form-item>
                <el-form-item label="联系电话">
                    <el-input v-model="roomForm.phone" placeholder="业主联系电话（选填）" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="showRoom = false">取消</el-button>
                <el-button type="primary" @click="submitRoom">确定</el-button>
            </template>
        </el-dialog>
    </div>
</template>
