function createUser() {
  firebase.auth().createUserWithEmailAndPassword(document.getElementById('email').value, document.getElementById('password').value).catch(
    function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == 'auth/invalid-email') {
          alert('Email address is invalid.');
        }
        else if (errorCode == 'auth/weak-password') {
          alert('Password too weak');
        }
        else {
          alert(errorMessage);
        }
    }
  );
  firebase.auth().onAuthStateChanged(function(user) { if (user) { next(); }});
}

function register() {
  firebase.auth().currentUser.sendEmailVerification();
  firebase.auth().currentUser.updateProfile({
    displayName: document.getElementById('first-name').value + " " + document.getElementById('last-name').value
  });
  if (document.getElementById("player").checked) {
    db.collection("users").doc(firebase.auth().currentUser.uid).set({
        first: document.getElementById('first-name').value,
        last: document.getElementById('last-name').value,
        email: document.getElementById('email').value,
        state: document.getElementById('state').value,
        highschool: document.getElementById('highschool').value,
        role: "player",
        coins: 0,
        notifications: 0,
        matches: 0,
        wins: 0,
        boost: false,
        games: {
            fortnite: document.getElementById("fortnite").checked,
            overwatch: document.getElementById("overwatch").checked,
            smash: document.getElementById("smash").checked,
            valorant: document.getElementById("valorant").checked
        }
    }).then(function() {
        window.location = "index.html";
    }).catch(function(error) {
            console.error("Error writing document: ", error);
    });
  }
  else if (document.getElementById("coach").checked) {
    db.collection("users").doc(firebase.auth().currentUser.uid).set({
        first: document.getElementById('first-name').value,
        last: document.getElementById('last-name').value,
        email: document.getElementById('email').value,
        state: document.getElementById('state').value,
        highschool: document.getElementById('highschool').value,
        role: "coach"
    }).then(function() {
        window.location = "index.html";
    }).catch(function(error) {
            console.error("Error writing document: ", error);
    });
  }
}

function uploadAvatar(avatar) {
  var storageReference = firebase.storage().ref(firebase.auth().currentUser.uid);
  var avatarReference = storageReference.child("profile.png");
  var image = avatar.target.files[0];

  avatarReference.put(image).then(function(snapshot) {
    console.log('Uploaded profile image!');
    snapshot.ref.getDownloadURL().then(function(url){
        firebase.auth().currentUser.updateProfile({
            photoURL: url
        });
        document.getElementById("addProfilePic").src = url;
    });
  });
  if (firebase.auth().currentUser.photoURL = "null") { firebase.auth().currentUser.updateProfile({ photoURL: "media/avatar.png" }); }
}

window.onload = function() {
  document.getElementById('submitRegistrationButton').addEventListener("click", register);
  document.getElementById('userCreate').addEventListener("click", createUser);
  document.getElementById('avatarUploader').addEventListener("change", uploadAvatar);
}
