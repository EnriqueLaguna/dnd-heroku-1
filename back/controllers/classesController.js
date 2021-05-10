const fs = require('fs');
const CloudantSDK = require('@cloudant/cloudant');
const CLOUDANT_CREDS = require('../localdev-config.json');
const cloudant = new CloudantSDK(CLOUDANT_CREDS.url);
const CLASSES_CLOUDANT_DB = cloudant.db.use('classes');

class ClassesController {

    async insertClass(dndclass) {
        let addedEntry = await CLASSES_CLOUDANT_DB.insert(dndclass);
        console.log(addedEntry);
        if (addedEntry.ok) {
            dndclass.rev = addedEntry.rev;
            dndclass.id = addedEntry.id;
            return dndclass;
        } else {
            return;
        }
    }

    async updateClass(dndclass) {
        console.log('update class...')
        let updatee = {
            name: dndclass.name,
            smallDescription: dndclass.smallDescription,
            hitDie: dndclass.hitDie,
            primaryAbility: dndclass.primaryAbility,
            image: dndclass.image,
            saves: dndclass.saves,
            logo: dndclass.logo,
            background: dndclass.background,
            id: dndclass.id,
            rev: dndclass.rev
        }
        let foundClass = await this.getClassById(updatee.id);
        if (foundClass) {
            let addedEntry = await CLASSES_CLOUDANT_DB.insert(updatee);
            console.log(addedEntry);
            if (addedEntry.ok) {
                dndclass.rev = addedEntry.rev;
                dndclass.id = addedEntry.id;
                return dndclass;
            } else {
                return;
            }

        } else {
            return;
        }
    }

    async deleteClass(user) {
        CLASSES_CLOUDANT_DB.destroy(user.id, user.rev).then((body) => {
            console.log(body);
            if (body.ok) {
                return true;
            } else {
                return false;
            }
        });
    }


    async getList() {
        let classes = new Array();
        let entries = await CLASSES_CLOUDANT_DB.list({
            include_docs: true
        });
        for (let entry of entries.rows) {
            classes.push(entry.doc);
        }
        console.log(classes);
        return classes;
    }

    async getClassById(id) {
        let dndclass = await CLASSES_CLOUDANT_DB.get(id);
        return dndclass;
    }

}

module.exports = ClassesController;