import * as functions from 'firebase-functions'
import * as express from 'express'
// import { addEntry, getAllEntries, updateEntry, deleteEntry } from './entryController'
import { addEntry, getAllEntries,updateEntry, deleteEntry} from './entryController'


const app = express()
app.get('/', (req, res) => res.status(200).send('Hey there!'))
app.get('/entries', getAllEntries)
app.post('/entries', addEntry)
app.patch('/entries/:entryId', updateEntry)
app.delete('/entries/:entryId', deleteEntry)
exports.app = functions.https.onRequest(app)
