import * as functions from 'firebase-functions'
import * as express from 'express'
// import { addEntry, getAllEntries, updateEntry, deleteEntry } from './entryController'
import { addEntry, getAllEntries, updateEntry, deleteEntry } from './controllers/entryController'
import createUser from './controllers/userController'
import errorMiddleware from './middlewares/errorHandler'
import isAuthorizedUser from './middlewares/authHandler'

const app = express()
app.post('/users', createUser)
// app.use(isAuthorizedUser)
app.get('/entries', isAuthorizedUser, getAllEntries)
app.post('/entries', isAuthorizedUser, addEntry)
app.patch('/entries/:entryId', isAuthorizedUser, updateEntry)
app.delete('/entries/:entryId', isAuthorizedUser, deleteEntry)

// set it above crud not work
app.use(errorMiddleware)
exports.app = functions.https.onRequest(app)
