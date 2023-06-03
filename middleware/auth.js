const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config()

const checkToken = (req, resp, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return resp.resp(403).send("you need a token  for authentication")
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRETE_KEY)
        console.log(decoded);
        req.body.user= decoded.user;
        return next();

    }
    catch (err) {
        return resp.status(404).send("invalid token")
    }


}
module.exports = checkToken;