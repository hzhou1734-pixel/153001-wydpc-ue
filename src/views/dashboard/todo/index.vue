<script setup lang="ts" name="dashboardTodo">
import { getDashboardTodo } from '@/mock/api'

interface TodoItem {
    id: number
    name: string
    count: number
    path: string
    perms: string
}

const router = useRouter()
const loading = ref(false)
const todoList = ref<TodoItem[]>([])

const getTodo = async () => {
    loading.value = true
    try {
        todoList.value = await getDashboardTodo()
    } finally {
        loading.value = false
    }
}

const handleClick = (item: TodoItem) => {
    router.push(item.path)
}

onMounted(getTodo)
</script>

<template>
    <div class="dashboard-todo" v-loading="loading">
        <el-card class="!border-none" shadow="never">
            <template #header>
                <span class="card-title">待处理事项</span>
            </template>
            <div class="flex flex-wrap">
                <div
                    v-for="item in todoList"
                    :key="item.id"
                    class="w-1/2 md:w-1/3 lg:w-1/4 mb-4 pr-4 cursor-pointer"
                    @click="handleClick(item)"
                >
                    <div
                        class="flex items-center justify-between p-4 rounded-lg border border-br-light hover:shadow-md transition-shadow"
                    >
                        <div>
                            <div class="text-tx-secondary text-sm mb-1">{{ item.name }}</div>
                            <div class="text-3xl font-medium" :class="item.count > 0 ? 'text-primary' : ''">
                                {{ item.count }}
                            </div>
                        </div>
                        <el-icon :size="20" class="text-tx-secondary">
                            <icon name="el-icon-ArrowRight" />
                        </el-icon>
                    </div>
                </div>
            </div>
            <el-empty v-if="!loading && todoList.length === 0" description="暂无待处理事项" />
        </el-card>
    </div>
</template>
