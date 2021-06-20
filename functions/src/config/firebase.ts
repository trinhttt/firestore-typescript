import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import firebase from 'firebase'
var firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
}

firebase.initializeApp(firebaseConfig);

admin.initializeApp({
  credential: admin.credential.cert({
    privateKey: functions.config().private.key.replace(/\\n/g, '\n'),//avoid invalid PEM format
    projectId: functions.config().project.id,
    clientEmail: functions.config().client.email
  }),
  databaseURL: 'https://vietnam-api-demo.firebaseio.com'
})

const db = admin.firestore()
export { admin, db, firebase }