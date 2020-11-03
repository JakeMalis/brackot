export function match(p1, p2) {
  this.playerOne = p1;
  this.playerTwo = p2;
  this.playerOneScore = null;
  this.playerTwoScore = null;
}

/* *** CREATE INITIAL MATCHES FUNCTION ***
  - creates first/initial round of matches
  - only run once
  - creates matches with null players in order to have room for byes
*/
export function createInitialMatches(){
  var matches = [];
  var byes = getByesAndRounds()[0];
  var initialNumRounds = (numParticipants - byes)/2;
  if(byes >= initialNumRounds){
    for(var x = 0; x < 2 * initialNumRounds; x+=2){
      matches.push(Object.assign({}, new match(shuffledParticipants[x], shuffledParticipants[x+1])));
      matches.push(Object.assign({}, new match(null, null)));
    }
    for(var y = 0; y < byes - initialNumRounds; y+=2){
      matches.push(Object.assign({},new match(null, null)));
    }
  }
  else if (byes == 0){
    for(var v = 0; v < 2*initialNumRounds; v+=2){
      matches.push(Object.assign({}, new match(shuffledParticipants[v], shuffledParticipants[v+1])));
    }
  }
  else {
    for(var z = 0; z < 2 * byes; z+=2){
      matches.push(Object.assign({},new match(shuffledParticipants[z], shuffledParticipants[z+1])));
      matches.push(Object.assign({},Object.assign({}, new match(null, null))));
    }
    for(var w = 0; w < 2 * (initialNumRounds - byes); w+=2){
      var indexStart = 2 * (byes + 1) - 1;
      matches.push(Object.assign({}, new match(shuffledParticipants[indexStart + w], shuffledParticipants[indexStart + w+1])));
    }
  }

  return matches;
}

/* *** SHUFFLE PARTICIPANTS FUNCTION ***
  - shuffles participants in tournaments
  - only run once
*/
export function shuffleParticipants(const participants){
  numParticipants = participants.length;
  let shuffledParticipants;

  for(var i = numParticipants - 1; i > 0; i--){
    const j = Math.floor(Math.random() * i);
    const temp = shuffledParticipants[i];
    shuffledParticipants[i] = shuffledParticipants[j];
    shuffledParticipants[j] = temp;
  }

  return shuffledParticipants;
}

/* *** GET BYES AND ROUNDS FUNCTION ***
  - return byes and rounds as an array of the two values
  - byes: number of players who skip first round and automatically qualify to second rounds
  - rounds: number of round the tournament will have (including the final round w/ 2 players)
*/
export function getByesAndRounds(){
  var byes = 0;
  var rounds = 0;
  var test = true;
  while (test) {
    if (Math.pow(2, rounds) < numParticipants){
      rounds++;
    }
    else{
      byes = Math.pow(2, rounds) - numParticipants;
      test = false;
    }
  }
  return [byes, rounds];
}

/* *** ASSIGN WINNER FUNCTION ***
  - looks at one match within a round and returns the winner (player with highest score)
  - if either player is missing a score or if both players are missing a score it will return null
  - this function is used in creation of every round (except first)
*/
export function assignWinner(matchup){
  if(matchup.playerOneScore > matchup.playerTwoScore){
    return matchup.playerOne;
  }
  else if(matchup.playerOneScore < matchup.playerTwoScore){
    return matchup.playerTwo;
  }
  else if(matchup.playerOneScore == null && matchup.playerTwoScore == null){
    return null;
  }
  return null;
}

/* *** IMPLEMENT BYES FUNCTION ***
  - creates the second round and onlyt the second round
  - in tournaments with an "imperfect" number of participants there will be byes (people who automatically advance to second round)
  - this function creates a round of matches with winners from first round and the byes
*/
export function implementByes(){
  var matches = [];
  var initialMatches = createInitialMatches();
  var byes = getByesAndRounds()[0];
  var numOfWinners = (numParticipants-byes)/2;
  var count = 1;
  if(byes == 0){
    for(var w = 0; w < numOfWinners; w+=2){
      matches.push(Object.assign({}, new match(assignWinner(initialMatches[w]), assignWinner(initialMatches[w+1]))));
    }
  }
  else if(numOfWinners - byes >= 2){
    for(var z = 0; z < byes; z+=2){
      matches.push(Object.assign({}, new match(assignWinner(initialMatches[z]), shuffledParticipants[shuffledParticipants.length - count])));
      count++;
    }
    for(var v = 2*byes; v < numOfWinners + byes; v+=2){
      matches.push(Object.assign({}, new match(assignWinner(initialMatches[v]), assignWinner(initialMatches[v+1]))));
    }
  }
  else {
    for(var x = 0; x < 2*numOfWinners; x+=2){
      matches.push(Object.assign({}, new match(assignWinner(initialMatches[x]), shuffledParticipants[shuffledParticipants.length - count])));
      count++;
    }
    for(var y = 0; y < byes - numOfWinners; y+=2){
      matches.push(Object.assign({}, new match(shuffledParticipants[2*numOfWinners + y], shuffledParticipants[2*numOfWinners + y + 1])));
    }
  }

  return matches;
}

/* ***NEXT ROUND FUNCTION ***
  - returns the next round in tournament given the previous round as a parameter
  - uses the assignWinner method for each match within the round
  - (person with higher score in each match continues)
*/
export function nextRound(lastRound){
  var matches = [];
  if(lastRound.length > 1){
    for(var z = 0; z < lastRound.length; z+=2){
      matches.push(Object.assign({},new match(assignWinner(lastRound[z]), assignWinner(lastRound[z+1]))));
    }
    return matches;
  }
  return assignWinner(lastRound[0]);
}
