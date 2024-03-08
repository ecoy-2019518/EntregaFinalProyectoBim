import {Schema, model} from 'mongoose'

const shoppingCartSchema= Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'user',
        require: true
    },
    products:[{
        product:{
            type: Schema.Types.ObjectId,
            ref: 'product',
            require: true
        },
        amount:{
            type: Number,
            require: true    
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