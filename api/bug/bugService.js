import { utilService } from '../../services/util.service.js'
import fs from 'fs'

const PAGE_SIZE = 2
const bugs = utilService.readJsonFile('./data/bug.json')
//console.log(bugs);

export const bugService = {

    query,
    getById,
    remove,
    save,
    compareByTitle,
    compareBySeverity,
    compareByCreatedAt

}

async function query(filterBy = {}, sort = {}) {
    let filteredBugs = [...bugs]

    try {

        if (filterBy.txt) {
            const regExp = new RegExp(filterBy.txt, 'i')
            filteredBugs = filteredBugs.filter(bug => regExp.test(bug.title))
        }
        if (filterBy.minSeverity) {
            filteredBugs = filteredBugs.filter(bug => bug.severity >= filterBy.minSeverity)
        }

        switch (sort.sortBy) {
            case 'title':
                console.log("in case title");
                filteredBugs = filteredBugs.sort(bugService.compareByTitle)
                break
            case 'severity':
                filteredBugs = filteredBugs.sort(bugService.compareBySeverity)
                break
            case 'createdAt':
                filteredBugs = filteredBugs.sort(bugService.compareByCreatedAt)
                break
        }
        if (sort.sortDir === '-1')
            filteredBugs = filteredBugs.reverse()

        if (filterBy.pageIdx !== undefined) {
            const startIdx = filterBy.pageIdx * PAGE_SIZE
            filteredBugs = filteredBugs.slice(startIdx, startIdx + PAGE_SIZE)
        }

        return filteredBugs

    } catch (error) {
        throw error
    }
}

async function getById(bugId) {
    try {
        const bug = bugs.find(bug => bug._id === bugId)
        if (!bug) throw `Cant find bug with id =  ${bugId}`
        return bug
    } catch (error) {
        throw error
    }
}

async function remove(bugId, loggedinUser) {
    try {
        const idx = bugs.findIndex(bug => bug._id === bugId)
        if (idx < 0) throw `Cant find bug with id ${bugId}`

        const bugToRemove = bugs[idx]
        if (bugToRemove.creator._id !== loggedinUser._id) throw { msg: `Not your bug`, code: 403 }

        bugs.splice(idx, 1)
        _saveBugsToFile()
    } catch (error) {
        throw error
    }
}

async function save(bugToSave, loggedinUser) {
    try {
        if (bugToSave._id) {
            const idx = bugs.findIndex(bug => bug._id === bugToSave._id)
            if (idx < 0) throw `Cant find bug with id ${bugToSave._id}`

            const bug = bugs[idx]
            if (bug.creator._id !== loggedinUser._id) throw { msg: `Not your bug`, code: 403 }

            bugToSave = { ...bug, ...bugToSave }
            bugs.splice(idx, 1, bugToSave)

        } else {
            bugToSave._id = utilService.makeId()
            bugToSave.createdAt = Date.now()
            bugToSave.creator = loggedinUser
            bugs.push(bugToSave)
        }
        await _saveBugsToFile()
        return bugToSave
    } catch (error) {
        throw error
    }
}


function _saveBugsToFile(path = './data/bug.json') {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 4)
        fs.writeFile(path, data, (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}

function compareByTitle(bug1, bug2) {

    if (bug1.title > bug2.title)
        return 1
    else if (bug1.title < bug2.title)
        return -1
    else
        return 0
}

function compareBySeverity(bug1, bug2) {

    return bug1.severity - bug2.severity
}

function compareByCreatedAt(bug1, bug2) {

    return bug1.createdAt - bug2.createdAt
}