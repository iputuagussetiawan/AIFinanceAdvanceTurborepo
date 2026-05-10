import mongoose, { Document, Schema } from 'mongoose'

import { COAEnum, type COAEnumType } from '../enums/chart-0f-account.enum'

export interface ChartOfAccountDocument extends Document {
    companyId: mongoose.Types.ObjectId
    code: string
    name: string
    type: COAEnumType
    subType: string
    parentId: mongoose.Types.ObjectId | null
    isSystem: boolean
    isActive: boolean
    level: number
    createdAt: Date
    updatedAt: Date
}

const chartOfAccountSchema = new Schema<ChartOfAccountDocument>(
    {
        // Link to the Company (Foreign Key from your image)
        companyId: {
            type: Schema.Types.ObjectId,
            ref: 'Company',
            required: true,
            index: true,
        },
        // Account code (e.g., "1001", "2000")
        code: {
            type: String,
            required: true,
            trim: true,
        },
        // Account name (e.g., "Cash at Bank", "Accounts Payable")
        name: {
            type: String,
            required: true,
            trim: true,
        },
        // Main category (e.g., "Asset", "Liability", "Equity", "Revenue", "Expense")
        type: {
            type: String,
            enum: COAEnum,
            required: true,
        },
        // Specific category (e.g., "Current Asset", "Long-term Debt")
        subType: {
            type: String,
            required: true,
        },
        // Reference to another account for nested structures (Sub-accounts)
        parentId: {
            type: Schema.Types.ObjectId,
            ref: 'ChartOfAccount',
            default: null,
        },
        // true if this is a default account created by the system that shouldn't be deleted
        isSystem: {
            type: Boolean,
            default: false,
        },
        level: {
            type: Number,
            default: 1,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    },
)

// Compound index: ensure account codes are unique within the same company
chartOfAccountSchema.index({ companyId: 1, code: 1 }, { unique: true })

const ChartOfAccountModel = mongoose.model<ChartOfAccountDocument>(
    'ChartOfAccount',
    chartOfAccountSchema,
)

export default ChartOfAccountModel
