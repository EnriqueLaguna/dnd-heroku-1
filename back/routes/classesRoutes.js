'use strict';
const express = require('express');
const ClassesController = require('../controllers/classesController');
const classesCtrl = new ClassesController();
const router = express();

router.get('/', async (req, res) => {
    let classes = await classesCtrl.getList();
    console.log('classes: '+classes);
    res.send({content:classes});

});

router.get('/:id',async (req,res)=>{
    let classes = classesCtrl.getList();
    console.table(classes);
    res.status(200).send(JSON.stringify(classes))
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
        let u = classesCtrl.getClassById(b.email);
        if (u) {
            b.uid = u.uid;
            Object.assign(u,b);
            res.status(200).send(classesCtrl.updateUser(u));
        } else {
            res.status(404).send('user does not exist');
        }
    } else {
        res.status(400).send('missing arguments');
    }
});

router.delete('/:id', async (req,res)=>{
    if (req.params.email) {
        let u = await classesCtrl.getClassById(req.params.email);
        console.log("USERFOUND:");
        console.log(u);
        if (u) {
            res.status(200).send({"deleted":await classesCtrl.deleteClass(u)});
        } else {
            res.status(404).send('user does not exist');
        }
    } else {
        res.status(400).send('missing arguments');
    }
});
module.exports = router;