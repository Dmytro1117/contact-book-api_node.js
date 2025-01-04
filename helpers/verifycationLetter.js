const { BASE_URL } = process.env;

const verifycationLetter = ({ email, verificationToken }) => ({
  to: email,
  subject: "Verify email",
  html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationToken}">Click for verify email</a>`,
});

module.exports = { verifycationLetter };
