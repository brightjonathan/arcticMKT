// auth-helpers.js
// Small shared helpers used by register.html, login.html, forgot-password.html, otp-verification.html

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Firebase Phone Auth requires E.164 format, e.g. +15550001234
export function isValidPhone(phone) {
  return /^\+[1-9]\d{7,14}$/.test(phone);
}

export function isStrongEnoughPassword(password) {
  // at least 8 chars, at least one letter and one number
  return /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password);
}

// Maps Firebase Auth error codes to plain-language messages.
export function mapAuthError(error) {
  const code = error && error.code ? error.code : "";
  switch (code) {
    case "auth/email-already-in-use":
      return "An account with this email already exists. Try logging in instead.";
    case "auth/invalid-email":
      return "That email address doesn't look right. Double-check it and try again.";
    case "auth/weak-password":
      return "That password is too weak. Use at least 8 characters, with letters and numbers.";
    case "auth/user-not-found":
      return "We couldn't find an account with that email.";
    case "auth/wrong-password":
      return "That password is incorrect. Try again or reset your password.";
    case "auth/invalid-credential":
      return "Incorrect email or password. Please try again.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment and try again.";
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";
    case "auth/invalid-phone-number":
      return "That phone number doesn't look right. Include your country code, e.g. +1 555 000 0000.";
    case "auth/missing-phone-number":
      return "A phone number is required to send a verification code.";
    case "auth/code-expired":
      return "That code has expired. Request a new one and try again.";
    case "auth/invalid-verification-code":
      return "That code isn't correct. Double-check it and try again.";
    case "auth/user-disabled":
      return "This account has been disabled. Contact support for help.";
    case "auth/credential-already-in-use":
    case "auth/account-exists-with-different-credential":
      return "That phone number is already linked to another account.";
    case "auth/provider-already-linked":
      return "This account is already verified.";
    case "auth/quota-exceeded":
      return "We've hit our verification limit for now. Please try again shortly.";
    case "auth/requires-recent-login":
      return "For security, please log out and back in before making this change.";
    default:
      return "Something went wrong. Please try again.";
  }
}

// Shows a message inside a status box element. type is "error" or "success".
export function showStatus(el, message, type) {
  el.textContent = message;
  el.style.display = "block";
  el.className = "status-box status-" + (type === "success" ? "success" : "error");
}

export function hideStatus(el) {
  el.style.display = "none";
  el.textContent = "";
}

export function setLoading(button, loading, loadingText, defaultText) {
  button.disabled = loading;
  button.textContent = loading ? loadingText : defaultText;
}