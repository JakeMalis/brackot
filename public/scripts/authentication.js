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
          firebase.auth().currentUser.sendEmailVerification().then(
              function () {
                  alert('Verification Email Sent');
              });
          window.location = "dashboard/index.html";
      } else if (validateEmail(email) === false) {
          alert('Email address is not valid');
      }
}

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
            document.getElementById('quickstart-sign-in-status').textContent = 'Signed in';
            document.getElementById('quickstart-account-details').textContent = JSON.stringify(user, null, '  ');
            window.location = "logout.html";
        } else {
            document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
            document.getElementById('quickstart-account-details').textContent = 'null';
        }
    });
    document.getElementById('loginBtn').addEventListener('click', passwordSignIn, false);
}

window.onload = function() {
    initApp();
}
