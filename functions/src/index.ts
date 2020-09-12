import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

exports.subscribeUserToUnlimited = functions.region('us-east1').auth.user().onCreate((user) => {
  return admin.auth().setCustomUserClaims(user.uid, {subscription: "unlimited"});
});

exports.deleteOldMail = functions.region('us-east1').pubsub.schedule('every 1 hours').onRun(async (context) => {
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


exports.sendWelcomeEmail = functions.region('us-east1').auth.user().onCreate(async (user) => {
  if (!user.email) throw new Error("User has no email address");

  const link = await admin.auth().generateEmailVerificationLink(user.email);

  functions.logger.log(link);
});
