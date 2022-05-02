const nodemailer = require("nodemailer");


const modifyText = (text)  => {
    let newText = `
      Email Verification for Registeration form with Ramaiah Evolute!!
      Click on below link to verify
      LINK: ${text}
    `;

    return newText;
}

const sendEmail = async (email, subject, text) => {
  try {
    console.log(process.env.USERNAME)
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: 587,
      secure: true,
      auth: {
        user:"firebase.evolute@gmail.com",
        pass: process.env.PASS,
      },
    });

    text = modifyText(text);
    await transporter.sendMail({
      from: "firebase.evolute@gmail.com",
      to: email,
      subject: subject,
      text: text,
    });
    console.log("email sent sucessfully");
  } catch (error) {
    console.log("email not sent");
    console.log(error);
  }
};

module.exports = sendEmail;
