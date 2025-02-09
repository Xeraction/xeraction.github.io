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
    thing += '<a onclick="redirect(\'help\')" id="sidelink">Help</a>';
    thing += '<br><br>';
    thing += '<a id="sidecat">Cool Stuff</a>';
    thing += '<a onclick="redirect(\'adsave\')" id="sidelink">AD Save Editor</a>';
    thing += '<br><br>';
    thing += '<a id="sidecat">Projects</a>';
    thing += '<a onclick="redirect(\'quiz\')" id="sidelink">Quiz</a>';
    thing += '<a onclick="redirect(\'42\')" id="sidelink">42</a>';
    thing += '<a onclick="redirect(\'lettercode\')" id="sidelink">Lettercode</a>';
    thing += '<a onclick="redirect(\'gol\')" id="sidelink">Game of Life</a>';
    //thing += '<a onclick="redirect(\'unfolding\')" id="sidelink">Unfolding</a>';
    frame.insertAdjacentHTML("beforeend", thing);
}

function redirect(page) {
    window.location.assign(`./${page}.html`);
}

function main() {
    addNav();
    if (window.location.pathname.split("/").pop() !== "unfolding.html") {
        const field = document.getElementById("field");
        if (isOverflowing(field))
            field.style.overflowY = "scroll";
        else
            field.style.overflowY = "hidden";

        //yoinked from colon's furry site
        let observer = new MutationObserver(() => {
            if (isOverflowing(field))
                field.style.overflowY = "scroll";
            else
                field.style.overflowY = "hidden";
        });
        observer.observe(document.getElementById("text-content"), {childList: true, subtree: true, attributes: true, characterData: true});
    }
    return undefined;
}

window.onload = main();