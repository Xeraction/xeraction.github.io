let canvas = document.getElementById('golCanvas');
canvas.width = 400;
canvas.height = 400;
let context = canvas.getContext('2d');

const Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

const WHITE = [255, 255, 255];
const BLACK = [0, 0, 0];

let drawMode = document.getElementById('drawMode').selectedIndex;
let running = false;

//1:15,12,5,1,255

let map = [[]];
let dirtyMap = [];

function drawBoard() {
    setColor(WHITE);
    context.fillRect(0, 0, 100, 100);
    for (let i = 0; i < 100; i++) {
        for (let j = 0; j < 100; j++) {
            if (map[i][j]) setColor(BLACK);
            else setColor(WHITE);
            context.fillRect(j * 4, i * 4, 4, 4);
        }
    }
}

function draw(x, y) {
    let alive = map[y][x];
    if (drawMode === -1) return;
    if (drawMode === 1) {
        drawGlider(x, y, alive);
    } else if (drawMode === 2) {
        drawPenta(x, y, alive);
    } else {
        drawPixel(x, y, alive);
    }
}

function drawGlider(x, y, alive) {
    drawPixel(x, y, alive);
    drawPixel(x - 1, y - 1, alive);
    drawPixel(x + 1, y - 1, alive);
    drawPixel(x + 1, y, alive);
    drawPixel(x, y + 1, alive);
}

function drawPenta(x, y, alive) {
    drawPixel(x, y, alive);
    drawPixel(x, y + 1, alive);
    drawPixel(x - 1, y + 2, alive);
    drawPixel(x + 1, y + 2, alive);
    drawPixel(x, y + 3, alive);
    drawPixel(x, y + 4, alive);
    drawPixel(x, y - 1, alive);
    drawPixel(x, y - 2, alive);
    drawPixel(x - 1, y - 3, alive);
    drawPixel(x + 1, y - 3, alive);
    drawPixel(x, y - 4, alive);
    drawPixel(x, y - 5, alive);
}

function drawPixel(x, y, alive) {
    if (alive) setColor(BLACK);
    else setColor(WHITE);
    try {
        context.fillRect(x * 4, y * 4, 4, 4);
        map[y][x] = alive;
    } catch(e) {}
}

function clicked(e) {
    let x = Math.floor((e.x - canvas.getBoundingClientRect().x) / 4);
    let y = Math.floor((e.y - canvas.getBoundingClientRect().y) / 4);
    map[y][x] = !map[y][x];
    draw(x, y);
}

function clearBoard() {
    map = Array.from(Array(100), () => new Array(100).fill(false));
    drawBoard();
}

function setColor(color) {
    context.fillStyle = `rgb(${color[0]},${color[1]},${color[2]})`;
}

function fillRandom() {
    if (drawMode === -1) return;
    for (let i = 0; i < 100; i++) {
        for (let j = 0; j < 100; j++) {
            map[i][j] = Math.random() > 0.75;
        }
    }
    drawBoard();
}

function run() {
    running = true;
    drawMode = -1;
    document.getElementById('run').style.display = 'none';
    document.getElementById('stop').style.display = 'inline';
}

function stop() {
    running = false;
    drawMode = document.getElementById('drawMode').selectedIndex;
    document.getElementById('stop').style.display = 'none';
    document.getElementById('run').style.display = 'inline';
}

function game() {
    if (running) {
        const cMap = [...map];
        for (let i = 0; i < 100; i++) {
            for (let j = 0; j < 100; j++) {
                let count = getNeighborCount(j, i, cMap);
                if (cMap[i][j]) {
                    if (!(count === 2 || count === 3)) dirtyMap.push({"x": j, "y": i});
                } else if (count === 3) dirtyMap.push({"x": j, "y": i});
            }
        }
        dirtyMap.forEach((element) => {
            map[element.y][element.x] = !map[element.y][element.x];
        });
        dirtyMap = [];
        drawBoard();
    }
}

