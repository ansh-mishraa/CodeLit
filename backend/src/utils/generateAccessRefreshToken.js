import jwt from "jsonwebtoken";

export const generateAccessRefreshToken = (user) => {
  const accessToken = jwt.sign(
    {
      id: user.id
    },
    process.env.ACCESS_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "1d",
    }
  );

  const refreshToken = jwt.sign(
    {
      id: user.id
    },
    process.env.REFRESH_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
    }
  );

  return {
    accessToken,
    refreshToken,
  };
};
