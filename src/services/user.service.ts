import { ApiError, ServiceResponse } from "@/common/models/serviceResponse";
import { db } from "@/db/database.config";
import { otp, users } from "@/entities";
import { logger } from "@/server";
import type { Country, UpdateUserType, UserInputType, UserRole, UserType } from "@/types";
import bcrypt from "bcrypt";
import { desc, eq } from "drizzle-orm";
import { StatusCodes } from "http-status-codes";

export class UserService {
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async getByEmail(email: string): Promise<UserType> {
    try {
      const user = await db.select().from(users).where(eq(users.email, email));
      const foundUser = user ? user[0] : null;
      if (!foundUser) {
        throw new Error("User with the specified email not found");
      }

      // const returnedUser = {
      //   ...foundUser,
      //   role: foundUser.role as UserRole,
      // };
      // return returnedUser;

      // The returned object will match UserType automatically
      return foundUser as UserType;
    } catch (error) {
      throw new Error("Error retrieving user by email");
    }
  }

  async createUser(userData: UserInputType): Promise<ServiceResponse<UserType | null>> {
    try {
      const { email } = userData;
      const foundOtp = await db.select().from(otp).where(eq(otp.email, email)).orderBy(desc(otp.createdAt)).limit(1);

      const currentTime = new Date();
      const fiveMinutesInMs = 5 * 60 * 1000;
      if (
        foundOtp.length === 0 ||
        (foundOtp.length > 0 &&
          (foundOtp[0].otp !== userData.otp ||
            currentTime.getTime() - foundOtp[0].createdAt.getTime() > fiveMinutesInMs))
      ) {
        return ServiceResponse.success<null>("Invalid or expired OTP", null, StatusCodes.NOT_FOUND);
      }

      const hashedPassword = await this.hashPassword(userData.password);
      const createdUser = await db
        .insert(users)
        .values({ ...userData, password: hashedPassword })
        .returning();
      const newUser = {
        ...createdUser[0],
        country: createdUser[0].country as Country,
        role: createdUser[0].role as UserRole,
      };

      return ServiceResponse.success<UserType>("User Created Successfully", newUser, StatusCodes.OK);
    } catch (error) {
      const errorMessage = `Error creating user: ${(error as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure<null>("Duplicate username or email", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async getUserById(id: string): Promise<ServiceResponse<UserType | null>> {
    try {
      const userData = await db.select().from(users).where(eq(users.id, id));
      const foundUser = userData ? userData[0] : null;
      return ServiceResponse.success<UserType>(
        "User retrieved successfully",
        foundUser as unknown as UserType,
        StatusCodes.OK,
      );
    } catch (error) {
      return ServiceResponse.failure<null>("Failed to retrieve user", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async findAllUsers(): Promise<ServiceResponse<UserType[] | null>> {
    try {
      const foundUsers = await db.select().from(users);
      return ServiceResponse.success<UserType[]>(
        "Users Retrieved Successfully",
        foundUsers as unknown as UserType[],
        StatusCodes.OK,
      );
    } catch (error) {
      return ServiceResponse.failure<null>("Failed to retrieve users", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteUser(id: string): Promise<ServiceResponse<UserType | null>> {
    try {
      const userData = await db.delete(users).where(eq(users.id, id)).returning();
      const deletedUser = userData ? userData[0] : null;
      return ServiceResponse.success<UserType>(
        "User deleted successfully",
        deletedUser as unknown as UserType,
        StatusCodes.OK,
      );
    } catch (error) {
      return ServiceResponse.failure<null>("Failed to delete user", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async updateUser(id: string, data: UpdateUserType): Promise<ServiceResponse<UserType | null>> {
    try {
      const userData = await db
        .update(users)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(users.id, id))
        .returning();

      const updatedUser = userData ? userData[0] : null;
      return ServiceResponse.success<UserType>(
        "User updated successfully",
        updatedUser as unknown as UserType,
        StatusCodes.OK,
      );
    } catch (error) {
      logger.info(error);
      return ServiceResponse.failure<null>("Failed to update user", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export const userService = new UserService();
