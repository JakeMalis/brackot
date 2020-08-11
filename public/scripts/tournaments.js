const tournaments = new Array();
const TournamentCardArray = [];

function personalizeElements() {
  loadTournaments();
}

function enroll(tournamentNumber) {
  const tournament = tournaments[tournamentNumber - 1];
  var tournamentId = (tournament.date + "-" + tournament.game);

  firebase.firestore().collection("tournaments").doc(tournamentId).update({
    players: firebase.firestore.FieldValue.arrayUnion(firebase.auth().currentUser.uid)
  }).then(function() {
    refreshTournaments();
    sendConfirmationEmail(tournamentNumber);
  });
}

function sendConfirmationEmail(tournamentNumber) {
  const tournament = tournaments[tournamentNumber - 1];
  var tournamentId = (tournament.date + "-" + tournament.game);
  var game = tournament.game;
  var date = tournament.elegant_date;
  var name = tournament.name;

  var tournamentImage = "https://firebasestorage.googleapis.com/v0/b/all-star-esports/o/games%2F" + game + "-gameplay.jpg?alt=media";

  firebase.firestore().collection("mail").doc(firebase.auth().currentUser.uid + "-" + tournamentId).set({
    toUids: [firebase.auth().currentUser.uid],
    template: {
      name: 'tournament_confirmation',
      data: {
        game: game,
        name: name,
        date: date,
        id: tournamentId,
        tournamentImage: tournamentImage,
        email: firebase.auth().currentUser.email
      }
    }
  });
}

function refreshTournaments() {
  var tournamentNumber = 1;
  firebase.firestore().collection("tournaments").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        tournaments.push(doc.data());

        document.getElementById("tournamentCard" + tournamentNumber).style.visibility = "visible";
        document.getElementById("tournamentWallpaper" + tournamentNumber).src = "/media/game_wallpapers/" + doc.data().game + "-" + "gameplay.jpg";
        document.getElementById("tournamentTitle" + tournamentNumber).innerHTML = doc.data().name;
        document.getElementById("tournamentGame" + tournamentNumber).innerHTML = doc.data().game;
        document.getElementById("tournamentDate" + tournamentNumber).innerHTML = doc.data().elegant_date;
        document.getElementById("tournamentParticipants" + tournamentNumber).innerHTML = (doc.data().players.length) + " Participants";


        if ((doc.data().players).includes(firebase.auth().currentUser.uid)) {
          document.getElementById("tournamentCardButton" + tournamentNumber).className = 'tournamentCardButtonSigned';
          document.getElementById("tournamentCardButton" + tournamentNumber).innerHTML = "✓ Signed Up";
          document.getElementById("tournamentCardButton" + tournamentNumber).disabled = true;
        }

        tournamentNumber++;
    });
  });
}

/*<button className="tournamentCardButton" id={"tournamentCardButton" + this.props.tournamentNumber}>Sign Up</button>*/
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

function loadTournaments() {
  async function renderTournamentCards() {
    var tournamentNumber = 1;
    firebase.firestore().collection("tournaments").get().then(function(querySnapshot) {
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
  renderTournamentCards();
  var tournamentNumber = 1;
  firebase.firestore().collection("tournaments").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        tournaments.push(doc.data());

        $('#tournamentContent' + tournamentNumber).click(function(){
          window.location = "tournament-info?tournamentId=" + doc.id;
        });

        //This will have to change for team registration so that it says it for each registered player on a team
        if ((doc.data().players).includes(firebase.auth().currentUser.uid)) {
          document.getElementById("tournamentCardButton" + tournamentNumber).className = 'tournamentCardButtonSigned';
          document.getElementById("tournamentCardButton" + tournamentNumber).innerHTML = "✓ Signed Up";
          document.getElementById("tournamentCardButton" + tournamentNumber).disabled = true;
        }

        if ((doc.data().type) === "team") {
          document.getElementById("tournamentCardButton" + tournamentNumber).innerHTML = "Pick Team Roster";
          document.getElementById("tournamentCardButton" + tournamentNumber).onclick = function() {
            $('#chooseTeamModal').modal();
          };
        }

        document.getElementById("tournamentCard" + tournamentNumber).style.visibility = "visible";
        document.getElementById("tournamentWallpaper" + tournamentNumber).src = "/media/game_wallpapers/" + doc.data().game + "-" + "gameplay.jpg";
        document.getElementById("tournamentTitle" + tournamentNumber).innerHTML = doc.data().name;
        document.getElementById("tournamentGame" + tournamentNumber).innerHTML = doc.data().game;
        document.getElementById("tournamentDate" + tournamentNumber).innerHTML = doc.data().elegant_date;
        document.getElementById("tournamentParticipants" + tournamentNumber).innerHTML = (doc.data().players.length) + " Participants";


        tournamentNumber++;
    });
  });
}
