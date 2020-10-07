function createUser() {
  firebase.app().functions('us-east1').httpsCallable('registration-createUserAccount')({
    email: document.getElementById('email').value,
    password: document.getElementById('password').value,
    displayName: document.getElementById('name').value,
  }).then((result) => {
    firebase.auth().signInWithEmailAndPassword(document.getElementById('email').value, document.getElementById('password').value);
    firebase.auth().onAuthStateChanged(function(user) { if (user) { window.location = "dashboard.html"; }});
  }).catch((error) => {
    var errorCode = error.message;
    var errorMessage = error.details;
    console.log(errorCode);

    if (errorCode == 'auth/invalid-email') {
      document.getElementById("alertBox").style.display = "block";
      document.getElementById("alertBox").classList.add("errorAlert");
      document.getElementById("alertTextBold").innerHTML = "Error: ";
      document.getElementById("alertText").innerHTML = "The email address you have entered is invalid. Please ensure you are entering a real email address.";
      var email = document.getElementById('email');
      email.style.borderColor = '#f44336';
      email.classList.add('error');
      setTimeout(function() {
        email.classList.remove('error');
      }, 300);
    }
    else if (errorCode == 'auth/email-already-exists') {
      document.getElementById("alertBox").style.display = "block";
      document.getElementById("alertBox").classList.add("errorAlert");
      document.getElementById("alertTextBold").innerHTML = "Error: ";
      document.getElementById("alertText").innerHTML = "The email address you have entered is already in use. Please try using another email address.";
      var email = document.getElementById('email');
      email.style.borderColor = '#f44336';
      email.classList.add('error');
      setTimeout(function() {
        email.classList.remove('error');
      }, 300);
    }
    else if (errorCode == 'auth/invalid-password') {
      document.getElementById("alertBox").style.display = "block";
      document.getElementById("alertBox").classList.add("errorAlert");
      document.getElementById("alertTextBold").innerHTML = "Error: ";
      document.getElementById("alertText").innerHTML = "The password you have entered is too weak. Please enter a more secure password.";
      var password = document.getElementById('password');
      password.style.borderColor = '#f44336';
      password.classList.add('error');
      setTimeout(function() {
        email.classList.remove('error');
      }, 300);
      error.preventDefault();
    }
  });
}
