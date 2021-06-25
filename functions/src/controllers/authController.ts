import { Request, Response, NextFunction } from 'express'
import HTTPError from '../utilities/HTTPError'
import { firebase } from '../config/firebase'
import returnSuccess from '../utilities/successHandler'

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body
    try {
        if (!email || !password) {
            throw new HTTPError(400, "email/password is empty")
        }
        // pro env
        await firebase.auth().createUserWithEmailAndPassword(email, password )

        // local env
        // create in authentication
        // const user = await admin.auth().createUser({email, password })
        var user = firebase.auth().currentUser;
        const mess = "user was created successfully"
        returnSuccess(201, res, mess, user)
    } catch (error) {
        next(error)
    }
}
const login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body
    try {
        if (!email || !password) {
            throw new HTTPError(400, "email/password is empty")
        }
        await firebase.auth().signInWithEmailAndPassword(email, password)
        let token = await firebase.auth().currentUser?.getIdToken(true)

        // Make some custom tokens to be used with signInWithCustomToken()
        // const customToken = admin.auth().createCustomToken(userId ?? "")
        const mess = "user was created successfully"
        returnSuccess(201, res, mess, token)
    } catch (error) {
        next(error)
    }
}

export { createUser, login }