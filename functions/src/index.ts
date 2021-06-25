import express from 'express'
import * as functions from 'firebase-functions'
import errorMiddleware from './middlewares/errorHandler'
import * as AuthenticationTrigger from "./triggers/authenticationTrigger";
import * as FirestoreTrigger from "./triggers/firestore/userTrigger";
import * as StorageTrigger from "./triggers/storageTrigger";

import router from './routes/index'

const app = express()

app.use(router);
app.use(errorMiddleware)

module.exports = {
  ...FirestoreTrigger,
  ...AuthenticationTrigger,
  ...StorageTrigger,
  api: functions.https.onRequest(app)
}
