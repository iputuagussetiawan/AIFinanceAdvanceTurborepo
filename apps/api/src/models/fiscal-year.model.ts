import mongoose, { Document, Schema } from 'mongoose'

export interface FiscalYearDocument extends Document {
    companyId: mongoose.Types.ObjectId
    name: string
    startDate: Date
    endDate: Date
    isClosed: boolean
    createdAt: Date
    updatedAt: Date
}

const fiscalYearSchema = new Schema<FiscalYearDocument>(
    {
        // Link to the Company (Foreign Key)
        companyId: {
            type: Schema.Types.ObjectId,
            ref: 'Company',
            required: true,
            index: true,
        },
        // Name of the fiscal year (e.g., "FY 2025" or "Year 2025")
        name: {
            type: String,
            required: true,
            trim: true,
        },
        // The start date of the period
        startDate: {
            type: Date,
            required: true,
        },
        // The end date of the period
        endDate: {
            type: Date,
            required: true,
        },
        // Whether the books are closed for this year (prevents further editing)
        isClosed: {
            type: Boolean,
            default: false,
        },
    },
    {
        // Handles createdAt and updatedAt automatically
        timestamps: true,
    },
)

// Ensure a company cannot have two Fiscal Years with the same name
fiscalYearSchema.index({ companyId: 1, name: 1 }, { unique: true })

const FiscalYearModel = mongoose.model<FiscalYearDocument>('FiscalYear', fiscalYearSchema)

export default FiscalYearModel
