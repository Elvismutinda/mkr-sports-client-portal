"use server";

import { AuthError } from "next-auth";

import { LoginRequest, LoginSchema } from "@/lib/validations/auth";
import { signIn } from "../../../auth";
import { DEFAULT_LOGIN_REDIRECT } from "../../../routes";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/data/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const login = async (values: LoginRequest) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (
    !existingUser ||
    existingUser.length === 0 ||
    !existingUser[0].email ||
    !existingUser[0].password
  ) {
    return { error: "Invalid credentials!" };
    // return { error: "User does not exist!" };
  }

  if (!existingUser[0].emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser[0].email
    );

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return { success: "Verification email sent! (Check inbox or spam)" };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "Something went wrong!" };
      }
    }

    throw error;
  }
};