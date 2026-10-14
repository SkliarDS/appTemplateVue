import { ref } from "vue";
import cookies from "browser-cookies";

const COOKIE_NAME = "cookieConsent";
const COOKIE_EXPIRATION_DAYS = 182;

const isConsentGiven = ref(false);
const isConsentVisible = ref(false);

export const useCookieConsent = () => {
	const checkConsent = () => {
		const consent = cookies.get(COOKIE_NAME);

		isConsentGiven.value = Boolean(consent);
		isConsentVisible.value = !consent;

		return Boolean(consent);
	};

	const acceptCookies = () => {
		cookies.set(COOKIE_NAME, "true", { expires: COOKIE_EXPIRATION_DAYS });
		isConsentGiven.value = true;
		isConsentVisible.value = false;
	};

	return {
		isConsentGiven,
		isConsentVisible,
		checkConsent,
		acceptCookies,
	};
};
