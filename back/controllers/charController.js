const fs = require('fs');
const USERS_DB = require('../data/users.json');
const CloudantSDK = require('@cloudant/cloudant');
const CLOUDANT_CREDS = require('../localdev-config.json');
const cloudant = new CloudantSDK(CLOUDANT_CREDS.url);
const USERS_CLOUDANT_DB = cloudant.db.use('users');
let CURRENT_ID = 0;


let uids = USERS_DB.map((obj) => {
    return obj.uid
});
CURRENT_ID = Math.max(...uids) + 1;
console.log(`Current id: ${CURRENT_ID}`);
// console.table(USERS_DB);

class CharsController {

    async insertUser(user, cbOk) {
        // user.uid = this.generateId();
        // USERS_DB.push(user);
        // return user;
        //user.password = bcrypt.hashSync(user.password,5);
        USERS_CLOUDANT_DB.insert(user).then((addedEntry) => {
            console.log(addedEntry);
            if (addedEntry.ok) {
                user.rev = addedEntry.rev;
                user.uid = addedEntry.id;
                cbOk(user);
            } else {
                cbOk();
            }
        }).catch((error) => {
            cbOk(null, error);
        });
    }

    async updateUser(user, cbOk) {
        console.log('update user...')
        let updatee = {
            userName: user.userName,
            email: user.email,
            password: user.password,
            characters: user.characters,
            image: user.image,
            _id: user.uid,
            _rev: user.rev,
            token: user.token
        }
        this.getUserByEmail(updatee.email, (foundUser) => {
            if (foundUser) {
                USERS_CLOUDANT_DB.insert(updatee).then((addedEntry) => {
                    console.log(addedEntry);
                    if (addedEntry.ok) {
                        user.rev = addedEntry.rev;
                        user.uid = addedEntry.id;
                        cbOk(user);
                    } else {
                        cbOk();
                    }
                }).catch((error) => {
                    cbOk(null, error);
                });
            } else {
                cbOk();
            }
        })
    }

    async deleteUser(user) {
        USERS_CLOUDANT_DB.destroy(user.id, user.rev).then((body) => {
            console.log(body);
            if (body.ok) {
                return true;
            } else {
                return false;
            }
        });
    }

    async getUser(id) {
        let user = await USERS_CLOUDANT_DB.get(id);
        return user;
    }
    async getUserEmail(userEmail){
        const q = {
            selector: {
                email: userEmail
            }
        }
        let user = await USERS_CLOUDANT_DB.find(q);
        console.log(user);
    }

    async getList(userToken) {
        const q = {
            selector: {
                token:  userToken
                }
            }
        let docs = await USERS_CLOUDANT_DB.find(q)
        if (docs.docs.length > 0) {
            //regresar resultado..
            let chars = docs.docs[0].characters;
            return chars;
        } else {
            return;
        }
    }
}

module.exports = CharsController;