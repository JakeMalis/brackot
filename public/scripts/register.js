var jordanspeepeenumber = 0;
const nameTab = document.getElementById("nameTab");
const emailTab = document.getElementById("emailTab");
const roleTab = document.getElementById("roleTab");
const locationTab = document.getElementById("locationTab");
const gamesTab = document.getElementById("gamesTab");

function show(x){
  x.style.display = "block";
}

function hide(x){
  x.style.display = "none";
}

function next(){
  jordanspeepeenumber++;
  if (jordanspeepeenumber > 3){
    hide(nextButton);
    show(submitRegistrationButton);
  }
  if (jordanspeepeenumber < 0){
    jordanspeepeenumber = 0;
  }
  if (jordanspeepeenumber == 0){
    show(nameTab);
    hide(emailTab);
    hide(roleTab);
    hide(locationTab);
    hide(gamesTab);
  }
  if (jordanspeepeenumber == 1){
    hide(nameTab);
    show(emailTab);
    hide(roleTab);
    hide(locationTab);
    hide(gamesTab);
  }
  if (jordanspeepeenumber == 2){
    hide(nameTab);
    hide(emailTab);
    show(roleTab);
    hide(locationTab);
    hide(gamesTab);
  }
  if (jordanspeepeenumber == 3){
    hide(nameTab);
    hide(emailTab);
    hide(roleTab);
    show(locationTab);
    hide(gamesTab);
  }
  if (jordanspeepeenumber == 4){
    hide(nameTab);
    hide(emailTab);
    hide(roleTab);
    hide(locationTab);
    show(gamesTab);
  }
}
