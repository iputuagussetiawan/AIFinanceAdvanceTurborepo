import mongoose, { Document, Schema } from 'mongoose'

export interface JournalDetailDocument extends Document {
    companyId: mongoose.Types.ObjectId
    journalEntryId: mongoose.Types.ObjectId // Link to the Header
    description: string | null
    debit: number
    credit: number
    currency: string
    createdAt: Date
    updatedAt: Date
}

const journalDetailSchema = new Schema<JournalDetailDocument>(
    {
        // Link to the Company (Multi-tenant)
        companyId: {
            type: Schema.Types.ObjectId,
            ref: 'Company',
            required: true,
            index: true,
        },
        // Link to the Header (JournalEntryHeader)
        journalEntryId: {
            type: Schema.Types.ObjectId,
            ref: 'JournalEntryHeader',
            required: true,
            index: true, // Crucial for fetching all lines of a single JV
        },
        description: {
            type: String,
            trim: true,
        },
        // Financial values
        debit: {
            type: Number,
            default: 0,
            min: 0,
        },
        credit: {
            type: Number,
            default: 0,
            min: 0,
        },
        // Currency used for this specific line
        currency: {
            type: String,
            required: true,
            uppercase: true,
        },
    },
    {
        timestamps: true,
    },
)

const JournalDetailModel = mongoose.model<JournalDetailDocument>(
    'JournalDetail',
    journalDetailSchema,
)

export default JournalDetailModel
