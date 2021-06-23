
import * as admin from 'firebase-admin'
// import * as functions from 'firebase-functions'
import * as serviceAccount from './serviceAccount.json'
import * as firebaseConfig from './firebaseConfig.json'
import firebase from 'firebase'

//init to login with web app
firebase.initializeApp(firebaseConfig);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as object),
  databaseURL: 'https://vietnam-api-demo.firebaseio.com',
  storageBucket: 'vietnam-api-demo.appspot.com',
});

// admin.initializeApp({
//   credential: admin.credential.cert({
//     privateKey: functions.config().private.key.replace(/\\n/g, '\n'),//avoid invalid PEM format
//     projectId: functions.config().project.id,
//     clientEmail: functions.config().client.email
//   }),
//   databaseURL: 'https://vietnam-api-demo.firebaseio.com'
// })

const db = admin.firestore()
const bucket = admin.storage().bucket()

export { admin, db, firebase, bucket }