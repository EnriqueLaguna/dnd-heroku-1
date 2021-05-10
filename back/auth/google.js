const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client('836913044846-ls2l7u9je50neg42ckknff67mrop9mda.apps.googleusercontent.com');
async function verify(){
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: '836913044846-ls2l7u9je50neg42ckknff67mrop9mda.apps.googleusercontent.com',

    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
}
module.exports = {
    verify
}