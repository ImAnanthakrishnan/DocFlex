import User from "../models/userModel.js";
import Doctor from "../models/doctorModel.js";
export const checkBlockedPatient = async (req, res, next) => {
  try {
    const blockedUser = await User.find({ is_blocked: true });
    const blocked = blockedUser.map((user) => user.email.toString());
    const userEmail = req.body ? req.body.email : null;

    if (blocked.includes(String(userEmail))) {

      return res.status(200).json({message:"Access denied.Blocked user"});
    }
      next();
  } catch (err) {
    res.status(500).json({ sucess: false, message: "Internal server error" });
  }
};

export const checkBlockedDoctor = async (req, res, next) => {
  try {
    const blockedUser = await Doctor.find({ is_blocked: true });
    const blocked = blockedUser.map((user) => user.email.toString());
    const userEmail = req.body ? req.body.email : null;

    if (blocked.includes(String(userEmail))) {

      return res.status(400).json({message:"Access denied.Blocked user"});
    }
      next();
  } catch (err) {
    console.log(err)
    res.status(500).json({ sucess: false, message: "Internal server error" });
  }
};
