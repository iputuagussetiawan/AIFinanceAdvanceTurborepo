import mongoose, { Document, Schema } from 'mongoose'

export interface RoleDocument extends Document {
    name: string
    permissions: string[]
}

const roleSchema = new Schema<RoleDocument>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        permissions: {
            type: [String],
            required: true,
            default: [],
        },
    },
    {
        timestamps: true,
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

const RoleModel = mongoose.model<RoleDocument>('Role', roleSchema)
export default RoleModel
