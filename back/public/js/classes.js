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

function sendHTTPRequest(urlAPI, data, method, cbOK, cbError) {
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



const dndClassToHTML = (dndclass, index) => {
    let carousel_class = index > 2 ? "hideRight":
                         index == 2 ? "nextRightSecond" :
                         index == 1 ? "next" :
                         "selected";
    return `
    <div class="${carousel_class}">
        <div class="card text-white bg-dark text-center">
            <img src="${dndclass.logo}"
                class="card-img-top" alt="Barbarian">
            <div class="card-body">
                <h5 class="card-title">${dndclass.name}</h5>
                <p class="card-text">${dndclass.smallDescription}</p>
                <a href="./classDetail.html" class="btn btn-primary">View Detail</a>
                <p class="back-img" hidden>${dndclass.background}</p>
            </div>
        </div>
    </div>`
}

const dndClassListToHTML = (list, id) => {
    if (id && list && document.getElementById(id)) {
        document.getElementById(id).innerHTML = list.map(dndClassToHTML).join('\n');
    }
}

function getClasses() {
    let url = APIURL + "/classes";
    sendHTTPRequest(url, null, HTTTPMethods.get, (res) => {
        let data = JSON.parse(res.data)
        dndClassListToHTML(data['content'], 'carousel');
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

    getClasses();

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

    $('#filterClass').on('change', function (event) {
        let names = [];
        let order = [];
        $.each($('.card-title'), function (index, item){
            names.push(item.innerText);
        });
        $.each($('#carousel>div'), function (index, item){
            order.push(item.className);
        });
        let current = order.indexOf('selected');
        let find = names.findIndex(el => el.toLowerCase().startsWith( $('#filterClass').val().toLowerCase() ));
        find = find >= 0 ? find: current;
        console.log(current - find);
        
        for (let i = current - find; i != 0; i < 0 ? i++: i--) {
            if (i > 0) {
                moveToSelected('prev');
            } else {
                moveToSelected('next');
            }
        }
    });
});