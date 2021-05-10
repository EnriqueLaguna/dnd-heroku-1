const fs = require('fs');
const CloudantSDK = require('@cloudant/cloudant');
const CLOUDANT_CREDS = require('../localdev-config.json');
const cloudant = new CloudantSDK(CLOUDANT_CREDS.url);
const RACES_CLOUDANT_DB = cloudant.db.use('races');

class RacesController {

    async insertRace(race) {
        let addedEntry = await RACES_CLOUDANT_DB.insert(race);
        console.log(addedEntry);
        if (addedEntry.ok) {
            race.rev = addedEntry.rev;
            race.id = addedEntry.id;
            return race;
        } else {
            return;
        }
    }

    async updateRace(race) {
        console.log('update race...')
        let updatee = {
            name: race.name,
            smallDescription: race.smallDescription,
            hitDie: race.hitDie,
            primaryAbility: race.primaryAbility,
            image: race.image,
            saves: race.saves,
            logo: race.logo,
            background: race.background,
            id: race.id,
            rev: race.rev
        }
        let foundRace = await this.getRaceById(updatee.id);
        if (foundRace) {
            let addedEntry = await RACES_CLOUDANT_DB.insert(updatee);
            console.log(addedEntry);
            if (addedEntry.ok) {
                race.rev = addedEntry.rev;
                race.id = addedEntry.id;
                return race;
            } else {
                return;
            }

        } else {
            return;
        }
    }

    async deleteRace(race) {
        RACES_CLOUDANT_DB.destroy(race.id, race.rev).then((body) => {
            console.log(body);
            if (body.ok) {
                return true;
            } else {
                return false;
            }
        });
    }


    async getList() {
        let races = new Array();
        let entries = await RACES_CLOUDANT_DB.list({
            include_docs: true
        });
        for (let entry of entries.rows) {
            races.push(entry.doc);
        }
        console.log(races);
        return races;
    }

    async getRaceById(id) {
        let race = await RACES_CLOUDANT_DB.get(id);
        return race;
    }

}

module.exports = RacesController;