'use strict';
const express = require('express');
const RacesController = require('../controllers/racesController');
const RacesCtrl = new RacesController();
const router = express();

router.get('/', async (req, res) => {
    let races = await RacesCtrl.getList();
    console.log('Races: '+races);
    res.send({content:races});

});

router.get('/:id',async (req,res)=>{
    let races = RacesCtrl.getList();
    console.table(races);
    res.status(200).send(JSON.stringify(races))
    /*
    if(req.params.email){
        users = users.find(ele=> ele.email === req.params.email);
        if(users){
            res.send(users);
        }else{
            res.set('Content-Type','application/json');
            res.status(204).send({});
        }
    }else{
        res.status(400).send('missing params');
    }*/
});

router.put('/:id',async (req,res)=>{
    let b = req.body;
    if (req.params.email && (b.nombre || b.apellidos || b.password  || b.fecha)) {
        let u = RacesCtrl.getClassById(b.email);
        if (u) {
            b.uid = u.uid;
            Object.assign(u,b);
            res.status(200).send(RacesCtrl.updateUser(u));
        } else {
            res.status(404).send('user does not exist');
        }
    } else {
        res.status(400).send('missing arguments');
    }
});

router.delete('/:id', async (req,res)=>{
    if (req.params.email) {
        let u = await RacesCtrl.getClassById(req.params.email);
        console.log("USERFOUND:");
        console.log(u);
        if (u) {
            res.status(200).send({"deleted":await RacesCtrl.deleteClass(u)});
        } else {
            res.status(404).send('user does not exist');
        }
    } else {
        res.status(400).send('missing arguments');
    }
});
module.exports = router;