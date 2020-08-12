import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

exports.subscribeUserToUnlimited = functions.region('us-east1').auth.user().onCreate((user) => {
  return admin.auth().setCustomUserClaims(user.uid, {subscription: "unlimited"});
});
