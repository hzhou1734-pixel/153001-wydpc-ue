<script setup lang="ts" name="communityLists">
import { getCommunityList } from '@/mock/api'
import { usePaging } from '@/hooks/usePaging'
import { useRouter } from 'vue-router'

const router = useRouter()

// 搜索参数（与 usePaging 联动，getCommunityList 支持 keyword/address 过滤）
const searchParams = reactive({
    keyword: '',
    address: ''
})

const { pager, getLists, resetPage } = usePaging({
    fetchFun: getCommunityList,
    params: searchParams,
    firstLoading: true
})

const handleSearch = () => {
    resetPage()
}

const handleReset = () => {
    searchParams.keyword = ''
    searchParams.address = ''
    resetPage()
}

// 随机生成门头图（模拟上传）
const randomCover = () => {
    return `https://picsum.photos/seed/ghj-${Math.random().toString(36).slice(2, 8)}/400/300`
}

// 新增/编辑弹窗
const showEdit = ref(false)
const editTitle = ref('新增小区')
const editForm = reactive({
    id: 0,
    name: '',
    cover: '',
    region: [] as string[],
    address: '',
    buildings: 0,
    houses: 0,
    status: 1
})

// 省市区精简数据（模拟）
const regionOptions = [
    {
        value: '浙江省',
        label: '浙江省',
        children: [
            {
                value: '杭州市',
                label: '杭州市',
                children: [
                    { value: '西湖区', label: '西湖区' },
                    { value: '滨江区', label: '滨江区' },
                    { value: '拱墅区', label: '拱墅区' },
                    { value: '余杭区', label: '余杭区' },
                    { value: '萧山区', label: '萧山区' }
                ]
            },
            {
                value: '宁波市',
                label: '宁波市',
                children: [
                    { value: '鄞州区', label: '鄞州区' },
                    { value: '海曙区', label: '海曙区' }
                ]
            }
        ]
    },
    {
        value: '江苏省',
        label: '江苏省',
        children: [
            {
                value: '南京市',
                label: '南京市',
                children: [
                    { value: '玄武区', label: '玄武区' },
                    { value: '鼓楼区', label: '鼓楼区' }
                ]
            },
            {
                value: '苏州市',
                label: '苏州市',
                children: [
                    { value: '姑苏区', label: '姑苏区' },
                    { value: '工业园区', label: '工业园区' }
                ]
            }
        ]
    }
]

const openAdd = () => {
    editTitle.value = '新增小区'
    Object.assign(editForm, {
        id: 0,
        name: '',
        cover: randomCover(),
        region: [],
        address: '',
        buildings: 0,
        houses: 0,
        status: 1
    })
    showEdit.value = true
}

const openEdit = (row: any) => {
    editTitle.value = '编辑小区'
    Object.assign(editForm, {
        id: row.id,
        name: row.name,
        cover: row.cover,
        region: [],
        address: row.address,
        buildings: row.buildings,
        houses: row.houses,
        status: row.status
    })
    showEdit.value = true
}

const changeCover = () => {
    editForm.cover = randomCover()
}

const submitEdit = () => {
    if (!editForm.name) {
        ElMessage.warning('请输入小区名称')
        return
    }
    if (editForm.id === 0 && editForm.region.length !== 3) {
        ElMessage.warning('请选择省市区')
        return
    }
    if (!editForm.address) {
        ElMessage.warning('请输入详细位置')
        return
    }
    const row = pager.lists.find((item: any) => item.id === editForm.id)
    if (row) {
        // 楼栋数/房屋数由系统数据自动生成，编辑时不覆盖
        Object.assign(row, {
            name: editForm.name,
            cover: editForm.cover,
            address: editForm.address,
            status: editForm.status
        })
    } else {
        pager.lists.unshift({
            id: Date.now(),
            name: editForm.name,
            address: editForm.region.join('') + editForm.address,
            cover: editForm.cover,
            buildings: editForm.buildings,
            houses: editForm.houses,
            certified: 0,
            users: 0,
            staff_count: 0,
            tuoguan_orders: 0,
            shanshi_orders: 0,
            peizhen_orders: 0,
            status: editForm.status,
            create_time: '2026-09-09 10:30:00'
        })
        pager.count++
    }
    ElMessage.success('保存成功')
    showEdit.value = false
}

// 启用/停用
const toggleStatus = (row: any) => {
    row.status = row.status === 1 ? 0 : 1
    ElMessage.success(row.status === 1 ? '已启用' : '已停用')
}

const goDetail = (row: any) => {
    router.push({ path: '/community/detail', query: { id: row.id } })
}

const handleDelete = (row: any) => {
    ElMessageBox.confirm('删除后不可恢复，确认删除该小区吗？', '提示', { type: 'warning' })
        .then(() => {
            const index = pager.lists.findIndex((item: any) => item.id === row.id)
            if (index > -1) {
                pager.lists.splice(index, 1)
                pager.count--
            }
            ElMessage.success('删除成功')
        })
        .catch(() => {})
}

