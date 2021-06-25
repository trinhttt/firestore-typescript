import { Request, Response, NextFunction } from 'express'
import { db } from '../config/firebase'
import HTTPError from '../utilities/HTTPError'
import returnSuccess from '../utilities/successHandler'
import { Entry } from '../interfaces/entry'

const addEntry = async (req: Request, res: Response, next: NextFunction) => {
    const { body: { title, text, userId } } = req

    try {
        const entry = db.collection('entries').doc()
        const entryObject: Entry = {
            id: entry.id,
            title,
            text,
            userId
            //   imageUrl: imageUrl || ''
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

        const entryDocs = await db.collection('entries').get()
        let result: Array<Entry> = [] // Entry[] = []

        entryDocs.forEach((doc: any) => {
            const entryObject: Entry = doc.data() // doc: QuerySnapshot, doc.data(): Object
            return result.push(entryObject)
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
        next(error)
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