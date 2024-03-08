'use strict'//Modo estricto

import Category from './category.model.js'
import Product from '../product/product.model.js'
import { checkUpdate } from '../utils/validator.js'

export const test = (req, res) => {
    console.log('test is running')
    return res.send({ message: 'test function is running' })
}

export const defaultCategory = async () => {
    try {
        const categoryExist = await Category.findOne({ name: 'default category' })
        if (categoryExist) {
            console.log('The category "default category" was created')
            return
        }
        let data = {
            name: 'default category',
            description: 'default'
        }
        let category = new Category(data)
        await category.save()
    } catch (err) {
        console.error(err)
    }
}

export const add = async (req, res) => {
    try {
        let data = req.body
        let category = new Category(data)
        await category.save()
        return res.send({ message: 'Category saved succesfully' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error saving category', err: err })
    }
}

export const update = async (req, res) => {
    try {
        let { id } = req.params
        let data = req.body
        let update = checkUpdate(data, id)
        if (!update) return res.status(400).send({ message: 'Have submitted some data that cannot be updated or missing data' })
        let updateCategory = await Category.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        )
        if (!updateCategory) return res.status(401).send({ message: 'Category not found and not updated' })
        return res.send({ message: 'Updated Category', updateCategory })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error updating category' })
    }

}

export const deleteC = async (req, res) => {
    try {
        let { id } = req.params
        let deletedCategory = await Category.findOneAndDelete({ _id: id })
        if (!deletedCategory) return res.status(404).send({ message: 'Category not found and not deleted' })
        return res.send({ message: `Category ${deletedCategory.name} deleted successfully` })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error deleting category' })
    }
}

export const list = async (req, res) => {
    try {
        let category = await Category.find()
        if (category.length === 0) return res.status(400).send({ message: 'Category not found' })
        return res.send({ category })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Category not found' })
    }
}
