function personalizeElements() {
  loadAvailableGames();
  renderTournamentCards(query);
  addTournamentCardData(query);
}

var TournamentCardArray = [];
var games = ["Counter-Strike: Global Offensive", "Fall Guys", "Fortnite", "League of Legends", "Minecraft", "Overwatch", "Rocket League", "Super Smash Bros. Ultimate", "Valorant"];
var tournamentsCollection = firebase.firestore().collection("tournaments");
var query = tournamentsCollection.where("date", ">=", new Date()).where("game", "in", games);

class TournamentCard extends React.Component {
  render() {
    return (
        <div className="tournamentCard" id={"tournamentCard" + this.props.tournamentNumber}>
          <div className="tournamentCardBackground">
            <div className="tournamentCardContent" id={"tournamentContent" + this.props.tournamentNumber}>
            <img id={"tournamentWallpaper" + this.props.tournamentNumber}></img>
              <div className="tournamentCardText">
                  <h6 className="tournamentCardTitle" id={"tournamentTitle" + this.props.tournamentNumber}></h6>
                  <ul className="tournamentCardDetails">
                    <li className="tournamentDetailsList"><i className="fa fa-gamepad tournamentCardIcon" aria-hidden="true"></i><div className="tournamentCardDetail" id={"tournamentGame" + this.props.tournamentNumber}></div></li>
                    <li className="tournamentDetailsList"><i className="fa fa-calendar tournamentCardIcon" aria-hidden="true"></i><div className="tournamentCardDetail" id={"tournamentDate" + this.props.tournamentNumber}></div></li>
                    <li className="tournamentDetailsList"><i className="fa fa-user tournamentCardIcon" aria-hidden="true"></i><div className="tournamentCardDetail" id={"tournamentParticipants" + this.props.tournamentNumber}></div></li>
                  </ul>
              </div>
            </div>
          </div>
        </div>
    );
  }
}

async function loadAvailableGames() {
  games.forEach(function() {
    $("#allTeams").append('<li><a class="teamName">' + doc.data().name + '</a></li>');
  });



  firebase.firestore().collection("teams").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        $("#allTeams").append('<li><a class="teamName">' + doc.data().name + '</a></li>');
    });
  }).then(function() {
    $(function(){
      $('.teamName').on('click', function() {
          $("#team").val($(this).text());
          $("#allTeams").hide();
      });
    });
  });
}

async function renderTournamentCards(query) {
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
  });
}

async function addTournamentCardData(query) {
  var tournamentNumber = 1;
  query.get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        $('#tournamentContent' + tournamentNumber).click(function(){
          window.location = "tournament-info?tournamentId=" + doc.id;
        });

        document.getElementById("tournamentCard" + tournamentNumber).style.visibility = "visible";
        document.getElementById("tournamentWallpaper" + tournamentNumber).src = "/media/game_wallpapers/" + doc.data().game + "-" + "gameplay.jpg";
        document.getElementById("tournamentTitle" + tournamentNumber).innerHTML = doc.data().name;
        document.getElementById("tournamentGame" + tournamentNumber).innerHTML = doc.data().game;

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

        document.getElementById("tournamentDate" + tournamentNumber).innerHTML = date.getMonth() + '/' + date.getDate() + '/' + date.getFullYear() + ' @ ' + hour + ':' + date.getMinutes() + ' ' + meridiem;
        document.getElementById("tournamentParticipants" + tournamentNumber).innerHTML = (doc.data().players.length) + " Participants";


        tournamentNumber++;
    });
  });
}
