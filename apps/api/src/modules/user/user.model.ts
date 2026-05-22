import mongoose, { Document, Schema } from 'mongoose'

import { compareValue, hashValue } from '../../utils/bcrypt'

export interface UserDocument extends Document {
    firstName: string
    lastName: string
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
            required: [true, 'First name is required'],
            trim: true,
            uppercase: true, // To match the styling in your image
        },
        lastName: {
            type: String,
            required: [true, 'Last name is required'],
            trim: true,
            uppercase: true, // To match the styling in your image
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
            transform: (doc, ret) => {
                delete (ret as any)._id // Hapus _id asli agar lebih rapi
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

//This code is a Mongoose Middleware (specifically a "Pre-Save Hook"). Its primary purpose is to automatically hash the user's password before it ever touches your database, ensuring that you never store plain-text passwords.
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        if (this.password) {
            this.password = await hashValue(this.password)
        }
    }
    next()
})

//This code defines a Custom Instance Method in Mongoose. Its specific job is to "clean" the user data by removing the sensitive password field before you send the information back to the frontend.
userSchema.methods.omitPassword = function (): Omit<UserDocument, 'password'> {
    const userObject = this.toObject()
    delete userObject.password
    return userObject
}

//This code defines an Instance Method called comparePassword. It is used during the login process to verify if the plain-text password entered by a user matches the hashed password stored in your MongoDB database.
userSchema.methods.comparePassword = async function (value: string) {
    return compareValue(value, this.password)
}

//This code is the final step in setting up your database model. It takes your configuration (the Schema) and creates a functional tool (the Model) that allows you to interact with the MongoDB database.
const UserModel = mongoose.model<UserDocument>('User', userSchema)
export default UserModel
