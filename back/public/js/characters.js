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

const dndCharToHTML = (dndclass, index) => {
    let carousel_class = index > 2 ? "hideRight":
                         index == 2 ? "nextRightSecond" :
                         index == 1 ? "next" :
                         "selected";
    return `
    <div class="${carousel_class}">
        <div class="row flex-nowrap">
            <div class="col pr-0">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-KKvhV7Ld_K0NGPPY9DnD0ufixXEFvsfafQ&usqp=CAU" class="img-fluid rounded" alt="">
            </div>
            <div class="col-auto pl-0">
                <div class="card text-white bg-dark">
                    <div class="card-body overflow-auto">
                        <h4 class="card-title">${dndclass.Name}</h4>
                        <p class="card-text">${dndclass.race}<br>HP: 18</p>
                    </div>
                </div>
                <p class="back-img" hidden>https://cdn.wallpapersafari.com/57/97/rXi8wK.jpg</p>
            </div>
        </div>
    </div>`
}

const dndCharListToHTML = (list, id) => {
    if (id && list && document.getElementById(id)) {
        document.getElementById(id).innerHTML = list.map(dndCharToHTML).join('\n');
    }
}

function getUserChars() {
    let url = APIURL + "/characters";
    let tok = {
        "token": TOKEN
    };
    console.log('Getting user chars...')
    console.log(tok);
    sendHTTPRequest(url, JSON.stringify(tok), HTTTPMethods.get, (res) => {
        let data = JSON.parse(res.data)
        console.log(data);
        dndCharListToHTML(data['content'], 'carousel');
    }, (res) => {
    }, getTokenValue('token'));
}

//Carousel
function moveToSelected(element) {
    classes = [
        "prev",
        "next",
        "selected",
        "nextRightSecond",
        "prevLeftSecond",
        "hideRight",
        "hideLeft"
]

    if (element == "next") {
        var selected = $("#carousel > .selected").next();
    } else if (element == "prev") {
        var selected = $("#carousel > .selected").prev();
    } else {
        var selected = element;
    }

    setBg(selected.find('div div .back-img')[0].innerHTML);

    var next = $(selected).next();
    var prev = $(selected).prev();
    var prevSecond = $(prev).prev();
    var nextSecond = $(next).next();

    $(selected).removeClass(classes).addClass('selected');

    $(prev).removeClass(classes).addClass('prev');
    $(next).removeClass(classes).addClass('next');

    $(nextSecond).removeClass(classes).addClass("nextRightSecond");
    $(prevSecond).removeClass(classes).addClass("prevLeftSecond");

    $(nextSecond).nextAll().removeClass(classes).addClass('hideRight');
    $(prevSecond).prevAll().removeClass(classes).addClass('hideLeft');

}

function setBg(url) {
    $("body").css('background-image', 'url(' + url + ')')
}

document.addEventListener('DOMContentLoaded', () => {

    getUserChars();


    // Carousel Events
    $(document).keydown(function (e) {
        switch (e.which) {
            case 37: // left
                moveToSelected('prev');
                break;

            case 39: // right
                moveToSelected('next');
                break;

            default:
                return;
        }
        e.preventDefault();
    });

    $('#carousel > div').click(function () {
        moveToSelected($(this));
    });

    $('#prev').click(function () {
        moveToSelected('prev');
    });

    $('#next').click(function () {
        moveToSelected('next');
    });

    


});