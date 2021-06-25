import { Request, Response, NextFunction } from 'express'
import { db } from '../config/firebase'
import HTTPError from '../utilities/HTTPError'
import returnSuccess from '../utilities/successHandler'

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const querySnapshot = await db.collection('users').get()
        let result: any = []
        querySnapshot.forEach((doc) => {
            const { title, text } = doc.data()
            return result.push({ title, text })
        })
        returnSuccess(200, res, "Got list", result)
    } catch (error) {
        next(error)
    }
}

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params
    const { title } = req.body
    try {
        const user = db.collection('users').doc(userId)
        const userObject = {
            title: title
            // userId
        }

        await user.update(userObject).catch(error => {
            if (error.message.includes('NOT_FOUND')) {
                throw new HTTPError(404, "no entity to update")
            } else {
                throw new HTTPError(400, error.message)
            }
        })
        returnSuccess(200, res, "user updated successfully", userObject)
    }
    catch (error) {
        next(error)
    }
}

export { getAllUsers, updateUser }