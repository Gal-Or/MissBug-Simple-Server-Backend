import { utilService } from '../../services/util.service.js'
import { dbService } from '../../services/db.service.js'
import { loggerService } from './../../services/logger.service.js';


import mongodb from 'mongodb'
const { ObjectId } = mongodb

import fs from 'fs'
import { log } from 'console'


const PAGE_SIZE = 2

//checkDB()
//const bugs = utilService.readJsonFile('./data/bug.json')
//console.log(bugs);

async function checkDB() {

    const collection = await dbService.getCollection('bug')
    console.log("coll from checkDB : " + await collection.find({}).toArray());
    const bugs = await collection.find()
    const arr = await bugs.toArray()
    console.log("bugs from mongo : " + JSON.stringify(arr, null, 2));
    // return bugs
}

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

    try {

        const criteria = _buildCriteria(filterBy)
        const collection = await dbService.getCollection('bug')
        var bugCursor = await collection.find(criteria).sort({ description: +sort.sortDir })

        if (filterBy.pageIdx !== undefined) {
            bugCursor.skip(filterBy.pageIdx * PAGE_SIZE).limit(PAGE_SIZE)
        }

        const bugs = bugCursor.toArray()
        return bugs


    } catch (error) {
        loggerService.error("bugService.js, function: query,  error: ", err)

        throw error
    }
}

async function getById(bugId) {
    try {
        const collection = await dbService.getCollection('bug')
        const bug = await collection.findOne({ "_id": ObjectId(bugId) })
        return bug
    } catch (err) {
        loggerService.error("bugService.js, function: getById,  error: ", err)
        throw err
    }
}

async function remove(bugId, loggedinUser) {
    try {
        const collection = await dbService.getCollection('bug')
        const bug = await collection.deleteOne({ _id: ObjectId(bugId) })
        return bugId

    } catch (err) {
        loggerService.error("bugService.js, function:remove,  error: ", err)
        throw err
    }
}

async function save(bug, loggedinUser) {
    try {
        if (bug._id) {
            const bugToSave = {
                title: bug.title,
                description: bug.description,
                severity: bug.severity
            }
            const collection = await dbService.getCollection('bug')
            await collection.updateOne({ _id: ObjectId(bug._id) }, { $set: bugToSave })

        } else {
            bug.createdAt = Date.now()
            bug.creator = loggedinUser
            const collection = await dbService.getCollection('bug')
            await collection.insertOne(bug)
        }
        return bug
    } catch (error) {
        loggerService.error("bugService.js, function:save,  error: ", err)
        throw error
    }
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

function _buildCriteria(filterBy) {

    var criteria = {}

    if (filterBy.txt) {
        criteria = {
            $or: [{ title: { $regex: filterBy.txt, $options: 'i' } },
            { description: { $regex: filterBy.txt, $options: 'i' } }]
        }
    }
    if (filterBy.minSeverity) {
        criteria = { ...criteria, severity: { $gt: filterBy.minSeverity } }
    }

    console.log("criteria= ", criteria);

    return criteria

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
