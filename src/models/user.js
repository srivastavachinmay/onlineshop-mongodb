const mongodb = require('mongodb')
const getDb = require('../util/database').getDb


class User {
    constructor(username, email) {
        this.name = username
        this.email = email
    }
    save(){
        const db = getDb()
    }
    static findById(userId){

    }
}

module.exports = User
