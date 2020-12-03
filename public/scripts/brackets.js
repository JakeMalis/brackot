let clickedRound = 0;
let clickedTable = 0;
let usersCollectionData = [];

const tournamentCollection = firebase.firestore().collection("tournaments");
const userCollection = firebase.firestore().collection("users");

const render_fn = (container, data, _, state) => {
  switch (state) {
    case 'empty-bye':
      container.append(`BYE`);
      return;
    case 'empty-tbd':
      container.append(`TBD`);
      return;
    case 'entry-no-score':
    case 'entry-default-win':
    case 'entry-complete':
      const [teamName, teamAvatar] = data.split('^^^');
      container
        .append(
          `<img src=${teamAvatar ? teamAvatar : 'https://firebasestorage.googleapis.com/v0/b/brackot/o/BrackotLogo2.jpg?alt=media&token=7bdf6862-64ec-4db7-9666-3e2865d2cdbe'} width="24px" height="24px" /> `
        )
        .append(teamName);
      return;
  }
};

const getUserData = (userId) => {
  let userName;
  return userCollection.doc(userId).get().then((userDoc) => {
    userName = userDoc.data().name;
    return Promise.resolve(firebase.storage().refFromURL("gs://brackot-app.appspot.com/" + userId + "/profile")).then((ref) => {
      return ref.getDownloadURL();
    }).catch(err => {
      return '';
    });
  }).then((url) => {
    return `${userName}^^^${url}`;
  })
}

const initBracket = (type, participantNumber) => {
  const matchResults = [];
  let i = 2;
  let index = 0;

  if (type === 'Single Elimination') {
    while (participantNumber / i >= 1) {
      matchResults.push(new Array(participantNumber / i).fill('').map((_, idx) => [null, null, `${index + 1}^^^${idx+1}`]));
      index ++ ;
      i *= 2;
    }
  } else if (type === 'Double Elimination') {
    
  }

  return matchResults;
}

/*================================================NEW BRACKET COMPONENT=================================================*/
class BracketComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      teamNames: [],
      teamScores: [],
      bracketType: 'single',
    }
  }

  async componentDidMount() {
    document.getElementById('upperParticipantScoreInput').value = 0;
    document.getElementById('lowerParticipantScoreInput').value = 0;

    const tournamentDoc = await tournamentCollection.doc(tournamentId).get();
    const { shuffledParticipants, bracket, bracketType } = tournamentDoc.data();
    const users = await Promise.all(shuffledParticipants.map(participant => getUserData(participant)));
    usersCollectionData = users;
    const participantNumber = shuffledParticipants.length + 1;
    const renderBrackets = initBracket(bracketType, participantNumber);

    if (bracketType === 'Single Elimination') {
      bracket.forEach(single => {
        // Winner Bracket Only
        renderBrackets[single.round-1][single.table-1] = [single.teamOneScore, single.teamTwoScore, `${single.round}^^^${single.table}`];
      })
    } else if (bracketType === 'Double Elimination') {
    }

    const userData = [];
    for (let i = 0 ; i < users.length ; i += 2 ) {
      userData.push([users[i], users[i + 1] || null]);
    }

    this.setState({teamNames: userData, teamScores: renderBrackets});

    tournamentCollection.doc(tournamentId).onSnapshot((snapshot) => {
      const { bracket } = snapshot.data();
      const renderBrackets = initBracket(bracketType, participantNumber);

      if (bracketType === 'Single Elimination') {
        bracket.forEach(single => {
          // Winner Bracket Only
          renderBrackets[single.round-1][single.table-1] = [single.teamOneScore, single.teamTwoScore, `${single.round}^^^${single.table}`];
        })
      } else if (bracketType === 'Double Elimination') {
      }

      this.setState({teamNames: userData, teamScores: renderBrackets});
    });
  }

  componentDidUpdate() {
    if (this.state.teamNames.length > 0) {
      ($('div#bracket-render')).bracket({
        init: {
          teams: this.state.teamNames,
          results : [
            this.state.teamScores
          ]
        },
        teamWidth: 180,
        scoreWidth: 40,
        roundMargin: 40,
        matchMargin: 40,
        skipConsolationRound: true,
        decorator: {
					render: render_fn,
					edit: () => {}
        },
        onMatchClick: (data) => {
          const [round, table] = data.split('^^^');
          openMatchModal(round, table, this.state.teamScores)
        },
      });
    }
  }

  render() {
    return (
      <div id="bracket-render" style={{width: '100%'}}></div>
    )
  }
}

