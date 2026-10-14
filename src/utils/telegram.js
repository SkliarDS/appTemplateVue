import { TELEGRAM_ENABLED } from "@/utils/constans";

// Telegram Mini App. SDK грузится отдельным чанком и только при VITE_TELEGRAM_ENABLED=true
let webApp = null;

export async function initTelegram() {
	if (!TELEGRAM_ENABLED) return;
	webApp = (await import("@twa-dev/sdk")).default;
	webApp.ready();
	webApp.expand();
}

// Объект WebApp или null, если Telegram выключен / SDK не загрузился
export const getWebApp = () => webApp;
