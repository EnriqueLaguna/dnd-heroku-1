'use strict';
const express = require('express');
const UsersController = require('../controllers/usersController');
const usersCtrl = new UsersController();
const router = express();

router.post('/', async (req, res) => {
    let b = req.body;
    console.log(b.email);
    if (b.userName && b.email) {
        let u = await usersCtrl.getUserByEmail(b.email);
        console.log(u);
        if (u) {
            res.status(400).send('user already exists');
        } else {
            usersCtrl.insertUser(b, (user) => {
                res.status(201).send(user);
            });
        }


    } else {
        res.status(400).send('missing arguments');
    }
});

router.get('/', async (req, res) => {
    let userCtrl = new UsersController();
    let users = await userCtrl.getList();
    console.log('users: ' + users);
    /*if (req.query.name || req.query.lastname) {
        let nom = (req.query.name) ? req.query.name : '';
        let ap = (req.query.lastname) ? req.query.lastname : '';
        users = users.filter((ele, index, arr) => {
            let isMatch = true;
            if (nom) {
                isMatch &= ele.nombre.toUpperCase().includes(nom.toUpperCase())
            }
            if (ap) {
                isMatch &= ele.apellidos.toUpperCase().includes(ap.toUpperCase())
            }
            return isMatch;
        });
    }*/
    res.send({
        content: users
    });

});

router.get('/:email', async (req, res) => {
    let userCtrl = new UsersController();
    let users = await userCtrl.getList();
    if(req.params.email){
        let user = users.find(ele=> ele.email === req.params.email);
        if(user){
            res.send(user);
        }else{
            res.set('Content-Type','application/json');
            res.status(204).send({});
        }
    }else{
        res.status(400).send('missing params');
    }
});



router.put('/:email', async (req, res) => {
    let b = req.body;
    //console.log(b);
    //console.log(req.params.email);
    if (req.params.email && (b.userName || b.apellidos || b.password || b.fecha)) {
        let u = await usersCtrl.getUserByEmail(b.email);
        if (u) {
            //b.uid = u.uid;
            b._id = u._id;
            Object.assign(u, b);
            res.status(200).send(usersCtrl.updateUser(u));
        } else {
            res.status(404).send('user does not exist');
        }
    } else {
        res.status(400).send('missing arguments');
    }
});

router.delete('/:email', async (req, res) => {
    if (req.params.email) {
        let u = await usersCtrl.getUserByEmail(req.params.email);
        console.log("USERFOUND:");
        console.log(u);
        if (u) {
            res.status(200).send({
                "deleted": await usersCtrl.deleteUser(u)
            });
        } else {
            res.status(404).send('user does not exist');
        }
    } else {
        res.status(400).send('missing arguments');
    }
});

module.exports = router;