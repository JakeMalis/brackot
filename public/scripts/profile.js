function personalizeElements() {
  document.getElementById("profileProfilePic").src = firebase.auth().currentUser.photoURL;


  document.getElementById('avatarUploader').addEventListener("change", uploadAvatar);
  document.getElementById('editProfileButton').addEventListener("click", editProfile);
  document.getElementById('saveProfileButton').addEventListener("click", saveProfileChanges);


  firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).get().then(function(doc) {
    document.getElementById("name").placeholder = doc.data().name;
    document.getElementById("email").placeholder = firebase.auth().currentUser.email;
    //if (doc.data().teams.length === 0) { document.getElementById("team").placeholder = "None"; }
  });
  /*
  firebase.firestore().collection("teams").where("players", "array-contains", firebase.auth().currentUser.uid).get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      document.getElementById("teams").placeholder = document.getElementById("teams").placeholder + doc.data().name + ", ";
    });
  }).then(function() {
    document.getElementById("teams").placeholder = document.getElementById("teams").placeholder.slice(0, -2);
  });
  */
}

function editProfile() {
  document.getElementById('editProfileButton').style.display = "none";
  document.getElementById('saveProfileButton').style.display = "inline-block";
  document.getElementById("avatar").src = firebase.auth().currentUser.photoURL;
  document.getElementById("profileProfilePic").src = firebase.auth().currentUser.photoURL;


  document.getElementById("name").disabled = false;
  document.getElementById("name").value = document.getElementById("name").placeholder;


  document.getElementById("email").disabled = false;
  document.getElementById("email").value = document.getElementById("email").placeholder;
}

function saveProfile() {
  document.getElementById('editProfileButton').style.display = "inline-block";
  document.getElementById('saveProfileButton').style.display = "none";

  document.getElementById("avatar").src = firebase.auth().currentUser.photoURL;
  document.getElementById("profileProfilePic").src = firebase.auth().currentUser.photoURL;

  document.getElementById("name").disabled = true;
  document.getElementById("name").placeholder = document.getElementById("name").value;
  document.getElementById("name").value = "";

  document.getElementById("email").disabled = true;
  document.getElementById("email").placeholder = document.getElementById("email").value;
  document.getElementById("email").value = "";

}

function saveProfileChanges() {
  if (document.getElementById("name").placeholder != document.getElementById("name").value) {
    firebase.auth().currentUser.updateProfile({
      displayName: document.getElementById('name').value,
    });
    firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).update({
        name: document.getElementById('name').value
    }).then(function() {
        saveProfile();
    }).catch(function(error) {
            console.error("Error writing document: ", error);
    });
  }

  if (document.getElementById("email").placeholder != document.getElementById("email").value) {
    $('#modal').modal();
  }

  if ((document.getElementById("name").placeholder == document.getElementById("name").value) && (document.getElementById("email").placeholder == document.getElementById("email").value)) {
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
