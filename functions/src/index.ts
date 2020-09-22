import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as compress_images from 'compress-images';

admin.initializeApp();

const path = require('path');
const os = require('os');
const fs = require('fs');

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


exports.sendWelcomeEmail = functions.region('us-east1').auth.user().onCreate(async (user) => {
  if (!user.email) throw new Error("User has no email address");

  const link = await admin.auth().generateEmailVerificationLink(user.email);

  functions.logger.log(link);
});

exports.compressProfilePicture = functions.region('us-east1').storage.object().onFinalize(async (object) => {
  const fileType = object.contentType;
  const filePath: string = object.name!;
  const fileBucket = object.bucket;
  const fileName = path.basename(filePath);

  const bucket = admin.storage().bucket(fileBucket);
  const tempFilePath = path.join(os.tmpdir(), fileName);

  await bucket.file(filePath).download({destination: tempFilePath});
  //functions.logger.log("Image downloaded locally to, ", tempFilePath);

  if (fileType === "image/jpg") {
    compress_images(
      tempFilePath,
      process.cwd(),
      { compress_force: false, statistic: true, autoupdate: true },
      false,
      { jpg: { engine: "mozjpeg", command: ["-quality", "60"] }},
      function (error, completed) {
        if (completed === true) {
          functions.logger.log("Compressed jpg file")
        }
      }
    );
  }

  return fs.unlinkSync(tempFilePath);
});

/*
exports.setUserProfilePicture = functions.region('us-east1').storage.object().onMetadataUpdate(async (object) => {

});
*/
