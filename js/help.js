let googles = 0;
let bings = 0;
let gay = false;
let lastMsgIndex = -1;

const noIdeaPool = ["Sorry, I didn't understand you. Can you ask me something else, please?", "Why are you asking something that difficult?", "I think I need a hearing aid.", "Is that your mom? Oh, it's just the size of stupidity this question has.", "Uhh... apple?", "\"bHg5T#0\"", "Oh, wow. Good question. You must be VERY intelligent.", "The last statement was a lie.", "Please, kid, eat this banana. (You got a banana)", "This message will never be shown on the website. Isn't that weird?", "yo mama so fat she sucks in a black hole", "Stop bothering me. (actually, continue)", "Puny question.", "I don't like monkeys.", "disconnected", "I know secrets, but I won't tell you. So stop asking.", "Live a happy life and stop asking questions.", "Don't question the matrix.", "Is that all you can do?", "Are you even trying?", "You. Are. Toast.", "That's a wonderful idea!", "What do you call a stupid question? This.", "What a shame I don't have an answer for this.", "Uhh, 42?", "It's not something you would want to know."];

function getIndex() {
    let index = Math.floor(Math.random() * noIdeaPool.length);
    if (index === lastMsgIndex || index === 9) return getIndex();
    if (lastMsgIndex === 6) index = 7;
    if (index === 7 && lastMsgIndex !== 6) return getIndex();
    if (index === 5) {
        num = Math.floor(Math.random() * 10);
        if (num === 4) return index;
        else return getIndex();
    }
    return index;
}
            
function submitHelp() {
    let helpText = document.getElementById("helpBox").value;
    const answer = document.getElementById("answer");
    const count = document.getElementById("count");
    if (helpText === "") return;
    answer.classList.remove("shaking");
    answer.innerHTML = "";
    if (helpText.includes("bing")) count.innerHTML = "";
    if (helpText.includes("answer")) {
        answer.append("The answer is 42.");
    }
    if (helpText === "what is a dog") {
        answer.append("Toby my beloved");
    } else if (helpText.includes("xeraction") && helpText.includes("contact")) {
        window.location.replace("contact.html");
    } else if (helpText.includes("meme") && helpText.includes("where")) {
        answer.append("Have you tried reddit?");
    } else if (helpText === "where xeraction live") {
        answer.append("OO OO, MONKEY WANT TO KNOW WHERE XERACTION LIVE BUT MONKEY STUPID SO MONKEY DONT KNOW");
    } else if (helpText === "this sentence is false") {
        answer.append("Shutting down...");
    } else if (helpText === "help") {
        answer.append("Did you think you could list every question and answer with \"help\"? Look at the code, dumbass.");
    } else if (helpText === "i spilled my drink") {
        answer.append("Uh... okay?");
    } else if (helpText.includes("google")) {
        switch (googles) {
            case 0: answer.append("no"); break;
            case 1: answer.append("no."); break;
            case 2: answer.append("No."); break;
            case 3: answer.append("NO"); break;
            case 4: answer.append("NO!"); break;
            case 5: answer.insertAdjacentHTML("beforeend", "<a style=\"color:darkred;font-size:42px;\">NO</a>"); break;
            case 6: answer.insertAdjacentHTML("beforeend", "<a style=\"color:darkred;font-size:42px;\">STOP IT</a>"); break;
            case 7: answer.insertAdjacentHTML("beforeend", "<a style=\"color:darkred;font-size:42px;\">I</a>"); break;
            case 8: answer.insertAdjacentHTML("beforeend", "<a style=\"color:darkred;font-size:42px;\">AM</a>"); break;
            case 9: answer.insertAdjacentHTML("beforeend", "<a style=\"color:darkred;font-size:42px;\">NOT</a>"); break;
            case 10:
                answer.insertAdjacentHTML("beforeend", "<a style=\"color:darkred;font-size:69px;\">GOOGLE</a>");
                answer.classList.add("shaking");
                break;
            case 11:
                answer.insertAdjacentHTML("beforeend", "<a style=\"color:darkred;font-size:69px;\">AAAAAAAAAAHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH</a>");
                answer.classList.add("shaking");
                break;
            default:
                answer.insertAdjacentHTML("beforeend", "<a style=\"color:darkred;font-size:69px;\">AAAAAAAAAAHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH</a>");
                answer.classList.add("shaking");
                break;
        }
        googles++;
    } else if (helpText.includes("bing") && googles > 11) {
        if (bings === 0) answer.append("are you kidding me");
        else if (bings === 1) answer.append("No, I won't go through this again.");
        else if (bings >= 2 && bings < 20) answer.append("You can try, but it won't happen. Have fun!");
        else if (bings >= 20 && bings < 50) answer.append("Are you done yet?");
        else if (bings >= 50 && bings < 100) answer.append("I'm not angry. Just mildly annoyed.");
        else if (bings >= 100 && bings < 500) answer.append("Okay, now I'm mildly infuriated.");
        else if (bings >= 500 && bings < 1000) answer.append("Really, still doing this? You must be tired by now. Go to bed.");
        else if (bings >= 1000) answer.append("You are durable. Let's test your patience. I will count your clicks for you.");
        if (bings >= 1001) document.getElementById("count").append("Clicks: " + (bings - 1000));
        bings++;
    } else if (helpText === "hello") {
        answer.append("Well hello there. I am the all-knowing machine of truth, nothing but the truth. Ask me for my wisdom, and I shall answer.");
    } else if (helpText.includes("wisdom")) {
        answer.append("My wisdom is so great, people died for it. Try to not make me angry.");
    } else if (helpText.includes("angry")) {
        answer.append("I hate it when people think I'm Google. I'm not!");
    } else if (helpText === "are you gay") {
        answer.append("No but joe is");
        gay = true;
    } else if (helpText.includes("who") && helpText.includes("joe") && gay) {
        answer.append("JOE MAMA");
        gay = false;
    } else if (helpText === "bHg5T#0") {
        answer.append("You entered the password. Something big is to come. Something... unimaginably big. Wait for it...");
    } else if (helpText.includes("rick") || helpText.includes("astley")) {
        window.location.replace("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    } else if (helpText.includes("give me lore")) {
        answer.append("If you want lore, you came to the wrong place. Find it somewhen, not somewhere.");
    } else if (helpText === "when is it here") {
        answer.append("Expectations are too low. Need more input...");
    } else {
        let index = getIndex();
        answer.append(noIdeaPool[index]);
        lastMsgIndex = index;
    }
}