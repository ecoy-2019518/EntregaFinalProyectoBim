'use strict'

import User from './user.model.js'
import { encrypt, checkPassword, checkUpdate, checkUpdateAdmin } from '../utils/validator.js'
import { generateJwt } from '../utils/jwt.js'

export const test = (req, res) => {
    console.log('test is running')
    return res.send({ message: 'Test is running' })
}

export const defaultAdmin = async () => {
    try {
        const userExist = await User.findOne({ username: 'default' })
        if (userExist) {
            console.log('The user admin "default" was created')
            return
        }
        let data = {
            name: 'Default',
            surname: 'Defaultt',
            username: 'default',
            password: await encrypt('12345678'),
            email: 'default@gmail.com',
            phone: '12345678',
            rol: 'ADMIN'
        }
        let user = new User(data)
        await user.save()
    } catch (err) {
        console.error(err)
    }
}

export const defaultClient = async () => {
    try {
        const userExist = await User.findOne({ username: 'ecoy' })
        if (userExist) {
            console.log('The user client "ecoy" was created')
            return
        }
        let data = {
            name: 'Edwin',
            surname: 'Coy',
            username: 'ecoy',
            password: await encrypt('12345678'),
            email: 'ecoy@gmail.com',
            phone: '12345678',
            rol: 'CLIENT'
        }
        let user = new User(data)
        await user.save()
    } catch (err) {
        console.error(err)
    }
}

export const register = async (req, res) => {
    try {
        let data = req.body
        let userExist = await User.findOne({
            $or: [
                { username: data.username },
                { email: data.email }
            ]
        })
        if (userExist) return res.status(400).send({ message: 'user with this username or email already exists' })
        data.password = await encrypt(data.password)
        data.rol = 'CLIENT'
        let user = new User(data)
        await user.save()
        return res.send({ message: `Registered successfully, can be logged with username ${user.username}` })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error registering user', err: err })
    }
}

export const login = async (req, res) => {
    try {
        let { usernameOrEmail, password } = req.body
        let user = await User.findOne({
            $or: [
                { username: usernameOrEmail },
                { email: usernameOrEmail }
            ]
        })
        if (user && await checkPassword(password, user.password)) {
            let loggedUser = {
                uid: user._id,
                username: user.username,
                name: user.name,
                email: user.email,
                rol: user.rol
            }
            let token = await generateJwt(loggedUser)
            return res.send(
                {
                    message: `Welcome ${loggedUser.name}`,
                    loggedUser,
                    token
                }
            )
        }
        return res.status(404).send({ message: 'Invalid credentials' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error to login', err: err })
    }
}

export const update = async (req, res) => {
    try {
        let { id } = req.params
        let { user } = req
        let data = req.body
        if (user.rol == 'ADMIN') {//admin edita cualquier usuario
            let update = checkUpdateAdmin(data, id)
            if (!update) return res.status(400).send({ message: 'Have submitted some data that cannot be updated or missing data' })
            let userExist = await User.findOne({
                $or: [
                    { username: data.username },
                    { email: data.email }
                ]
            })
            if (userExist) return res.status(400).send({ message: 'user with this username or email already exists' })
            let updatedUser = await User.findOneAndUpdate(
                { _id: id },
                data,
                { new: true }
            )
            if (!updatedUser) return res.status(401).send({ message: 'User not found and not updated' })
            return res.send({ message: 'Updated user', updatedUser })
        } else {//rol que no sea admin solo puede editar su propia cuenta
            let uid = req.user._id
            if (id != uid) return res.status(401).send({ message: 'You can onnly update your account' })

            let update = checkUpdate(data, id)
            if (!update) return res.status(400).send({ message: 'Have submitted some data that cannot be updated or missing data' })

            let userExist = await User.findOne({
                $or: [
                    { username: data.username },
                    { email: data.email }
                ]
            })
            if (userExist) return res.status(400).send({ message: 'user with this username or email already exists' })
            let updatedUser = await User.findOneAndUpdate(
                { _id: id },
                data,
                { new: true }
            )
            if (!updatedUser) return res.status(401).send({ message: 'User not found and not updated' })
            return res.send({ message: 'Updated user', updatedUser })
        }
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error updating account', err: err })
    }
}

export const deleteU = async (req, res) => {
    try {
        let { id } = req.params
        let { user } = req
        let { confirmDelete } = req.body
        if (user.rol == 'ADMIN') {   //verifica rol administrador
            if(confirmDelete !== 'confirm') return res.status(200).send({message: 'Are you sure to delete the account? type "confirm" to verify that you want to delete your account'})//verifica que el usuario quiera eliminar la cuenta
            let deletedUser = await User.findOneAndDelete({ _id: id })
            if (!deletedUser) return res.status(404).send({ message: 'Account not found and not deleted' })
            return res.send({ message: `Account with username ${deletedUser.username} deleted successfully` })
        } else {
            let uid = req.user._id
            if (id != uid) return res.status(401).send({ message: 'You can only delete your account' })
            if(confirmDelete !== 'confirm') return res.status(200).send({message: 'Are you sure to delete the account? type "confirm" to verify that you want to delete your account'})//verifica que el usuario quiera eliminar la cuenta
            let deletedUser = await User.findOneAndDelete({ _id: id })
            if (!deletedUser) return res.status(404).send({ message: 'Account not found and not deleted' })
            return res.send({ message: `Account with username ${deletedUser.username} deleted successfully` })
        }
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error deleting account', err: err })
    }
}

export const editPassword = async (req, res) => {
    try{
        let {oldPassword, newPassword } = req.body
        let { id } = req.params
        let uid = req.user._id
        if (id != uid) return res.status(401).send({ message: 'You can only update your own account' });
        let user = await User.findOne({_id: id})
        if(!user) return res.status(404).send({message: 'User not found'})
        let rightOldPassword = await checkPassword(oldPassword, user.password)
        if(!rightOldPassword) return res.status(400).send({message: 'Incorrect old password'})
        if(oldPassword === newPassword) return res.status(500).send({message: 'enter a password different from the previous one'});
        let updatedUser = await User.findOneAndUpdate(
            { _id: id },
            { password: await encrypt(newPassword) },
            { new: true }
        )
        if (!updatedUser) return res.status(404).send({ message: 'User not found or password not updated' })
        return res.send({ message: 'Password updated successfully', updatedUser })
    }catch(err){
        console.error(err);
        return res.status(500).send({ message: 'Error updating password', err: err });
    }
}