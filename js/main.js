function isOverflowing(element) {
    return element.clientWidth < element.scrollWidth || element.clientHeight < element.scrollHeight;
}

function openNav() {
    document.getElementById("sidenav").style.width = "222px";
}

function closeNav() {
    document.getElementById("sidenav").style.width = "0px";
}

function addNav() {
    const frame = document.getElementById("sidenav");
    let thing = '';
    thing += '<a id="closesidenav" onclick="closeNav()">&times;</a>';
    thing += '<a onclick="redirect(\'index\')" id="sidelink">Home</a>';
    thing += '<a onclick="redirect(\'about\')" id="sidelink">About</a>';
    thing += '<a onclick="redirect(\'news\')" id="sidelink">News</a>';
    thing += '<a onclick="redirect(\'contact\')" id="sidelink">Contact</a>';
    thing += '<a onclick="redirect(\'help\')" id="sidelink">Help</a><br><br>';
    thing += '<a id="sidecat">Projects</a>';
    thing += '<a onclick="redirect(\'quiz\')" id="sidelink">Quiz</a>';
    thing += '<a onclick="redirect(\'42\')" id="sidelink">42</a>';
    thing += '<a onclick="redirect(\'lettercode\')" id="sidelink">Lettercode</a>';
    thing += '<a onclick="redirect(\'gol\')" id="sidelink">Game of Life</a>';
    frame.insertAdjacentHTML("beforeend", thing);
}

function redirect(page) {
    const path = window.location.pathname;
    const currentPage = path.split("/").pop();
    let projectPage = false;
    if (currentPage === "quiz.html" || currentPage === "42.html" || currentPage === "lettercode.html" || currentPage === "gol.html") projectPage = true;
    switch (page) {
        case "index":
        case "about":
        case "news":
        case "contact":
        case "help": window.location.assign("." + (projectPage ? "." : "") + "/" + page + ".html"); break;
        case "quiz":
        case "42":
        case "lettercode":
        case "gol": window.location.assign("." + (projectPage ? "" : "/projects") + "/" + page + ".html"); break;
        default: window.location.replace("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    }
}

function main() {
    addNav();
    const field = document.getElementById("field");
    if (isOverflowing(field)) field.style.overflowY = "scroll";
    else field.style.overflowY = "hidden";

    //yoinked from colon's furry site
    let observer = new MutationObserver(() => {
        if (isOverflowing(field)) field.style.overflowY = "scroll";
        else field.style.overflow = "hidden";
    });
    observer.observe(document.getElementById("text-content"), {childList: true, subtree: true, attributes: true, characterData: true});
    return undefined;
}

window.onload = main();