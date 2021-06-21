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
//     status?: number
//     message: number
// }

// class HTTPError implements CustomError {
//     name ='sss'
//     message: string = 'fff'
//     // status: number = 1
//     // message: string = ""
// }
export default HTTPError