const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
      if (err) {
        return res
          .status(403)
          .json({ status: false, message: "invalid token" });
      }

      req.user = user;
      next();
    });
  } else {
    return res
      .status(401)
      .json({ status: false, message: "You are not authenticated" });
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (
      req.user.userType === "Client" ||
      req.user.userType === "Admin" ||
      req.user.userType === "Vendor" ||
      req.user.userType === "Driver"
    ) {
      next();
    } else {
      return res
        .status(403)
        .json({ status: false, message: "You are not allowed access" });
    }
  });
};

const verifyVendor = (req, res, next) => {
  verifyToken(req, res, () => {
    if (["Admin", "Vendor", "Client"].includes(req.user.userType)) {
      next();
    } else {
      return res
        .status(403)
        .json({ status: false, message: "You are not allowed access" });
    }
  });
};

const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.userType === "Admin") {
      next();
    } else {
      return res
        .status(403)
        .json({ status: false, message: "You are not allowed access" });
    }
  });
};

const verifyDriver = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.userType === "Driver") {
      next();
    } else {
      return res
        .status(403)
        .json({ status: false, message: "You are not allowed access" });
    }
  });
};

module.exports = {
  verifyTokenAndAuthorization,
  verifyVendor,
  verifyAdmin,
  verifyDriver,
};
