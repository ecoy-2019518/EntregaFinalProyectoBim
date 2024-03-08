import {Schema, model} from 'mongoose'

const shoppingCartSchema= Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'user',
        require: [true, "user is require"]
    },
    products:[{
        product:{
            type: Schema.Types.ObjectId,
            ref: 'product',
            require: [true, "product is require"]
        },
        amount:{
            type: Number,
            default: 1,
            require: [true, "amount is require"]
        }
    }],
    total:{
        type: Number,
        require: true
    }
    
},{
    versionKey: false
})

export default model('shoppingCart', shoppingCartSchema)