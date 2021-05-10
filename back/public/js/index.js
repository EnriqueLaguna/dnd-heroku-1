const HTTTPMethods = {
    "put": "PUT",
    "post": "POST",
    "get": "GET",
    "delete": "DELETE"
}
const APIURL = window.location.protocol + '//' + window.location.host + '/api';
let TOKEN = getTokenValue('token');

function getTokenValue(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function sendHTTPRequest(urlAPI, data, method, cbOK, cbError, authToken) {
    // 1. Crear XMLHttpRequest object
    let xhr = new XMLHttpRequest();
    // 2. Configurar:  PUT actualizar archivo
    xhr.open(method, urlAPI);
    // 3. indicar tipo de datos JSON
    xhr.setRequestHeader('Content-Type', 'application/json');
    if (authToken)
        xhr.setRequestHeader('x-auth-user', authToken);
    // 4. Enviar solicitud al servidor
    xhr.send(data);
    // 5. Una vez recibida la respuesta del servidor
    xhr.onload = function () {
        if (xhr.status != 200 && xhr.status != 201) { // analizar el estatus de la respuesta HTTP 
            // Ocurrió un error
            cbError(xhr.status + ': ' + xhr.statusText);
        } else {
            console.log(xhr.responseText); // Significa que fue exitoso
            cbOK({
                status: xhr.status,
                data: xhr.responseText
            });
        }
    };
}

function googleLogin(){
    console.log('Login with google...');
    /*
    const googleLogin = document.querySelector('#google-login');
    googleLogin.addEventListener('click', () => window.location.replace(APIURL+"/users/google",HTTTPMethods.get, (res) => {
        setCookie('token', JSON.parse(res.data)['token'], 10);
        alert("Bienvenido con Google");
        console.log(res);
    }, (res) => {
        console.log('Error con google');
    }));
    
   sendHTTPRequest(APIURL+"/google", null, HTTTPMethods.get, (res) => {
        consolel.log(res);
        setCookie('token', JSON.parse(res.data)['token'], 10);
        alert('Bienvenido con google');
    }, (res) => {
        console.log('Algo salio mal con google');
    })
   */
    window.location.replace(APIURL+"/google");
};

function login() {
    console.log('login...');
    let userdata = {
        "email": $('#loginEmail').val(),
        "password": $('#loginPassword').val()
    };
    console.log(userdata);
    sendHTTPRequest(APIURL+"/login", JSON.stringify(userdata), HTTTPMethods.post, (res) => {
        setCookie('token', JSON.parse(res.data)['token'], 10);
        alert("Bienvenid@");
        console.log(res);
        //window.location.href = "/characters.html";
    }, (res) => {
        console.log("Ocurrio un error");
    });
}

function createUser() {
    console.log('Called createUser');
    let userdata = {
        "userName": $("#UserName").val(),
        "email": $("#regEmail").val(),
        "password": $("#password1").val(),
        "image": $("#Image").val(),
        "characters": [],
        "googleOauth":false
    }
    console.log(userdata);
    sendHTTPRequest(APIURL+"/users", JSON.stringify(userdata), HTTTPMethods.post, (res) => {
        console.log(res);
        alert("El usuario se creo correctamente");
        $('#registerModal').modal('hide');
    }, (res) => {
        alert("Hubo un error");
        console.log(res);
    }, getTokenValue('token'));

}



document.addEventListener('DOMContentLoaded', () => {
    
    $('#LoginForm').on('change', function (event) {
        if ($('#loginPassword').val().length > 0 && $('#loginEmail')[0].validity.valid) {
            $('#responseMSG').html('<p style="color:green">Todo correcto!</p>');
            $('#LoginBtn').prop('disabled', false);
        } else {
            $('#responseMSG').html('<p style="color:red">Te faltan datos</p>');
        }
    });

    $('#google-login').on('click', (event) =>{
        event.preventDefault();
        console.log('Si da el click');
        googleLogin();
    })

    $('#LoginForm').on('submit', function (event) {
        event.preventDefault();
        login();
    });

    $('#createUserForm').on('submit', function(event){
        event.preventDefault();
    });

    $('#createUserBtn').on('click', function(event) {
        createUser();
    });

    $('#createUserForm').on('change', function (event) {
        if (!($('#createUserForm input').toArray().some(elem => !elem.checkValidity()))) {
            //Validar contrasenias
            if ($('#password1').val() == $('#password2').val()) {
                $('#responseMSG').html('<p style="color:green">Todo correcto!</p>');
                $('#createUserBtn').prop('disabled', false);
            } else {
                $('#createUserBtn').prop('disabled', true);
                $('#responseMSG').html('<p style="color:red">Las contrasenias no coinciden</p>');
            }
        } else {
            $('#createUserBtn').prop('disabled', true);
            $('#responseMSG').html('<p style="color:red">Te faltan datos</p>');
        }
    });

    $('#createFormModal').on('show.bs.modal', function (event) {
        // console.log(event.relatedTarget);
        //agrega tu codigo...
    });


});