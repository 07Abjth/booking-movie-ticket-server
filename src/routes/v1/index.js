import express from 'express';
import userRouter from './userRoutes.js'
import movieRouter from './movieRoutes.js'
import theaterOwnerRouter from './theaterOwnerRoutes.js'
import theater from './theaterRoutes.js'

const v1Router = express.Router();

v1Router.use('/user', userRouter)
v1Router.use('/movie', movieRouter)
v1Router.use('/theater-owner',theaterOwnerRouter)
v1Router.use('/theater',theater)





export default v1Router;