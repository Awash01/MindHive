import { getAuth } from "firebase-admin/auth";
import { app } from "./../config/firebase.js";
import User from "./../models/user.model.js";
import redis from "../../../shared/redis/redis.js";

export const login = async (req, res) => {
  try {
    const { token } = req.body;
    const decoded = await getAuth(app).verifyIdToken(token);

    let user = await User.findOne({
      firebaseUid: decoded.uid,
    });

    if (!user) {
      user = await User.create({
        firebaseUid: decoded.uid,
        name: decoded.name,
        email: decoded.email,
        avtar: decoded.picture,
      });
    }

    const sessionId = crypto.randomUUID();

    await redis.set(
      `session-${sessionId}`,
      JSON.stringify({
        userId: user._id,
        name: user.name,
        email: user.email,
        avtar: user.avtar,
      }),
      "EX",
      7 * 24 * 60 * 60,
    );

    res.cookie("session", sessionId, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({
      message: `login error ${error.message}`,
    });
  }
};

export const logOut = async (req, res) => {
  try {
    // CHANGE: Cookie ka naam 'session' hai, isliye sessionId ko req.cookies.session se read kiya
    const sessionId = req.cookies.session;

    // CHANGE: Session ID milne par hi Redis session delete hoga
    if (sessionId) {
      await redis.del(`session-${sessionId}`);
    }

    // Cookie ko clear karna
    res.clearCookie("session", {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: `Logout error ${error.message}`,
    });
  }
};
