var xhr = new window.XMLHttpRequest(),
    method = "post",
    url = "http://localhost:8080/update";

//this is where the game will be made
class Clicker{
    //This will be the actual button that the user clicks on :)
    constructor(lvl){
        this.lvl =lvl;
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

        this.lvldisplay = document.createElement("div");
        this.lvldisplay.id = name+'lvl';

        this.pricedisplay = document.createElement("div");
        this.pricedisplay.id = name+"displayprice";

        this.button = document.createElement("button");
        this.button.innerHTML = name+"LvlUp";
        this.button.onclick = this.lvlUp.bind(this);

        this.area.append(document.createTextNode(name+"Level: "));
        this.area.append(this.lvldisplay);
        this.area.append(document.createElement("br"));

        this.area.append(document.createTextNode(name+"LvlUpPrice: "));
        this.area.append(this.pricedisplay);
        this.area.append(document.createElement("br"));
        this.area.append(this.button);
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


let clicks = parseInt(document.getElementById('storedclicks').value);
let total_clicks = parseInt(document.getElementById('storedTotalClicks').value);
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

setInterval(xhrsend, 15000);