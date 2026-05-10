import { v4 as uuidv4 } from 'uuid'

export function generateInviteCode() {
    return uuidv4().replace(/-/g, '').substring(0, 8)
}

export function generateTaskCode() {
    return `task-${uuidv4().replace(/-/g, '').substring(0, 3)}`
}

export function generateVerifyCode() {
    // Generates: [20 chars]-vfy
    const randomPart = uuidv4().replace(/-/g, '').substring(0, 15)
    const prefix = 'vfy'
    return `${prefix}-${randomPart}`
}
