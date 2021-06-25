import * as functions from "firebase-functions"
import { createUserInFirestore, deleteUserInFirestore, deleteEntries } from './methods/authMethods'

export const onCreate = functions.auth
  .user()
  .onCreate((userRecord, _context) => {
    console.log(`user ${userRecord.uid} created.`)
    createUserInFirestore(userRecord)
  })

export const onDelete = functions.auth
  .user()
  .onDelete((userRecord, _context) => {
    console.log(`user ${userRecord.uid} deleted.`)
    deleteUserInFirestore(userRecord)
    deleteEntries(userRecord)
  })