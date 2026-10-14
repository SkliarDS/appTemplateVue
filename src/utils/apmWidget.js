const APM_WIDGET_SRC = "https://qr.apmcheck.ru/1.0.8/js/widget-v2.min.js";
const APM_WIDGET_INTEGRITY = "sha384-zCW32CMcVMLCXaVpvbtslfDqKcLPPtFrHR30eSpkSb4V6AzGJeVIsPeumW9iCFSp";

let loadingPromise = null;

// Ждём полной загрузки страницы (событие window load)
function waitWindowLoad() {
	if (document.readyState === "complete") return Promise.resolve();
	return new Promise((resolve) => window.addEventListener("load", resolve, { once: true }));
}

// Подключает скрипт виджета APM один раз. Повторные вызовы возвращают тот же Promise
export function loadApmWidget() {
	if (loadingPromise) return loadingPromise;

	loadingPromise = waitWindowLoad().then(
		() =>
			new Promise((resolve, reject) => {
				const script = document.createElement("script");
				script.src = APM_WIDGET_SRC;
				script.integrity = APM_WIDGET_INTEGRITY;
				script.crossOrigin = "anonymous";
				script.async = true;
				script.onload = resolve;
				script.onerror = () => {
					script.remove();
					loadingPromise = null; // дадим шанс повторить загрузку
					reject(new Error("Не удалось загрузить виджет APM"));
				};
				document.body.appendChild(script);
			}),
	);

	return loadingPromise;
}
