import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

exports.subscribeUserToUnlimited = functions.region('us-east1').auth.user().onCreate((user) => {
  return admin.auth().setCustomUserClaims(user.uid, {subscription: "unlimited"});
});

exports.deleteOldMail = functions.region('us-east1').firestore.document('mail/{documentId}').onCreate((snap, context) => {
      async function removeMail() {
        await admin.firestore().collection('mail').get().then(querySnapshot => {
          querySnapshot.forEach(documentSnapshot => {
            const sendDate: Date = new Date(documentSnapshot.data().delivery.startTime.toDate());
            const currentDate: Date = new Date();
            currentDate.setDate(currentDate.getHours() - 1);

            async function deleteMail() {
              if (sendDate.getTime() <= currentDate.getTime()) {
                return admin.firestore().runTransaction(transaction => {
                  transaction.delete(admin.firestore().doc('mail/' + documentSnapshot.id));
                  return Promise.resolve();
                });
                functions.logger.log("Email ", documentSnapshot.id, "was sent more than 1 hour ago.");
              }
              else {
                return sendDate;
              }
            };
            void deleteMail();
          });
        });
      };
      void removeMail();
});
