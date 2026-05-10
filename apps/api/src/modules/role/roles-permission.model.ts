import mongoose, { Document, Schema } from 'mongoose'

import { RolePermissions } from './role-permission.util'
import { Permissions, Roles, type PermissionType, type RoleType } from './role.enum'

export interface RoleDocument extends Document {
    name: RoleType
    permissions: Array<PermissionType>
}

const roleSchema = new Schema<RoleDocument>(
    {
        name: {
            type: String,
            enum: Object.values(Roles),
            required: true,
            unique: true,
        },
        permissions: {
            type: [String],
            enum: Object.values(Permissions),
            required: true,
            default: function (this: RoleDocument) {
                return RolePermissions[this.name]
            },
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
