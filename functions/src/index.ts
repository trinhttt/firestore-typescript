import * as functions from 'firebase-functions'
import * as express from 'express'
// import { addEntry, getAllEntries, updateEntry, deleteEntry } from './entryController'
import { addEntry, getAllEntries, updateEntry, deleteEntry } from './controllers/entryController'
import { createUser, login } from './controllers/authController'
import errorMiddleware from './middlewares/errorHandler'
import isAuthorizedUser from './middlewares/authHandler'
import * as AuthenticationTrigger from "./triggers/authenticationTrigger";
import * as FirestoreTrigger from "./triggers/firestore/userTrigger";

const app = express()
app.post('/users', createUser)
app.post('/login', login)
// app.use(isAuthorizedUser)
app.get('/entries', isAuthorizedUser, getAllEntries)
app.post('/entries', isAuthorizedUser, addEntry)
app.patch('/entries/:entryId', isAuthorizedUser, updateEntry)
app.delete('/entries/:entryId', isAuthorizedUser, deleteEntry)

// set it above crud not work
app.use(errorMiddleware)
export const firestoreTrigger = { ...FirestoreTrigger }//??...
export const authenticationTrigger = { ...AuthenticationTrigger }
exports.app = functions.https.onRequest(app)//??export together?
