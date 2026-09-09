<template>
    <div>
        <el-card class="!border-none" shadow="never">
            <el-form class="mb-[-16px]" :model="queryParams" :inline="true">
                <el-form-item class="w-[280px]" label="用户信息">
                    <el-input
                        v-model="queryParams.keyword"
                        placeholder="昵称/手机号码/所属小区"
                        clearable
                        @keyup.enter="resetPage"
                    />
                </el-form-item>
                <el-form-item label="所属小区">
                    <el-select v-model="queryParams.community" class="w-[200px]" clearable placeholder="全部小区">
                        <el-option v-for="item in communityOptions" :key="item" :label="item" :value="item" />
                    </el-select>
                </el-form-item>
                <el-form-item label="账户状态">
                    <el-select v-model="queryParams.status" class="w-[140px]" clearable placeholder="全部状态">
                        <el-option label="正常" :value="1" />
                        <el-option label="已禁用" :value="0" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="resetPage">查询</el-button>
                    <el-button @click="resetParams">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card class="!border-none mt-4" shadow="never">
            <el-table size="large" v-loading="pager.loading" :data="pager.lists">
                <el-table-column label="头像" width="86">
                    <template #default="{ row }">
                        <el-avatar :src="row.avatar" :size="44" />
                    </template>
                </el-table-column>
                <el-table-column label="用户昵称" prop="nickname" min-width="110" />
                <el-table-column label="手机号码" prop="mobile" min-width="130" />
                <el-table-column label="所属小区" prop="community" min-width="150" />
                <el-table-column label="房屋信息" prop="room" min-width="150" />
                <el-table-column label="业主认证" min-width="100">
                    <template #default="{ row }">
                        <el-tag :type="row.certified ? 'success' : 'info'" effect="light">
                            {{ row.certified ? '已认证' : '未认证' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="账户余额" min-width="120" align="right">
                    <template #default="{ row }">¥{{ row.balance }}</template>
                </el-table-column>
                <el-table-column label="服务订单" min-width="100" align="center">
                    <template #default="{ row }">{{ row.orders }} 单</template>
                </el-table-column>
                <el-table-column label="账户状态" min-width="100">
                    <template #default="{ row }">
                        <el-tag :type="row.status ? 'success' : 'danger'" effect="light">
                            {{ row.status ? '正常' : '已禁用' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="注册时间" prop="create_time" min-width="170" />
                <el-table-column label="操作" width="100" fixed="right">
                    <template #default="{ row }">
                        <el-button type="primary" link>
                            <router-link
                                :to="{
                                    path: getRoutePath('user.user/detail'),
                                    query: { id: row.id }
                                }"
                            >
                                详情
                            </router-link>
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="flex justify-end mt-4">
                <pagination v-model="pager" @change="getLists" />
            </div>
        </el-card>
    </div>
</template>

<script lang="ts" setup name="consumerLists">
import { getConsumerList } from '@/mock/api'
import { consumerList } from '@/mock/data'
import { usePaging } from '@/hooks/usePaging'
import { getRoutePath } from '@/router'

const communityOptions = [...new Set(consumerList.map((item) => item.community))]
const queryParams = reactive({
    keyword: '',
    community: '',
    status: '',
})

const { pager, getLists, resetPage, resetParams } = usePaging({
    fetchFun: getConsumerList,
    params: queryParams,
})

onActivated(() => {
    getLists()
})

getLists()
</script>
