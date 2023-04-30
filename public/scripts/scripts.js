var progdict = {
    "bridgecondition": ["???", "Open", "Vanilla", "Stones", "Medallions", "Dungeons", "Spiders", "Hearts"],
    "gbkcondition": ["???", "Keysy", "Vanilla", "Ganon's Castle", "Overworld", "Any Dung.", "Regional", "Anywhere", "LACS", "Stones", "Medallions", "Dungeons", "Spiders", "Hearts", "Triforce"],
    "songs": ["Songs", "Songs", "Dung. Songs", "Songs Anyw."],
    "shops": ["Shops", "Shops", "Shops 0", "Shops 1", "Shops 2", "Shops 3", "Shops 4", "Shops Rand"],
    "spiders": ["Skulltulas", "Skulltulas", "OW Skulls", "Dung. Skulls", "All Skulls"],
    "scrubs": ["Scrubs", "Scrubs", "Cheap Scrubs", "V. Scrubs", "Rand Scrubs"],
    "sks": ["SKs", "SK Keysy", "V. SKs", "Dung. SKs", "OW SKs", "Any Dung. SKs", "Regional SKs", "SKs Anywhere"],
    "bks": ["BKs", "BK Keysy", "V. BKs", "Dung. BKs", "Regional BKs", "BKs Anywhere", "Keyring BKs"],
    "dot": ["DoT", "Open DoT", "Closed DoT"],
    "egg": ["Weird Egg", "Weird Egg", "Weird Egg", "Skip Zelda"],
    "beans": ["Beans", "Beans", "Beans", "Beans Planted"],
    "csmc": ["CAMC", "CAMC", "CTMC", "CSMC"],
    "pools": ["Item Pool", "Minimal", "Scarce", "Balanced", "Plentiful"],
    "poes": ["Poes", "1 Poe", "2 Poes", "3 Poes", "4 Poes", "5 Poes", "6 Poes", "7 Poes", "8 Poes", "9 Poes", "10 Poes"],
    "hintsreq": ["Hints Req.", "Free Hints", "Unknown Hints", "SoA Hints", "MoT Hints"],
    "hintdist": ["Hint Dist.", "Useless", "Balanced", "Strong", "Very Strong", "Scrubs"],
    "dmg": ["Dmg", "Half Dmg", "Normal Dmg", "Double Dmg", "Quad Dmg", "OHKO"],
    "mixed": ["Mixed Pools", "Mixed Pools", "Mixed Indoors", "Full Mixed Pools"],
    "potscrates": ["Pots/Crates", "Pots/Crates", "Dung. Pots", "OW Pots", "All Pots", "Dung. Crates", "OW Crates", "All Crates", "Dung. Freestand.", "OW Freestand.", "All Freestand."],
};

var shortprogdict = {
    "mixed": ["Mixed Pools", "Mixed Pools", "Mixed Indoors", "Full Mixed"],
};

var maxcounts = {
    "Stones": 3,
    "Medallions": 6,
    "Dungeons": 9,
    "Spiders": 100,
    "Hearts": 20,
    "Triforce": 100
}

function increment_count(elementid, delta) {
    var element = document.getElementById(elementid);
    var currcount = parseInt(element.innerHTML, 10);
    var currcond = (elementid == "bridgecount") 
        ? document.getElementById("bridgecondition").innerHTML 
        : document.getElementById("gbkcondition").innerHTML;
    var newvalue = (currcount+delta > maxcounts[currcond]) ? 1 : currcount+delta;
    rootRef.child("settings").child(elementid).set(newvalue);
}

function decrement_count(elementid, delta) {
    var element = document.getElementById(elementid);
    var currcount = parseInt(element.innerHTML, 10);
    var currcond = (elementid == "bridgecount") 
        ? document.getElementById("bridgecondition").innerHTML 
        : document.getElementById("gbkcondition").innerHTML;
    var newval = (currcount-delta < 1) ? maxcounts[currcond] : currcount-delta;
    rootRef.child("settings").child(elementid).set(newval);
}

function toggle(elementid) {
    var element = document.getElementById(elementid);
    var state = element.classList.contains("toggle-unknown");
    rootRef.child("settings").child(elementid).set(state);
}

function progressive_forward(elementid) {
    var element = document.getElementById(elementid);
    var idx = (element.classList.contains("short") ? shortprogdict : progdict)[elementid].indexOf(element.innerHTML);
    var newidx = idx+1 >= (element.classList.contains("short") ? shortprogdict : progdict)[elementid].length ? 0 : idx+1;
    rootRef.child("settings").child(elementid).set(newidx);
}

function progressive_reverse(elementid) {
    var element = document.getElementById(elementid);
    var idx = (element.classList.contains("short") ? shortprogdict : progdict)[elementid].indexOf(element.innerHTML);
    var newidx = idx-1 < 0 ? (element.classList.contains("short") ? shortprogdict : progdict)[elementid].length-1 : idx-1;
    rootRef.child("settings").child(elementid).set(newidx);
}

function progressive_disable_forward(elementid) {
    var element = document.getElementById(elementid);
    var idx = (element.classList.contains("short") ? shortprogdict : progdict)[elementid].lastIndexOf(element.innerHTML);
    if (element.classList.contains("toggle-unknown")) {
        idx = 0;
    } else if (element.classList.contains("toggle-off")) {
        idx = 1;
    }
    var newidx = idx+1 >= (element.classList.contains("short") ? shortprogdict : progdict)[elementid].length ? 0 : idx+1;
    rootRef.child("settings").child(elementid).set(newidx);
}

function progressive_disable_reverse(elementid) {
    var element = document.getElementById(elementid);
    var idx = (element.classList.contains("short") ? shortprogdict : progdict)[elementid].lastIndexOf(element.innerHTML);
    if (element.classList.contains("toggle-unknown")) {
        idx = 0;
    } else if (element.classList.contains("toggle-off")) {
        idx = 1;
    }
    var newidx = idx-1 < 0 ? (element.classList.contains("short") ? shortprogdict : progdict)[elementid].length-1 : idx-1;
    rootRef.child("settings").child(elementid).set(newidx);
}

function tritoggle_forward(elementid) {
    var element = document.getElementById(elementid);
    var idx = 2;
    if (element.classList.contains("toggle-unknown")) {
        idx = 0;
    } else if (element.classList.contains("toggle-off")) {
        idx = 1;
    }
    var newvalue = (idx + 1) >= 3 ? 0 : idx + 1;
    rootRef.child("settings").child(elementid).set(newvalue);
}

function tritoggle_reverse(elementid) {
    var element = document.getElementById(elementid);
    var idx = 2;
    if (element.classList.contains("toggle-unknown")) {
        idx = 0;
    } else if (element.classList.contains("toggle-off")) {
        idx = 1;
    }
    var newvalue = (idx - 1) < 0 ? 2 : idx - 1;
    rootRef.child("settings").child(elementid).set(newvalue);
}

function display_counts(elementid, value) {
    conds_with_counts = ["Stones", "Medallions", "Dungeons", "Spiders", "Hearts", "Triforce"]
    if (elementid == "bridgecondition")
        document.getElementById("bridgecount").style.display = (conds_with_counts.indexOf(value) >= 0) ? "inline" : "none";
    else
        document.getElementById("gbkcount").style.display = (conds_with_counts.indexOf(value) >= 0) ? "inline" : "none";
}