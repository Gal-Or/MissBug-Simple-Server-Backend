import express from 'express'
import cors from 'cors'

import { bugService } from './bugService.js'

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
// app.use(cookieParser())
app.use(cors(corsOptions))

app.get('/', (req, res) => res.send('Hello there'))

app.get('/api/bug', async (req, res) => {

    try {
        const bugs = await bugService.query()
        res.send(bugs)
    } catch (err) {
        res.status(400).send(`Could'nt get cars`)
    }

})

app.get('/api/bug/save', async (req, res) => {

    try {
        var bugToSave = {
            _id: req.query.id,
            title: req.query.title,
            severity: +req.query.severity,
            createdAt: +req.query.createdAt
        }

        bugToSave = await bugService.save(bugToSave)
        res.send(bugToSave)
    } catch (err) {
        res.status(400).send(err)
    }
})

app.get('/api/bug/:bugId', async (req, res) => {
    try {
        const bugId = req.params.bugId
        const bug = await bugService.getById(bugId)
        res.send(bug)

    } catch (err) {
        res.status(400).send(err)
    }
})

app.get('/api/bug/:bugId/remove', async (req, res) => {
    try {
        const bugId = req.params.bugId
        await bugService.remove(bugId)
        res.send('deleted')

    } catch (err) {
        res.status(400).send(err)
    }
})


const port = 3030
app.listen(port, () => console.log('Server ready at port 3030'))