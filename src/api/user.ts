/**
 * 用户相关 API（Mock 版）
 * 全部返回 Promise.resolve(裸 data)，绕过 axios 拦截器
 */
import { mockLogin, mockLogout, mockUserInfo } from '@/mock/user'

// 登录
export function login(params: Record<string, any>) {
    return mockLogin(params)
}

// 退出登录
export function logout() {
    return mockLogout()
}

// 用户信息
export function getUserInfo() {
    return mockUserInfo()
}

// 编辑管理员信息
export function setUserInfo(params: any) {
    return Promise.resolve(params)
}
