import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

exports.subscribeUserToUnlimited = functions.region('us-east1').auth.user().onCreate((user) => {
  return admin.auth().setCustomUserClaims(user.uid, {subscription: "unlimited"});
});

exports.deleteOldMail = functions.region('us-east1').firestore.document('mail/{documentId}').onCreate((snap, context) => {
      let count: number = 0;

      async function removeMail() {
        await admin.firestore().collection('mail').get().then(querySnapshot => {
          querySnapshot.forEach(documentSnapshot => {
            const sendDate: Date = new Date(documentSnapshot.data().delivery.startTime.toDate());
            let currentDate: Date = new Date();
            currentDate.setDate(currentDate.getDate() - 1);

            if (sendDate <= currentDate) {
              count++;
            }
          });
        });
        functions.logger.log(count, " emails were sent more than 1 day ago.");
      };
      void removeMail();
});
