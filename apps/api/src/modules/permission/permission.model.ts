import mongoose, { Document, Schema } from 'mongoose'

export interface PermissionDocument extends Document {
    name: string
    description?: string
    createdAt: Date
    updatedAt: Date
}

const permissionSchema = new Schema<PermissionDocument>(
    {
        name: { type: String, required: true, unique: true, trim: true },
        description: { type: String, trim: true, default: '' },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: (_doc, ret) => {
                delete (ret as any)._id
                delete (ret as any).__v
                return ret
            },
        },
        toObject: { virtuals: true },
    },
)

const PermissionModel = mongoose.model<PermissionDocument>('Permission', permissionSchema)
export default PermissionModel
