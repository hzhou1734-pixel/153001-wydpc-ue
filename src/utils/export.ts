/**
 * 前端数据导出（CSV，兼容 Excel 中文）
 */

/** 转义 CSV 单元格：含逗号 / 引号 / 换行时用双引号包裹 */
const escapeCell = (val: any) => {
    const str = val === null || val === undefined ? '' : String(val)
    return /[",\n\r]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str
}

interface ExportColumn {
    label: string
    prop?: string
    /** 自定义取值，优先级高于 prop */
    formatter?: (row: any, index: number) => any
}

/**
 * 导出列表为 CSV 文件
 * @param filename 文件名（不含扩展名）
 * @param columns 列配置
 * @param rows 数据行
 */
export function exportCsv(filename: string, columns: ExportColumn[], rows: any[]) {
    if (!rows?.length) {
        ElMessage.warning('暂无可导出的数据')
        return false
    }
    const header = columns.map((c) => escapeCell(c.label)).join(',')
    const body = rows
        .map((row, i) =>
            columns
                .map((c) => escapeCell(c.formatter ? c.formatter(row, i) : row[c.prop as string]))
                .join(',')
        )
        .join('\r\n')
    // \uFEFF 解决 Excel 打开中文乱码
    const blob = new Blob([`\uFEFF${header}\r\n${body}`], {
        type: 'text/csv;charset=utf-8;'
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    ElMessage.success(`已导出 ${rows.length} 条记录`)
    return true
}
