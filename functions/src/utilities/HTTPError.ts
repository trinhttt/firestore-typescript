class HTTPError extends Error {
    status: number
    message: string
    constructor(status: number, message: string) {
        super()
        this.status = status
        this.message = message
    }
}

//??Interface or class or both
// interface CustomError extends Error {
//     status: number
//     message: string
// }

// class HTTPError implements CustomError {
// }
export default HTTPError