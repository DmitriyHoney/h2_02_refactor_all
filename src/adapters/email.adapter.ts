import nodemailer from 'nodemailer';
import {settings} from "../config/settings";

const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PWD,
    },
});

export const emailAdapter = {
    async sendMail(to: string, subject: string, text: string, html: string) {
        return await transporter.sendMail({
            from: '"Backend application" <test.dmitry.bolshakov@gmail.com>',
            to,
            subject,
            text,
            html,
        });
    }
};
