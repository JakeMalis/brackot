var tabNumber = 0;
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
  tabNumber++;
  if (tabNumber > 4){
    hide(nextButton);
    show(submitRegistrationButton);
  }
  if (document.getElementById('coach').checked) {
    tabNumber++;
  }
  if (tabNumber < 0){
    tabNumber = 0;
  }
  if (tabNumber == 0){
    show(nameTab);
    hide(emailTab);
    hide(roleTab);
    hide(locationTab);
    hide(gamesTab);
  }
  if (tabNumber == 1){
    hide(nameTab);
    show(emailTab);
    hide(roleTab);
    hide(locationTab);
    hide(gamesTab);
  }
  if (tabNumber == 2){
    hide(nameTab);
    hide(emailTab);
    show(roleTab);
    hide(locationTab);
    hide(gamesTab);
  }
  if (tabNumber == 3){
    hide(nameTab);
    hide(emailTab);
    hide(roleTab);
    hide(locationTab);
    show(gamesTab);
  }
  if (tabNumber == 4){
    hide(nameTab);
    hide(emailTab);
    hide(roleTab);
    show(locationTab);
    hide(gamesTab);
  }
}
