<template>
    <el-dialog
        v-model="visible"
        :title="`分配权限 - ${roleName}`"
        width="720px"
        top="5vh"
        :close-on-click-modal="false"
    >
        <div v-loading="loading">
            <el-alert
                type="info"
                :closable="false"
                show-icon
                class="!mb-3"
                title="勾选页面节点即授予「查看」权限；其下子节点为该页面实际存在的操作权限（新增、编辑、删除、审核、导出、派单等）"
            />
            <div class="flex items-center gap-4 mb-2">
                <el-checkbox v-model="checkStrictly" label="父子联动" />
                <el-button link type="primary" @click="toggleExpand">展开/折叠</el-button>
                <el-button link type="primary" @click="selectAll">全选/全不选</el-button>
                <span class="text-xs text-tx-secondary">已选 {{ checkedKeys.length }} 项</span>
            </div>
            <el-scrollbar class="h-[460px]">
                <el-tree
                    ref="treeRef"
                    :data="treeData"
                    :props="{ label: 'name', children: 'children' }"
                    node-key="key"
                    :check-strictly="!checkStrictly"
                    :default-expand-all="isExpand"
                    show-checkbox
                >
                    <template #default="{ data }">
                        <span class="flex items-center">
                            <span>{{ data.name }}</span>
                            <el-tag v-if="data.type === 'op'" size="small" type="info" class="!ml-2">
                                操作
                            </el-tag>
                            <el-tag v-else-if="data.type === 'page'" size="small" class="!ml-2">页面</el-tag>
                        </span>
                    </template>
                </el-tree>
            </el-scrollbar>
        </div>
        <template #footer>
            <el-button @click="visible = false">取消</el-button>
            <el-button type="primary" :loading="saving" @click="handleSubmit">保存权限</el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts" name="settingRoleAuth">
import { getPermTree, getRolePerms, saveRolePerms } from '@/mock/api'

const emit = defineEmits(['success'])

const visible = ref(false)
const loading = ref(false)
const saving = ref(false)
const isExpand = ref(true)
const checkStrictly = ref(true)
const treeRef = shallowRef<any>()
const treeData = ref<any[]>([])
const checkedKeys = ref<string[]>([])
const roleId = ref(0)
const roleName = ref('')

/** 打开弹窗 */
const open = async (row: any) => {
    roleId.value = row.id
    roleName.value = row.name
    visible.value = true
    loading.value = true
    try {
        const [tree, perms]: any[] = await Promise.all([getPermTree(), getRolePerms({ id: row.id })])
        treeData.value = tree || []
        checkedKeys.value = perms?.perms || []
        await nextTick()
        // 仅勾选叶子节点，父节点由树自动推导
        const leafKeys = collectLeafKeys(treeData.value).filter((k) => checkedKeys.value.includes(k))
        treeRef.value?.setCheckedKeys(leafKeys, false)
        expandAll(true)
    } finally {
        loading.value = false
    }
}

/** 收集全部叶子节点 key */
const collectLeafKeys = (nodes: any[]): string[] => {
    const result: string[] = []
    const walk = (list: any[]) => {
        list.forEach((item) => {
            if (item.children?.length) walk(item.children)
            else result.push(item.key)
        })
    }
    walk(nodes)
    return result
}

/** 展开 / 折叠全部节点 */
const expandAll = (expand: boolean) => {
    const walk = (list: any[]) => {
        list.forEach((item: any) => {
            const node = treeRef.value?.store?.nodesMap?.[item.key]
            if (node) node.expanded = expand
            if (item.children?.length) walk(item.children)
        })
    }
    walk(treeData.value)
}

const toggleExpand = () => {
    isExpand.value = !isExpand.value
    expandAll(isExpand.value)
}

const selectAll = () => {
    if (checkedKeys.value.length >= collectLeafKeys(treeData.value).length) {
        treeRef.value?.setCheckedKeys([])
    } else {
        treeRef.value?.setCheckedKeys(collectLeafKeys(treeData.value))
    }
    syncChecked()
}

const syncChecked = () => {
    const checked: string[] = treeRef.value?.getCheckedKeys() || []
    const half: string[] = treeRef.value?.getHalfCheckedKeys() || []
    checkedKeys.value = [...new Set([...checked, ...half])]
}

const handleSubmit = async () => {
    const checked: string[] = treeRef.value?.getCheckedKeys() || []
    const half: string[] = treeRef.value?.getHalfCheckedKeys() || []
    // 只保存叶子节点（真实权限标识），父节点无需入库
    const leafSet = new Set(collectLeafKeys(treeData.value))
    const perms = [...new Set([...checked, ...half])].filter((k) => leafSet.has(k))
    saving.value = true
    try {
        await saveRolePerms({ id: roleId.value, perms })
        ElMessage.success('权限分配成功')
        visible.value = false
        emit('success')
    } finally {
        saving.value = false
    }
}

defineExpose({ open })
</script>
