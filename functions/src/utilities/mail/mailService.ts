import * as handlebars from 'handlebars'
import * as nodemailer from 'nodemailer'
import fs from 'fs'
import * as path from 'path'

export class MailService {
    private readonly transporter: any = null

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false, // port 465 (smtps) thì true, các port khác để false
            auth: {
                user: process.env.SMTP_AUTH_USERNAME,
                pass: process.env.SMTP_AUTH_PASSWORD
            }
        })
    }

    async sendMail(mailAddress, subject, templateName, params) {
        if (!this.transporter) {
            throw new Error("Can not create transport")
        }

        await this.transporter.sendMail({
            from: process.env.ADMIN_MAIL_ADDRESS,//?? your value?
            to: mailAddress,
            subject: subject,
            html: this.renderTemplate(templateName, params)
        })
    }

    private renderTemplate(templateName, params: Object) {
        const templatePath = path.join(__dirname, templateName + '.hbs')
        const data = fs.readFileSync(templatePath, 'utf8')
        const template = handlebars.compile(data.toString())
        return template(params)
    }
}