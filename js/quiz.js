const frame = document.getElementById("text-content");
const storage = window.localStorage;

const modeLength = [72, 46];

const nameTheMobAnswers = ["horse", "evoker", "iron golem", "mule", "wandering trader", "enderman", "hoglin", "endermite", "guardian", "elder guardian", "donkey", "phantom", "slime", "cave spider", "villager", "turtle", "drowned", "zombie villager", "killer bunny", "vindicator", "wolf", "polar bear", "ocelot", "strider", "witch", "wither", "zombie horse", "blaze", "illusioner", "rabbit", "sheep", "tropical fish", "stray", "vex", "ender dragon", "piglin brute", "parrot", "bee", "llama", "wither skeleton", "axolotl", "fox", "snow golem", "zoglin", "cow", "pufferfish", "mooshroom", "zombified piglin", "silverfish", "creeper", "pillager", "shulker", "zombie", "husk", "salmon", "glow squid", "piglin", "cat", "skeleton horse", "magma cube", "spider", "ghast", "skeleton", "panda", "squid", "bat", "dolphin", "goat", "chicken", "ravager", "pig", "cod"];
const nameTheBiomeAnswers = ["flower forest", "tall birch forest", "jungle", "nether wastes", "beach", "stony shore", "frozen river", "lush caves", "badlands", "lukewarm ocean", "savanna", "old growth spruce taiga", "bamboo jungle", "ice spikes", "plains", "mushroom fields", "basalt deltas", "forest", "cold ocean", "swamp", "desert", "dripstone caves", "snowy tundra", "old growth pine taiga", "birch forest", "ocean", "eroded badlands", "windswept forest", "snowy taiga", "soul sand valley", "sparse jungle", "river", "frozen ocean", "windswept savanna", "warped forest", "sunflower plains", "taiga mountains", "snowy beach", "dark forest", "windswept gravelly hills", "taiga", "warm ocean", "wooded badlands", "crimson forest", "windswept hills", "snowy taiga mountains"];

const completed = [];

//switcheroos
let wrong = false;
let right = false;
let hintShownLetters = 0;

function saveData(mode) {
    if (mode === 0) return;
    let save = "";
    const comp = completed[mode - 1];
    for (let i = 0; i < comp.length; i++) {
        save += comp[i] ? "1" : "0";
    }
    storage.setItem("quiz" + mode, save);
}

function loadData(mode) {
    if (mode === 0) return;
    let save = "";
    const length = modeLength[mode - 1];
    if (storage.getItem("quiz" + mode)) save = storage.getItem("quiz" + mode);
    else {
        for (let i = 0; i < length; i++) save += "0";
    }
    if (save.length <= length) {
        const missingLength = length - save.length;
        for (let i = 0; i < missingLength; i++) save += "0";
    }
    const temp = [];
    for (let i = 0; i < length; i++) {
        temp[i] = save.charAt(i) === "1";
    }
    completed[mode - 1] = temp;
}

function deleteData() {
    if (window.confirm("Are you sure you want to delete your entire Quiz Data? All your progress will be lost!")) {
        storage.removeItem("quiz1");
        storage.removeItem("quiz2");
        main();
    }
}

function resetSwitcheroos() {
    wrong = false;
    right = false;
    hintShownLetters = 0;
}

const mainHTML = "<h1>Quizzes</h1>" +
    "<p>Here you will find a collection of quizzes you can play.<br>" +
    "Every quiz has a unique theme, so you can play the quiz you like.<br>" +
    "New quizzes will be added, I just don't know when.<br>" +
    "For quiz requests, contact me <a onclick=\"redirect('contact')\" id=\"alink\">here</a>.</p><br><br>" +
    "<a id=\"button\" onclick=\"loadNew(minecraftHTML)\">Minecraft</a><br><br><br><br><br>" +
    "<a id=\"button\" onclick=\"deleteData()\">Delete Quiz Data</a>";

const minecraftHTML = "<h1>Minecraft Quizzes</h1>" +
    "<p>Here you will find a collection of Minecraft themed quizzes, all with different topics.<br>" +
    "Click on one of the buttons below to get started!</p><br><br>" +
    "<a id=\"button\" onclick=\"loadNameMob()\">Name the Mob</a>&nbsp;&nbsp;&nbsp;&nbsp;" +
    "<a id=\"button\" onclick=\"loadNameBiomes()\">Name the Biome</a>&nbsp;&nbsp;&nbsp;&nbsp;" +
    "<br><br><br><br><br><br><br><a id=\"button\" onclick=\"loadNew(mainHTML)\">Back</a>";

function loadNew(thing) {
    resetSwitcheroos();
    thing += "<br><br>";
    thing += "<div style=\"clear:both;\"></div>";
    frame.innerHTML = "";
    frame.insertAdjacentHTML("beforeend", thing);
}

function isCompleted(mode, level) {
    const comp = completed[mode - 1];
    return comp[level - 1];
}

function complete(mode, level) {
    const comp = completed[mode - 1];
    comp[level - 1] = true;
    completed[mode - 1] = comp;
    saveData(mode);
}

