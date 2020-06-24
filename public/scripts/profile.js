function initApp() {
  firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
          var displayName = user.displayName;
          var email = user.email;
          var emailVerified = user.emailVerified;
          var photoURL = user.photoURL;
          var isAnonymous = user.isAnonymous;
          var uid = user.uid;
          var providerData = user.providerData;
          user.providerData.forEach(function (profile) {
            console.log("Sign-in provider: " + profile.providerId);
            console.log("  Provider-specific UID: " + profile.uid);
            console.log("  Name: " + profile.displayName);
            console.log("  Email: " + profile.email);
            console.log("  Photo URL: " + profile.photoURL);
          });
          personalizeElements();
      }
      else {
        window.location = "login.html";
      }
  });
  document.getElementById('avatarUploader').addEventListener("click", uploadAvatar);
  document.getElementById('editProfileButton').addEventListener("click", editProfile);
  document.getElementById('saveProfileButton').addEventListener("click", saveProfileChanges);
}

window.onload = function() {
  initApp();
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
  firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).update({
      first: document.getElementById('firstName').value,
      last: document.getElementById('lastName').value,
      email: document.getElementById('email').value,
      highschool: document.getElementById('highschool').value,
  }).then(function() {
      console.log("Document successfully written!");
  }).catch(function(error) {
          console.error("Error writing document: ", error);
  });

  setTimeout(function(){
      saveProfile();
  }, 500);
}

function uploadAvatar(avatar) {
  var storageReference = firebase.storage().ref(firebase.auth().currentUser.uid + ".png");
  var image = avatar.target.files[0];


  storageReference.put(image).then(function(snapshot) {
    console.log('Uploaded profile image!');
    snapshot.ref.getDownloadURL().then(function(url){
        firebase.auth().currentUser.updateProfile({
            photoURL: url
        });
    });
  });
}
