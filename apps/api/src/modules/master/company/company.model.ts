import mongoose, { model, Schema, type Document, type Types } from 'mongoose'

import type { ICompany } from './company.validation'

export const CompanySize = {
    STARTUP: 'STARTUP',
    SME: 'SME',
    LARGE: 'LARGE',
    ENTERPRISE: 'ENTERPRISE',
} as const
export type CompanySizeType = keyof typeof CompanySize

export interface CompanyDocument extends Omit<ICompany, '_id'>, Document {
    _id: Types.ObjectId
    owner: mongoose.Types.ObjectId
    size?: CompanySizeType
    country?: string
    city?: string
    phone?: string
    isVerified: boolean
}

const companySchema = new Schema<CompanyDocument>(
    {
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Company owner is required'],
            index: true,
        },
        name: {
            type: String,
            required: [true, 'Company name is required'],
            minlength: 3,
            maxlength: 100,
            trim: true,
        },
        slug: {
            type: String,
            required: [true, 'Slug is required'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        logoUrl: {
            type: String,
            default: '',
        },
        bgUrl: {
            type: String,
            default: '',
        },
        baseCurrency: {
            type: String,
            required: [true, 'Base currency is required'],
            uppercase: true,
            minlength: 3,
            maxlength: 3,
            default: 'IDR',
        },
        industry: {
            type: String,
            trim: true,
            index: true,
        },
        description: {
            type: String,
            maxlength: 2000,
        },
        website: {
            type: String,
            default: '',
        },
        size: {
            type: String,
            enum: Object.values(CompanySize),
            default: null,
        },
        country: {
            type: String,
            trim: true,
            default: '',
        },
        city: {
            type: String,
            trim: true,
            default: '',
        },
        phone: {
            type: String,
            trim: true,
            default: '',
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        // Otomatis membuat field createdAt dan updatedAt
        timestamps: true,
        // Memastikan saat data dikirim ke JSON, _id dan __v ditangani dengan baik
        toJSON: {
            virtuals: true,
            transform: (doc, ret) => {
                delete (ret as any)._id // Hapus _id asli agar lebih rapi
                delete (ret as any).__v
                return ret
            },
        },
        toObject: { virtuals: true },
    },
)

// Menambahkan text index untuk pencarian nama perusahaan yang lebih cepat
companySchema.index({ name: 'text', industry: 'text' })

export const CompanyModel = model<CompanyDocument>('Company', companySchema)
