import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();

import {shuffleParticipants} from 'bracket-generation.ts';
import {getByesAndRounds} from 'bracket-generation.ts';
import {createInitialMatches} from 'bracket-generation.ts';
import {implementByes} from 'bracket-generation.ts';

exports.startTournament = functions.region('us-east1').https.onCall(async (data, context) => {
  var numParticipants = 0;

  var participants = await admin.firestore().runTransaction(async (transaction) => {
    return await transaction.get(firebase.firestore().collection("tournaments").doc(data.tournamentId)).then(doc => {
      return doc.data().players;
    })
  });

  var shuffledParticipants = shuffleParticipants(participants);

  var byes = getByesAndRounds()[0];
  var rounds = getByesAndRounds()[1];

  var firstRound = createInitialMatches();
  if (participants.length > 2) { var secondRound = implementByes(); }


  let bracket;

  for (round = 1; round <= /*However many rounds there are*/; round++) {
    bracket["round" + round] = null;
    for (matchup = 1; matchup <= /*Amount of matchups in specific round*/; matchup++) {
      const obj = {};
      obj["roundKey"] = "round" + round;

      obj.roundKey["matchup" + matchup] = /*Somehow add all the matchup data*/;

      //Dani needs to help me rework a function so that its easier to get the data
    }
  }


  //Example of what bracket should look like
  var bracket = {
    round1: {
      matchup1: {
        playerOne: "2aZ3wiFW3pRfwo8X4Be1VVci9QR2",
        playerTwo: "Dsfoiaksdfjlasfjdlkasd",
        playerOneScore: 3,
        playerTwoScore: 2
      }
    }
  }

});
