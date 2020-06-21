function validateEmail(email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
    {
        return (true)
    }
    return (false)
}

function passwordSignIn() {
      var email = document.getElementById('email').value;
      var password = document.getElementById('password').value;
      if (validateEmail(email) === true) {
          firebase.auth().signInWithEmailAndPassword(email, password).catch(
              function (error) {
                  var errorCode = error.code;
                  var errorMessage = error.message;
                  if (errorCode == 'auth/wrong-password') {
                      alert('Incorrect password')
                  } else {
                      alert(errorMessage);
                  }
              });
      } else if (validateEmail(email) === false) {
          alert('Email address is not valid');
      }
}

function initApp() {
  var user = firebase.auth().currentUser;
  if (user) {
    user.providerData.forEach(function (profile) {
      console.log("Sign-in provider: " + profile.providerId);
      console.log("  Provider-specific UID: " + profile.uid);
      console.log("  Name: " + profile.displayName);
      console.log("  Email: " + profile.email);
      console.log("  Photo URL: " + profile.photoURL);
    });
  }
  else { console.log("Not signed in"); }

  document.getElementById('loginBtn').addEventListener("click", passwordSignIn);

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
          window.location = "index.html";
      }
  });
}

window.onload = function() {
  setTimeout(function(){
      initApp();
  }, 500);
}
