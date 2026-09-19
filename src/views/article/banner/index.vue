<template>
    <div class="article-banner">
        <el-card class="!border-none" shadow="never">
            <template #header>
                <div class="flex items-center justify-between">
                    <span class="card-title">Banner图设置</span>
                    <el-button type="primary" @click="openAdd">
                        <el-icon class="mr-1"><Plus /></el-icon>添加Banner图
                    </el-button>
                </div>
            </template>

            <!-- 筛选搜索 -->
            <el-form inline class="mb-2">
                <el-form-item label="Banner标题">
                    <el-input v-model="queryParams.keyword" placeholder="请输入Banner图标题" clearable class="!w-60"
                        :prefix-icon="Search" @keyup.enter="onSearch" />
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="queryParams.status" placeholder="全部状态" clearable class="!w-32">
                        <el-option label="显示" :value="1" />
                        <el-option label="隐藏" :value="0" />
                    </el-select>
                </el-form-item>
                <el-form-item label="添加时间">
                    <el-date-picker v-model="createRange" type="daterange" range-separator="至" start-placeholder="开始日期"
                        end-placeholder="结束日期" value-format="YYYY-MM-DD" class="!w-60" />
                </el-form-item>
                <el-form-item>
                    <el-button @click="resetQuery">重置</el-button>
                    <el-button type="primary" @click="onSearch">查询</el-button>
                </el-form-item>
            </el-form>

            <el-table :data="pager.lists" stripe v-loading="pager.loading">
                <el-table-column prop="name" label="Banner图标题" min-width="180" show-overflow-tooltip />
                <el-table-column label="封面图" min-width="180">
                    <template #default="{ row }">
                        <el-image :src="row.image" :preview-src-list="[row.image]" preview-teleported fit="cover"
                            class="w-40 h-14 rounded" />
                    </template>
                </el-table-column>
                <el-table-column label="跳转设置" min-width="200" show-overflow-tooltip>
                    <template #default="{ row }">
                        <span v-if="row.link">{{ linkDesc(row) }}</span>
                        <span v-else class="text-tx-secondary">不跳转</span>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="排序" width="80" sortable  show-overflow-tooltip />
                <el-table-column label="状态" width="90">
                    <template #default="{ row }">
                        <el-switch :model-value="row.status" :active-value="1" :inactive-value="0" @change="toggleShow(row)" />
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="添加时间" width="160" show-overflow-tooltip />
                <el-table-column label="操作" width="130" fixed="right">
                    <template #default="{ row }">
                        <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
                        <el-button link type="danger" @click="delRow(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="flex justify-end mt-4">
                <el-pagination v-model:current-page="pager.page" v-model:page-size="pager.size" :total="pager.count"
                    layout="total, prev, pager, next" @current-change="getLists" />
            </div>
        </el-card>

        <!-- 添加/编辑弹窗 -->
        <el-dialog v-model="editVisible" :title="editForm.id ? '编辑Banner图' : '添加Banner图'" width="600px" destroy-on-close>
            <el-form :model="editForm" label-width="110px">
                <el-form-item label="Banner标题" required>
                    <el-input v-model="editForm.name" placeholder="如：首页-中秋活动推广" maxlength="40" show-word-limit />
                </el-form-item>
                <el-form-item label="Banner图" required>
                    <ImageUpload v-model="editForm.image" width="100%" :height="112" tip="建议尺寸 750×300，支持 jpg/png/webp，5MB 以内" />
                </el-form-item>
                <el-form-item label="排序">
                    <el-input-number v-model="editForm.sort" :min="0" :max="999" />
                    <span class="ml-2 text-xs text-tx-secondary">数值越小越靠前</span>
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio-group v-model="editForm.status">
                        <el-radio :value="1">显示</el-radio>
                        <el-radio :value="0">隐藏</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="跳转类目">
                    <el-select v-model="editForm.link_type" class="!w-full" @change="onTypeChange">
                        <el-option v-for="t in linkTypes" :key="t.value" :label="t.label" :value="t.value" />
                    </el-select>
                    <div class="text-xs text-tx-secondary mt-1">选填，设置用户点击 Banner 后打开的内容或页面</div>
                </el-form-item>
                <el-form-item v-if="editForm.link_type === 'wallet'" label="跳转页面">
                    <el-input model-value="/pages/wallet/index" disabled />
                    <div class="text-xs text-tx-secondary mt-1">钱袋子为特殊类目：固定跳转 APP 钱袋子页面，无需选择内容</div>
                </el-form-item>
                <el-form-item v-else-if="linkContentMap[editForm.link_type]" :label="linkContentMap[editForm.link_type].label" required>
                    <el-select v-model="editForm.link_id" placeholder="请选择" class="!w-full">
                        <el-option v-for="o in linkContentMap[editForm.link_type].options" :key="o.id"
                            :label="`#${o.id} ${o.name}`" :value="o.id" />
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="editVisible = false">取消</el-button>
                <el-button type="primary" @click="submitEdit">保存</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts" name="articleBanner">
