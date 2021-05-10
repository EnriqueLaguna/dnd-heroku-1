'use strict';
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const morgan = require('morgan');
const axios = require('axios').default;

const verify = require('./auth/google');

const passport = require('passport');


const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');


const app = express();

//load middleware
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: ['clave'] //clave para encriptar
  }))
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}))
app.use(cors());
app.use(morgan('tiny'));

app.use(passport.initialize());
app.use(passport.session());

require('dotenv').config();
require('./config/passport');

//Controllers
const usersRouter = require('./routes/usersRoutes');
const UsersController = require('./controllers/usersController');

const classesRouter = require('./routes/classesRoutes');
const racesRouter = require('./routes/racesRoutes');
const charRouter = require('./routes/charRoutes');
const loginRouter = require('./routes/loginRoute');

const PORT = process.env.PORT || 3000;
const SECRET_JWT = process.env.SECRET_JWT || 'h@la123Cr@yola';

/*
async function authentication(req, res, next) {
    let xauth = req.get('x-auth-user');
    if (xauth) {
        let token = jwt.verify(xauth, SECRET_JWT);
        let id = token.id;
        let userctrl = new UsersController();
        try {
            let user = await userctrl.getUser(id);
            if (user && user.token === xauth) {
                next();
            } else {
                res.status(401).send('Not authorized');
            }
        } catch (error) {
            console.log(error);
        }
    } else {
        res.status(401).send('Not authorized');
    }
}
*/
//app.use('/api/users',authentication,usersRouter);
app.use('/api/users', usersRouter);
app.use('/api/classes', classesRouter);
app.use('/api/races', racesRouter);
app.use('/api/characters', charRouter);

/**
 * Un simple comentario para chechar Git
 */
app.use((req, res, next) => {
    if(req.header('Authorization')) {
        req.token = req.header('Authorization').replace('Bearer', '');
        return next();
    }
    res.status(401).send('401 Unathorized 1');
})
app.use(async (req, res, next) => {
    let uCntrl = new UsersController();
    try{
        const response = await axios.get(`http://oauth2.googleapis.com/tokeninfo?id_token=${req.token}`);
        const user = await uCntrl.getUserByEmail(response.data.email);
        if(!!user){
            return next();
        }
        if(req.originalUrl.includes('/api/login')){
            console.log('Llego aqui');
            await uCntrl.insertUser(response.data);
            return next();
        }
        res.status(401).send('401 Unauthorized 2');
    }catch (err){
        res.send(err);
    }
});

app.post('/api/login', loginRouter);

/*
app.post('/api/login', async (req, res) => {
    if (req.body.email && req.body.password) {
        let uctrl = new UsersController();
        let user = await uctrl.getUserByCredentials(req.body.email, req.body.password);
        if (user) {
            let token = jwt.sign({
                "id": user.id
            }, SECRET_JWT);
            user.token = token;
            let userLogin = await uctrl.updateUser(user);
            res.status(200).send({
                "token": userLogin.token
            });
        } else {
            res.status(401).send('Wrong credentials');
        }
    } else {
        res.status(400).send('Missing user/pass');
    }
});


app.get('/api/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

app.get('/api/google/callback', passport.authenticate('google', {
    failureRedirect: '/'
}), (req, res) => {
    //console.log("Profile ABAJO");
    //console.log(req.user)
    res.set('user', req.user);
    res.redirect('/characters.html');
});


app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
})
*/
// app.get('/',(req,res)=>{
//     res.send('Users app práctica 4');
// });


app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
})