onMounted(getLists)
</script>

<template>
    <div class="community-lists" v-loading="pager.loading">
        <el-card class="!border-none" shadow="never">
            <template #header>
                <div class="flex items-center justify-between">
                    <span class="card-title">小区列表</span>
                    <el-button type="primary" @click="openAdd">
                        <icon name="el-icon-Plus" :size="14" class="mr-1" />
                        新增小区
                    </el-button>
                </div>
            </template>

            <!-- 搜索区 -->
            <div class="flex flex-wrap items-center gap-3 mb-4">
                <el-input
                    v-model="searchParams.keyword"
                    placeholder="请输入小区名称"
                    clearable
                    class="!w-56"
                    @keyup.enter="handleSearch"
                    @clear="handleSearch"
                />
                <el-input
                    v-model="searchParams.address"
                    placeholder="请输入详细地址"
                    clearable
                    class="!w-56"
                    @keyup.enter="handleSearch"
                    @clear="handleSearch"
                />
                <el-button type="primary" @click="handleSearch">
                    <icon name="el-icon-Search" :size="14" class="mr-1" />
                    查询
                </el-button>
                <el-button @click="handleReset">重置</el-button>
            </div>

            <!-- 列表 -->
            <el-table :data="pager.lists">
                <el-table-column label="小区门头" width="100">
                    <template #default="{ row }">
                        <el-image
                            :src="row.cover"
                            :preview-src-list="[row.cover]"
                            preview-teleported
                            fit="cover"
                            class="w-16 h-11 rounded"
                        />
                    </template>
                </el-table-column>
                <el-table-column label="小区名称" prop="name" min-width="150" show-overflow-tooltip>
                    <template #default="{ row }">
                        <span class="font-bold">{{ row.name }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="位置" prop="address" min-width="220" show-overflow-tooltip />
                <el-table-column label="楼栋总数" prop="buildings" min-width="90" align="center" />
                <el-table-column label="总户数" prop="houses" min-width="90" align="center" />
                <el-table-column label="已认证户数" prop="certified" min-width="100" align="center" />
                <el-table-column label="员工总数" prop="staff_count" min-width="90" align="center" />
                <el-table-column label="托管单总数" prop="tuoguan_orders" min-width="100" align="center" />
                <el-table-column label="膳食单总数" prop="shanshi_orders" min-width="100" align="center" />
                <el-table-column label="陪诊单总数" prop="peizhen_orders" min-width="100" align="center" />
                <el-table-column label="状态" width="80" align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">
                            {{ row.status === 1 ? '营业中' : '已停用' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="210" fixed="right" align="center">
                    <template #default="{ row }">
                        <el-button link type="primary" @click="goDetail(row)">详情</el-button>
                        <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
                        <el-button link :type="row.status === 1 ? 'warning' : 'success'" @click="toggleStatus(row)">
                            {{ row.status === 1 ? '停用' : '启用' }}
                        </el-button>
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
                <el-form-item label="小区门头" required>
                    <div class="flex items-center gap-3">
                        <el-image
                            v-if="editForm.cover"
                            :src="editForm.cover"
                            :preview-src-list="[editForm.cover]"
                            preview-teleported
                            fit="cover"
                            class="w-24 h-16 rounded border border-br"
                        />
                        <el-button size="small" @click="changeCover">更换门头图</el-button>
                    </div>
                </el-form-item>
                <el-form-item label="小区名称" required>
                    <el-input v-model="editForm.name" placeholder="请输入小区名称" />
                </el-form-item>
                <el-form-item label="省市区" :required="editForm.id === 0">
                    <el-cascader
                        v-model="editForm.region"
                        :options="regionOptions"
                        placeholder="请选择省 / 市 / 区"
                        class="w-full"
                        clearable
                    />
                </el-form-item>
                <el-form-item label="详细位置" required>
                    <el-input v-model="editForm.address" placeholder="请输入小区详细位置" />
                </el-form-item>
                <el-form-item label="楼栋数">
                    <div class="flex items-center">
                        <span class="font-bold">{{ editForm.buildings }} 栋</span>
                        <span class="ml-2 text-xs text-tx-secondary">由「楼栋房屋管理」数据自动统计，不可编辑</span>
                    </div>
                </el-form-item>
                <el-form-item label="房屋数">
                    <div class="flex items-center">
                        <span class="font-bold">{{ editForm.houses }} 套</span>
                        <span class="ml-2 text-xs text-tx-secondary">由「楼栋房屋管理」数据自动统计，不可编辑</span>
                    </div>
                </el-form-item>
                <el-form-item label="状态">
                    <el-switch v-model="editForm.status" :active-value="1" :inactive-value="0" active-text="营业中" inactive-text="停用" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="showEdit = false">取消</el-button>
                <el-button type="primary" @click="submitEdit">确定</el-button>
            </template>
        </el-dialog>
    </div>
</template>
