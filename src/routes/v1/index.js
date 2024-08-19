import express from 'express';
import userRouter from './userRoutes.js'
import movieRouter from './movieRoutes.js'
import theaterOwnerRouter from './theaterOwnerRoutes.js'
import theaterRouter from './theaterRoutes.js'
import showRouter from './showRoutes.js'
import seatRouter from './seatRoutes.js'
import ratingRouter from './ratingRoutes.js'
import paymentRouter from './paymentRoutes.js'
import bookingRouter from './bookingRoutes.js'
import adminRouter from './adminRoutes.js'



const v1Router = express.Router();

v1Router.use('/user', userRouter)
v1Router.use('/movie', movieRouter)
v1Router.use('/theater-owner',theaterOwnerRouter)
v1Router.use('/theater',theaterRouter)
v1Router.use('/show',showRouter)
v1Router.use('/seat',seatRouter)
v1Router.use('/rating', ratingRouter)
v1Router.use('/payment',paymentRouter)
v1Router.use('/booking',bookingRouter)
v1Router.use('/admin',adminRouter)





export default v1Router;