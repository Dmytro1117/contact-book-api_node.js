const phoneRegexp = /^\(\d{3}\) \d{3}-\d{4}$/;
const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const typeSubscription = ["starter", "pro", "business"];

module.exports = { phoneRegexp, emailRegexp, typeSubscription };
