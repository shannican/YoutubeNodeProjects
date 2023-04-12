const nodemailer = require("nodemailer");
const googleApis = require("googleapis");

const REDIRECT_URI = `https://developers.google.com/oauthplayground`;
const CLIENT_ID = `933200786057-glo78kghd6a8gs78ub482c4h81670eit.apps.googleusercontent.com`;
const CLIENT_SECRET = `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`;
const REFRESH_TOKEN =`1//041bf7EWGDtAMCgYIARAAGAQSNwF-L9IrP8O0Axc_39DkCvIgIZIpZxLZ5QIbfbldBofCLVtq_eUv5ps8gg5i6BQVTcwsddqcv8A`;
const authClient = new googleApis.google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET,REDIRECT_URI);
authClient.setCredentials({refresh_token: REFRESH_TOKEN});


async function mailer(user,otpstring,userid){
   console.log(user)
 try{
    const ACCESS_TOKEN = await authClient.getAccessToken();
    const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
    type: "OAuth2",
    user: "shannikant1220@gmail.com",
    clientId: CLIENT_ID, 
    clientSecret: CLIENT_SECRET,
    refreshToken: REFRESH_TOKEN,
    accessToken: ACCESS_TOKEN
 }
 })
 const details = {
    from: "shannimura8683@gmail.com",
    to: user,
    subject: "change your password",
    text: "message text",
    html: `<a href="http://localhost:3000/reset/${userid}/otp/${otpstring}">reset password</a>`,
 }
 const result = await transport.sendMail(details);
 return result;
 }
 catch(err){
 return err;
 }
}

module.exports = mailer