import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();

//NPM Dependencies
import { v4 as uuidv4 } from 'uuid';

exports.registration = require('./registration');

exports.makeUserAdmin = functions.region('us-east1').https.onCall(async (data, context) => {
  if(!context.auth) throw new Error("User is not logged in");
  const uid = context.auth.uid;
  return admin.auth().setCustomUserClaims(uid, {stripeRole: "unlimited", admin: true});
});

exports.deleteOldMail = functions.region('us-east1').pubsub.schedule('0 0 * * *').onRun(async (context) => {
  const currentDate: Date = new Date();
  currentDate.setHours(currentDate.getHours() - 1);

  await admin.firestore().collection('mail').where("delivery.attempts", ">", 0).get().then(querySnapshot => {
    querySnapshot.forEach(documentSnapshot => {
      const sendDate: Date = new Date(documentSnapshot.data().delivery.startTime.toDate());
      if (sendDate.getTime() <= currentDate.getTime()) {
        return admin.firestore().doc('mail/' + documentSnapshot.id).delete();
      }
      else {
        return null;
      }
    });
  });
});

exports.fixUserDocuments = functions.region('us-east1').pubsub.schedule('*/10 * * * *').onRun(async (context) => {
  await admin.auth().listUsers(1000).then(async (listUsersResult) => {
    for (const user of listUsersResult.users) {
      const ret = await new Promise(async (resolve, reject) => {
        try {
          await admin.firestore().collection('users').doc(user.toJSON()["uid"]).get().then(async (doc) => {
              if (!(doc.exists)) {
                function getRandomInt(max) {
                  return Math.floor(Math.random() * Math.floor(max));
                }

                const displayName: string = "newUser-" + getRandomInt(10).toString() + getRandomInt(10).toString() + getRandomInt(10).toString() + getRandomInt(10).toString() + getRandomInt(10).toString() + getRandomInt(10).toString() + getRandomInt(10).toString() + getRandomInt(10).toString();

                await admin.firestore().collection('users').doc(user.toJSON()["uid"]).set({
                  name: displayName,
                  email: user.toJSON()["email"],
                  stats: {
                    tournamentsJoined: 0,
                    tournamentsCreated: 0,
                    matchesPlayed: 0,
                    playersHosted: 0,
                    bugsReported: 0,
                    coins: 0,
                    notifications: 0,
                    wins: 0
                  },
                  email_preferences: {
                    announcements: true,
                    newsletter: true,
                    thirdparty: true
                  }
                });

                await admin.auth().updateUser(user.toJSON()["uid"], {
                  displayName: displayName
                });
                resolve(true);
              }
              else {
                resolve(false);
              }
          });
        }
        catch(e) {
          console.log('Error: ', e);
          resolve(false);
        }
      });
    }
  });
});

exports.storeUserProfilePictures = functions.region('us-east1').pubsub.schedule('*/5 * * * *').onRun(async (context) => {
  await admin.auth().listUsers(500).then(async (listUsersResult) => {
    for (const user of listUsersResult.users) {
      const ret = await new Promise(async (resolve, reject) => {
        try {
          await admin.firestore().collection('users').doc(user.toJSON()["uid"]).update({
            avatarUrl: user.toJSON()["photoURL"]
          });
          resolve(true);
        }
        catch(e) {
          console.log('Error: ', e);
          resolve(false);
        }
      });
    }
  });
});
