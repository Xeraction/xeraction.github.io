var frame = document.getElementById("text-content");
var storage = window.localStorage;

const modeLength = ["72"];

const nameTheMobAnswers = ["horse", "evoker", "iron golem", "mule", "wandering trader", "enderman", "hoglin", "endermite", "guardian", "elder guardian", "donkey", "phantom", "slime", "cave spider", "villager", "turtle", "drowned", "zombie villager", "killer bunny", "vindicator", "wolf", "polar bear", "ocelot", "strider", "witch", "wither", "zombie horse", "blaze", "illusioner", "rabbit", "sheep", "tropical fish", "stray", "vex", "ender dragon", "piglin brute", "parrot", "bee", "llama", "wither skeleton", "axolotl", "fox", "snow golem", "zoglin", "cow", "pufferfish", "mooshroom", "zombified piglin", "silverfish", "creeper", "pillager", "shulker", "zombie", "husk", "salmon", "glow squid", "piglin", "cat", "skeleton horse", "magma cube", "spider", "ghast", "skeleton", "panda", "squid", "bat", "dolphin", "goat", "chicken", "ravager", "pig", "cod"];

var completed = [];

//switcheroos
var wrong = false;
var right = false;

function saveData(mode) {
    if (mode == 0) return;
    var save = "";
    var comp = completed[mode - 1];
    for (var i = 0; i < comp.length; i++) {
        save += comp[i] ? "1" : "0";
    }
    storage.setItem("quiz" + mode, save);
}

function loadData(mode) {
    if (mode == 0) return;
    var save = "";
    var length = modeLength[mode - 1];
    if (storage.getItem("quiz" + mode)) save = storage.getItem("quiz" + mode);
    else {
        for (var i = 0; i < length; i++) save += "0";
    }
    if (save.length <= length) {
        var missingLength = length - save.length;
        for (var i = 0; i < missingLength; i++) save += "0";
    }
    var temp = [];
    for (var i = 0; i < length; i++) {
        temp[i] = save.charAt(i) == "1";
    }
    completed[mode - 1] = temp;
}

function deleteData() {
    if (window.confirm("Are you sure you want to delete your entire Quiz Data? All your progress will be lost!")) {
        storage.removeItem("quiz1");
        main();
    }
}

function resetSwitcheroos() {
    wrong = false;
    right = false;
}

const mainHTML = "<h1>Quizzes</h1>" +
    "<p>Here you will find a collection of quizzes you can play.<br>" +
    "Every quiz has a unique theme, so you can play the quiz you like.<br>" +
    "New quizzes will be added, I just don't know when.<br>" +
    "For quiz requests, contact me <a href=\"./contact.html\">here</a>.</p><br><br>" +
    "<a id=\"button\" onclick=\"loadNew(minecraftHTML)\">Minecraft</a><br><br><br><br><br>" +
    "<a id=\"button\" onclick=\"deleteData()\">Delete Quiz Data</a>";

const minecraftHTML = "<h1>Minecraft Quizzes</h1>" +
    "<p>Here you will find a collection of Minecraft themed quizzes, all with different topics.<br>" +
    "Click on one of the buttons below to get started!</p><br><br>" +
    "<a id=\"button\" onclick=\"loadNameMob()\">Name the Mob</a>&nbsp;&nbsp;&nbsp;&nbsp;" +
    "<br><br><br><br><br><br><a id=\"button\" onclick=\"loadNew(mainHTML)\">Back</a>";

function loadNew(thing) {
    resetSwitcheroos();
    thing += "<div style=\"clear:both;\"></div>";
    frame.innerHTML = "";
    frame.insertAdjacentHTML("beforeend", thing);
}

function isCompleted(mode, level) {
    var comp = completed[mode - 1];
    return comp[level - 1];
}

function complete(mode, level) {
    var comp = completed[mode - 1];
    comp[level - 1] = true;
    completed[mode - 1] = comp;
    saveData(mode);
}

function loadQuiz(mode, level) {
    var thing = "";
    if (mode == 1) {
        thing += "<h1>Name the Mob</h1>";
        thing += "<h3>Level " + level + "</h3>";
        thing += "<img src=\"../assets/mcmobs/" + level + ".png\" alt=\"Error\"><br><br><br>";
        thing += "<input type=\"text\" id=\"input\"><br><br><br>";
        thing += "<a id=\"button\" onclick=\"checkAnswer(1, " + level + ")\">Check</a>&nbsp;&nbsp;";
        thing += "<a id=\"button\" onclick=\"loadNameMob()\">Back</a>";
    }
    loadNew(thing);
}

function checkAnswer(mode, level) {
    var input = document.getElementById("input").value;
    if (input == "") return;
    if (mode == 1) {
        var answer = nameTheMobAnswers[level - 1];
        if (input.toLowerCase() === answer) {
            if (!right) {
                if (wrong) document.getElementById("wrong").outerHTML = "";
                frame.insertAdjacentHTML("beforeend", "<p id=\"right\" style=\"color:green;font-size:30px;\">RIGHT</p>");
                complete(mode, level);
                right = true;
                wrong = false;
            }
        } else {
            if (!wrong) {
                if (right) document.getElementById("right").outerHTML = "";
                frame.insertAdjacentHTML("beforeend", "<p id=\"wrong\" style=\"color:red;font-size:30px;\">WRONG</p>");
                wrong = true;
                right = false;
            }
        }
    }
}

function loadLevels(title, subtitle, mode, levelCount) {
    loadData(mode);
    var thing = "<h1>" + title + "</h1><p>" + subtitle + "</p><br>";
    if (mode == 1) thing += "<a id=\"button\" onclick=\"loadNew(minecraftHTML)\">Back</a><br><br><br>";
    var part = "";
    var tens = 0;
    for (var i = 0; i < levelCount; i++) {
        part += "<a id=\"button" + (isCompleted(mode, i + 1) ? "a" : "") + "\" onclick=\"loadQuiz(" + mode + ", " + (i + 1) + ")\">Level " + (i + 1) + "</a>&nbsp;&nbsp;";
        tens++;
        if (tens == 10) {
            part += "<br><br><br>";
            tens = 0;
        }
    }
    thing += part;
    loadNew(thing);
}

function loadNameMob() {
    loadLevels("Name the Mob", "Do you know the name of the shown mob? Type it in the textbox underneath the picture and press check!", 1, 72);
}

function main() {
    loadNew(mainHTML);
}

window.onload = main;