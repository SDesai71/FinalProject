unames = '';
uscore = '';
var xhr = new window.XMLHttpRequest(),
    method = "get",
    url = "http://localhost:8080/getscores";

function xhrget() {
    xhr.open(method, url, true);
    xhr.send();
}

xhrget();

getscores = xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200){
        //console.log(this.response);
        scores = JSON.parse(this.response);


        for (var score = 0; score <= 1; score++){
            unames += scores[score].Username+"\n";
            uscore += scores[score].totalClicks+"\n";
        }
        document.getElementById('names').innerText = unames;
        document.getElementById('userscores').innerText = uscore;

        }
};

