import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

exports.subscribeUserToUnlimited = functions.region('us-east1').auth.user().onCreate((user) => {
  return admin.auth().setCustomUserClaims(user.uid, {subscription: "unlimited"});
});

exports.deleteOldMail = functions.region('us-east1').firestore.document('mail/{documentId}').onCreate((snap, context) => {
      //const newValue = snap.data();
      //return newValue;
      //var currentDate = new Date(newValue.startTime.toDate());
      let count: number = 1;
      async function removeMail() {
        await admin.firestore().collection('mail').get().then(querySnapshot => {
          querySnapshot.forEach(documentSnapshot => {
            count++;
          });
        });
        functions.logger.log("Hello from Firebase. Here's the number: ", count);
      };
      void removeMail();
});
