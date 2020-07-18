function personalizeElements() {
  document.getElementById("profileProfilePic").src = firebase.auth().currentUser.photoURL;

  
  document.getElementById('avatarUploader').addEventListener("change", uploadAvatar);
  document.getElementById('editProfileButton').addEventListener("click", editProfile);
  document.getElementById('saveProfileButton').addEventListener("click", saveProfileChanges);


  firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).get().then(function(doc) {
    document.getElementById("firstName").placeholder = doc.data().first;
  });

  firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).get().then(function(doc) {
    document.getElementById("lastName").placeholder = doc.data().last;
  });

  firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).get().then(function(doc) {
    document.getElementById("email").placeholder = firebase.auth().currentUser.email;
  });

  firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).get().then(function(doc) {
    document.getElementById("team").placeholder = doc.data().team;
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

function updateEmail() {
  const confirmedPassword = document.getElementById("passwordConfirmation").value;
  const user = firebase.auth().currentUser;

  const credential = firebase.auth.EmailAuthProvider.credential(
      user.email,
      confirmedPassword
  );
  user.reauthenticateWithCredential(credential).then(function() {
    user.updateEmail(document.getElementById('email').value);
    firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).update({
        email: document.getElementById('email').value
    }).then(function() {
        saveProfile();
        $('#modal').modal('hide');
        firebase.auth().currentUser.sendEmailVerification();
    }).catch(function(error) {
            console.error("Error writing document: ", error);
    });
  });
}

function uploadAvatar(avatar) {
  var storageReference = firebase.storage().ref(firebase.auth().currentUser.uid);
  var avatarReference = storageReference.child("profile");
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
