import mongoose, { Document, Schema } from 'mongoose'

import { JournalEntryStatusEnum, type JournalEntryStatusEnumType } from '../enums/jurnal-entry.enum'

export interface JournalEntryHeaderDocument extends Document {
    companyId: mongoose.Types.ObjectId
    fiscalYearId: mongoose.Types.ObjectId
    entryNumber: string
    description: string | null
    date: Date
    status: JournalEntryStatusEnumType
    totalDebit: number
    totalCredit: number
    createdBy: mongoose.Types.ObjectId
    postedBy: mongoose.Types.ObjectId | null
    createdAt: Date
    updatedAt: Date
}

const journalEntryHeaderSchema = new Schema<JournalEntryHeaderDocument>(
    {
        // Link to the Company
        companyId: {
            type: Schema.Types.ObjectId,
            ref: 'Company',
            required: true,
            index: true,
        },
        // Link to the specific Fiscal Year
        fiscalYearId: {
            type: Schema.Types.ObjectId,
            ref: 'FiscalYear',
            required: true,
        },
        // Sequential number (e.g., JV-2024-0001)
        entryNumber: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        date: {
            type: Date,
            required: true,
        },
        // Transaction Lifecycle Status
        status: {
            type: String,
            enum: JournalEntryStatusEnum,
            default: 'DRAFT',
            required: true,
        },
        // Summary totals for validation
        totalDebit: {
            type: Number,
            default: 0,
        },
        totalCredit: {
            type: Number,
            default: 0,
        },
        // Audit Trail: Who created it?
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        // Audit Trail: Who approved/posted it?
        postedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
    },
    {
        timestamps: true,
    },
)

// IMPORTANT: Entry numbers must be unique within a specific company
journalEntryHeaderSchema.index({ companyId: 1, entryNumber: 1 }, { unique: true })

const JournalEntryHeaderModel = mongoose.model<JournalEntryHeaderDocument>(
    'JournalEntryHeader',
    journalEntryHeaderSchema,
)

export default JournalEntryHeaderModel
