import { Request, Response, NextFunction } from 'express'
import { db } from '../config/firebase'
import HTTPError from '../models/HTTPError'
import returnSuccess from '../utilities/successHandler'

//?? no need
// type EntryType = {
//   title: string,
//   text: string,
//   userId: string,
//   coverImageUrl: string
// }

// type Request = {
//   body: EntryType,
//   params: { userId: string, entryId: string }
// }
const addEntry = async (req: Request, res: Response, next: NextFunction) => {
    //   const { body: { title, text, coverImageUrl }, params: { userId } } = req
    const { body: { title, text } } = req

    try {
        const entry = db.collection('entries').doc()
        const entryObject = {
            id: entry.id,
            title,
            text,
            //   userId,
            //   coverImageUrl: coverImageUrl || ''
        }
        entry.set(entryObject)
        returnSuccess(200, res, "entry added successfully", entryObject)
    } catch (error) {
        return next(error)
    }
}

const getAllEntries = async (req: Request, res: Response, next: NextFunction) => {
    // const { userId } = req.params
    // const allEntries: EntryType[] = []

    try {
        //   const querySnapshot = await db.collection('entries').where('userId', '==', userId).get()
        //   querySnapshot.forEach((doc: { data: () => any; }) => allEntries.push(doc.data()))
        //or
        //querySnapshot.forEach((doc: any) => allEntries.push(doc.data()))
        //   return res.status(200).json(allEntries)

        const querySnapshot = await db.collection('entries').get()
        let result: any = []
        querySnapshot.forEach((doc) => {
            const { title, text } = doc.data() // doc: QuerySnapshot, doc.data(): Object
            return result.push({ title, text })
        })
        returnSuccess(200, res, "Got list", result)
    } catch (error) {
        return next(error)
    }
}


const updateEntry = async (req: Request, res: Response, next: NextFunction) => {
    // const { body: { text, coverImageUrl }, params: { userId, entryId } } = req
    const { entryId } = req.params
    const { title } = req.body
    try {
        const entry = db.collection('entries').doc(entryId)
        // Don't need to get data
        // const currentData = (await entry.get()).data() || {}

        const entryObject = {
            title: title
            // userId
        }

        await entry.update(entryObject).catch(error => {
            // 5 NOT_FOUND: no entity to update: app: \"dev~vietnam-api-demo\"\npath <\n  Element {\n    type: \"entries\"\n    name: \"wUIzLLoQtItPYxptWbAL1\"\n  }\n>\n
            if (error.message.includes('NOT_FOUND')) {
                throw new HTTPError(404, "no entity to update")
            } else {
                throw new HTTPError(400, error.message)
            }
        })
        returnSuccess(200, res, "entry updated successfully", entryObject)
    }
    catch (error) {
        //?? can't remove return >< 
        return next(error)
    }
}

const deleteEntry = async (req: Request, res: Response, next: NextFunction) => {
    const { entryId } = req.params

    try {
        const entry = db.collection('entries').doc(entryId)
        // exists: true: return error if NOT_FOUND
        await entry.delete({ exists: true }).catch(error => {
            if (error.message.includes('NOT_FOUND')) {
                throw new HTTPError(404, "no entity to update")
            } else {
                throw new HTTPError(400, error.message)
            }
        })

        returnSuccess(200, res, 'entry deleted successfully', null)
    }
    catch (error) {
        return next(error)
    }
}

export { addEntry, getAllEntries, updateEntry, deleteEntry }