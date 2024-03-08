import mongoose from "mongoose"

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: [true, "name is require"]
    },
    description: {
        type: String,
        required: [true, "description is require"]
    }
}, {
    versionKey: false
})

export default mongoose.model('category', categorySchema)