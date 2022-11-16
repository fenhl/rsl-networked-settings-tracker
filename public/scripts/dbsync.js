// User ID
var uid = undefined;
// Room ID
var roomid = location.pathname.replace(/\/$/, "").split("/").pop().toLowerCase();

// Parse url controls
var password_override = "";
var urlquery = location.search.replace(/\/$/, "").split("?").pop().toLowerCase().split("&");
for (let i = 0; i < urlquery.length; i++) {
    if (urlquery[i].includes("password=")) {
        password_override = urlquery[i].substr(urlquery[i].indexOf("=") + 1);
    } else if (urlquery[i].toLowerCase().includes("theme=light")) {
        document.getElementById("light-theme").removeAttribute("media");
    } else if (urlquery[i].toLowerCase().includes("theme=dark")) {
        document.getElementById("light-theme").remove();
    }
}
var authAttempted = false;
// Database root reference
var rootRef = {};


// Function called when page is first opened to log into db via anonymous uid
function init(callback) {
    firebase.auth().onAuthStateChanged(function(user) {
        if(user) {
            uid = user.uid;
            rootRef = firebase.database().ref('games/' + roomid);
            callback();
        }
        else {
            console.log("Auth state not logged in");
            if(authAttempted) return;
            authAttempted = true;
            firebase.auth().signInAnonymously().catch(function(error) {
                console.log(error);
            });
        }
    });
}

function init_tracker() {
    var initialized = null;
    rootRef.child('settings').on('child_added', function (data) {
      setItemState(data.key, data.val());
    });
    rootRef.child('settings').on('child_changed', function (data) {
      setItemState(data.key, data.val());
    });
    rootRef.child('settings').on('child_removed', function (data) {
      setItemState(data.key, false);
    });
    rootRef.child('owner').on('value', function (data) {
      initialized = !!data.val();
      document.getElementById('notInitialized').hidden = initialized;
      document.getElementById('setPasscode').innerText = initialized ? 'Enter passcode' : 'Initialize room w/passcode';
      document.getElementById('ownerControls').hidden = !(initialized && (data.val() === uid));
    });
    setTimeout(() => {
        if (password_override === "") {
            return;
        }
        console.log("Override password set, handle it");
        if (initialized == false) { // create room
            set_password(password_override);
        } else { // add to editors if room already exists
            rootRef.child('editors').child(uid).set(password_override, function(error) {
                if (error) {
                    console.log("Did not add to editors on page load");
                    console.log(error);
                } else {
                    console.log("Added to editors successfully due password set in url");
                }
            });
        }
    }, 2500); //small timeout to catch potential firebase delay
  }

// Set the room password
function set_password(presetPW = null) { // if preset password is provided, allow it to be used for auth
    var passcode = (presetPW != null) ? presetPW : document.getElementById("password").value;
    if (presetPW) { // enter preset password into input field for clarity
        document.getElementById("password").value = presetPW;
    }
    if (document.getElementById('notInitialized').hidden) {
        rootRef.child('editors').child(uid).set(passcode);
    } else {
        var editors = {};
        editors[uid] = true;
        rootRef.set({
            owner: uid,
            passcode: passcode,
            editors: editors
        });
    }
}

// Destroy the database entry including owner and authorized users
function destroy_firebase() {
    rootRef.set({});
}

// Reset database to defaults
function reset_firebase() {
    rootRef.child('settings').set({});
}

// Update the item states. Triggers on child_added, child_changed and child_removed
function setItemState(elementid, state) {
    var element = document.getElementById(elementid);
    if(element.classList.contains("toggleable") || element.classList.contains("classless-toggle")) {
        if(state)
            element.classList.remove("toggle-unknown");
        else
            if(!element.classList.contains("toggle-unknown"))
                element.classList.add("toggle-unknown");
    }
    else if(element.classList.contains("progressive")) {
        element.innerHTML = (element.classList.contains("short") ? shortprogdict : progdict)[elementid][state];
        if(state === 0 && !element.classList.contains("toggle-unknown"))
            element.classList.add("toggle-unknown");
        if(state !== 0 && element.classList.contains("toggle-unknown"))
            element.classList.remove("toggle-unknown");
        if(["bridgecondition", "gbkcondition"].indexOf(elementid) >= 0)
            display_counts(elementid, (element.classList.contains("short") ? shortprogdict : progdict)[elementid][state]);
        // When tracker is reset state=false is passed
        if(state === false)
            setItemState(elementid, 0);
    }
    else if(element.classList.contains("progressive-disable") || element.classList.contains("classless-progressive-disable")) {
        element.innerHTML = (element.classList.contains("short") ? shortprogdict : progdict)[elementid][state];
        if(state === 0 && !element.classList.contains("toggle-unknown"))
            element.classList.add("toggle-unknown");
        if(state !== 0 && element.classList.contains("toggle-unknown"))
            element.classList.remove("toggle-unknown");
        if(state === 1 && !element.classList.contains("toggle-off"))
            element.classList.add("toggle-off");
        if(state !== 1 && element.classList.contains("toggle-off"))
            element.classList.remove("toggle-off");
        // When tracker is reset state=false is passed
        if(state === false)
            setItemState(elementid, 0);
    }
    else if(element.classList.contains("counter")) {
        element.innerHTML = state;
        // Handle resets
        if(state === false)
            setItemState(elementid, 1);
    }
    else if(element.classList.contains("tri-toggle")) {
        if(state === 0 && !element.classList.contains("toggle-unknown"))
            element.classList.add("toggle-unknown");
        if(state !== 0 && element.classList.contains("toggle-unknown"))
            element.classList.remove("toggle-unknown");
        if(state === 1 && !element.classList.contains("toggle-off"))
            element.classList.add("toggle-off");
        if(state !== 1 && element.classList.contains("toggle-off"))
            element.classList.remove("toggle-off");
        // Handle resets
        if(state === false)
            setItemState(elementid, 0);
    }
}
