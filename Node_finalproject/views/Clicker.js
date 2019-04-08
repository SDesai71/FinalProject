var xhr = new window.XMLHttpRequest(),
    method = "post",
    url = "http://localhost:8080/update";

var getxhr = new window.XMLHttpRequest(),
    getmethod = "get",
    geturl = "http://localhost:8080/getstats";

class Clicker{
    //This will be the actual button that the user clicks on :)
    constructor(lvl){
        this.lvl = parseInt(lvl);
        this.nextPrice = 10*this.lvl;

        this.lvlDisplay = document.getElementById('clickerLvl');
        this.priceDisplay = document.getElementById('lvlprice');
        this.display();
        this.sender()
    }

    click(){
        clicks += this.lvl;
        total_clicks += this.lvl;
        this.display();
    }
    lvlUp(){
        if(clicks >= this.nextPrice) {
            clicks -= this.nextPrice;
            this.nextPrice += 10*this.lvl;
            this.lvl += 1;
            this.sender();
        }
    }

    sender(){
        this.lvlDisplay.innerHTML = this.lvl;
        this.priceDisplay.innerHTML = this.nextPrice;
        this.display()

    }

    display(){
    numclicks.innerHTML = clicks;
    totalclicks.innerHTML= total_clicks;
    }
}


class AutoClicker{
    //This will be the automated clickers
    constructor(lvl,price,name){
        this.lvl = lvl;
        this.nextPrice = price*this.lvl+100;
        this.interval = 5/this.lvl*1000;

        this.area = document.createElement("div");
        this.area.id = name+'autoclick';
        this.area.onclick = this.lvlUp.bind(this);

        this.lvldisplay = document.createElement("div");
        this.lvldisplay.id = name+'lvl';

        this.pricedisplay = document.createElement("div");
        this.pricedisplay.id = name+"displayprice";

        this.button = document.createElement("button");
        this.button.innerHTML = name+"LvlUp";

        this.area.append(document.createTextNode(name+" Level:"));
        this.area.append(this.lvldisplay);

        this.area.append(document.createTextNode(name+" LvlUp Price: "));
        this.area.append(this.pricedisplay);
        this.area.append(document.createElement("hr"));
        autoclickarea.append(this.area);

        this.sender();
        this.autoclicker = setInterval(this.click.bind(this), this.interval)
    }

    click(){
        if(this.lvl >= 1){
        clicks += 1;
        total_clicks += 1;
        this.display();
        }
    }

    lvlUp(){
        if(clicks >= this.nextPrice) {
            clicks -= this.nextPrice;
            this.nextPrice += 10*this.lvl;
            this.lvl += 1;
            clearInterval(this.autoclicker);
            this.interval = 5/this.lvl*1000;
            this.autoclicker = setInterval(this.click.bind(this), this.interval);
            this.sender();
        }
    }
    sender(){
        this.lvldisplay.innerHTML = this.lvl;
        this.pricedisplay.innerHTML = this.nextPrice;
        this.display()

    }
    display(){
        numclicks.innerHTML = clicks;
        totalclicks.innerHTML= total_clicks;
    }
}


var autoclickarea = document.getElementById('autoclickarea');
var numclicks = document.getElementById('clicks');
var totalclicks = document.getElementById('totalClicks');

function xhrsend(){
    xhr.open(method,url,true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    let data =
        {
            Clicks: numclicks.innerHTML,
            totalClicks: totalclicks.innerHTML,
            lvl: document.getElementById("clickerLvl").innerHTML,
            autolvl: document.getElementById("AutoClicklvl").innerHTML
        };
    xhr.send(JSON.stringify(data));
}

getscores = getxhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200){
        stats = JSON.parse(this.response);
        numclicks.innerHTML = parseInt(this.response[0].Clicks);
        document.getElementById('storedTotalClicks').value = parseInt(stats[0].totalClicks);
        document.getElementById('storedclicks').value = stats[0].Clicks;

        clicker = new Clicker(stats[0].lvl);
        Messi = new AutoClicker(parseInt(stats[0].autolvl),20,'Lionel Messi');
        Ronaldo = new AutoClicker(0,100,'Cristiano Ronaldo');
        Pogba = new AutoClicker(0,100,'Paul Pogba');
        Hazard = new AutoClicker(0,100,'Eden Hazard');
        Neymar = new AutoClicker(0,100,'Neymar');
        Zlatan = new AutoClicker(0,100,'Zlatan Ibrahimovic');
        console.log('built');

        setInterval(xhrsend, 15000);
    }
};

function xhrget() {
    getxhr.open(getmethod, geturl, true);
    getxhr.send();
}

xhrget();

let clicks = parseInt(document.getElementById('storedclicks').value);
let total_clicks = parseInt(document.getElementById('storedTotalClicks').value);
