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
    var frame = document.getElementById("sidenav");
    var thing = "";
    thing += "<a id=\"closesidenav\" onclick=\"closeNav()\">&times;</a>";
    thing += "<a href=\"./index.html\" id=\"sidelink\">Home</a>";
    thing += "<a href=\"./about.html\" id=\"sidelink\">About</a>";
    thing += "<a href=\"./contact.html\" id=\"sidelink\">Contact</a>";
    thing += "<a href=\"./help.html\" id=\"sidelink\">Help</a><br><br>";
    thing += "<a id=\"sidecat\">Projects</a>";
    thing += "<a href=\"./quiz.html\" id=\"sidelink\">Quiz</a>";
    thing += "<a href=\"./42.html\" id=\"sidelink\">42</a>";
    frame.insertAdjacentHTML("beforeend", thing);
}

function main() {
    addNav();
    var field = document.getElementById("field");
    if (isOverflowing(field)) field.style.overflowY = "scroll";
    else field.style.overflowY = "hidden";

    //yoinked from colon's furry site
    let observer = new MutationObserver(mutation => {
        if (isOverflowing(field)) field.style.overflowY = "scroll";
        else field.style.overflow = "hidden";
    });
    observer.observe(document.getElementById("text-content"), {childList: true, subtree: true, attributes: true, characterData: true});
}

window.onload = main();