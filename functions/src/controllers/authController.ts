import { Request, Response, NextFunction } from 'express'
import HTTPError from '../utilities/HTTPError'
import { db, firebase } from '../config/firebase'
import returnSuccess from '../utilities/successHandler'
import { sendOTP } from '../utilities/mail/otpMethods'

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body
    try {
        if (!email || !password) {
            throw new HTTPError(400, "email/password is empty")
        }
        // pro env
        await firebase.auth().createUserWithEmailAndPassword(email, password)

        // local env
        // create in authentication
        // const user = await admin.auth().createUser({email, password })
        // var user = firebase.auth().currentUser // user contain token
        await sendOTP(email)

        const mess = "account was created, please check otp in your mail"
        returnSuccess(201, res, mess, null)
    } catch (error) {
        next(error)
    }
}

const verifyOTP = async (req: Request, res: Response, next: NextFunction) => {
    const { params: { opt }, query: { email } } = req
    try {
        const users = await db
            .collection('users')
            .where("email", "==", email)
            .limit(1)
            .get()

        const userData = users.docs[0].data()
        if (!userData) {
            throw new HTTPError(404, 'user not found')
        }
        // Check otp
        if (userData.otp != opt) {
            throw new HTTPError(404, "opt not match")
        }
        // Check otp expired
        const nowTime = new Date();
        if (userData.otp_expired_datetime < nowTime) {
            throw new HTTPError(404, "opt expired")
        }

        const token = await firebase.auth().currentUser?.getIdToken(true)
        returnSuccess(201, res, "OTP is valid", token)
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

        // Make some custom tokens to be used with signInWithCustomToken()
        // const customToken = admin.auth().createCustomToken(userId ?? "")
        const mess = "user was created successfully"
        let token = await firebase.auth().currentUser?.getIdToken(true)
        returnSuccess(201, res, mess, token)
    } catch (error) {
        next(error)
    }
}

export { createUser, login, verifyOTP }