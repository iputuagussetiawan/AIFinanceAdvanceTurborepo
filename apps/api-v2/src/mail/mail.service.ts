import { Injectable } from '@nestjs/common'
import { Resend } from 'resend'

@Injectable()
export class MailService {
    private resend: Resend

    constructor() {
        this.resend = new Resend(process.env.RESEND_API_KEY)
    }

    async sendVerificationEmail(to: string, url: string) {
        return this.resend.emails.send({
            from: process.env.MAIL_FROM || 'noreply@example.com',
            to,
            subject: 'Verify your email',
            html: `<p>Click <a href="${url}">here</a> to verify your email. Link expires in 45 minutes.</p>`,
        })
    }

    async sendPasswordResetEmail(to: string, url: string) {
        return this.resend.emails.send({
            from: process.env.MAIL_FROM || 'noreply@example.com',
            to,
            subject: 'Reset your password',
            html: `<p>Click <a href="${url}">here</a> to reset your password. Link expires in 1 hour.</p>`,
        })
    }
}
