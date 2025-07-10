// types/global.d.ts
export {};

declare global {
  interface Window {
    recaptchaVerifier: import("firebase/auth").RecaptchaVerifier;
    confirmationResult: import("firebase/auth").ConfirmationResult;
  }
}
