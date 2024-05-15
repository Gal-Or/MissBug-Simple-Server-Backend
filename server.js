import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import path from 'path'
// import cookieParser from 'cookie-parser'




const app = express()

const corsOptions = {
    origin: [
        'http://127.0.0.1:5173',
        'http://127.0.0.1:3000',
        'http://localhost:5173',
        'http://localhost:3000'
    ],
    credentials: true
}

// Express Config:
app.use(express.static('public'))
app.use(cookieParser())
app.use(cors(corsOptions))
app.use(express.json())


import { bugRoutes } from './api/bug/bug.routes.js'
app.use('/api/bug', bugRoutes)

import { userRoutes } from './api/user/user.routes.js'
app.use('/api/user', userRoutes)

import { authRoutes } from './api/auth/auth.routes.js'
app.use('/api/auth', authRoutes)


app.get('/', (req, res) => res.send('Hello there'))



app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

const port = process.env.PORT || 3030
app.listen(port, () => console.log(`Server ready at port ${port}`))