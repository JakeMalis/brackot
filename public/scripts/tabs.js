var tabNumber = 3;
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
  if ((document.getElementById('first-name').value == "") || (document.getElementById('last-name').value == "")) {
    tabNumber--;
    alert("First or last name is empty")
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
    hide(teamTab);
    hide(gamesTab);
    hide(profilePicTab);
  }
  if (tabNumber == 1){
    hide(nameTab);
    show(emailTab);
    hide(roleTab);
    hide(teamTab);
    hide(gamesTab);
    hide(profilePicTab);
  }
  if (tabNumber == 2){
    hide(nameTab);
    hide(emailTab);
    show(roleTab);
    hide(gamesTab);
    hide(teamTab);
    hide(profilePicTab);
  }
  if (tabNumber == 3){
    hide(nameTab);
    hide(emailTab);
    hide(roleTab);
    show(gamesTab);
    hide(teamTab);
    hide(profilePicTab);
  }
  if (tabNumber == 4){
    hide(nameTab);
    hide(emailTab);
    hide(roleTab);
    hide(gamesTab);
    show(teamTab);
    hide(profilePicTab);
  }
  if (tabNumber == 5){
    hide(nameTab);
    hide(emailTab);
    hide(roleTab);
    hide(gamesTab);
    hide(teamTab);
    show(profilePicTab);
  }
}

function liveFilter() {
  var input, filter, ul, li, a, i, txtValue;
  input = document.getElementById("team");
  filter = input.value.toUpperCase();
  ul = document.getElementById("allTeams");
  li = ul.getElementsByTagName("li");

  if(input.value.length == 0) {
    ul.style.display = "none";
  } else {
    ul.style.display = "block";
  }

  for (i = 0; i < li.length; i++) {
    a = li[i].getElementsByTagName("a")[0];
    txtValue = a.textContent || a.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "block";
    } else {
      li[i].style.display = "none";
    }
  }
}
