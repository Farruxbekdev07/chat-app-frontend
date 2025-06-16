// firebase
import { signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import { auth } from "./config";

let recaptchaVerifier: RecaptchaVerifier;

export const setupRecaptcha = (containerId: string) => {
  recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    size: "invisible",
  });
};

export const sendVerificationCode = async (phone: string) => {
  if (!recaptchaVerifier) throw new Error("Recaptcha not set up yet");
  const confirmationResult = await signInWithPhoneNumber(
    auth,
    phone,
    recaptchaVerifier
  );
  window.confirmationResult = confirmationResult; // bu yerda saqlaymiz
  return confirmationResult;
};

export const confirmCode = async (code: string) => {
  if (!window.confirmationResult) throw new Error("No confirmation result");
  return await window.confirmationResult.confirm(code);
};
