import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
// @ts-ignore
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

  functions.logger.log(user.email);
  functions.logger.log(link);
});

exports.compressProfilePicture = functions.region('us-east1').storage.object().onFinalize(async (object) => {
  const filePath: string = object.name!;
  const fileBucket = object.bucket;
  const fileName = path.basename(filePath);

  const bucket = admin.storage().bucket(fileBucket);
  const localFilePath = path.join(os.tmpdir(), fileName);

  await bucket.file(filePath).download({destination: localFilePath}).then(async () => {
    await compress_images(localFilePath, '/tmp/', { compress_force: false, statistic: true , autoupdate: false }, false,
        { jpg: { engine: "mozjpeg", command: ["-quality", "60"] } },
        { png: { engine: "pngquant", command: ["--quality=20-50", "-o"] } },
        { svg: { engine: "svgo", command: "--multipass" } },
        { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } },
      function (error, completed, statistic) {
        functions.logger.log("-------------");
        functions.logger.log(error);
        functions.logger.log(completed);
        functions.logger.log(statistic);
        functions.logger.log("-------------");
      }
    );

    const newFilePath = path.join(path.dirname(filePath), fileName);
    functions.logger.log(newFilePath);

    await bucket.upload(localFilePath, {
      destination: 'compressedImage/compressed.png'
    });
  });

  return fs.unlinkSync(localFilePath);
});

/*
exports.setUserProfilePicture = functions.region('us-east1').storage.object().onMetadataUpdate(async (object) => {

});
*/
