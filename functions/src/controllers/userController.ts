import { Request, Response, NextFunction } from 'express'
import HTTPError from '../models/HTTPError'
import { admin } from '../config/firebase'
import returnSuccess from '../utilities/successHandler'

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body
    try {
        if (!email || !password) {
            throw new HTTPError(400, "email/password is empty")
        }
        const user = await admin.auth().createUser({ email, password })
        const customToken = await admin.auth().createCustomToken(user.uid)
        returnSuccess(201, res, "user was created successfully", { token: customToken })
    } catch (error) {
        next(error)
    }
}

export default createUser