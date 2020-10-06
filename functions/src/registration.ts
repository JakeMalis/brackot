import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// @ts-ignore
import * as compress_images from 'compress-images';
import { v4 as uuidv4 } from 'uuid';

import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';

exports.createUserDocument = functions.region('us-east1').auth.user().onCreate(async (user) => {
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

exports.saveDisplayName = functions.region('us-east1').firestore.document('users/{userId}').onCreate(async (snap, context) => {
  const displayName = await admin.auth().getUser(snap.id).then((userRecord) => {
    return userRecord.toJSON()["displayName"];
  });

  if (displayName == null) {
    const randomUUID = "newUser-" + uuidv4();

    await admin.auth().updateUser(snap.id, {
      displayName: randomUUID
    });

    await admin.firestore().collection('users').doc(snap.id).update({
      name: randomUUID
    });
  }
});

exports.sendWelcomeEmail = functions.region('us-east1').firestore.document('users/{userId}').onCreate(async (snap, context) => {
  const user = snap.data();
  let name;

  try {
    if (user.name == null) {
      throw new Error("User doesn't have a display name")
    }
    else {
      name = user.name;
    }
  }
  catch(error) {
    name = "player";
  }

  await admin.firestore().collection('mail').add({
    to: user.email,
    template: {
      name: 'welcome',
      data: {
        name: name,
        link: await admin.auth().generateEmailVerificationLink(user.email),
        email: user.email
      }
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

  fs.unlinkSync(localFilePath);
});
