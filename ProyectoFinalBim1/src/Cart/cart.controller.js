"use strict"

import Cart from './cart.model.js'
import Product from '../product/product.model.js'

export const add = async (req, res) => {
  try {
    let { product, amount } = req.body
    let data = req.body
    let uid = req.user._id
    let existProduct = await Product.findOne({ _id: data.product })
    if (!existProduct) return res.status(400).send({message: 'Product not found'})
    let productSA = await Product.findById(product)
    if (productSA.stock === 0) return res.status(400).send({message: 'no existence of this product'})
    if (amount > productSA.stock) return res.status(400).send({message: 'no stock of this product'})
    let cart = new Cart(data)
    await cart.save()
    return res.send({message: `Purchase successfully`})
  } catch (err) {
    console.error(err)
    return res.status(500).send({ message: "Error for add products" })
  }
}