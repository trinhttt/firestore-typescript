import express from 'express'
import { addEntry, getAllEntries, updateEntry, deleteEntry } from '../controllers/entryController'
import { createUser, login } from '../controllers/authController'
import { uploadFileViaPath, uploadFile, deleteFile, saveFile, downloadFile } from '../controllers/fileController'
import isAuthorizedUser from '../middlewares/authHandler'

const router = express.Router();
router.use(express.urlencoded({ extended: true }));

router.post('/users', createUser)
router.post('/login', login)
// app.use(isAuthorizedUser)
router.get('/entries', isAuthorizedUser, getAllEntries)
router.post('/entries', isAuthorizedUser, addEntry)
router.patch('/entries/:entryId', isAuthorizedUser, updateEntry)
router.delete('/entries/:entryId', isAuthorizedUser, deleteEntry)

router.post("/upload", uploadFileViaPath);
router.post("/uploadFile/:entryId", uploadFile);
router.delete("/deleteFile/:filename", deleteFile);
router.post("/saveFile", saveFile);
router.get("/downloadFile/:filename", downloadFile);

export default router
