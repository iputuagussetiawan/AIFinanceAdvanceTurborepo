import mongoose, { Document, Schema } from 'mongoose'

import { compareValue, hashValue } from '../../utils/bcrypt'

export interface UserDocument extends Document {
    firstName?: string
    lastName?: string
    email: string
    phoneNumber?: string
    address?: string
    website?: string
    birthday?: Date
    bio?: string
    password?: string
    profilePicture: string | null
    isEmailVerified: boolean
    isActive: boolean
    lastLogin: Date | null
    currentCompany: mongoose.Types.ObjectId | null
    onboardingComplete: boolean
    createdAt: Date
    updatedAt: Date
    comparePassword(value: string): Promise<boolean>
    omitPassword(): Omit<UserDocument, 'password'>
}

const userSchema = new Schema<UserDocument>(
    {
        firstName: {
            type: String,
            required: false,
            trim: true,
            uppercase: true,
            default: '',
        },
        lastName: {
            type: String,
            required: false,
            trim: true,
            uppercase: true,
            default: '',
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        phoneNumber: {
            type: String,
            trim: true,
            default: '',
        },
        address: {
            type: String,
            trim: true,
            default: '',
        },
        website: {
            type: String,
            trim: true,
            default: '',
        },
        birthday: {
            type: Date,
            default: null,
        },
        bio: {
            type: String,
            required: false,
        },
        password: { type: String, select: false },
        profilePicture: {
            type: String,
            default: null,
        },
        currentCompany: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company',
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        isActive: { type: Boolean, default: true },
        lastLogin: { type: Date, default: null },
        onboardingComplete: { type: Boolean, default: false },
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

userSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`
})

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        if (this.password) {
            this.password = await hashValue(this.password)
        }
    }
    next()
})

userSchema.methods.omitPassword = function (): Omit<UserDocument, 'password'> {
    const userObject = this.toObject()
    delete userObject.password
    return userObject
}

userSchema.methods.comparePassword = async function (value: string) {
    return compareValue(value, this.password)
}

const UserModel = mongoose.model<UserDocument>('User', userSchema)
export default UserModel
