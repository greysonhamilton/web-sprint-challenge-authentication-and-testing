const db = require('../../data/dbConfig');

const getAll = async() => {

    const users = await db('users')
        .select("*")
    return users;

}

const getByID = async(id)=>{

    const user = await db ('users')
        .select(
            'users.id',
            'users.username',
            'users.password'
        )
        .where("users.id", id)
        .first()
    return user;

}

const getByUsername = async(filter) => {

    const user = await db ('users')
        .select(
            'users.id',
            'users.username',
            'users.password'
        )
        .where("users.username", filter)
        .first()
    return user;

}

const add = async(item) => {

    const newUser = await db('users')
        .insert(item)
    return grabByID(newUser)
}

module.exports = {
    getAll,
    getByID,
    getByUsername,
    add
}