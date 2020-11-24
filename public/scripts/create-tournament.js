function personalizeElements() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1;
  var yyyy = today.getFullYear();
  if(dd<10){
    dd='0'+dd
  }
  if(mm<10){
    mm='0'+mm
  }

  today = yyyy+'-'+mm+'-'+dd;
  document.getElementById("date").setAttribute("min", today);

  games.forEach((game) => {
    gameFileName = (game.toLowerCase()).replaceAll(/ /g, "").replaceAll("-","").replaceAll(".","").replaceAll("'","");
    $("#createTournamentGameCarousel").append('<label id="create' + gameFileName + 'TournamentLabel" onclick="animateGameCarousel(this.id)" class="createTournamentGamesLabel"><input name="newTournamentGame" class="createTournamentGamesRadio" type="radio" value="' + game + '""></input><picture><source srcset="../media/game_images/' + gameFileName + '.webp" type="image/webp"><img class="createTournamentGamesImage" src="../media/game_images/' + gameFileName + '.jpg"></picture></label>');
  });

}

function animateGameCarousel(selected){
  var colored = "#" + selected;
  $('.createTournamentGamesLabel').addClass('uncheckedGamesLabel');
  $(colored).removeClass('uncheckedGamesLabel');
}

function animatePrizing(selected){
  var clicked = "#" + selected + "Label";
  $('.prizingLabel').removeClass('createTournamentLabelChecked');
  $(clicked).addClass('createTournamentLabelChecked');
  if ($('#prizing').prop("checked") == true){
    $('#newTournamentPrizingRow').css("display", "inline-block");
  }
  else{
    $('#newTournamentPrizingRow').css("display", "none");
  }
}

function animatePlatform(selected){
  var clicked = "#" + selected + "Label";
  $(clicked).toggleClass('createTournamentLabelChecked');
}

function animateParticipantType(selected){
  var clicked = "#" + selected + "Label";
  $('.participantLabel').removeClass('createTournamentLabelChecked');
  $(clicked).addClass('createTournamentLabelChecked');
}

function searchGameCreateTournament(searchbar) {
    var value = $(searchbar).val().toLowerCase().replaceAll(" ","").replaceAll("'",""); // value stores the current string in the searchbar, in lowercase and with no spaces
    $("#createTournamentGameCarousel > label").each(function() {
      if ($(this).attr("id").toLowerCase().replace('label', '').replace('createtournament', '').search(value) > -1) { $(this).show(); }
      else { $(this).hide(); }
  });
}

function addTournament() { try{
  if((document.getElementById('tournamentName').value == "")
   ||(document.getElementById('tournamentDescription').value == "")
   ||(document.querySelector('input[name="newTournamentGame"]:checked').value == "" || null || undefined)
   ||(document.querySelector('input[name="newTournamentParticipantType"]:checked').value == "" || null || undefined)
 ) throw "Incomplete Form Error";

  var date = document.getElementById("date").value, time = document.getElementById("time").value;

  var firstEarnings = document.getElementById('firstEarnings').value;
  var secondEarnings = document.getElementById('secondEarnings').value;
  var thirdEarnings = document.getElementById('thirdEarnings').value;

  var entryFee = 0.00;
  var teamSize = 1;
  var privacy = "public";

  //Single Elimination, Double Elimination, Round Robin, Free-For-All
  var bracketType = "Single Elimination"

  firebase.firestore().collection("tournaments").add({
      creator: firebase.auth().currentUser.uid,
      creatorName: firebase.auth().currentUser.displayName,
      date: new Date(date + " " + time),
      description: document.getElementById('tournamentDescription').value,
      game: document.querySelector('input[name="newTournamentGame"]:checked').value,
      name: document.getElementById('tournamentName').value,
      players: [],
      platform: {
          pc: document.getElementById("pc").checked,
          xbox: document.getElementById("xbox").checked,
          ps: document.getElementById("ps").checked,
          switch: document.getElementById("switch").checked,
          mobile: document.getElementById("mobile").checked
      },
      earnings: {
          1: firstEarnings,
          2: secondEarnings,
          3: thirdEarnings
      },
      tournamentStarted: false,
      unlimited: document.getElementById("unlimited").checked,
      type: document.querySelector('input[name="newTournamentParticipantType"]:checked').value,
      entryFee: entryFee,
      teamSize: teamSize,
      privacy: privacy,
      bracketType: bracketType
  }).then(function() {
      document.getElementById("alertBox").style.display = "block";
      if(document.getElementById("alertBox").classList.contains("errorAlert")){document.getElementById("alertBox").classList.remove("errorAlert");}
      document.getElementById("alertTextBold").innerHTML = "Update: ";
      document.getElementById("alertText").innerHTML = "Your tournament has been added!";
  }).catch(function(error) {
      console.error("Error writing document: ", error);
  });
  }
  catch(error){
    document.getElementById("alertBox").style.display = "block";
    document.getElementById("alertBox").classList.add("errorAlert");
    document.getElementById("alertTextBold").innerHTML = "Error: ";
    document.getElementById("alertText").innerHTML = "Your tournament submission was incomplete. All of the required fields must be complete before submitting.";
    alert(error);
  }
}