import { contentBannerList, contentActivityList, contentWonderfulList, contentNoticeList } from '@/mock/data_content'
import { escortServices, helperServices, nursingServices } from '@/mock/data_service'
import { usePaging } from '@/hooks/usePaging'
import { Search, Plus } from '@element-plus/icons-vue'
import ImageUpload from '@/components/image-upload/index.vue'

const queryParams = reactive({ keyword: '', status: '', start_time: '', end_time: '' })
const createRange = ref<string[]>([])

// 本地筛选：列表分页与数据源保持一致
const doFilter = (data: any[], params: Record<string, any> = {}) => {
    let result = data
    if (params.keyword) {
        const kw = String(params.keyword)
        result = result.filter((i: any) => String(i.name || '').includes(kw))
    }
    if (params.status !== '' && params.status !== undefined && params.status !== null) {
        result = result.filter((i: any) => i.status === Number(params.status))
    }
    if (params.start_time) {
        result = result.filter((i: any) => String(i.create_time).slice(0, 10) >= params.start_time)
    }
    if (params.end_time) {
        result = result.filter((i: any) => String(i.create_time).slice(0, 10) <= params.end_time)
    }
    return result
}

const getBannerList = (params: Record<string, any>) => {
    const { page_no = 1, page_size = 15, ...rest } = params
    const lists = doFilter(contentBannerList, rest)
    return Promise.resolve({
        count: lists.length,
        lists: lists.slice((page_no - 1) * page_size, page_no * page_size)
    })
}

const { pager, getLists, resetPage, resetParams } = usePaging({
    fetchFun: getBannerList,
    params: queryParams,
    firstLoading: true
})

const onSearch = () => {
    queryParams.start_time = createRange.value?.[0] || ''
    queryParams.end_time = createRange.value?.[1] || ''
    resetPage()
}
const resetQuery = () => {
    createRange.value = []
    queryParams.start_time = ''
    queryParams.end_time = ''
    resetParams()
}

