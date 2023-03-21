let num = -1;
let befNum = -1;
let time = 0;
let pb = "";

function startGame() {
    const frame = document.getElementById("mame");
    frame.innerHTML = "";
    let thing = "";
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
    const date = new Date();
    time = date.getTime();
}

function win() {
    const items = document.getElementsByClassName("change");
    for (let i = 0; i < items.length; i++) {
        items.item(i).onclick = null;
    }
    const date = new Date();
    const now = date.getTime();
    time = now - time;
    const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);
    const millis = Math.floor(time % 1000);
    console.log(hours + ", " + minutes + ", " + seconds + ", " + millis);
    let newPB = (hours !== 0 ? (hours + ":") : "") + (minutes >= 10 ? minutes : ("0" + minutes)) + ":" + (seconds >= 10 ? seconds : ("0" + seconds)) + ":" + millis;
    if (isNewPB(newPB)) {
        pb = newPB;
        localStorage.setItem("42pb", pb);
        document.getElementById("pb").innerHTML = "Personal best: " + pb;
    }
    document.getElementById("mame").insertAdjacentHTML("beforebegin", "<a id=\"win\" style=\"font-size:42px;color:green;\">WIN</a>");
    document.getElementById("mame").insertAdjacentHTML("beforeend", "<br><br><br><a id=\"button\" onclick=\"reset()\">Done</a>");
}

function isNewPB(newPB) {
    if (pb === "--") return true;
    const split = pb.split(":");
    const nSplit = newPB.split(":");
    if (split.length > nSplit.length) return true;
    if (split.length < nSplit.length) return false;
    for (let i = 0; i < split.length; i++) {
        const a = parseInt(split[i]);
        const b = parseInt(nSplit[i]);
        if (a > b) return true;
        if (a < b) return false;
    }
    return false;
}

function reset() {
    document.getElementById("mame").innerHTML = "<br><br><a id=\"button\" onclick=\"startGame()\">Start</a>";
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
    const length = num.toString().length;
    let newNum = "";
    newNum += num.toString().charAt(0);
    for (let i = 1; i < length; i++) newNum += "0";
    num = parseInt(newNum);
    update("floor(" + befNum + ")");
}

function ceil() {
    const length = num.toString().length;
    let newNum = "";
    newNum += num.toString().charAt(0);
    newNum = (parseInt(newNum) + 1).toString();
    for (let i = 1; i < length; i++) newNum += "0";
    num = parseInt(newNum);
    update("ceil(" + befNum + ")");
}

function addCross() {
    const sum = getCrossSum(num);
    num += sum;
    update("+" + sum);
}

function subCross() {
    const sum = getCrossSum(num);
    num -= sum;
    update("-" + sum);
}

function sub3() {
    num -= 3;
    update("-3");
}

function getCrossSum(aNum) {
    const sNum = aNum.toString();
    let sum = 0;
    for (let i = 0; i < sNum.length; i++) {
        sum += parseInt(sNum.charAt(i));
    }
    return sum;
    
}

function update(op) {
    document.getElementById("randNum").innerHTML = num;
    document.getElementById("lastOp").innerHTML = op;
    if (num === 45) document.getElementById("mame").insertAdjacentHTML("beforeend", "<a class=\"button\" id=\"removeMe\" onclick=\"sub3()\">Subtract 3</a>");
    else if (document.getElementById("removeMe")) document.getElementById("removeMe").remove();
    if (num === 42) win();
    befNum = num;
}

function getRandNum() {
    //get a random range of numbers
    const rangeStart = Math.floor(Math.random() * 1000) + 1;
    const rangeEnd = Math.floor(Math.random() * 1000000) + 1000;
    //get a random number within the range
    return Math.floor(Math.random() * rangeEnd) + rangeStart;
}

function getPB() {
    pb = localStorage.getItem("42pb");
    if (pb == null) pb = "--";
    document.getElementById("pb").innerHTML = "Personal best: " + pb;
}

window.onload = getPB;