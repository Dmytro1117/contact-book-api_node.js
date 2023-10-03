const sgMail = require("@sendgrid/mail");
const { SEND_GRIN_API_KEY } = process.env;

sgMail.setApiKey(SEND_GRIN_API_KEY);

const sendEmail = async (data) => {
  try {
    const email = { ...data, from: "moiseenkodmitriy@i.ua" };
    await sgMail.send(email);
    return true;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  sendEmail,
};