//Local functions used to render the bracket and other client-side functions
const renderMatchCards = () => {
  ReactDOM.render(
    <BracketComponent />,
    document.getElementById("bracket-renderer")
  );
}

const openMatchModal = async (round, table, bracket) => {
  const [teamOneScore, teamTwoScore] = bracket[round-1][table-1];

  let tableIndex, upperUser, lowerUser;

  if (+round === 1) {
    tableIndex = +table * 2;
    if (usersCollectionData.length < tableIndex) return;
    upperUser = usersCollectionData[tableIndex - 2].split('^^^');
    lowerUser = usersCollectionData[tableIndex - 1].split('^^^');
  } else {
    const compTable = +table*2-2;
    const prevUpper = bracket[round-2][compTable];
    const prevLower = bracket[round-2][compTable+1];
    const isBYE = +round === 2 && 2 * (compTable + 2) > usersCollectionData.length;
    if (!isBYE && (prevUpper[0] === null || prevUpper[1] === null || prevLower[0] === null || prevLower[1] === null)) return;
    const startTable = findParentTable(+round-1, +table*2-1, bracket);
    const startIndex = bracket[0][startTable - 1][0] >= bracket[0][startTable - 1][1] ? startTable * 2 - 2 : startTable * 2 - 1;

    const endTable = findParentTable(+round-1, +table*2, bracket);
    const endIndex = bracket[0][endTable - 1][0] >= bracket[0][endTable - 1][1] ? endTable * 2 - 2 : endTable * 2 - 1;
    upperUser = usersCollectionData[startIndex].split('^^^');
    lowerUser = usersCollectionData[endIndex].split('^^^');
  }

  const modal = document.getElementById("matchModal");
  modal.style.display = "block";

  document.getElementById("upperParticipantScoreModal").innerHTML = teamOneScore;
  document.getElementById("lowerParticipantScoreModal").innerHTML = teamTwoScore;
  
  document.getElementById("upperParticipantNameModal").innerHTML = upperUser[0];
  document.getElementById("lowerParticipantNameModal").innerHTML = lowerUser[0];
  document.getElementById("upperParticipantPicModal").src = upperUser[1] || 'media/BrackotLogo2.jpg';
  document.getElementById("lowerParticipantPicModal").src = lowerUser[1] || 'media/BrackotLogo2.jpg';
  clickedRound = round;
  clickedTable = table;
}

const findParentTable = (round, table, bracket) => {
  if (round === 1) return table;
  const matchRecord = bracket[round - 1][table - 1];
  const tableId = matchRecord[0] > matchRecord[1] ? table * 2 - 1 : table * 2;
  return findParentTable(round-1, tableId, bracket);
}

const closeMatchModal = () => {
  const modal = document.getElementById("matchModal");
  modal.style.display = "none";
  clickedRound = 0;
  clickedTable = 0;
}

const editMatchScores = () => {
  document.getElementById('upperParticipantScoreInput').value = +document.getElementById("upperParticipantScoreModal").innerHTML;
  document.getElementById('lowerParticipantScoreInput').value = +document.getElementById("lowerParticipantScoreModal").innerHTML;
  document.getElementById("editScoresButton").style.display = "none";
  document.getElementById("submitResultsButton").style.display = "block";
  document.getElementById("upperParticipantScoreInput").style.display = "inline-block";
  document.getElementById("lowerParticipantScoreInput").style.display = "inline-block";
  document.getElementById("upperParticipantScoreModal").style.display = "none";
  document.getElementById("lowerParticipantScoreModal").style.display = "none";
}

