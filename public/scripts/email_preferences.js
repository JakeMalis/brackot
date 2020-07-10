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

function saveProfile() {
  document.getElementById('editPreferencesButton').style.visibility = "visible";
  document.getElementById('savePreferencesButton').style.visibility = "hidden";


  document.getElementById("announcements").disabled = true;
  document.getElementById("newsletter").disabled = true;
  document.getElementById("thirdparty").disabled = true;

  firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).update({
    email_preferences: {
      announcements: document.getElementById("announcements").checked,
      newsletter: document.getElementById("newsletter").checked,
      thirdparty: document.getElementById("thirdparty").checked
    }
  });
}
