'use strict'

import express from 'express'
import { validateJwt } from "../middlewares/validate.jwt.js"
import { add } from './Cart.controller.js'

const api = express.Router();

api.post("/add", [validateJwt], add)

export default api