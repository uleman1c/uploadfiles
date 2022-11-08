
var files = '';
var idEl = '#procent';

var uuid = '';

var numFile = 0;
var numPart = 0;
var startingByte = 0;
var endindByte = 0;

var errorCount = 0;

var upload_chunk_size = 120000;

var startTime = 0;

function onLoad() {

    numPart = numPart + 1;

    startingByte = endindByte;

    var curFile = files[numFile];

    var curTime = Date.now() / 1000;

    var delta = curTime - startTime;

    var elapsed = Math.floor((curFile.size - startingByte) / (startingByte / delta) / 60);

    var curDate = new Date();
    curDate.setMinutes(curDate.getMinutes() + elapsed);

    let formatter = new Intl.DateTimeFormat("ru", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });

    document.querySelector(idEl).innerHTML = curFile.name + ", " + Math.floor(startingByte / 1024) + " Kb, " 
        + Math.floor(startingByte * 100 / curFile.size) + "%, ошибок " + errorCount 
        + ", осталось " + elapsed + " минут, " + formatter.format(curDate);

    if (startingByte < curFile.size) {


    }
    else {

        numFile = numFile + 1;

        startingByte = 0;

    }

    sendNext();

}

function onError() {

    if (true || errorCount < 10) {

        errorCount = errorCount + 1;

        sendPartOfFile();

    }

}

function getXMLHttpRequest(){

    if('ActiveXObject' in window){
        return new ActiveXObject('Msxml2.XMLHTTP');
     }else{
        return new XMLHttpRequest();
     }    
}

function sendPartOfFile() {

    var curFile = files[numFile];

    var blob = curFile.slice(startingByte, endindByte);

    var req = getXMLHttpRequest(); //new XMLHttpRequest();

    var url = "";
    req.open("POST", url, true);
    req.setRequestHeader('id', uuid);
    req.setRequestHeader('parentid', ''); // $('#parent_id').val());
    req.setRequestHeader('filename', encodeURIComponent(curFile.name));
    req.setRequestHeader('part', numPart);
    req.setRequestHeader('size', endindByte - startingByte);
    req.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));

    req.onreadystatechange = function () { // (3)

        if (this.readyState != 4) return;

        // button.innerHTML = 'Готово!';

        if (this.status != 200) {

            setTimeout(onError, 1000);
            // alert(this.status + ': ' + this.statusText);

        } else {

            onLoad();

        }

    }

    req.send(blob);

}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function getFileUid(){

    var curFile = files[numFile];

    var req = getXMLHttpRequest(); //new XMLHttpRequest();

    var url = "";
    req.open("POST", url, false);
    req.setRequestHeader('id', uuid);
    req.setRequestHeader('parentid', ''); // $('#parent_id').val());
    req.setRequestHeader('filename', encodeURIComponent(curFile.name));
    req.setRequestHeader('part', numPart);
    req.setRequestHeader('size', endindByte - startingByte);
    req.setRequestHeader('getuid', true);
    req.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));

    req.onreadystatechange = function () { // (3)

        if (this.readyState != 4) return;

        // button.innerHTML = 'Готово!';

        if (this.status != 200) {

            //setTimeout(onError, 1000);
            // alert(this.status + ': ' + this.statusText);

        } else {

            //onLoad();

        }

    }

    req.send();

    return JSON.parse(req.response).id;

}

function sendNext() {

    if (numFile < files.length) {

        var curFile = files[numFile];

        if (startingByte == 0) {

            uuid = getFileUid();

            startTime = Date.now() / 1000;

        }

        endindByte = startingByte + upload_chunk_size;
        if (endindByte > curFile.size) {
            endindByte = curFile.size;
        }

        sendPartOfFile();


    } else {

        location.reload();

    }

}

function newUid() {
    let u = Date.now().toString(16) + Math.random().toString(16) + '0'.repeat(16);
    return [u.substr(0, 8), u.substr(8, 4), '4000-8' + u.substr(13, 3), u.substr(16, 12)].join('-');
}

function big_file_upload(f){
	
	upload_chunk_size = 120000;
	
	files = f[0].files;

    numFile = 0;

    startingByte = 0;

    sendNext();

}

function big_file_upload_files(f){
	
	upload_chunk_size = 120000;
	
	files = f;

    numFile = 0;

    startingByte = 0;

    sendNext();

}

function onSelectFile(e){

    big_file_upload(document.querySelectorAll('#inputFile'));

}
