var num = -1;
var befNum = -1;
var time = 0;
var pb = "";

function startGame() {
    var frame = document.getElementById("game");
    frame.innerHTML = "";
    var thing = "";
    num = getRandNum();
    befNum = num;
    thing += "<a id=\"randNum\">" + num + "</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
    thing += "<a id=\"lastOp\"></a><br><br><br>";
    thing += "<a id=\"button\" class=\"change\" onclick=\"double()\">Double</a>&nbsp;";
    thing += "<a id=\"button\" class=\"change\" onclick=\"half()\">Half</a>&nbsp;";
    thing += "<a id=\"button\" class=\"change\" onclick=\"square()\">Square</a>&nbsp;";
    thing += "<a id=\"button\" class=\"change\" onclick=\"root()\">Root</a>&nbsp;";
    thing += "<a id=\"button\" class=\"change\" onclick=\"floor()\">Floor</a>&nbsp;";
    thing += "<a id=\"button\" class=\"change\" onclick=\"ceil()\">Ceil</a><br><br><br>";
    thing += "<a id=\"button\" class=\"change\" onclick=\"addCross()\">Add cross sum</a>&nbsp;";
    thing += "<a id=\"button\" class=\"change\" onclick=\"subCross()\">Subtract cross sum</a>&nbsp;";
    frame.insertAdjacentHTML("beforeend", thing);
    var date = new Date();
    time = date.getTime();
}

function win() {
    var items = document.getElementsByClassName("change");
    for (var i = 0; i < items.length; i++) {
        items.item(i).onclick = null;
    }
    var date = new Date();
    var now = date.getTime();
    time = now - time;
    var hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((time % (1000 * 60)) / 1000);
    var millis = Math.floor(time % 1000);
    console.log(hours + ", " + minutes + ", " + seconds + ", " + millis);
    newPB = (hours != 0 ? (hours + ":") : "") + (minutes >= 10 ? minutes : ("0" + minutes)) + ":" + (seconds >= 10 ? seconds : ("0" + seconds)) + ":" + millis;
    if (isNewPB(newPB)) {
        pb = newPB;
        localStorage.setItem("42pb", pb);
        document.getElementById("pb").innerHTML = "Personal best: " + pb;
    }
    document.getElementById("game").insertAdjacentHTML("beforebegin", "<a id=\"win\" style=\"font-size:42px;color:green;\">WIN</a>");
    document.getElementById("game").insertAdjacentHTML("beforeend", "<br><br><br><a id=\"button\" onclick=\"reset()\">Done</a>");
}

function isNewPB(newPB) {
    if (pb == "--") return true;
    var split = pb.split(":");
    var nSplit = newPB.split(":");
    if (split.length > nSplit.length) return true;
    if (split.length < nSplit.length) return false;
    for (var i = 0; i < split.length; i++) {
        var a = parseInt(split[i]);
        var b = parseInt(nSplit[i]);
        if (a > b) return true;
        if (a < b) return false;
    }
    return false;
}

function reset() {
    document.getElementById("game").innerHTML = "<br><br><a id=\"button\" onclick=\"startGame()\">Start</a>";
    document.getElementById("win").remove();
    num = -1;
    befNum = -1;
}

function double() {
    num *= 2;
    update("x2");
}

function half() {
    num = Math.floor(num / 2);
    update("/2");
}

function square() {
    num *= num;
    update("x" + befNum);
}

function root() {
    num = Math.floor(Math.sqrt(num));
    update("sqrt(" + befNum + ")");
}

function floor() {
    var length = num.toString().length;
    var newNum = "";
    newNum += num.toString().charAt(0);
    for (var i = 1; i < length; i++) newNum += "0";
    num = parseInt(newNum);
    update("floor(" + befNum + ")");
}

function ceil() {
    var length = num.toString().length;
    var newNum = "";
    newNum += num.toString().charAt(0);
    newNum = (parseInt(newNum) + 1).toString();
    for (var i = 1; i < length; i++) newNum += "0";
    num = parseInt(newNum);
    update("ceil(" + befNum + ")");
}

function addCross() {
    var sum = getCrossSum(num);
    num += sum;
    update("+" + sum);
}

function subCross() {
    var sum = getCrossSum(num);
    num -= sum;
    update("-" + sum);
}

function sub3() {
    num -= 3;
    update("-3");
}

function getCrossSum(aNum) {
    var sNum = aNum.toString();
    var sum = 0;
    for (var i = 0; i < sNum.length; i++) {
        sum += parseInt(sNum.charAt(i));
    }
    return sum;
    
}

function update(op) {
    document.getElementById("randNum").innerHTML = num;
    document.getElementById("lastOp").innerHTML = op;
    if (num == 45) document.getElementById("game").insertAdjacentHTML("beforeend", "<a class=\"button\" id=\"removeMe\" onclick=\"sub3()\">Subtract 3</a>");
    else if (document.getElementById("removeMe")) document.getElementById("removeMe").remove();
    if (num == 42) win();
    befNum = num;
}

function getRandNum() {
    //get a random range of numbers
    var rangeStart = Math.floor(Math.random() * 1000) + 1;
    var rangeEnd = Math.floor(Math.random() * 1000000) + 1000;
    //get a random number within the range
    var num = Math.floor(Math.random() * rangeEnd) + rangeStart;
    return num;
}

function getPB() {
    pb = localStorage.getItem("42pb");
    if (pb == null) pb = "--";
    document.getElementById("pb").innerHTML = "Personal best: " + pb;
}

window.onload = getPB();