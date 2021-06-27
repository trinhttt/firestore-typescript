import nodemailer from 'nodemailer'
import { Request, Response, NextFunction } from 'express'
import returnSuccess from '../utilities/successHandler'

export const sendMail = async (req: Request, res: Response, next: NextFunction) => {
    const adminEmail = ''
    const adminPassword = ''
    //host của google - gmail
    const mailHost = 'smtp.gmail.com'
    // 587 là một cổng tiêu chuẩn và phổ biến trong giao thức SMTP
    const mailPort: number = 587
    //dùng port 465 (smtps) thì để true, còn lại hãy để false cho tất cả các port khác
    const secure: boolean = mailPort == 465 ? true : false

    var transporter = nodemailer.createTransport({ // config mail server
        host: mailHost,
        port: mailPort, 
        secure: secure,
        auth: {
            user: adminEmail,
            pass: adminPassword
        },
        tls: {
            //?? do not fail on invalid certs
            rejectUnauthorized: false
        }
    });
    var content = '';
    content += `s
        <div style="padding: 10px; background-color: #003375">
            <div style="padding: 10px; background-color: white;">
                <h4 style="color: #0085ff">Gửi mail với nodemailer và express</h4>
                <span style="color: black">Đây là mail test</span>
            </div>
        </div>
    `;
    var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
        from: 'Trinhzzzzz',
        to: req.body.mail,
        subject: 'Test Nodemailer',
        text: 'Your text is here',
        html: content 
    }
    //@ts-ignore
    transporter.sendMail(mainOptions, function (err, info) {
        if (err) {
            console.log(err);
            next(err)
        } else {
            console.log('Message sent: ' + info.response);
            returnSuccess(200, res, "Sent mail", null)
        }
    });
}

