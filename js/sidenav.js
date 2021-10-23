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
    frame.insertAdjacentHTML("beforeend", thing);
}

window.onload = addNav();