export const COAEnum = {
    ASSET: 'ASSET',
    LIABILITY: 'LIABILITY',
    EQUITY: 'EQUITY',
    INCOME: 'INCOME',
    EXPENSE: 'EXPENSE',
}

export type COAEnumType = keyof typeof COAEnum
