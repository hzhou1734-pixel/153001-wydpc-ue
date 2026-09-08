<script setup lang="ts" name="communityBuilding">
import { getBuildingTree, getRoomList } from '@/mock/api'

const loading = ref(false)
const treeData = ref<any[]>([])
const treeRef = ref()
const roomLoading = ref(false)
const roomList = ref<any[]>([])
const currentUnit = ref<any>(null)

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

// 选中单元节点
const handleNodeClick = (data: any) => {
    currentUnit.value = data.type === 'unit' ? data : null
}

const filteredRooms = computed(() => {
    if (!currentUnit.value) return roomList.value
    return roomList.value.filter((item: any) => item.unit_id === currentUnit.value.id)
})

// 新增楼栋/单元（模拟）
const showAdd = ref(false)
const addForm = reactive({ type: 'building', name: '' })
const openAdd = (type: string) => {
    addForm.type = type
    addForm.name = ''
    showAdd.value = true
}
const submitAdd = () => {
    if (!addForm.name) {
        ElMessage.warning('请输入名称')
        return
    }
    if (addForm.type === 'building') {
        treeData.value.push({
            id: Date.now(),
            name: addForm.name,
            community_id: 1,
            children: []
        })
    } else {
        const node = treeRef.value?.getCurrentNode()
        if (!node) {
            ElMessage.warning('请先在左侧选中一个楼栋')
            return
        }
        node.children = node.children || []
        node.children.push({
            id: Date.now(),
            name: addForm.name,
            parent_id: node.id,
            type: 'unit'
        })
    }
    ElMessage.success('添加成功')
    showAdd.value = false
}

onMounted(() => {
    getTree()
    getRooms()
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
                        <el-button size="small" type="primary" plain>新增房号</el-button>
                    </div>
                    <el-table :data="filteredRooms" v-loading="roomLoading" border>
                        <el-table-column prop="name" label="房号" min-width="100" />
                        <el-table-column prop="area" label="面积（㎡）" width="100" />
                        <el-table-column prop="owner" label="业主" width="100" />
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

        <el-dialog v-model="showAdd" :title="addForm.type === 'building' ? '新增楼栋' : '新增单元'" width="420px">
            <el-form label-width="80px">
                <el-form-item :label="addForm.type === 'building' ? '楼栋名称' : '单元名称'" required>
                    <el-input v-model="addForm.name" :placeholder="addForm.type === 'building' ? '如：6栋' : '如：1单元'" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="showAdd = false">取消</el-button>
                <el-button type="primary" @click="submitAdd">确定</el-button>
            </template>
        </el-dialog>
    </div>
</template>
