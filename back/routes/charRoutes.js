'use strict';
const express = require('express');
const CharsController = require('../controllers/charController');
const charsCtrl = new CharsController();
const router = express();

router.get('/', async (req, res) => {
    let chars = await charsCtrl.getList(req.body.token);
    res.send({content:chars});

});

router.get('/:id', async (req,res)=>{
    let races = await charsCtrl.getList();
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

router.post('/', async(req, res) => {
    let b = req.body;
    console.log(b);
    res.status(200).send(b);
})

router.put('/:id', async (req,res)=>{
    let b = req.body;
    if (req.params.email && (b.nombre || b.apellidos || b.password  || b.fecha)) {
        let u = await charsCtrl.getClassById(b.email);
        if (u) {
            b.uid = u.uid;
            Object.assign(u,b);
            res.status(200).send(charsCtrl.updateUser(u));
        } else {
            res.status(404).send('user does not exist');
        }
    } else {
        res.status(400).send('missing arguments');
    }
});

router.delete('/:id', async (req,res)=>{
    if (req.params.email) {
        let u = await charsCtrl.getClassById(req.params.email);
        console.log("USERFOUND:");
        console.log(u);
        if (u) {
            res.status(200).send({"deleted":await charsCtrl.deleteClass(u)});
        } else {
            res.status(404).send('user does not exist');
        }
    } else {
        res.status(400).send('missing arguments');
    }
});
module.exports = router;