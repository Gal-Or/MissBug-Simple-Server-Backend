import { userService } from './userService.js'


export async function getUsers(req, res) {

    try {
        const { sortBy, sortDir, pageIdx, txt, minSeverity } = req.query

        const filterBy = { txt, minSeverity: +minSeverity, pageIdx }
        const sort = { sortBy, sortDir }


        var bugs = await userService.query(filterBy, sort)



        res.send(bugs)
    } catch (err) {
        res.status(400).send(`Could'nt get cars ` + err)
    }
}

export async function getUser(req, res) {
    try {
        const bugId = req.params.bugId
        const bug = await userService.getById(bugId)
        res.send(bug)

    } catch (err) {
        res.status(400).send(err)
    }
}

export async function removeUser(req, res) {
    try {
        const bugId = req.params.bugId
        await userService.remove(bugId)
        res.send('deleted')

    } catch (err) {
        res.status(400).send(err)
    }
}


export async function updateUser(req, res) {

    const { _id, fullname, username, password, score } = req.body
    let userToSave = { _id, fullname, username, password, score: +score }

    try {
        userToSave = await userService.save(userToSave)
        res.send(userToSave)
    } catch (err) {
        // loggerService.error(`Could'nt save car`, error)
        res.status(400).send(err)
    }
}

export async function addUser(req, res) {

    const { fullname, username, password } = req.body
    let userToSave = { fullname, username, password, score: 0 }

    try {
        userToSave = await userService.save(userToSave)
        res.send(userToSave)

    } catch (err) {
        //loggerService.error(`Could'nt save car`, error)
        res.status(400).send(err)
    }
}