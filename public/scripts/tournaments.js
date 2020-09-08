function personalizeElements() {
  $("#gameList").append('<li class="filterListItem gameFilterListItem"><label class="filterOption"><input class="filterInput" type="radio"><p class="filterText">All</p></input></label></li>');
  $("#dateList").append('<li class="filterListItem dateFilterListItem"><label class="filterOption"><input class="filterInput" type="radio"><p class="filterText">All</p></input></label></li>');
  games.forEach(function(entry) {
    $("#gameList").append('<li class="filterListItem gameFilterListItem"><label class="filterOption"><input class="filterInput" type="radio"><p class="filterText">' + entry + '</p></input></label></li>');
  });
  dateOptions.forEach(function(entry) {
    $("#dateList").append('<li class="filterListItem dateFilterListItem"><label class="filterOption"><input class="filterInput" type="radio"><p class="filterText">' + entry + '</p></input></label></li>');
  });
  filterData();
  renderTournamentCards();
}

var games = ["Counter-Strike Global Offensive", "Fall Guys", "Fortnite", "League of Legends", "Minecraft", "Overwatch", "Rocket League", "Super Smash Bros. Ultimate", "Valorant"];
var selectedGame = games;
var tournamentsCollection = firebase.firestore().collection("tournaments");
var date = new Date();
var dateOperator = ">=";
var dateOptions = ["Today", "This Week", "This Month"];
var filteredDate = new Date();
var query = tournamentsCollection.where("date", ">=", new Date()).where("date", dateOperator, filteredDate).where("game", "in", games);

class TournamentCard extends React.Component {
  render() {
    return (
        <div className="tournamentCard" id={"tournamentCard" + this.props.tournamentNumber}>
          <div className="tournamentCardBackground">
            <div className="tournamentCardContent" id={"tournamentContent" + this.props.tournamentNumber}>
              <img className="tournamentWallpaper" id={"tournamentWallpaper" + this.props.tournamentNumber}></img>
              <div className="tournamentCardText">
                  <h6 className="tournamentCardTitle" id={"tournamentTitle" + this.props.tournamentNumber}></h6>
                  <ul className="tournamentCardDetails">
                    <li className="tournamentDetailsList"><i className="fa fa-gamepad tournamentCardIcon" aria-hidden="true"></i><div className="tournamentCardDetail" id={"tournamentGame" + this.props.tournamentNumber}></div></li>
                    <li className="tournamentDetailsList"><i className="fa fa-calendar tournamentCardIcon" aria-hidden="true"></i><div className="tournamentCardDetail" id={"tournamentDate" + this.props.tournamentNumber}></div></li>
                    <li className="tournamentDetailsList"><i className="fa fa-user tournamentCardIcon" aria-hidden="true"></i><div className="tournamentCardDetail" id={"tournamentParticipants" + this.props.tournamentNumber}></div></li>
                  </ul>
              </div>
              <div className="tournamentCardHostBar">
                <img className="tournamentCardHostPic" id={"tournamentHostPic" + this.props.tournamentNumber} src="media/BrackotLogo2.jpg"></img>
                <h6 className="tournamentCardHostName" id={"tournamentHostName" + this.props.tournamentNumber}></h6>
              </div>
            </div>
          </div>
        </div>
    );
  }
}

async function filterData() {
  $(function(){
    $('.gameFilterListItem').on('click', function() {
        $("#gameLabelField").html($(this).text());
        $("#gamePopup").removeClass("show");
        $("#gameButtonLabel").removeClass("filterButtonLabelActive");
        if ($(this).text() === "All") { selectedGame = games; }
        else { selectedGame = [$(this).text()]; }
        query = tournamentsCollection.where("date", ">=", new Date()).where("date", dateOperator, filteredDate).where("game", "in", selectedGame);
        renderTournamentCards();
        addTournamentCardData();
    });
    $('.dateFilterListItem').on('click', function() {
        $("#dateLabelField").html($(this).text());
        $("#datePopup").removeClass("show");
        $("#dateButtonLabel").removeClass("filterButtonLabelActive");
        if ($(this).text() === "All") { dateOperator = ">="; filteredDate = new Date(); }
        else if ($(this).text() === "Today") { dateOperator = "<="; filteredDate = new Date(new Date().setDate(new Date().getDate() + 1)); }
        else if ($(this).text() === "This Week") { dateOperator = "<="; filteredDate = new Date(new Date().setDate(new Date().getDate() + 7)); }
        else if ($(this).text() === "This Month") { dateOperator = "<="; filteredDate = new Date(new Date().setMonth(new Date().getMonth() + 1)); }
        query = tournamentsCollection.where("date", ">=", new Date()).where("date", dateOperator, filteredDate).where("game", "in", selectedGame);
        renderTournamentCards();
    });
  });
}

async function renderTournamentCards() {
  var TournamentCardArray = [];
  var tournamentNumber = 1;
  query.get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        TournamentCardArray.push(<TournamentCard tournamentNumber={tournamentNumber} />);
        tournamentNumber++
    });
  }).then(function() {
    ReactDOM.render(
      TournamentCardArray,
      document.getElementById("row")
    );
  }).then(function() {
    addTournamentCardData();
  });
}

async function addTournamentCardData() {
  var tournamentNumber = 1;
  query.get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        $('#tournamentContent' + tournamentNumber).click(function(){
          window.location = "tournament-info?tournamentId=" + doc.id;
        });

        document.getElementById("tournamentCard" + tournamentNumber).style.visibility = "visible";
        document.getElementById("tournamentWallpaper" + tournamentNumber).src = "/media/game_wallpapers/" + (doc.data().game.toLowerCase()).replace(/ /g, "").replace("-","").replace(".","") + "-" + "cardWallpaper.jpg";
        document.getElementById("tournamentTitle" + tournamentNumber).innerHTML = doc.data().name;
        if (doc.data().game == "Counter-Strike Global Offensive") {
          document.getElementById("tournamentGame" + tournamentNumber).innerHTML = "Counter-Strike: Global Offensive";
        }
        else {
          document.getElementById("tournamentGame" + tournamentNumber).innerHTML = doc.data().game;
        }
        document.getElementById("tournamentHostName" + tournamentNumber).innerHTML = doc.data().creatorName;

        var tournamentCreator = doc.data().creator;
        var gsReference = firebase.storage().refFromURL("gs://brackot-app.appspot.com/" + tournamentCreator + "/profile");
        var nNumber = tournamentNumber;
        gsReference.getDownloadURL().then(function (url) {
          document.getElementById("tournamentHostPic" + nNumber).src = url;
        }).catch((error) => {
            //console.log(error);
        });


        var date = new Date(doc.data().date.toDate());
        var hour;
        var meridiem;

        if ((date.getHours() - 12) <= 0) {
          hour = date.getHours();
          meridiem = "A.M."
        }
        else {
          hour = date.getHours() - 12;
          meridiem = "P.M."
        }

        document.getElementById("tournamentDate" + tournamentNumber).innerHTML = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear() + ' @ ' + hour + ':' + date.getMinutes() + ' ' + meridiem;
        document.getElementById("tournamentParticipants" + tournamentNumber).innerHTML = (doc.data().players.length) + " Participants";


        tournamentNumber++;
    });
  });
}
