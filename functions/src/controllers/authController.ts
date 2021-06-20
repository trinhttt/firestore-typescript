import { Request, Response, NextFunction } from 'express'
import HTTPError from '../utilities/HTTPError'
import { admin, firebase } from '../config/firebase'
import returnSuccess from '../utilities/successHandler'
// import firebase from 'firebase'

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body
    try {
        if (!email || !password) {
            throw new HTTPError(400, "email/password is empty")
        }
        // await firebase.auth().createUserWithEmailAndPassword(email, password )
        const user = await admin.auth().createUser({email, password })
        // var user = firebase.auth().currentUser;
        // console.log(user)
        // console.log(user?.getIdToken)
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
        // const userId = user.user?.uid
        let token = await firebase.auth().currentUser?.getIdToken(true)//.getIdToken(true)
        // Make some custom tokens to be used with signInWithCustomToken() method (TODO: configure options)
        // const customToken = admin.auth().createCustomToken(userId ?? "")
        const mess = "user was created successfully"
        returnSuccess(201, res, mess, token)
    } catch (error) {
        next(error)
    }
}

export { createUser, login }