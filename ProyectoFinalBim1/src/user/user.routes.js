import express from 'express'
import { deleteU, editPassword, login, register, test, update } from './user.controller.js'
import { validateJwt, isAdmin } from '../middleware/validate-jws.js';

const api = express.Router();

api.get('/test', test)
api.post('/register',  register)
api.post('/login', login)
api.put('/update/:id', [validateJwt], update)
api.put('/editPassword/:id', [validateJwt], editPassword)
api.delete('/delete/:id', [validateJwt], deleteU)


export default api