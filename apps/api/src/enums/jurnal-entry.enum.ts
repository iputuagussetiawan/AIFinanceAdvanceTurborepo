export const JournalEntryEnum = {
    ASSET: 'ASSET',
    LIABILITY: 'LIABILITY',
    EQUITY: 'EQUITY',
    INCOME: 'INCOME',
    EXPENSE: 'EXPENSE',
}

export const JournalEntryStatusEnum = {
    DRAFT: 'DRAFT',
    POSTED: 'POSTED',
    CANCELLED: 'CANCELLED',
    VOIDED: 'VOIDED',
    ARCHIVED: 'ARCHIVED',
}

export type JournalEntryEnumType = keyof typeof JournalEntryEnum
export type JournalEntryStatusEnumType = keyof typeof JournalEntryStatusEnum
