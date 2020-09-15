class ParticipantCard extends React.Component {
  render() {
    return(
      <div className={"participantCard"} id={"participantCard" + this.props.participantInfoNumber}>
        <img className={"participantCardPic"} id={"participantCardPic" + this.props.participantInfoNumber}></img>
        <p className={"participantCardName"} id={"participantCardName" + this.props.participantInfoNumber}></p>
      </div>
    );
  }
}

function renderParticipants(){
  var ParticipantCards = [];
  firebase.firestore().collection("tournaments").doc(tournamentId).get().then(async function(doc) {
      var participantInfoNumber = 1;

      doc.data().players.forEach(function(participant) {
        ParticipantCards.push(<ParticipantCard participantInfoNumber={participantInfoNumber}/>);
        participantInfoNumber++;
      });
    }).then(function() {
      ReactDOM.render(
        ParticipantCards,
        document.getElementById("participantsTab")
      );
    }).then(function() {
    loadParticipantData();
  });
}

function loadParticipantData(){
  firebase.firestore().collection("tournaments").doc(tournamentId).get().then(function(doc) {
      var participantNumber = 1;
      var players = doc.data().players;
      players.forEach(function(entry) {
        participantInfoLoadingFunction(entry, participantNumber);
        participantNumber++;
      });
    });
}

async function participantInfoLoadingFunction(entry, participantNumber) {
  firebase.firestore().collection("users").doc(entry).get().then(function(userDoc) {
    document.getElementById("participantCardName" + participantNumber).innerHTML = userDoc.data().name;
    
    var gsReference = firebase.storage().refFromURL("gs://brackot-app.appspot.com/" + entry + "/profile");
    gsReference.getDownloadURL().then(function (url) {
      document.getElementById("participantCardPic" + participantNumber).src = url;
    }).catch(function(error) {
      document.getElementById("participantCardPic" + participantNumber).src = "media/BrackotLogo2.jpg";
    });
  });
}
