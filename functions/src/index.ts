import express from 'express'
import * as functions from 'firebase-functions'
import errorMiddleware from './middlewares/errorHandler'
import * as AuthenticationTrigger from "./triggers/authenticationTrigger";
import * as FirestoreTrigger from "./triggers/firestore/userTrigger";
import * as StorageTrigger from "./triggers/storageTrigger";
import * as dotenv from 'dotenv';
import router from './routes/index'

dotenv.config()

const app = express()

app.use(router);
app.use(errorMiddleware)
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

export default {
  ...FirestoreTrigger,
  ...AuthenticationTrigger,
  ...StorageTrigger,
  api: functions.https.onRequest(app),
}
