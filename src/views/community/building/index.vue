<template>
    <div class="community-building">
        <el-card class="!border-none" shadow="never">
            <template #header>
                <div class="flex items-center justify-between">
                    <span class="card-title">楼栋房号</span>
                    <div>
                        <el-button type="primary" plain @click="openAddBuilding">添加楼栋</el-button>
                        <el-button type="primary" @click="openAddRoom">添加房号</el-button>
                    </div>
                </div>
            </template>

            <el-form :model="queryParams" inline class="mb-2">
                <el-form-item label="所属小区">
                    <el-select v-model="queryParams.community_id" placeholder="全部小区" clearable class="!w-[180px]">
                        <el-option v-for="item in communityOptions" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="楼栋/房号">
                    <el-input v-model="queryParams.keyword" placeholder="楼栋名称 / 房号" clearable class="!w-[180px]" @keyup.enter="getTreeList" />
                </el-form-item>
                <el-form-item label="认证状态">
                    <el-select v-model="queryParams.certified" placeholder="全部" clearable class="!w-[140px]">
                        <el-option label="已认证" :value="1" />
                        <el-option label="未认证" :value="0" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getTreeList">查询</el-button>
                    <el-button @click="resetQuery">重置</el-button>
                </el-form-item>
            </el-form>

            <el-table :data="treeList" v-loading="loading" row-key="id" default-expand-all border :tree-props="{ children: 'children' }">
                <el-table-column label="楼栋 / 房号" min-width="180">
                    <template #default="{ row }">
                        <span v-if="row.type === 'building'" class="font-bold">{{ row.name }}</span>
                        <span v-else>房号 {{ row.name }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="小区名称" min-width="160">
                    <template #default="{ row }">
                        <span v-if="row.type === 'building'">{{ row.community_name }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="楼栋管家" min-width="110">
                    <template #default="{ row }">
                        <span v-if="row.type === 'building'">{{ row.keeper_name || '未设置' }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="管家电话" width="120">
                    <template #default="{ row }">
                        <span v-if="row.type === 'building'">{{ row.keeper_mobile || '-' }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="房数" width="80" align="center">
                    <template #default="{ row }">
                        <span v-if="row.type === 'building'">{{ (row.children || []).length }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="认证业主" min-width="240">
                    <template #default="{ row }">
                        <template v-if="row.type === 'room'">
                            <div class="owner-cert flex items-center gap-2 py-1.5 pl-2 pr-3 rounded-lg border" :class="row.certified ? 'is-yes' : 'is-no'">
                                <span class="cert-bar" :class="row.certified ? 'yes' : 'no'"></span>
                                <el-image
                                    v-if="row.certified"
                                    :src="row.avatar"
                                    :preview-src-list="[row.avatar]"
                                    preview-teleported
                                    fit="cover"
                                    class="w-8 h-8 rounded-full shrink-0"
                                />
                                <div class="flex-1 min-w-0 leading-tight">
                                    <div class="text-sm truncate" :class="row.certified ? 'font-medium' : 'text-tx-secondary'">{{ row.owner }}</div>
                                    <div class="text-xs text-tx-secondary mt-0.5">{{ row.phone }}</div>
                                </div>
                                <el-tag :type="row.certified ? 'success' : 'info'" :effect="row.certified ? 'light' : 'plain'" size="small" class="shrink-0">
                                    {{ row.certified ? '已认证' : '未认证' }}
                                </el-tag>
                            </div>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column label="家庭成员数" width="110" align="center">
                    <template #default="{ row }">
                        <span v-if="row.type === 'room'">{{ row.certified ? `${row.family_count} 人` : '-' }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="认证时间" width="160">
                    <template #default="{ row }">
                        <span v-if="row.type === 'room'">{{ row.certified ? row.cert_time || '-' : '-' }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="排序" width="80" align="center">
                    <template #default="{ row }">
                        <span v-if="row.type === 'building'">{{ row.sort }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="130" fixed="right">
                    <template #default="{ row }">
                        <el-button link type="primary" @click="row.type === 'building' ? openEditBuilding(row) : openEditRoom(row)">编辑</el-button>
                        <el-button link type="danger" @click="row.type === 'building' ? handleDeleteBuilding(row) : handleDeleteRoom(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 添加 / 编辑楼栋 -->
        <el-dialog v-model="showBuilding" :title="buildingForm.id ? '编辑楼栋' : '添加楼栋'" width="440px">
            <el-form :model="buildingForm" label-width="90px">
                <el-form-item label="所属小区" required>
                    <el-select v-model="buildingForm.community_id" placeholder="请选择小区" class="!w-full">
                        <el-option v-for="item in communityOptions" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="楼栋名称" required>
                    <el-input v-model="buildingForm.name" placeholder="如：6栋" />
                </el-form-item>
                <el-form-item label="排序">
                    <el-input-number v-model="buildingForm.sort" :min="0" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="showBuilding = false">取消</el-button>
                <el-button type="primary" @click="submitBuilding">确定</el-button>
            </template>
        </el-dialog>

        <!-- 添加 / 编辑房号 -->
        <el-dialog v-model="showRoom" :title="roomForm.id ? '编辑房号' : '添加房号'" width="440px">
            <el-form :model="roomForm" label-width="90px">
                <el-form-item label="所属楼栋" required>
                    <el-select v-model="roomForm.building_id" placeholder="请选择楼栋" class="!w-full" filterable>
                        <el-option v-for="item in buildingOptions" :key="item.id" :label="`${item.community_name} ${item.name}`" :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="房号" required>
                    <el-input v-model="roomForm.name" placeholder="如：101" />
                </el-form-item>
                <el-form-item label="业主姓名">
                    <el-input v-model="roomForm.owner" placeholder="请输入业主姓名（未登记可留空）" maxlength="20" />
                </el-form-item>
                <el-form-item label="手机号码">
                    <el-input v-model="roomForm.phone" placeholder="请输入业主手机号码（未登记可留空）" maxlength="11" />
                </el-form-item>
                <el-form-item label="排序">
                    <el-input-number v-model="roomForm.sort" :min="0" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="showRoom = false">取消</el-button>
                <el-button type="primary" @click="submitRoom">确定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts" name="communityBuilding">
import { buildingTree, certifyList, communityList, roomList, staffList } from '@/mock/data'

const loading = ref(false)
const communityOptions = communityList
const queryParams = reactive({ community_id: '' as any, keyword: '', certified: '' as any })

/** 楼栋-房号二级树（文档要求：不需要单元，直接楼栋-房号） */
const treeList = computed(() => {
    const kw = String(queryParams.keyword || '').trim()
    const st = queryParams.certified
    let buildings = buildingTree as any[]
    if (queryParams.community_id !== '' && queryParams.community_id !== undefined) {
        buildings = buildings.filter((item: any) => item.community_id === queryParams.community_id)
    }
    const result = buildings.map((item: any, index: number) => {
        // 楼栋管家：楼栋管理员角色且负责楼栋包含该楼栋
        const keeper = staffList.find((s: any) => s.role_id === 4 && String(s.buildings || '').includes(item.name))
        let rooms = roomList.filter((r: any) => r.building_id === item.id)
        if (kw && !item.name.includes(kw)) {
            rooms = rooms.filter((r: any) => String(r.name).includes(kw) || String(r.owner).includes(kw))
        }
        // 认证状态筛选：仅过滤房号行
        if (st === 0 || st === 1) {
            rooms = rooms.filter((r: any) => r.certified === st)
        }
        return {
            id: `b-${item.id}`,
            type: 'building',
            raw_id: item.id,
            name: item.name,
            community_id: item.community_id,
            community_name: item.community_name,
            keeper_name: keeper?.name || '',
            keeper_mobile: keeper?.mobile || '',
            sort: index + 1,
            children: rooms.map((r: any, i: number) => {
                const cert: any = certifyList.find((c: any) => c.mobile === r.phone) || {}
                return {
                    id: `r-${r.id}`,
                    type: 'room',
                    raw_id: r.id,
                    building_id: r.building_id,
                    name: r.name,
                    owner: r.owner,
                    phone: r.phone,
                    certified: r.certified,
                    avatar: `https://picsum.photos/seed/ghj-room-${r.id}/100/100`,
                    family_count: r.certified ? cert.family_count || 3 : 0,
                    cert_time: r.certified ? cert.audit_time || cert.create_time || '-' : '',
                    sort: i + 1
                }
            })
        }
    })
    // 有筛选条件时隐藏无匹配房号的楼栋
    let final = st === 0 || st === 1 ? result.filter((b: any) => (b.children || []).length > 0) : result
    if (kw) final = final.filter((b: any) => (b.children || []).length > 0 || b.name.includes(kw))
    return final
})

const buildingOptions = computed(() =>
    (buildingTree as any[]).map((item: any) => ({ id: item.id, name: item.name, community_name: item.community_name }))
)

const getTreeList = () => {
    loading.value = true
    setTimeout(() => (loading.value = false), 120)
}
const resetQuery = () => {
    queryParams.community_id = ''
    queryParams.keyword = ''
    queryParams.certified = ''
    getTreeList()
}

// ============ 楼栋 ============
const showBuilding = ref(false)
const buildingForm = reactive({ id: 0 as any, community_id: '' as any, name: '', sort: 0 })

const openAddBuilding = () => {
    buildingForm.id = 0
    buildingForm.community_id = queryParams.community_id || ''
    buildingForm.name = ''
    buildingForm.sort = (buildingTree as any[]).length + 1
    showBuilding.value = true
}
const openEditBuilding = (row: any) => {
    buildingForm.id = row.raw_id
    buildingForm.community_id = row.community_id
    buildingForm.name = row.name
    buildingForm.sort = row.sort
    showBuilding.value = true
}
const submitBuilding = () => {
    if (!buildingForm.community_id) return ElMessage.warning('请选择所属小区')
    if (!buildingForm.name) return ElMessage.warning('请输入楼栋名称')
    if (buildingForm.id) {
        const target = (buildingTree as any[]).find((item: any) => item.id === buildingForm.id)
        if (target) {
            target.name = buildingForm.name
            target.community_id = buildingForm.community_id
        }
    } else {
        const community = communityList.find((item: any) => item.id === buildingForm.community_id)
        ;(buildingTree as any[]).push({
            id: Date.now(),
            name: buildingForm.name,
            community_id: buildingForm.community_id,
            community_name: community?.name || ''
        })
    }
    ElMessage.success(buildingForm.id ? '修改成功' : '添加成功')
    showBuilding.value = false
}
const handleDeleteBuilding = (row: any) => {
    const rooms = roomList.filter((r: any) => r.building_id === row.raw_id)
    ElMessageBox.confirm(
        rooms.length ? `该楼栋下还有 ${rooms.length} 套房号，删除后房号将一并移除，确定删除吗？` : `确定删除楼栋「${row.name}」吗？`,
        '提示',
        { type: 'warning' }
    )
        .then(() => {
            const idx = (buildingTree as any[]).findIndex((item: any) => item.id === row.raw_id)
            if (idx > -1) (buildingTree as any[]).splice(idx, 1)
            rooms.forEach((r: any) => {
                const i = roomList.findIndex((item: any) => item.id === r.id)
                if (i > -1) roomList.splice(i, 1)
            })
            ElMessage.success('删除成功')
        })
        .catch(() => {})
}

// ============ 房号 ============
const showRoom = ref(false)
const roomForm = reactive({ id: 0 as any, building_id: '' as any, name: '', owner: '', phone: '', sort: 0 })

const openAddRoom = () => {
    roomForm.id = 0
    roomForm.building_id = ''
    roomForm.name = ''
    roomForm.owner = ''
    roomForm.phone = ''
    roomForm.sort = 0
    showRoom.value = true
}
const openEditRoom = (row: any) => {
    roomForm.id = row.raw_id
    roomForm.building_id = row.building_id
    roomForm.name = row.name
    roomForm.owner = row.owner === '-' ? '' : row.owner || ''
    roomForm.phone = row.phone === '-' ? '' : row.phone || ''
    roomForm.sort = row.sort
    showRoom.value = true
}
const submitRoom = () => {
    if (!roomForm.building_id) return ElMessage.warning('请选择所属楼栋')
    if (!roomForm.name) return ElMessage.warning('请输入房号')
    if (roomForm.phone && !/^1\d{10}$/.test(roomForm.phone)) return ElMessage.warning('请输入正确的 11 位手机号码')
    if (roomForm.id) {
        const target = roomList.find((item: any) => item.id === roomForm.id)
        if (target) {
            target.name = roomForm.name
            target.building_id = roomForm.building_id
            target.owner = roomForm.owner || '-'
            target.phone = roomForm.phone || '-'
        }
    } else {
        roomList.push({
            id: Date.now(),
            name: roomForm.name,
            building_id: roomForm.building_id,
            owner: roomForm.owner || '-',
            phone: roomForm.phone || '-',
            certified: 0
        } as any)
    }
    ElMessage.success(roomForm.id ? '修改成功' : '添加成功')
    showRoom.value = false
}
const handleDeleteRoom = (row: any) => {
    ElMessageBox.confirm(`确定删除房号「${row.name}」吗？`, '提示', { type: 'warning' })
        .then(() => {
            const idx = roomList.findIndex((item: any) => item.id === row.raw_id)
            if (idx > -1) roomList.splice(idx, 1)
            ElMessage.success('删除成功')
        })
        .catch(() => {})
}

onMounted(getTreeList)
</script>

<style scoped>
/* 认证业主状态块：绿底=已认证，灰底=未认证，扫视即可区分 */
.owner-cert.is-yes {
    background: var(--el-color-success-light-9);
    border-color: var(--el-color-success-light-7);
}
.owner-cert.is-no {
    background: var(--el-fill-color-lighter);
    border-color: var(--el-fill-color);
}
.cert-bar {
    width: 3px;
    height: 30px;
    border-radius: 2px;
    flex-shrink: 0;
}
.cert-bar.yes {
    background: var(--el-color-success);
}
.cert-bar.no {
    background: var(--el-text-color-placeholder);
}
</style>
