import { bugService } from './bugService.js'


export async function getBugs(req, res) {

    try {
        const { sortBy, sortDir, pageIdx, txt, minSeverity } = req.query

        const filterBy = { txt, minSeverity: +minSeverity, pageIdx }
        const sort = { sortBy, sortDir }

        var bugs = await bugService.query(filterBy, sort)
        res.send(bugs)
    } catch (err) {
        res.status(400).send(`Could'nt get cars ` + err)
    }
}

export async function getBug(req, res) {
    try {
        const bugId = req.params.bugId
        const bug = await bugService.getById(bugId)
        res.send(bug)

    } catch (err) {
        res.status(400).send(err)
    }
}

export async function removeBug(req, res) {
    const { loggedinUser } = req
    try {

        const bugId = req.params.bugId
        //const bugToRemove = await bugService.getById(bugId)
        //if (bugToRemove.creator._id !== loggedinUser._id) return res.status(401).send('Not Your Bug')

        const bugID = await bugService.remove(bugId, loggedinUser)
        res.send(`bug with id: ${bugID} deleted`)

    } catch (err) {
        res.status(400).send(err)
    }
}


export async function updateBug(req, res) {
    const { loggedinUser } = req
    const { _id, title, description, severity } = req.body
    let bugToSave = { _id, title, description, severity: +severity }

    try {
        bugToSave = await bugService.save(bugToSave, loggedinUser)
        res.send(bugToSave)
    } catch (err) {
        // loggerService.error(`Could'nt save car`, error)
        res.status(400).send(err)
    }
}

export async function addBug(req, res) {
    const { loggedinUser } = req
    const { title, description, severity } = req.body
    let bugToSave = { title, description, severity: +severity }

    try {
        bugToSave = await bugService.save(bugToSave, loggedinUser)
        res.send(bugToSave)

    } catch (err) {
        //loggerService.error(`Could'nt save car`, error)
        res.status(400).send(err)
    }
}