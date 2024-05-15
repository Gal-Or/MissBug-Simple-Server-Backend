import { utilService } from '../../services/util.service.js'
import fs from 'fs'

const PAGE_SIZE = 2
const users = utilService.readJsonFile('./data/user.json')
// console.log(users);

export const userService = {

    query,
    getByUsername,
    getById,
    remove,
    save,

}

async function query() {

    try {
        return users

    } catch (error) {
        throw error
    }
}

async function getByUsername(username) {
    const user = users.find(user => user.username === username)
    return user
}

async function getById(userId) {
    try {
        const user = users.find(user => user._id === userId)
        if (!user) throw `Cant find user with id =  ${userId}`
        return user
    } catch (error) {
        throw error
    }
}

async function remove(userId) {
    try {
        const userIdx = users.findIndex(user => user._id === userId)
        if (userIdx < 0) throw `Cant find user with id ${userId}`
        users.splice(userIdx, 1)
        _saveUsersToFile()
    } catch (error) {
        throw error
    }
}

async function save(userToSave) {
    try {
        if (userToSave._id) {
            const idx = users.findIndex(user => user._id === userToSave._id)
            if (idx < 0) throw `Cant find user with id ${userToSave._id}`
            users[idx] = userToSave
        } else {
            userToSave._id = utilService.makeId()
            users.push(userToSave)
        }
        await _saveUsersToFile()
        return userToSave
    } catch (error) {
        throw error
    }
}


function _saveUsersToFile(path = './data/user.json') {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(users, null, 4)
        fs.writeFile(path, data, (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}
