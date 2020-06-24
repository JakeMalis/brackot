var tabNumber = 0;
const nameTab = document.getElementById("nameTab");
const emailTab = document.getElementById("emailTab");
const roleTab = document.getElementById("roleTab");
const gamesTab = document.getElementById("gamesTab");
const locationTab = document.getElementById("locationTab");
const profilePicTab = document.getElementById("profilePicTab");

function show(x){
  x.style.display = "block";
}

function hide(x){
  x.style.display = "none";
}

function next(){
  tabNumber++;
  if (tabNumber > 5){
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
    hide(profilePicTab);
  }
  if (tabNumber == 1){
    hide(nameTab);
    show(emailTab);
    hide(roleTab);
    hide(locationTab);
    hide(gamesTab);
    hide(profilePicTab);
  }
  if (tabNumber == 2){
    hide(nameTab);
    hide(emailTab);
    show(roleTab);
    hide(locationTab);
    hide(gamesTab);
    hide(profilePicTab);
  }
  if (tabNumber == 3){
    hide(nameTab);
    hide(emailTab);
    hide(roleTab);
    hide(locationTab);
    show(gamesTab);
    hide(profilePicTab);
  }
  if (tabNumber == 4){
    hide(nameTab);
    hide(emailTab);
    hide(roleTab);
    show(locationTab);
    hide(gamesTab);
    hide(profilePicTab);
  }
  if (tabNumber == 5){
    hide(nameTab);
    hide(emailTab);
    hide(roleTab);
    hide(locationTab);
    hide(gamesTab);
    show(profilePicTab);
  }
}