const nowTimeStr = () => {
    const d = new Date()
    const p = (n: number) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

// ============ 跳转类目与内容（先选类目，再选具体内容；钱袋子为固定页面） ============
const linkTypes = [
    { value: 'none', label: '不跳转' },
    { value: 'nursing', label: '托管服务' },
    { value: 'escort', label: '陪诊服务' },
    { value: 'helper', label: '生活帮手' },
    { value: 'activity', label: '社区活动' },
    { value: 'wallet', label: '钱袋子' },
    { value: 'wonderful', label: '精彩内容' },
    { value: 'notice', label: '通知公告' },
]

/** 钱袋子为特殊类目：固定跳转 APP 钱袋子页面，无二级内容选择 */
const WALLET_LINK = '/pages/wallet/index'

/** 类目 → 前端跳转链接前缀（拼接内容 id） */
const linkPathMap: Record<string, string> = {
    nursing: '/pages/nursing/detail',
    escort: '/pages/escort/detail',
    helper: '/pages/helper/detail',
    activity: '/pages/activity/detail',
    wonderful: '/pages/article/detail',
    notice: '/pages/notice/detail',
}

/** 类目 → 二级内容可选项（数据与对应管理页同源） */
const linkContentMap: Record<string, { label: string; options: { id: number; name: string }[] }> = {
    nursing: { label: '选择托管服务', options: nursingServices.map((s: any) => ({ id: s.id, name: `${s.name}（${s.type}）` })) },
    escort: { label: '选择陪诊服务', options: escortServices.map((s: any) => ({ id: s.id, name: s.name })) },
    helper: { label: '选择生活帮手服务', options: helperServices.map((s: any) => ({ id: s.id, name: s.title })) },
    activity: { label: '选择社区活动', options: contentActivityList.map((s: any) => ({ id: s.id, name: s.title })) },
    wonderful: { label: '选择精彩内容', options: contentWonderfulList.map((s: any) => ({ id: s.id, name: s.title })) },
    notice: { label: '选择通知公告', options: contentNoticeList.map((s: any) => ({ id: s.id, name: s.title })) },
}

const onTypeChange = () => {
    editForm.link_id = ''
}

/** 按类目生成跳转链接 */
const buildLink = () => {
    if (editForm.link_type === 'none') return ''
    if (editForm.link_type === 'wallet') return WALLET_LINK
    const base = linkPathMap[editForm.link_type]
    return base && editForm.link_id ? `${base}?id=${editForm.link_id}` : ''
}

/** 反向解析已保存链接 → 类目 + 内容 id */
const parseLink = (link: string) => {
    if (!link) return { type: 'none', id: '' as any }
    if (link === WALLET_LINK) return { type: 'wallet', id: '' as any }
    for (const [type, base] of Object.entries(linkPathMap)) {
        if (link.startsWith(base)) {
            const m = link.match(/[?&]id=(\d+)/)
            return { type, id: m ? Number(m[1]) : ('' as any) }
        }
    }
    return { type: 'none', id: '' as any }
}

/** 列表「跳转设置」列描述 */
const linkDesc = (row: any) => {
    if (!row.link) return '不跳转'
    if (row.link_type === 'wallet' || row.link === WALLET_LINK) return '钱袋子 · APP 钱袋子页面'
    const conf = linkContentMap[row.link_type]
    const label = linkTypes.find((t) => t.value === row.link_type)?.label
    if (!conf || !label) return row.link
    const item = conf.options.find((o) => o.id === Number(row.link_id))
    return item ? `${label} · ${item.name}` : `${label} · ${row.link}`
}

// ============ 添加 / 编辑 ============
const editVisible = ref(false)
const editForm = reactive({ id: 0, name: '', image: '', sort: 0, status: 1, link_type: 'none', link_id: '' as any })
const openAdd = () => {
    Object.assign(editForm, { id: 0, name: '', image: '', sort: (pager.lists.length || 0) + 1, status: 1, link_type: 'none', link_id: '' })
    editVisible.value = true
}
const openEdit = (row: any) => {
    const parsed = parseLink(row.link || '')
    Object.assign(editForm, {
        id: row.id, name: row.name, image: row.image, sort: row.sort, status: row.status,
        link_type: parsed.type, link_id: parsed.id
    })
    editVisible.value = true
}
const submitEdit = () => {
    if (!editForm.name.trim()) return ElMessage.warning('请输入Banner图标题')
    if (!editForm.image) return ElMessage.warning('请上传Banner图')
    const conf = linkContentMap[editForm.link_type]
    if (conf && !editForm.link_id) return ElMessage.warning(`请${conf.label}`)
    const image = editForm.image
    const link = buildLink()
    const linkData = { link, link_type: editForm.link_type, link_id: editForm.link_type === 'none' ? '' : editForm.link_id }
    if (editForm.id) {
        const row = pager.lists.find((i: any) => i.id === editForm.id)
        if (row) Object.assign(row, { name: editForm.name, image, sort: editForm.sort, status: editForm.status, ...linkData })
        ElMessage.success('保存成功')
    } else {
        pager.lists.unshift({ id: Date.now(), name: editForm.name, image, sort: editForm.sort, status: editForm.status, create_time: nowTimeStr(), ...linkData })
        pager.count += 1
        ElMessage.success('添加成功')
    }
    editVisible.value = false
}

// ============ 显示 / 隐藏 ============
const toggleShow = (row: any) => {
    row.status = row.status === 1 ? 0 : 1
    ElMessage.success(row.status === 1 ? '已设置为显示' : '已隐藏，前端不再显示')
}

// ============ 删除 ============
const delRow = (row: any) => {
    ElMessageBox.confirm(`确定删除Banner图「${row.name}」吗？删除后前端不再显示。`, '删除确认', { type: 'warning' })
        .then(() => {
            const idx = pager.lists.findIndex((i: any) => i.id === row.id)
            if (idx > -1) pager.lists.splice(idx, 1)
            pager.count = Math.max(0, pager.count - 1)
            ElMessage.success('删除成功')
        })
        .catch(() => { })
}

onMounted(getLists)
</script>
