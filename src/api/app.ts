/**
 * 应用配置 API（Mock 版）
 */
import { mockConfig, mockDictData } from '@/mock/config'

// 配置
export function getConfig() {
    return mockConfig()
}

// 工作台主页
export function getWorkbench() {
    return Promise.resolve({})
}

// 字典数据
export function getDictData(params: any) {
    return mockDictData(params?.type || params)
}