function loadQuiz(mode, level) {
    let thing = "";
    if (mode === 1) {
        thing += "<h1>Name the Mob</h1>";
        thing += "<h3>Level " + level + "</h3>";
        thing += "<img src=\"../assets/mcmobs/" + level + ".png\" alt=\"Error\"><br><br><br>";
        thing += "<input type=\"text\" id=\"input\"><br><br><br>";
        if (level > 1) thing += "<a id=\"button\" onclick=\"loadQuiz(1, " + (level - 1) + ")\"><</a>&nbsp;&nbsp;";
        thing += "<a id=\"button\" onclick=\"checkAnswer(1, " + level + ")\">Check</a>&nbsp;&nbsp;";
        thing += "<a id=\"button\" onclick=\"loadNameMob()\">Back</a>";
        if (level < modeLength[0]) thing += "&nbsp;&nbsp;<a id=\"button\" onclick=\"loadQuiz(1, " + (level + 1) + ")\">></a>";
    } else if (mode === 2) {
        thing += "<h1>Name the Biome</h1>";
        thing += "<h3>Level " + level + "</h3>";
        thing += "<img src=\"../assets/mcbiomes/" + level + ".png\" alt=\"Error\"><br><br><br>";
        thing += "<input type=\"text\" id=\"input\"><br><br><br>";
        if (level > 1) thing += "<a id=\"button\" onclick=\"loadQuiz(2, " + (level - 1) + ")\"><</a>&nbsp;&nbsp;";
        thing += "<a id=\"button\" onclick=\"checkAnswer(2, " + level + ")\">Check</a>&nbsp;&nbsp;";
        thing += "<a id=\"button\" onclick=\"loadNameBiomes()\">Back</a>";
        if (level < modeLength[1]) thing += "&nbsp;&nbsp;<a id=\"button\" onclick=\"loadQuiz(2, " + (level + 1) + ")\">></a>";
    }
    thing += "<br><br>";
    thing += "<p id=\"right\" style=\"color:green;font-size:30px;display:none;\">RIGHT</p>";
    thing += "<p id=\"wrong\" style=\"color:#810404;font-size:30px;display:none;\">WRONG</p>";
    thing += "<p>Hints</p><br>";
    thing += "<a id=\"button\" onclick=\"getHint(1, " + mode + ", " + level + ")\">Show word count</a>&nbsp;&nbsp;";
    thing += "<a id=\"button\" onclick=\"getHint(2, " + mode + ", " + level + ")\">Show letter count</a>&nbsp;&nbsp;";
    thing += "<a id=\"button\" onclick=\"getHint(3, " + mode + ", " + level + ")\">Show one letter</a>";
    thing += "<br><br><p id=\"hintDisplay\"></p>";
    loadNew(thing);
}

function getHint(hintMode, quizMode, level) {
    let display = "";
    let answer = "";
    if (quizMode === 1) answer = nameTheMobAnswers[level - 1];
    else if (quizMode === 2) answer = nameTheBiomeAnswers[level - 1];
    if (hintMode === 1) {
        let split = answer.split(" ");
        display = split.length;
    } else if (hintMode === 2) {
        let tempAns = answer.replace(" ", "");
        display = tempAns.length;
    } else if (hintMode === 3) {
        if (answer.charAt(hintShownLetters) === ' ') hintShownLetters++;
        display = "";
        document.getElementById("input").value = answer.slice(0, hintShownLetters + 1);
        hintShownLetters++;
    }
    document.getElementById("hintDisplay").innerHTML = display;
}

function checkAnswer(mode, level) {
    let input = document.getElementById("input").value;
    if (input === "") return;
    input = input.toLowerCase();
    input += "\n";
    let start = 0;
    for (let i = 0; i < input.length; i++) {
        if (input.charAt(i) === ' ') start ++;
        else break;
    }
    input = input.substring(start, input.length);
    let end = input.length - 1;
    for (let i = input.length - 2; i > 0; i--) {
        if (input.charAt(i) === ' ') end--;
        else break;
    }
    input = input.substring(0, end);
    let answer = "";
    if (mode === 1) answer = nameTheMobAnswers[level - 1];
    else if (mode === 2) answer = nameTheBiomeAnswers[level - 1];
    if (input === answer) {
        if (!right) {
            if (wrong) document.getElementById("wrong").style.display = "none";
            document.getElementById("right").style.display = "block";
            complete(mode, level);
            right = true;
            wrong = false;
        }
    } else {
        if (!wrong) {
            if (right) document.getElementById("right").style.display = "none";
            document.getElementById("wrong").style.display = "block";
            wrong = true;
            right = false;
        }
    }
}

function loadLevels(title, subtitle, mode, levelCount) {
    loadData(mode);
    let thing = "<h1>" + title + "</h1><p>" + subtitle + "</p><br>";
    if (mode === 1 || mode === 2) thing += "<a id=\"button\" onclick=\"loadNew(minecraftHTML)\">Back</a><br><br><br>";
    let part = "";
    const width = document.getElementById("text-content").clientWidth;
    let count = 0;
    for (let i = 0; i < levelCount; i++) {
        part += "<a id=\"button" + (isCompleted(mode, i + 1) ? "a" : "") + "\" onclick=\"loadQuiz(" + mode + ", " + (i + 1) + ")\">Level " + (i + 1) + "</a>&nbsp;&nbsp;";
        count += 150;
        if (count >= width) {
            count = 0;
            part += "<br><br><br>";
        }
    }
    thing += part;
    loadNew(thing);
}

function loadNameMob() {
    loadLevels("Name the Mob", "Do you know the name of the shown mob? Type it in the textbox underneath the picture and press check!", 1, 72);
}

function loadNameBiomes() {
    loadLevels("Name the Biome", "Do you know the name of the shown biome? Type it in the textbox underneath the picture and press check!", 2, 46);
}

function main() {
    loadNew(mainHTML);
}

window.onload = main;