import express from 'express';
import dotenv from 'dotenv';
import createHttpError from 'http-errors';
import AuthRouter from './Router/Auth.route.js';
dotenv.config();
const app = express();

app.use('/auth', AuthRouter)
app.use((req, resp, next)=>{
    next(createHttpError.NotFound());
})

//ERROR HANDLER
app.use((err, req, resp, next)=>{
resp.status(err.status || 500)
resp.send({
    error:{
        status: err.status || 500,
        message: err.message
    }
})
})

app.listen(process.env.PORT, () => console.log(`Server is running at ${process.env.PORT}`))