import { getWebApp } from '@/utils/telegram';

// Если Telegram выключен (VITE_TELEGRAM_ENABLED=false), все методы ничего не делают
export const useTelegram = () => {
    const WebApp = getWebApp();
    const user = WebApp?.initDataUnsafe?.user ?? null;
    const colorScheme = WebApp?.colorScheme;
    const initData = WebApp?.initData;

    const close = () => WebApp?.close();

    const showMainButton = (text, callback) => {
        WebApp?.MainButton.setText(text);
        WebApp?.MainButton.onClick(callback);
        WebApp?.MainButton.show();
    };

    const hideMainButton = () => {
        WebApp?.MainButton.hide();
    };

    const showBackButton = (callback) => {
        WebApp?.BackButton.onClick(callback);
        WebApp?.BackButton.show();
    };

    const hideBackButton = () => {
        WebApp?.BackButton.hide();
    };

    return {
        user,
        colorScheme,
        initData,
        close,
        showMainButton,
        hideMainButton,
        showBackButton,
        hideBackButton,
    };
};