//Functions done locally reagrding updating data that need to be moved to a cloud function
function startTournament() {
  tournamentCollection.doc(tournamentId).get().then((tournamentDataDoc) => {
    const { players } = tournamentDataDoc.data();
    const playerCount = players.length;
    const shuffledParticipants = players;

    for(let i = playerCount - 1; i > 0; i--){
      const j = Math.floor(Math.random() * i);
      const temp = shuffledParticipants[i];
      shuffledParticipants[i] = shuffledParticipants[j];
      shuffledParticipants[j] = temp;
    }

    tournamentCollection.doc(tournamentId).set({
      tournamentStarted: true,
      shuffledParticipants: shuffledParticipants,
    });
  });
  document.getElementById("bracketNavbar").style.display = "inline-block";
  document.getElementById("tournamentSignUpButton").className = 'tournamentCardButton tournamentCardButtonInProgress';
  document.getElementById("tournamentSignUpButton").innerHTML = "Tournament In Progress";
  document.getElementById("tournamentSignUpButton").disabled = true;
}

/* *** SAVE MATCH SCORES functions ***
   - uploads scores edited in match modal to firebase
   - changes scores in match object (allows the assign winner function to work)
*/
const saveMatchScores = async () => {
  const tournamentDataDoc = await tournamentCollection.doc(tournamentId).get();
  const tournamentData = tournamentDataDoc.data();
  const { bracket } = tournamentData;
  const newBracketData = {
    round: +clickedRound,
    table: +clickedTable,
    teamOneScore: +document.getElementById('upperParticipantScoreInput').value,
    teamTwoScore: +document.getElementById('lowerParticipantScoreInput').value
  }
  let newBracket = [];
  const findIndex = bracket.findIndex(single => single.round === +clickedRound && single.table === +clickedTable);
  if (findIndex === -1) {
    newBracket = [...bracket, newBracketData];
  } else {
    newBracket = [...bracket];
    newBracket[findIndex] = newBracketData;
  }
  return tournamentCollection.doc(tournamentId).set({
    ...tournamentData,
    bracket: newBracket
  }).then(() => {
    document.getElementById("editScoresButton").style.display = "block";
    document.getElementById("submitResultsButton").style.display = "none";
    document.getElementById("upperParticipantScoreInput").style.display = "none";
    document.getElementById("lowerParticipantScoreInput").style.display = "none";
    document.getElementById("upperParticipantScoreModal").style.display = "inline-block";
    document.getElementById("lowerParticipantScoreModal").style.display = "inline-block";
    document.getElementById("upperParticipantScoreModal").innerHTML = newBracketData.teamOneScore;
    document.getElementById("lowerParticipantScoreModal").innerHTML = newBracketData.teamTwoScore;
    document.getElementById('upperParticipantScoreInput').value = 0;
    document.getElementById('upperParticipantScoreInput').value = 0;
  });

}

var currentMobileRound = 1;
function changeRoundMobile(action){
  tournamentCollection.doc(tournamentId).get().then(function(doc){
    var maxRound = getByesAndRounds()[1];
    document.getElementById("matchColumn" + currentMobileRound).style.display = "none";
    if((action == "previous") && (currentMobileRound > 1)){
      currentMobileRound -= 1;
    }
    if((action == "next") && (currentMobileRound < maxRound)){
      currentMobileRound += 1;
    }
    document.getElementById("matchColumn" + currentMobileRound).style.display = "inline-block";
    if(currentMobileRound != maxRound){
      document.getElementById("bracketRoundMobileText").innerHTML = "Round " + currentMobileRound;
    }
    else{
      document.getElementById("bracketRoundMobileText").innerHTML = "Final Round";
    }
  });
}
