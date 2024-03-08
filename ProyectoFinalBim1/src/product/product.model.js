import { Schema, model } from "mongoose"

const productSchema = Schema({
    name: {
        type: String,
        unique: true,
        required: [true, 'name is require']
    },
    description: {
        type: String,
        required: [true, 'description is require']
    },
    category: {
        type: Schema.ObjectId,
        ref: 'category',
        required: [true, 'category is require']
    },
    stock: {
        type: Number,
        required: [true, 'stock is require']
    },
    price: {
        type: Number,
        required: [true, 'price is require']
    }
}, {
    versionKey: false
})

export default model('product', productSchema)