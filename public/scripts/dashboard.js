function loadRegisteredTournaments() {
  var TournamentCardArray = [];

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

  async function renderTournamentCards() {
    var tournamentNumber = 1;
    firebase.firestore().collection("tournaments").where("players", "array-contains", firebase.auth().currentUser.uid).get().then(function(querySnapshot) {
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
  firebase.firestore().collection("tournaments").where("players", "array-contains", firebase.auth().currentUser.uid).get().then(function(querySnapshot) {
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

        document.getElementById("tournamentHostName" + tournamentNumber).innerHTML = doc.data().creatorName;

        var tournamentCreator = doc.data().creator;
        var gsReference = firebase.storage().refFromURL("gs://brackot-app.appspot.com/" + tournamentCreator + "/profile");
        var nNumber = tournamentNumber;
        gsReference.getDownloadURL().then(function (url) {
          document.getElementById("tournamentHostPic" + nNumber).src = url;
        }).catch((error) => {
            //console.log(error);
        });

        document.getElementById("tournamentDate" + tournamentNumber).innerHTML = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear() + ' @ ' + hour + ':' + date.getMinutes() + ' ' + meridiem;
        document.getElementById("tournamentParticipants" + tournamentNumber).innerHTML = (doc.data().players.length) + " Participants";


        tournamentNumber++;
    });
  });
}

function personalizeElements() {
  firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).get().then(function(doc) {
    document.getElementById("firstGreetingMessage").innerHTML = "Welcome back, " + firebase.auth().currentUser.displayName + "!";
    document.getElementById("notifications").innerHTML = doc.data().stats.notifications;
    document.getElementById("matches").innerHTML = doc.data().stats.matchesPlayed;
    document.getElementById("coins").innerHTML = doc.data().stats.coins;
    document.getElementById("wins").innerHTML = doc.data().stats.wins;
  });

  firebase.firestore().collection("tournaments").where("players", "array-contains", firebase.auth().currentUser.uid).get().then(function(querySnapshot) {
    if (!querySnapshot.empty) {
      document.getElementById("myTournaments").style.display = "flex";
      loadRegisteredTournaments();
    }
  });

}
