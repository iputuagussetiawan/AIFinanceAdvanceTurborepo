import mongoose, { Document, Schema, type Types } from 'mongoose'

import { compareValue, hashValue } from '../../utils/bcrypt'
import { UserSkillSchema } from '../user-skill/user-skill.model'
import { userEducationSchema } from '../userEducation/user-education.model'
import type { IUserEducation } from '../userEducation/user-education.validation'
import { userExperienceSchema } from '../userExperiences/user-experience.model'
import type { IUserExperience } from '../userExperiences/user-experience.validation'
import { userLanguageSchema } from '../userlanguage/user-language.model'
import type { IUserLanguage } from '../userlanguage/user-language.validation'

// _id: false prevents Mongoose from creating a unique ID for every array item

export interface UserDocument extends Document {
    firstName: string // New: Added from image
    lastName: string
    email: string
    jobTitle?: string // New: Added from image (e.g. "Graphic Designer")
    phoneNumber?: string // New: Added from image
    address?: string // New: Added from image
    website?: string
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
    languages?: IUserLanguage[]
    educations?: IUserEducation[]
    experiences?: IUserExperience[]
    skills?: Types.ObjectId[] // Assuming you will store references to UserSkill documents
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
        jobTitle: {
            type: String,
            trim: true,
            default: '', // e.g., "GRAPHIC DESIGNER"
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
        languages: {
            type: [userLanguageSchema],
            default: [],
        },
        educations: {
            type: [userEducationSchema],
            default: [],
        },
        experiences: {
            type: [userExperienceSchema],
            default: [],
        },
        skills: {
            type: [UserSkillSchema],
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
