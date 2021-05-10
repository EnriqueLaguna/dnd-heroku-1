const fs = require('fs');
const USERS_DB = require('../data/users.json');
const CloudantSDK = require('@cloudant/cloudant');
const CLOUDANT_CREDS = require('../localdev-config.json');
const cloudant = new CloudantSDK(CLOUDANT_CREDS.url);
const USERS_CLOUDANT_DB = cloudant.db.use('users');
//const passport = require('passport');
//const GoogleStrategy = require('passport-google-oauth20').Strategy;


class UsersController {

    async insertUser(user, cbOk) {
        let addedEntry = await USERS_CLOUDANT_DB.insert(user);
        if (addedEntry.ok) {
            user.rev = addedEntry.rev;
            user.uid = addedEntry.id;
            return user;
        } else {
            return;
        }
    }

    async updateUser(user) {
        let updatee = {
            userName: user.userName,
            email: user.email,
            password: user.password,
            characters: user.characters,
            image: user.image,
            _id: user.id,
            _rev: user.rev,
            token: user.token
        }
        let foundUser = await this.getUserByEmail(updatee.email)
        if (foundUser) {
            let addedEntry = await USERS_CLOUDANT_DB.insert(updatee);
            if (addedEntry.ok) {
                user.rev = addedEntry._rev;
                user.id = addedEntry._id;
                return user;
            } else {
                return;
            }
        } else {
            return;
        }
    }

    async deleteUser(user) {
        let body = await USERS_CLOUDANT_DB.destroy(user.id, user.rev)
        if (body.ok) {
            return true;
        } else {
            return false;
        }
    }


    async getList() {
        let users = new Array();
        let entries = await USERS_CLOUDANT_DB.list({
            include_docs: true
        });
        for (let entry of entries.rows) {
            users.push(entry.doc);
        }
        return users;
    }

    async getUserByCredentials(email, password) {
        const q = {
            selector: {
                email: {
                    "$eq": email
                },
                password: {
                    "$eq": password
                }
            }
        }
        let docs = await USERS_CLOUDANT_DB.find(q);
        if (docs.docs.length > 0) {
            //regresar resultado..
            let user = {
                userName: docs.docs[0].userName,
                email: docs.docs[0].email,
                password: docs.docs[0].password,
                image: docs.docs[0].image,
                characters: docs.docs[0].characters,
                id: docs.docs[0]._id,
                rev: docs.docs[0]._rev,
                token: docs.docs[0].token
            }
            return user;
        } else {
            return;
        }
    }
    async getUniqueUser(userName, password, email) {

        const q = {
            selector: {
                email: {
                    "$eq": email
                },
                userName: {
                    "$eq": userName
                },
            }
        }
        let docs = await USERS_CLOUDANT_DB.find(q);
            if (docs.docs.length > 0) {
                //regresar resultado..
                let user = {
                    userName: docs.docs[0].userName,
                    email: docs.docs[0].email,
                    password: docs.docs[0].password,
                    image: docs.docs[0].image,
                    characters: docs.docs[0].characters,
                    uid: docs.docs[0]._id,
                    rev: docs.docs[0]._rev
                }
                return user;
            } else {
                return;
            }
    }
    async getUser(id) {
        // let user = USERS_DB.find(ele=>ele.uid ===id);
        // return user;
        let user = await USERS_CLOUDANT_DB.get(id);
        return user;
    }

    async getUserByEmail(email) {

        const q = {
            selector: {
                email: {
                    "$eq": email
                }
            }
        }
        let docs = await USERS_CLOUDANT_DB.find(q)
        if (docs.docs.length > 0) {
            //regresar resultado..
            let user = {
                userName: docs.docs[0].userName,
                email:docs.docs[0].email,
                id: docs.docs[0]._id,
                password: docs.docs[0].password,
                image: docs.docs[0].image,
                characters: docs.docs[0].characters,
                rev: docs.docs[0]._rev
            }
            return user;
        } else {
            return;
        }
    }

    async getUserChars(userToken) {
        const q = {
            selector: {
                token: {
                    "$eq": userToken
                }
            }
        }
        let docs = await USERS_CLOUDANT_DB.find(q);
        if (docs.docs.length > 0) {
            //regresar resultado..
            let chars = docs.docs[0].characters;
            return chars;
        } else {
            return;
        }
    }
}

module.exports = UsersController;