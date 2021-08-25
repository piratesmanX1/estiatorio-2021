import Cookies from 'js-cookie'

// Page validation only on pages that required user to log-in first regardless of their role
export const pageValidation = () => {
    let validated = "";

    if (Cookies.get("user_id")) {
        if (Cookies.get("status") !== "0") {
            validated = "Your account is inactive, you are unauthorized to access this page.";
        } else {
            validated = true;
        }
    } else {
        validated = "You are not logged in yet.";
    }

    return validated;
}