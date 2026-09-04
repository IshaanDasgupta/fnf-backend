import {
  generateAccessToken,
  generateRefreshToken,
  getRefreshTokenExpiry,
} from "@/service/jwt";

export function getUserAuthData(user: any) {
  const basicOnboardingCompleted = !!user.name && !!user.age && !!user.gender;

  return {
    id: user._id.toString(),
    phone: user.phone_number,
    name: user.name,
    age: user.age,
    gender: user.gender,
    basicOnboardingCompleted,
  };
}

export function generateAuthResponse(user: any) {
  const userAuthData = getUserAuthData(user);

  return {
    user: userAuthData,
    accessToken: generateAccessToken(userAuthData.id),
    refreshToken: generateRefreshToken(userAuthData.id),
    refreshExpiresAt: getRefreshTokenExpiry(),
  };
}
