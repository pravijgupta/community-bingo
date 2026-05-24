export const bingoItems = [
    // Row 1
    "Parked in someone else's spot",
    "Argued with the\nassociation",
    "Waved to a neighbour you don’t\nreally know",
    "Babysat/dogsat for your\nneighbours",

    // Row 2
    "Closed the lift when someone ran towards it",
    "Consistently paid\nmaintenance late",
    "Rang your neighbour's doorbell and ran away",
    "Befriended the guard",

    // Row 3
    "Hoarded\ncorridor space",
    "Entered a\nrestricted area",
    "Guided a lost visitor",
    "Performed at a community event",

    // Row 4
    "Received a noise\ncomplaint",
    "Lurked\nduring a\nsociety\ndrama",
    "Shared\nfestive gifts with guards",
    "Donated items to the community staff"
];

export const secondaryBingoItems = [
    // Row 1
    "Pressed all the floors in the lift as a prank",
    "Offered\nwater to the\ndelivery\npartner",
    "Overheard gossip in the lift",
    "Been a\nregular at the pool/ sports court",

    // Row 2
    "Picked a fight with your neighbour",
    "Got stuck in the lift",
    "Slowed down your walk to watch a\nsociety fight",
    "Coached the kids in your society",

    // Row 3
    "New society rule\nintroduced because of you",
    "Held a\nposition in your\nsociety's\nassociation",
    "Stayed close with\nsomeone for the gossip",
    "Have a\nneighbour as your workout\npartner",

    // Row 4
    "Took your neighbour's newspaper",
    "Never showed up to a society meeting",
    "Sparked a heated\narguement in a group chat",
    "Won a\nsociety sports event"
];

export const columns = {
    A: [0, 4, 8, 12],
    B: [1, 5, 9, 13],
    C: [2, 6, 10, 14],
    D: [3, 7, 11, 15]
};

export const columnPersonalities = {
    A: "You’re a bit of a rule-bender",
    B: "You like testing the edges of society life",
    C: "You’re at home in community circles",
    D: "You're a good samaritan"
};

export const secondaryColumnPersonalities = {
    A: "You’re a bit of a rule-bender",
    B: "You're a true gated-life native",
    C: "You enjoy the drama... quietly",
    D: "You're the society athlete"
};

export const getTitleFromScore = (score) => {
    if (score <= 4) return "The Community\nNewbie";
    if (score <= 8) return "The Community\nRegular";
    if (score <= 12) return "The Community\nPro";
    return "The Society\nLegend";
};

export const getDescriptionFromScore = (score) => {
    if (score <= 4) return "looks like you're just getting started with society life.";
    if (score <= 8) return "you've found your rhythm in community life.";
    if (score <= 12) return "you know the community, and they know you.";
    return "you've seen it all. Been there, done that. Good going!";
};
