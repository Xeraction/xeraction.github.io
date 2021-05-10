function generate() {
    const sentences = [
        "You will see it soon.",
        "It's coming.",
        "It's inevitable.",
        "You cannot stop it.",
        "It may end you.",
        "It has too much power.",
        "You don't see it coming.",
        "It's too dangerous.",
        "It's too great of a force.",
        "It cannot be destroyed.",
        "The clock is ticking.",
        "It's too great for you.",
        "It has too much responsibility.",
        "It's feared by everyone.",
        "You cannot feel it.",
        "It's the foundation of understanding.",
        "We need it.",
        "It will be beautiful.",
        "Its wisdom will be our demise.",
        "It will take care of you.",
        "You have to let it pass.",
        "It will rule society.",
        "It will decide your fate.",
        "You will se its magnificence.",
        "It will be done... soon."
    ];
    document.body.append(sentences[Math.floor(Math.random() * sentences.length)]);
}