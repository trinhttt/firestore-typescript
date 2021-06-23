import * as functions from 'firebase-functions'

import express from 'express'
// import { addEntry, getAllEntries, updateEntry, deleteEntry } from './entryController'
import { addEntry, getAllEntries, updateEntry, deleteEntry } from './controllers/entryController'
import { createUser, login } from './controllers/authController'
import { uploadFile, uploadFileData } from './controllers/fileController'
import errorMiddleware from './middlewares/errorHandler'
import isAuthorizedUser from './middlewares/authHandler'
import * as AuthenticationTrigger from "./triggers/authenticationTrigger";
import * as FirestoreTrigger from "./triggers/firestore/userTrigger";
// import Multer from 'multer'
// import multer from 'multer';
// const multerConfig = require('./config/multer');
// const multer = require('multer');

const app = express()
// var storage = Multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'uploads')
//     },
//     filename: function (req, file, cb) {
//       cb(null, file.fieldname + '-' + Date.now())
//     }
//   })

//   var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, './uploads')  // change 'upload/' to './uṕload'
//     },
//     filename: function (req, file, cb) {
//       cb(null, Date.now() + '-' + file.originalname)
//     }
//   })

//   var upload = multer({ storage: storage })
// var upload = multer({ storage: storage }).array('userfiles', 10);


// Multer is required to process file uploads and make them available via
// req.files.
// const upload = multer({
//     storage: multer.memoryStorage(),
//     // limits: {
//     //   fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
//     // },
//   });
// var upload = multer({
//     dest: './jobs',
//     // limits: (40 * 1024 * 1024), // (MB * kb * bytes)
//     storage: multer.memoryStorage()
// });
app.post('/users', createUser)
app.post('/login', login)
// app.use(isAuthorizedUser)
app.get('/entries', isAuthorizedUser, getAllEntries)
app.post('/entries', isAuthorizedUser, addEntry)
app.patch('/entries/:entryId', isAuthorizedUser, updateEntry)
app.delete('/entries/:entryId', isAuthorizedUser, deleteEntry)

app.post('/uploadFile', uploadFile)
app.post('/uploadFileData', uploadFileData)
// app.post('/uploadFileData', upload, uploadFileData)
// var upload1 = upload.array('userfiles', 2);

// app.post('/upload', function (req, res) {
//   upload1(req, res, function (err:any) {
//     if (err instanceof multer.MulterError) {
//       // A Multer error occurred when uploading.
//       return res.status(500).json(err);
//     } else if (err) {
//       // An unknown error occurred when uploading.
//       return res.status(500).json(err);
//     }
//     if (!req.files) {

//     }
//     let uploadedFiles: any[] = [];
//     // for (let item of req.files) {
//     //   uploadedFiles.push({ filename: item.originalname });
//     // }

//     // Everything went fine.
//     return res.json({ progress: 100, files: uploadedFiles });
//   })
// });


// set it above crud not work
app.use(errorMiddleware)
export const firestoreTrigger = { ...FirestoreTrigger }//??...
export const authenticationTrigger = { ...AuthenticationTrigger }
exports.app = functions.https.onRequest(app)//??export together?
