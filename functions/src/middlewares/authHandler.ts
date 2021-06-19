import { Request, Response, NextFunction } from 'express'
import { admin } from '../config/firebase'
import HTTPError from '../models/HTTPError'

//?? Function or NextFunction
//??number or Number
const isAuthorizedUser = async (req: Request, res: Response, next: NextFunction) => {
    const token: any = req.headers.authorization
    if (!token) {
        next(new HTTPError(401, "Empty token"))
    }
    try {
        const decodedToken: admin.auth.DecodedIdToken = await admin.auth().verifyIdToken(token)
        req.params.userId = decodedToken.uid
        next()
    } catch (error) {
        next(error)
    }
}

export default isAuthorizedUser