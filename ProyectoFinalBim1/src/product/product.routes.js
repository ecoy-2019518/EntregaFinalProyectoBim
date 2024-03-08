import express from 'express'
import { test, add, update, deleteP, list, listName, soldout} from './product.controller.js'
import { isAdmin, validateJwt } from '../middleware/validate-jws.js'

const api = express.Router();

api.get('/test', [validateJwt, isAdmin], test)
api.post('/add', [validateJwt, isAdmin], add)
api.put('/update/:id', [validateJwt, isAdmin], update)
api.delete('/delete/:id', [validateJwt, isAdmin], deleteP)
api.get('/list', [validateJwt], list)
api.post('/soldout', [validateJwt], soldout)
api.post('/listName', [validateJwt], listName)

export default api