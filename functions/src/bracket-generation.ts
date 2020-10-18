function createInitialMatches(){
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

//Funciton needed for creating initial matches
function getByesAndRounds(){
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
  /* rounds returns number of rounds in the tournament */
  /* byes returns number of players that need byes in the first round */
}

function match(p1, p2) {
  this.playerOne = p1;
  this.playerTwo = p2;
  this.playerOneScore = null;
  this.playerTwoScore = null;
}

function shuffleParticipants(){
  for(var i = numParticipants - 1; i > 0; i--){
    const j = Math.floor(Math.random() * i);
    const temp = shuffledParticipants[i];
    shuffledParticipants[i] = shuffledParticipants[j];
    shuffledParticipants[j] = temp;
  }
}

function assignWinner(matchup){
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

function implementByes(){ /* creates second round of matches */
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

function nextRound(lastRound){
  var matches = [];
  if(lastRound.length > 1){
    for(var z = 0; z < lastRound.length; z+=2){
      matches.push(Object.assign({},new match(assignWinner(lastRound[z]), assignWinner(lastRound[z+1]))));
    }
    return matches;
  }
  return assignWinner(lastRound[0]);
}
