// User ID
var uid = undefined;
// Room ID
var roomid = location.pathname.replace(/\/$/, "").split("/").pop().toLowerCase();

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
  }

// Set the room password
function set_password() {
    var passcode = document.getElementById("password").value;
    if(document.getElementById('notInitialized').hidden) {
        rootRef.child('editors').child(uid).set(passcode);
    }
    else {
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
        element.innerHTML = progdict[elementid][state];
        if(state === 0 && !element.classList.contains("toggle-unknown"))
            element.classList.add("toggle-unknown");
        if(state !== 0 && element.classList.contains("toggle-unknown"))
            element.classList.remove("toggle-unknown");
        if(["bridgecondition", "gbkcondition"].indexOf(elementid) >= 0)
            display_counts(elementid, progdict[elementid][state]);
        // When tracker is reset state=false is passed
        if(state === false)
            setItemState(elementid, 0);
    }
    else if(element.classList.contains("progressive-disable")) {
        element.innerHTML = progdict[elementid][state];
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
