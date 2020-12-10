
class TournamentCardSkeleton extends React.Component {
  render() {
    return (
      <div className="tournamentCard">
        <div className="tournamentCardBackground">
          <div className="tournamentCardContent">
            <div className="tournamentCardSkeletonWallpaper loading"></div>
            <div className="tournamentCardText">
              <h6 className="tournamentCardTitle">Loading...</h6>
              <ul className="tournamentCardDetails">
                <li className="tournamentDetailsList">
                  <i
                    className="fa fa-gamepad tournamentCardIcon"
                    aria-hidden="true"
                  ></i>
                  <div className="tournamentCardDetail">Loading...</div>
                </li>
                <li className="tournamentDetailsList">
                  <i
                    className="fa fa-calendar tournamentCardIcon"
                    aria-hidden="true"
                  ></i>
                  <div className="tournamentCardDetail">Loading...</div>
                </li>
                <li className="tournamentDetailsList">
                  <i
                    className="fa fa-user tournamentCardIcon"
                    aria-hidden="true"
                  ></i>
                  <div className="tournamentCardDetail">Loading...</div>
                </li>
              </ul>
            </div>
            <div className="tournamentCardHostBar">
              <div className="tournamentCardSkeletonHostPic"></div>
              <h6 className="tournamentCardHostName">Loading...</h6>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function loadRegisteredTournaments() {
  var TournamentCardArray = [];
  var HostedTournamentCardArray = [];
  class TournamentCard extends React.Component {
    render() {
      return (
          <div className="tournamentCard" id={this.props.role + "TournamentCard" + this.props.tournamentNumber}>
            <div className="tournamentCardBackground">
              <div className="tournamentCardContent" id={this.props.role + "TournamentContent" + this.props.tournamentNumber}>
                <img className="tournamentWallpaper" id={this.props.role + "TournamentWallpaper" + this.props.tournamentNumber}></img>
                <div className="tournamentCardText">
                    <h6 className="tournamentCardTitle" id={this.props.role + "TournamentTitle" + this.props.tournamentNumber}></h6>
                    <ul className="tournamentCardDetails">
                      <li className="tournamentDetailsList"><i className="fa fa-gamepad tournamentCardIcon" aria-hidden="true"></i><div className="tournamentCardDetail" id={this.props.role + "TournamentGame" + this.props.tournamentNumber}></div></li>
                      <li className="tournamentDetailsList"><i className="fa fa-calendar tournamentCardIcon" aria-hidden="true"></i><div className="tournamentCardDetail" id={this.props.role + "TournamentDate" + this.props.tournamentNumber}></div></li>
                      <li className="tournamentDetailsList"><i className="fa fa-user tournamentCardIcon" aria-hidden="true"></i><div className="tournamentCardDetail" id={this.props.role + "TournamentParticipants" + this.props.tournamentNumber}></div></li>
                    </ul>
                </div>
                <div className="tournamentCardHostBar">
                  <img className="tournamentCardHostPic" id={this.props.role + "TournamentHostPic" + this.props.tournamentNumber} src="media/BrackotLogo2.jpg"></img>
                  <h6 className="tournamentCardHostName" id={this.props.role + "TournamentHostName" + this.props.tournamentNumber}></h6>
                </div>
              </div>
            </div>
          </div>
      );
    }
  }

  async function renderTournamentCards() {
    var renderTournamentNumber = 1;
    firebase.firestore().collection("tournaments").where("players", "array-contains", firebase.auth().currentUser.uid).get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
          TournamentCardArray.push(<TournamentCard role="player" tournamentNumber={renderTournamentNumber} key={renderTournamentNumber}/>);
          renderTournamentNumber++
      });
    }).then(function() {
      ReactDOM.render(
        TournamentCardArray,
        document.getElementById("myTournamentsRow")
      );
    });
  }
  renderTournamentCards();

  async function renderHostedTournamentCards() {
    var renderHostedTournamentNumber = 1;
    firebase.firestore().collection("tournaments").where("creator", "==", firebase.auth().currentUser.uid).get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
          HostedTournamentCardArray.push(<TournamentCard role="host" tournamentNumber={renderHostedTournamentNumber} key={renderHostedTournamentNumber}/>);
          renderHostedTournamentNumber++
      });
    }).then(function() {
      ReactDOM.render(
        HostedTournamentCardArray,
        document.getElementById("myHostedTournamentsRow")
      );
    });
  }
  renderHostedTournamentCards();


  firebase.firestore().collection("tournaments").where("players", "array-contains", firebase.auth().currentUser.uid).get().then(function(querySnapshot) {
    var renderTournamentNumber = 1;
    querySnapshot.forEach(function(doc) {

        $('#playerTournamentContent' + renderTournamentNumber).click(function(){
          window.location = "tournament-info?tournamentId=" + doc.id;
        });

        document.getElementById("playerTournamentCard" + renderTournamentNumber).style.visibility = "visible";
        document.getElementById("playerTournamentWallpaper" + renderTournamentNumber).src = "/media/game_wallpapers/" + (doc.data().game.toLowerCase()).replace(/ /g, "").replace("-","").replace(".","") + "-" + "cardWallpaper.jpg";
        document.getElementById("playerTournamentTitle" + renderTournamentNumber).innerHTML = doc.data().name;

        if (doc.data().game == "Counter-Strike Global Offensive") {
          document.getElementById("playerTournamentGame" + renderTournamentNumber).innerHTML = "Counter-Strike: Global Offensive";
        }
        else {
          document.getElementById("playerTournamentGame" + renderTournamentNumber).innerHTML = doc.data().game;
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

        document.getElementById("playerTournamentHostName" + renderTournamentNumber).innerHTML = doc.data().creatorName;

        var tournamentCreator = doc.data().creator;
        var gsReference = firebase.storage().refFromURL("gs://brackot-app.appspot.com/" + tournamentCreator + "/profile");
        var nNumber = renderTournamentNumber;
        gsReference.getDownloadURL().then(function (url) {
          document.getElementById("playerTournamentHostPic" + nNumber).src = url;
        }).catch((error) => {
            //console.log(error);
        });

        document.getElementById("playerTournamentDate" + renderTournamentNumber).innerHTML = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear() + ' @ ' + hour + ':' + String(date.getMinutes()).padStart(2, "0") + ' ' + meridiem;
        document.getElementById("playerTournamentParticipants" + renderTournamentNumber).innerHTML = (doc.data().players.length) + " Participants";


        renderTournamentNumber++;
    });
  });

  firebase.firestore().collection("tournaments").where("creator", "==", firebase.auth().currentUser.uid).get().then(function(querySnapshot) {
    var renderHostedTournamentNumber = 1;
    querySnapshot.forEach(function(doc) {

        $('#hostTournamentContent' + renderHostedTournamentNumber).click(function(){
          window.location = "tournament-info?tournamentId=" + doc.id;
        });

        document.getElementById("hostTournamentCard" + renderHostedTournamentNumber).style.visibility = "visible";
        document.getElementById("hostTournamentWallpaper" + renderHostedTournamentNumber).src = "/media/game_wallpapers/" + (doc.data().game.toLowerCase()).replace(/ /g, "").replace("-","").replace(".","") + "-" + "cardWallpaper.jpg";
        document.getElementById("hostTournamentTitle" + renderHostedTournamentNumber).innerHTML = doc.data().name;

        if (doc.data().game == "Counter-Strike Global Offensive") {
          document.getElementById("hostTournamentGame" + renderHostedTournamentNumber).innerHTML = "Counter-Strike: Global Offensive";
        }
        else {
          document.getElementById("hostTournamentGame" + renderHostedTournamentNumber).innerHTML = doc.data().game;
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

        document.getElementById("hostTournamentHostName" + renderHostedTournamentNumber).innerHTML = doc.data().creatorName;

        var tournamentCreator = doc.data().creator;
        var gsReference = firebase.storage().refFromURL("gs://brackot-app.appspot.com/" + tournamentCreator + "/profile");
        var nNumber = renderHostedTournamentNumber;
        gsReference.getDownloadURL().then(function (url) {
          document.getElementById("hostTournamentHostPic" + nNumber).src = url;
        }).catch((error) => {
            //console.log(error);
        });

        document.getElementById("hostTournamentDate" + renderHostedTournamentNumber).innerHTML = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear() + ' @ ' + hour + ':' + String(date.getMinutes()).padStart(2, "0") + ' ' + meridiem;
        document.getElementById("hostTournamentParticipants" + renderHostedTournamentNumber).innerHTML = (doc.data().players.length) + " Participants";


        renderHostedTournamentNumber++;
    });
  });
}



function personalizeElements() {
  ReactDOM.render(
    new Array(4).fill('').map((_, index) => <TournamentCardSkeleton key={index} />),
    document.getElementById("myTournamentsRow")
  );
  ReactDOM.render(
    new Array(4).fill('').map((_, index) => <TournamentCardSkeleton key={index} />),
    document.getElementById("myHostedTournamentsRow")
  );
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
    }
  }).then(function() {
    firebase.firestore().collection("tournaments").where("creator", "==", firebase.auth().currentUser.uid).get().then(function(querySnapshot) {
      if (!querySnapshot.empty) {
        document.getElementById("myHostedTournaments").style.display = "flex";
      }
    });
  }).then(function() {
    loadRegisteredTournaments();
  });
}
