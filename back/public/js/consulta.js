const HTTTPMethods = {
    "put": "PUT",
    "post": "POST",
    "get": "GET",
    "delete": "DELETE"
}
const APIURL = window.location.protocol + '//' + window.location.host + '/api';
let TOKEN = getTokenValue('token');
let PAGES = {
    current: 1,
    maxIndex: 1
};
let NAME_FILTER = '';

let deleteEvent = '';
let updateEvent = '';

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

function sendHTTPRequest(urlAPI, data, method, cbOK, cbError, ) {
    // 1. Crear XMLHttpRequest object
    let xhr = new XMLHttpRequest();
    // 2. Configurar:  PUT actualizar archivo
    xhr.open(method, urlAPI);
    // 3. indicar tipo de datos JSON
    xhr.setRequestHeader('Content-Type', 'application/json');
    //console.log(TOKEN);
    xhr.setRequestHeader('x-auth-user', TOKEN);
    // 4. Enviar solicitud al servidor
    xhr.send(data);
    // 5. Una vez recibida la respuesta del servidor
    xhr.onload = function () {
        if (xhr.status != 200) { // analizar el estatus de la respuesta HTTP 
            // Ocurrió un error
            alert(xhr.status + ': ' + xhr.statusText); // e.g. 404: Not Found
            cbError(xhr.status + ': ' + xhr.statusText);
        } else {
            // console.log(xhr.responseText); // Significa que fue exitoso
            cbOK({
                status: xhr.status,
                data: xhr.responseText
            });
        }
    };
}



const userToHTML = (user) => {
    return `
    <div class="media col-8 mt-2">
        <div class="media-body">
                <h4>${user.nombre} ${user.apellidos}</h4>
                <p >Correo: ${user.email}</p>
            </div>
        <div class="media-right align-self-center">
            <div class="row">
                <div class="btn btn-primary" data-user='${JSON.stringify(user)}' > <a class="text-white" href="detalle.html?email=${user.email}"><i class="fas fa-search"></i></a></div>
            </div>
            <div class="row">
                <div class="btn btn-primary "data-user='${JSON.stringify(user)}' data-toggle="modal" data-target="#updateFormModal"><i class="fas fa-pencil-alt edit"></i></div>
            </div>
            <div class="row">
                <div class="btn btn-primary mt-2" data-toggle="modal" data-target="#deleteFormModal"  data-email="${user.email}"><i class="fas fa-trash-alt remove "></i></div>
            </div>
        </div>
    </div>`
}
const userListToHTML = (list, id) => {
    if (id && list && document.getElementById(id)) {
        document.getElementById(id).innerHTML = list.map(userToHTML).join('');
    }
}

function activatePagination(l1, l5) {
    if (l1) $('.page-item:nth-child(1)').prop("class", "page-item");
    else $('.page-item:nth-child(1)').prop("class", "page-item disabled");
    if (l5) $('.page-item:nth-child(5)').prop("class", "page-item");
    else $('.page-item:nth-child(5)').prop("class", "page-item disabled");
}

function activateFocus(l1, l2, l3) {
    if (l1) $('.page-item:nth-child(2)').prop("class", "page-item active");
    else $('.page-item:nth-child(2)').prop("class", "page-item");
    if (l2) $('.page-item:nth-child(3)').prop("class", "page-item active");
    else $('.page-item:nth-child(3)').prop("class", "page-item");
    if (l3) $('.page-item:nth-child(4)').prop("class", "page-item active");
    else $('.page-item:nth-child(4)').prop("class", "page-item");
}

function updateUser(ele) {
    console.log('updateUser');
    updateEvent['nombre'] = $("input[name='nombre']").val();
    updateEvent['apellidos'] = $("input[name='apellidos']").val()
    updateEvent['password'] = $("input[name='password1']").val()
    updateEvent['fecha'] = $("input[name='fecha']").val()
    updateEvent['image'] = $("input[name='image']").val()
    sendHTTPRequest(
        '/api/users/' + updateEvent.email,
        JSON.stringify(updateEvent),
        HTTTPMethods.put,
        (res) => {
            alert("Usuario modificado");
            getUsersPage(PAGES.current, NAME_FILTER);
        }, (res) => {
            alert("Hubo un error");
        }, getTokenValue('token')
    )
}

