import { model, Schema, type Document, type Types } from 'mongoose'

import type { ICompany } from './company.validation'

// Kita gunakan Interface ICompany yang sudah Anda buat sebelumnya
// Jika Anda ingin dukungan penuh Mongoose methods, tambahkan interface Document
export interface CompanyDocument extends Omit<ICompany, '_id'>, Document {
    _id: Types.ObjectId
}

const companySchema = new Schema<CompanyDocument>(
    {
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
            unique: true, // Sangat penting untuk SEO dan routing
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
        isActive: {
            type: Boolean,
            default: true,
        },
        description: {
            type: String,
            maxlength: 2000,
        },
        website: {
            type: String,
            default: '',
        },
        industry: {
            type: String,
            trim: true,
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