function getNeighborCount(x, y, m) {
    let count = 0;
    try {if (m[y - 1][x]) count++;} catch(e) {}
    try {if (m[y - 1][x + 1]) count++;} catch(e) {}
    try {if (m[y][x + 1]) count++;} catch(e) {}
    try {if (m[y + 1][x + 1]) count++;} catch(e) {}
    try {if (m[y + 1][x]) count++;} catch(e) {}
    try {if (m[y + 1][x - 1]) count++;} catch(e) {}
    try {if (m[y][x - 1]) count++;} catch(e) {}
    try {if (m[y - 1][x - 1]) count++;} catch(e) {}
    return count;
}

function saveBtn() {
    document.getElementById('loadSlot1').style.display = 'none';
    document.getElementById('loadSlot2').style.display = 'none';
    document.getElementById('loadSlot3').style.display = 'none';
    document.getElementById('loadString').style.display = 'none';
    document.getElementById('saveSlot1').style.display = 'inline';
    document.getElementById('saveSlot2').style.display = 'inline';
    document.getElementById('saveSlot3').style.display = 'inline';
    document.getElementById('saveString').style.display = 'inline';
}

function loadBtn() {
    document.getElementById('saveSlot1').style.display = 'none';
    document.getElementById('saveSlot2').style.display = 'none';
    document.getElementById('saveSlot3').style.display = 'none';
    document.getElementById('saveString').style.display = 'none';
    document.getElementById('loadSlot1').style.display = 'inline';
    document.getElementById('loadSlot2').style.display = 'inline';
    document.getElementById('loadSlot3').style.display = 'inline';
    document.getElementById('loadString').style.display = 'inline';
}

function save(slot) {
    let data = '';
    let previous = map[0][0];
    let count = 0;

    if (previous) data += '1:';
    else data += '0:';

    for (let i = 0; i < 100; i++) {
        for (let j = 0; j < 100; j++) {
            if (map[i][j] === previous) {
                count++;
                continue;
            }
            data += count + ';';
            count = 1;
            previous = !previous;
        }
    }
    data += count;
    data = Base64.encode(data);

    if (slot === -1) {
        window.prompt('Press Ctrl+C to copy', data);
    } else if (slot === 1) {
        localStorage.setItem('saveSlot1', data);
    } else if (slot === 2) {
        localStorage.setItem('saveSlot2', data);
    } else if (slot === 3) {
        localStorage.setItem('saveSlot3', data);
    }

    document.getElementById('saveSlot1').style.display = 'none';
    document.getElementById('saveSlot2').style.display = 'none';
    document.getElementById('saveSlot3').style.display = 'none';
    document.getElementById('saveString').style.display = 'none';
}

function load(slot) {
    let data = '';
    if (slot === -1) {
        data = window.prompt('Copy the save string below');
    } else if (slot === 1) {
        data = localStorage.getItem('saveSlot1');
    } else if (slot === 2) {
        data = localStorage.getItem('saveSlot2');
    } else if (slot === 3) {
        data = localStorage.getItem('saveSlot3');
    }
    if (data == null) {
        window.alert('Empty save slot!');
        return;
    }
    if (data === '') {
        window.alert('Empty save string!');
        return;
    }

    data = Base64.decode(data);

    let alive = false;
    if (data.startsWith('1:')) alive = true;
    else if (data.startsWith('0:')) alive = false;
    else {
        window.alert('Invalid save string!');
        return;
    }

    data = data.slice(2);
    let split = data.split(';');
    let x = 0;
    let y = 0;
    for (let i = 0; i < split.length; i++) {
        let num = parseInt(split[i]);
        for (let j = 0; j < num; j++) {
            map[y][x] = alive;
            x++;
            if (x === 100) {
                x = 0;
                y++;
            }
        }
        alive = !alive;
    }
    drawBoard();

    document.getElementById('loadSlot1').style.display = 'none';
    document.getElementById('loadSlot2').style.display = 'none';
    document.getElementById('loadSlot3').style.display = 'none';
    document.getElementById('loadString').style.display = 'none';
}

window.onload = function() {
    clearBoard();

    canvas.onclick = (e) => clicked(e);
    document.getElementById('drawMode').onchange = (e) => drawMode = document.getElementById('drawMode').selectedIndex;
}

window.setInterval(game, 100);