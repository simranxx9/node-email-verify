const sendEmail = require("../utils/email");
const Token = require("../models/token");
const { User, validate } = require("../models/user");
const crypto = import("crypto");
const express = require("express");
const router = express.Router();


router.post("/", async (req, res) => {
  res.send(req.body);
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user)
      return res.status(400).send("User with given email already exist!");
      // user.deleteOne()

    user = await new User({
      name: req.body.name,
      email: req.body.email,
    }).save();
let buffer = (await crypto).randomBytes(64) 
    let token = await new Token({
      userId: user._id,
      token: buffer.toString('hex'),
    }).save();

    const message = `${process.env.BASE_URL}/user/verify/${user.id}/${token.token}`;
    await sendEmail(user.email, "Verify Email", message);

    res.send("An Email sent to your account please verify");
  } catch (error) {
    console.log(error);
    res.status(400).send("An error occured");
  }
});

router.get("/verify/:id/:token", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(400).send("Invalid link");

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send("Invalid link");

    await User.updateOne({ userId: user._id, verified: true });
    await Token.findByIdAndRemove(token._id);
console.log("verified")
    res.send("email verified sucessfully");
  } catch (error) {
    console.log(error)
    res.status(400).send("An error occured");
  }
});

module.exports = router;