//Lixto
function deleteUser(ele) { 
    console.log('deleteUser');
    console.log(ele.getAttribute('data-email'));
    sendHTTPRequest(
        '/api/users/' + ele.getAttribute('data-email'),
        null,
        HTTTPMethods.delete, (res) => {
            alert("Usuario eliminado");
            getUsersPage(PAGES.current, NAME_FILTER);
        }, (res) => {
            alert("Hubo un error");
        }, getTokenValue('token')
    );
}

function getUsersPage(page, filter) {
    console.log("Pagina: " + page);
    let nfilter = (filter) ? `${filter}` : '';
    let url = APIURL + "/users?page=" + page + "&limit=3" + nfilter;
    sendHTTPRequest(url, null, HTTTPMethods.get, (res) => {
        let data = JSON.parse(res.data)
        userListToHTML(data['content'], 'lista');
        PAGES.maxIndex = data['totalPages'];
    }, (res) => {

    }, getTokenValue('token'));
}


document.addEventListener('DOMContentLoaded', () => {
    getUsersPage(1, NAME_FILTER);

    let filterInput = document.getElementById('filterInput');
    filterInput.addEventListener('change', (e) => {
        NAME_FILTER = `&name=${e.target.value}`;
        getUsersPage(PAGES.current, NAME_FILTER);
    });

    activatePagination(false, true);

    //Lixto calixto
    $('.page-item').on('click', function (event) {
        if (PAGES.maxIndex <= 1) {
            activatePagination(false, false);
            return 0;
        }

        if (event.currentTarget.className.split(" ").slice(-1) != 'disabled') {
            //Reset page indicator
            activateFocus(false, false, false)

            //Page control
            switch (event.target.innerHTML) {
                case "Previous":
                    PAGES.current--;
                    getUsersPage(PAGES.current, NAME_FILTER);
                    break;
                case "Next":
                    PAGES.current++;
                    getUsersPage(PAGES.current, NAME_FILTER);
                    break;
                default:
                    PAGES.current = parseInt(event.target.innerHTML);
                    getUsersPage(PAGES.current, NAME_FILTER);
            }

            //Disable buttons on ends of list
            if (PAGES.current == 1) {
                activatePagination(false, true);
                activateFocus(true, false, false);
            } else if (PAGES.current == PAGES.maxIndex) {
                activatePagination(true, false);
                activateFocus(false, false, true);
            } else {
                activatePagination(true, true);
            }

            if ((PAGES.current > 1) && (PAGES.current < PAGES.maxIndex)) {
                $('.page-item:nth-child(2) > a').html(PAGES.current - 1);
                $('.page-item:nth-child(3) > a').html(PAGES.current);
                $('.page-item:nth-child(4) > a').html(PAGES.current + 1);
                activateFocus(false, true, false);
            }
        }

    });


    $('.btn.btn-danger').on('click', function (event) {
        deleteUser(deleteEvent);
    });

    $('.btn.btn-success').on('click', function (event) {
        updateUser(updateEvent);
    });

    $('#deleteFormModal').on('show.bs.modal', function (event) {
        console.log(event.relatedTarget);
        deleteEvent = event.relatedTarget;
    });

    $('#updateFormModal').on('show.bs.modal', function (event) {
        // console.log(event.relatedTarget);
        let user = JSON.parse(event.relatedTarget.getAttribute('data-user'));

        //Get user
        sendHTTPRequest(
            '/api/users/' + user.email,
            null,
            HTTTPMethods.get,
            (res) => {
                let data = JSON.parse(res.data);
                console.log(data);
                updateEvent = user;
                $("input[name='nombre']").val(data.nombre);
                $("input[name='apellidos']").val(data.apellidos);
                $("input[name='password1']").val(data.password);
                $("input[name='password2']").val(data.password);
                $("input[name='fecha']").val(data.fecha);
                $("input[name='image']").val(data.image);

            }, (res) => {
                alert("Hubo un error");
            }, getTokenValue('token')
        );

    });



});