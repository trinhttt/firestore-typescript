import { Request, Response } from 'express'
import { db } from './config/firebase'

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
const addEntry = async (req: Request, res: Response) => {
//   const { body: { title, text, coverImageUrl }, params: { userId } } = req
const { body: { title, text }} = req

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
    res.status(200).send({
      status: 'success',
      message: 'entry added successfully',
      data: entryObject
    })
  } catch(error) { res.status(500).json(error.message) }
}

const getAllEntries = async (req: Request, res: Response) => {
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
      const {title, text} = doc.data() // doc: QuerySnapshot, doc.data(): Object
      return result.push({title, text})
    })
    return res.status(200).json(result)
  } catch(error) { return res.status(500).json(error.message) }
}

const updateEntry = async (req: Request, res: Response) => {
  // const { body: { text, coverImageUrl }, params: { userId, entryId } } = req
  const { entryId } = req.params
  const { title } = req.body
  try {
    const entry = db.collection('entries').doc(entryId)

    // Don't need to get data
    // const currentData = (await entry.get()).data() || {}

    const entryObject = {
      // imageUrl: coverImageUrl || currentData.coverImageUrl,
      title: title
      // userId
    }

    await entry.update(entryObject).catch(error => {
      return res.status(400).json({
        status: 'error',
        message: error.message
      })
    })

    return res.status(200).json({
      status: 'success',
      message: 'entry updated successfully',
      data: entryObject
    })
  }
  catch(error) { return res.status(500).json(error.message) }
}

const deleteEntry = async (req: Request, res: Response) => {
  const { entryId } = req.params

  try {
    const entry = db.collection('entries').doc(entryId)
    console.log("deleteEntry")
    await entry.delete().catch(error => {
      return res.status(400).json({
        status: 'error',
        message: error.message
      })
    })

    return res.status(200).json({
      status: 'success',
      message: 'entry deleted successfully',
    })
  }
  catch(error) { return res.status(500).json(error.message) }
}

export { addEntry, getAllEntries, updateEntry, deleteEntry }