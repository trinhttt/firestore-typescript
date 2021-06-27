export default interface User {
    userId?: string,
    email?: string,
    createdAt?: string,
    imageUrl?: string,
    otp?: string,
    otpExpiredTime?: Date
}