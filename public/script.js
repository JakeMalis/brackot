function validateEmail(email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
    {
        return (true)
    }
    return (false)
}
function passwordSignIn() {
    if (firebase.auth().currentUser) {
        firebase.auth().signOut();
        document.getElementById('sign-in').textContent = 'Sign In';
    }
    else {
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
        } else if (validateEmail(email) === false) {
            alert('Email address is not valid');
        }
    }
}
function passwordSignUp() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    if (validateEmail(email) === true) {
        firebase.auth().createUserWithEmailAndPassword(email, password).catch(
            function(error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                if (errorCode == 'auth/weak-password') {
                    alert('Password too weak')
                }
                else {
                    alert(errorMessage);
                }
            });
        firebase.auth().currentUser.sendEmailVerification().then(
            function(){
                alert('Verification Email Sent');
            });
    }
    else if (validateEmail(email) === false) {
        alert('Email address is not valid');
    }
}
function passwordReset() {
    var email = document.getElementById('email').value;
    firebase.auth().sendPasswordResetEmail(email).then(
        function() {
            alert('Password Reset Email Sent');
        }
    ).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == 'auth/invalid-email') {
            alert(errorMessage);
        } else if (errorCode == 'auth/user-not-found') {
            alert(errorMessage);
        }
    });
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
            document.getElementById('sign-in').textContent = 'Sign out';
            document.getElementById('quickstart-account-details').textContent = JSON.stringify(user, null, '  ');
        } else {
            document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
            document.getElementById('quickstart-account-details').textContent = 'null';
        }
    });
    document.getElementById('signIn').addEventListener('click', passwordSignIn, false);
    document.getElementById('register').addEventListener('click', passwordSignUp, false);
    document.getElementById('passwordReset').addEventListener('click', passwordReset, false);
}
window.onload = function() {
    initApp();
}