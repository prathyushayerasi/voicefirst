const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function ForgotPasswordMailMsg(email, name, token) {
  let msg = {
    to: email,
    from: "no-reply@voicefirst.com",
    subject: "voicefirst👨🏻‍🍳 Reset Password ✔",
    text: " ",
    html: `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,600" rel="stylesheet">
    <style type="text/css">
      * {<html>
        font-family: 'Open Sans', sans-serif;
      }
    </style>
    </head>
    <body style="width:600px;">
    <div style="text-align: center;">
    <img src="" alt="" style="margin: auto;">
    <h2 style="font-size:24px; text-align: center;">Dear ` +
          ' ' +
          name +
          `<span></span></h2>
    <h2 style="font-size: 16px; text-align: center; color:red;">Click the link to reset password:
    <a href="http://voicefirst.herokuapp.com/changePassword?token=${token}" >Reset Password</a>
    </h2>
    <div style="background-color: #02132d; color:#fff;">
      <ul style="list-style: none; text-align: center; padding-top:10px; padding-bottom: 10px;">
        <li style="display: inline-block;">
        <a href="#" style="color:#fff; font-size: 12px; text-decoration: none;">voicefirst</a>
          </li>
      </ul>
    </div>
    </div>
    </body>
    
    </html>`
  };
  return msg;
}

function changePasswordMailMsg(email, name) {
  let msg = {
    to: email,
    from: "no-reply@voicefirst.com",
    subject: "voicefirst Password Changed ✔",
    text: `Dear ${name}, Your Passwrod has been changed successfully.`,
    html: `Dear ${name}, Your Passwrod has been changed successfully.`
  };
  return msg;
}

function addEmployeeMail(email, role, token){
  let msg = {
    to: email,
    from: "no-reply@voicefirst.com",
    subject: "Welcome Onboard - voicefirst ✔",
    text: `Dear ${email}, You are assigned as ${role} by your restaurant. Please visit http://voicefirst.herokuapp.com/employeeSignUp?token=${token} to Sign Up to voicefirst`,
    html: `Dear ${email}, You are assigned as ${role} by your restaurant. Please visit http://voicefirst.herokuapp.com/employeeSignUp?token=${token} to Sign Up to voicefirst`
  };
  return msg;
}

function WelcomeMail(email, name) {
  let msg = {
    to: email,
    from: "no-reply@voicefirst.com",
    subject: `Welcome ${name} to voicefirst Family. ✔`,
    text: `Dear ${name}, Welcome to voicefirst.`,
    html: `Dear ${name}, Welcome to voicefirst.`
  };
  return msg;
}

module.exports = {
  ForgotPasswordMailMsg,
  changePasswordMailMsg,
  addEmployeeMail,
  WelcomeMail
};
