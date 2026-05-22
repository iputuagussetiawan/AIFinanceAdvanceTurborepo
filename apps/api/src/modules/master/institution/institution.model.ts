import mongoose, { Document, Model, Schema } from 'mongoose'

/**
 * 1. Definisi Interface Objek Murni (POJO)
 * Ini digunakan saat Anda menggunakan .lean()
 */
export interface IInstitution {
    name: string
    type: 'university' | 'college' | 'high_school' | 'vocational_school' | 'other'
    location?: string
    website?: string
    logoUrl?: string
    orderPosition: number
    isActive: boolean
    createdAt?: Date
    updatedAt?: Date
}

/**
 * 2. Definisi Interface Document Mongoose
 * Ini mewarisi data dari IInstitution dan fungsionalitas Document.
 * Gunakan interface ini untuk variabel yang merupakan instance dari model (hasil .create() atau .find() tanpa .lean()).
 */
export interface InstitutionDocument extends IInstitution, Document {
    // Anda bisa menambahkan custom instance methods di sini jika ada.
    // Contoh:
    // formatLocation(): string;
}
/**
 * 3. Definisi Schema
 */
const institutionSchema = new Schema<InstitutionDocument>(
    {
        name: {
            type: String,
            required: [true, 'Institution name is required'],
            unique: true,
            trim: true,
        },
        type: {
            type: String,
            enum: ['university', 'college', 'high_school', 'vocational_school', 'other'],
            default: 'university',
            required: true,
        },
        location: {
            type: String,
            default: '',
            trim: true,
        },
        website: {
            type: String,
            default: '',
            trim: true,
        },
        logoUrl: {
            type: String,
            default: '',
        },
        orderPosition: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        // Pastikan virtuals tetap diproses
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

// Indexing untuk pencarian cepat
institutionSchema.index({ name: 'text' })

/**
 * 4. Create the Model
 */
const InstitutionModel: Model<InstitutionDocument> =
    mongoose.models.Institution ||
    mongoose.model<InstitutionDocument>('Institution', institutionSchema)

export default InstitutionModel
