window.onload = function() {
  firebase.auth().onAuthStateChanged(function(user) {
      if (user) { personalizeElements(); }
      else { window.location = "login.html"; }
  });
  document.getElementById('avatarUploader').addEventListener("change", uploadAvatar);
  document.getElementById('editProfileButton').addEventListener("click", editProfile);
  document.getElementById('saveProfileButton').addEventListener("click", saveProfileChanges);
}

function personalizeElements() {
  document.getElementById("avatar").src = firebase.auth().currentUser.photoURL;
  document.getElementById("profileProfilePic").src = firebase.auth().currentUser.photoURL;

  var userDocument = firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid);

  userDocument.get().then(function(doc) {
    document.getElementById("firstName").placeholder = doc.data().first;
  });

  userDocument.get().then(function(doc) {
    document.getElementById("lastName").placeholder = doc.data().last;
  });

  userDocument.get().then(function(doc) {
    document.getElementById("email").placeholder = doc.data().email;
  });

  userDocument.get().then(function(doc) {
    document.getElementById("highschool").placeholder = doc.data().highschool;
  });
}

function editProfile() {
  document.getElementById('editProfileButton').style.visibility = "hidden";
  document.getElementById('saveProfileButton').style.visibility = "visible";
  document.getElementById("avatar").src = firebase.auth().currentUser.photoURL;
  document.getElementById("profileProfilePic").src = firebase.auth().currentUser.photoURL;


  document.getElementById("firstName").disabled = false;
  document.getElementById("firstName").value = document.getElementById("firstName").placeholder;

  document.getElementById("lastName").disabled = false;
  document.getElementById("lastName").value = document.getElementById("lastName").placeholder;

  document.getElementById("email").disabled = false;
  document.getElementById("email").value = document.getElementById("email").placeholder;

  document.getElementById("highschool").disabled = false;
  document.getElementById("highschool").value = document.getElementById("highschool").placeholder;
}

function saveProfile() {
  document.getElementById('editProfileButton').style.visibility = "visible";
  document.getElementById('saveProfileButton').style.visibility = "hidden";

  document.getElementById("avatar").src = firebase.auth().currentUser.photoURL;
  document.getElementById("profileProfilePic").src = firebase.auth().currentUser.photoURL;

  document.getElementById("firstName").disabled = true;
  document.getElementById("firstName").placeholder = document.getElementById("firstName").value;
  document.getElementById("firstName").value = "";

  document.getElementById("lastName").disabled = true;
  document.getElementById("lastName").placeholder = document.getElementById("lastName").value;
  document.getElementById("lastName").value = "";

  document.getElementById("email").disabled = true;
  document.getElementById("email").placeholder = document.getElementById("email").value;
  document.getElementById("email").value = "";

  document.getElementById("highschool").disabled = true;
  document.getElementById("highschool").placeholder = document.getElementById("highschool").value;
  document.getElementById("highschool").value = "";

}

function saveProfileChanges() {
  firebase.auth().currentUser.updateProfile({
    displayName: document.getElementById('firstName').value + " " + document.getElementById('lastName').value,
  });

  if (document.getElementById("firstName").placeholder != document.getElementById("firstName").value) {
    firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).update({
        first: document.getElementById('firstName').value
    }).then(function() {
        saveProfile();
    }).catch(function(error) {
            console.error("Error writing document: ", error);
    });
  }

  if (document.getElementById("lastName").placeholder != document.getElementById("lastName").value) {
    firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).update({
        last: document.getElementById('lastName').value
    }).then(function() {
        saveProfile();
    }).catch(function(error) {
            console.error("Error writing document: ", error);
    });
  }

  if (document.getElementById("email").placeholder != document.getElementById("email").value) {
    firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).update({
        email: document.getElementById('email').value
    }).then(function() {
        saveProfile();
    }).catch(function(error) {
            console.error("Error writing document: ", error);
    });
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
        document.getElementById("profileProfilePic").src = url;
        document.getElementById("avatar").src = url;
    });
  });
}
