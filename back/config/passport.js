const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const userController = require('../controllers/usersController');

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: 'http://localhost:3000/api/google/callback',
        },
        function(accessToken, refreshToken, profile, done){
            done(null, profile);
        }
    )
);

passport.serializeUser(async function (user, done){
    console.log('Llego a la serializacion');
    let insertedUser = {
        "userName":user.name.givenName,
        "email":user.emails[0].value,
        "password":"",
        "characters":[],
        "image":user.photos[0].value,
        "googleOauth": true
    };

    
    const userContr = new userController();
    const userExist = await userContr.getUserByEmail(insertedUser.email);

    if(userExist == undefined){
        await userContr.insertUser(insertedUser);
    }

    console.log(insertedUser);
    done(null, insertedUser.email);
});                                                                               

passport.deserializeUser( async function (userEmail, done){
    console.log('Deserializacion');
    const userContr = new userController()
    console.log(userEmail);
    let fetchedUser = await userContr.getUserByEmail(userEmail);
    console.log(fetchedUser);
    if(fetchedUser != undefined){
        done(null, fetchedUser);
    }else{
        done(null);
    }
   
    
});