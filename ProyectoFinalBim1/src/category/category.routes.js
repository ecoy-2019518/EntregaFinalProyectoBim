import express from 'express'
import { test, add, update, deleteC, list } from './category.controller.js'
import { isAdmin, validateJwt } from '../middleware/validate-jws.js';

const api = express.Router();

//Rutas
api.get('/test', [validateJwt, isAdmin], test)
api.post('/add', [validateJwt, isAdmin], add)
api.put('/update/:id', [validateJwt, isAdmin], update)
api.delete('/delete/:id', [validateJwt, isAdmin], deleteC)
api.get('/list', [validateJwt, isAdmin], list)

export default api