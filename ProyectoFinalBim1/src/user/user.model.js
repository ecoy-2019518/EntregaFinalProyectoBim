import mongoose from "mongoose"

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name is require']
    },
    surname: {
        type: String,
        required: [true, 'surname is require']
    },
    username: {
        type: String,
        unique: true,
        lowercase: true,
        required: [true, 'username is require']
    },
    password: {
        type: String,
        minLength: [8, 'Password must be 8 characters'],
        required: [true, 'password is require']
    },
    email: {
        type: String,
        required: [true, 'email is require']
    },
    phone: {
        type: String,
        minLength: 8,
        maxLength: 8,
        required: [true, 'phone is require']
    },
    rol: {
        type: String,
        uppercase: true,
        enum: ['ADMIN', 'CLIENT'],
        required: [true, 'rol is require']
    }
}, {
    versionKey: false
})

export default mongoose.model('user', userSchema)