import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
// @ts-ignore
import * as compress_images from 'compress-images';
import { v4 as uuidv4 } from 'uuid';

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

exports.sendWelcomeEmail = functions.region('us-east1').firestore.document('users/{userId}').onCreate(async (snap, context) => {
  const user = snap.data();
  if (!user.email) throw new Error("User has no email address");

  const link = await admin.auth().generateEmailVerificationLink(user.email);

  await admin.firestore().collection('mail').add({
    to: user.email,
    template: {
      name: 'welcome',
      data: {
        name: user.name,
        link: link,
        email: user.email
      }
    }
  });

});

exports.createUserDocument = functions.region('us-east1').auth.user().onCreate(async (user) => {
  if (user.displayName === null) {
    const randomUUID = "newUser-" + uuidv4();
    await admin.auth().updateUser(user.uid, {
      displayName: randomUUID
    });
  }

  await admin.auth().updateUser(user.uid, {
    photoURL: "https://firebasestorage.googleapis.com/v0/b/brackot/o/BrackotLogo2.jpg?alt=media&token=7bdf6862-64ec-4db7-9666-3e2865d2cdbe"
  });

  await admin.firestore().collection('users').doc(user.uid).set({
    name: user.displayName,
    email: user.email,
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
});

exports.fixUsersWithoutDocument = functions.region('us-east1').pubsub.schedule('*/10 * * * *').onRun(async (context) => {
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
