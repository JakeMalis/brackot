window.onload = function() {
  firebase.auth().onAuthStateChanged(function(user) {
      if (user) { personalizeElements(); }
      else { window.location = "login.html"; }
  });
}

function personalizeElements() {
  document.getElementById("avatar").src = firebase.auth().currentUser.photoURL;

  firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).get().then(function(doc) {
    if (doc.data().unlimited == true) {
      document.getElementById("unlimitedIcon").style.visibility = "visible";
    }
    if (doc.data().email_preferences.announcements == true) {
        document.getElementById("announcements").checked = "true";
    }
    if (doc.data().email_preferences.newsletter == true) {
        document.getElementById("newsletter").checked = "true";
    }
    if (doc.data().email_preferences.thirdparty == true) {
        document.getElementById("thirdparty").checked = "true";
    }
  });
}

function editProfile() {
  document.getElementById('editPreferencesButton').style.visibility = "hidden";
  document.getElementById('savePreferencesButton').style.visibility = "visible";
  document.getElementById("avatar").src = firebase.auth().currentUser.photoURL;


  document.getElementById("announcements").disabled = false;
  document.getElementById("newsletter").disabled = false;
  document.getElementById("thirdparty").disabled = false;

}

function saveProfileChanges() {
  if (document.getElementById("firstName").placeholder != document.getElementById("firstName").value) {
    firebase.auth().currentUser.updateProfile({
      displayName: document.getElementById('firstName').value + " " + document.getElementById('lastName').value,
    });
    firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).update({
        first: document.getElementById('firstName').value
    }).then(function() {
        saveProfile();
    }).catch(function(error) {
            console.error("Error writing document: ", error);
    });
  }

  if (document.getElementById("lastName").placeholder != document.getElementById("lastName").value) {
    firebase.auth().currentUser.updateProfile({
      displayName: document.getElementById('firstName').value + " " + document.getElementById('lastName').value,
    });
    firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).update({
        last: document.getElementById('lastName').value
    }).then(function() {
        saveProfile();
    }).catch(function(error) {
            console.error("Error writing document: ", error);
    });
  }

  if (document.getElementById("email").placeholder != document.getElementById("email").value) {
    $('#modal').modal();
  }

  if (document.getElementById("highschool").placeholder != document.getElementById("highschool").value) {
    firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).update({
        highschool: document.getElementById('highschool').value
    }).then(function() {
        saveProfile();
    }).catch(function(error) {
            console.error("Error writing document: ", error);
    });
  }

  if ((document.getElementById("firstName").placeholder == document.getElementById("firstName").value) && (document.getElementById("lastName").placeholder == document.getElementById("lastName").value) && (document.getElementById("email").placeholder == document.getElementById("email").value) && (document.getElementById("highschool").placeholder == document.getElementById("highschool").value)) {
    saveProfile();
  }
}
