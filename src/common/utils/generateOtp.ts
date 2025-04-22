import otpGenerator from "otp-generator";

export const generateOTP = (): string => {
  const generatedOTP = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
    digits: true,
  });
  return generatedOTP;
};
