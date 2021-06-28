import { MailService } from './mailService'
import moment = require('moment');
import User from '../../interfaces/user'
import { db } from '../../config/firebase'

async function generateOTP() {
    const digits = '0123456789'
    const otpLength = process.env.OTP_LENGTH || 6

    let OTP = '';
    while (OTP.length < otpLength) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP
}

export const sendOTP = async (fbEmail: string) => {
    const otp = await generateOTP()

    const now = new Date()
    const expiredTime = 45 // min

    const otpExpiredDateTime = new Date(
        moment(now)
            .add(expiredTime, 'minutes')
            .format('YYYY-MM-DD HH:mm:ss'),
    )

    try {
        // Create user in firestore
        const user = db.collection('users').doc()
        const userObject: User = {
            email: fbEmail,
            otp: otp,
            otpExpiredTime: otpExpiredDateTime
        }
        await user.set(userObject)

        // Send otp mail
        const mail = new MailService()
        const subject = "Verify OTP"
        const template = "otpTemplate"
        const params = { code: otp }
        await mail.sendMail(fbEmail, subject, template, params)
    } catch (error) {
        throw error
    }
}