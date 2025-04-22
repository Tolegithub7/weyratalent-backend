import { ServiceResponse } from "@/common/models/serviceResponse";
import { generateOTP } from "@/common/utils/generateOtp";
import { db } from "@/db/database.config";
import { otp } from "@/entities/otp.schema";
import { logger } from "@/server";
import { eq } from "drizzle-orm";
import { StatusCodes } from "http-status-codes";
import { emailService } from "./email.service";

class OTPService {
  async generateOtp(email: string): Promise<ServiceResponse<null>> {
    try {
      const generatedOtp = generateOTP();

      // delete any previous otps with the same email
      await db.delete(otp).where(eq(otp.email, email));
      await emailService.sendOtpVerification(email, generatedOtp);
      console.log("Verification otp sent to email: ", email);

      await db.delete(otp).where(eq(otp.email, email));

      // 5 minutes expiry for the OTP
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

      // Store new OTP
      await db.insert(otp).values({
        email,
        otp: generatedOtp,
        expiresAt,
      });

      return ServiceResponse.success<null>("Otp created and email sent successfully", null, StatusCodes.CREATED);
    } catch (error) {
      return ServiceResponse.failure<null>(
        "Failed to send verification otp to email",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

export const otpService = new OTPService();
