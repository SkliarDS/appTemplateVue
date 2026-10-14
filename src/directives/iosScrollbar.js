/**
 * На iOS ::-webkit-scrollbar не поддерживается, скроллбар показывается только при скролле.
 * Директива добавляет всегда видимый кастомный скроллбар для указанных элементов (только на iOS).
 *
 * Использование:
 * - v-ios-scrollbar — элемент с директивой является скроллируемым контейнером
 * - v-ios-scrollbar="'.popup__window'" — найти все .popup__window внутри и добавить скроллбар
 * - v-ios-scrollbar="['.popup__window', '.dropdown__list-scroll']" — несколько селекторов
 */

const SCROLLBAR_WIDTH = 6;
const THUMB_MIN_HEIGHT = 40;

function isIOS() {
	if (typeof navigator === "undefined") return false;
	return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

function createScrollbar(el, theme = "default") {
	const track = document.createElement("div");
	track.className = `ios-scrollbar-track ios-scrollbar-track--${theme}`;
	track.style.position = "fixed";
	track.style.pointerEvents = "none";

	const thumb = document.createElement("div");
	thumb.className = `ios-scrollbar-thumb ios-scrollbar-thumb--${theme}`;
	thumb.style.pointerEvents = "auto";
	track.appendChild(thumb);
	document.body.appendChild(track);

	let rafId = null;
	let touchStartY = 0;
	let touchStartScrollTop = 0;

	function updateThumb() {
		const scrollHeight = el.scrollHeight;
		const clientHeight = el.clientHeight;
		const rect = el.getBoundingClientRect();

		track.style.top = `${rect.top}px`;
		track.style.left = `${rect.right - SCROLLBAR_WIDTH}px`;
		track.style.width = `${SCROLLBAR_WIDTH}px`;
		track.style.height = `${rect.height}px`;

		if (scrollHeight <= clientHeight) {
			track.style.opacity = "0";
			return;
		}

		track.style.opacity = "1";
		const trackHeight = rect.height;
		const ratio = clientHeight / scrollHeight;
		let thumbHeight = Math.max(THUMB_MIN_HEIGHT, Math.round(trackHeight * ratio));
		if (thumbHeight >= trackHeight) thumbHeight = trackHeight;

		const maxScroll = scrollHeight - clientHeight;
		const scrollTop = el.scrollTop;
		const thumbMaxTop = trackHeight - thumbHeight;
		const thumbTop = maxScroll > 0 ? (scrollTop / maxScroll) * thumbMaxTop : 0;

		thumb.style.height = `${thumbHeight}px`;
		thumb.style.transform = `translateY(${thumbTop}px)`;
	}

	function scheduleUpdate() {
		if (rafId !== null) return;
		rafId = requestAnimationFrame(() => {
			rafId = null;
			updateThumb();
		});
	}

	el.addEventListener("scroll", scheduleUpdate, { passive: true });
	const resizeObserver = new ResizeObserver(scheduleUpdate);
	resizeObserver.observe(el);
	window.addEventListener("resize", scheduleUpdate);
	window.addEventListener("scroll", scheduleUpdate, { passive: true });

	function onThumbTouchStart(e) {
		e.preventDefault();
		touchStartY = e.touches[0].clientY;
		touchStartScrollTop = el.scrollTop;
		document.addEventListener("touchmove", onThumbTouchMove, { passive: false });
		document.addEventListener("touchend", onThumbTouchEnd);
	}

	function onThumbTouchMove(e) {
		e.preventDefault();
		const deltaY = e.touches[0].clientY - touchStartY;
		const trackHeight = track.clientHeight;
		const thumbHeight = thumb.clientHeight;
		const thumbMaxTop = trackHeight - thumbHeight;
		const maxScroll = el.scrollHeight - el.clientHeight;

		if (maxScroll <= 0 || thumbMaxTop <= 0) return;

		const scrollDelta = (deltaY / thumbMaxTop) * maxScroll;
		el.scrollTop = Math.max(0, Math.min(maxScroll, touchStartScrollTop + scrollDelta));
	}

	function onThumbTouchEnd() {
		document.removeEventListener("touchmove", onThumbTouchMove);
		document.removeEventListener("touchend", onThumbTouchEnd);
	}

	thumb.addEventListener("touchstart", onThumbTouchStart, { passive: false });

	// Скрываем нативный скроллбар
	el.classList.add("has-ios-scrollbar");
	updateThumb();

	return {
		destroy() {
			el.classList.remove("has-ios-scrollbar");
			el.removeEventListener("scroll", scheduleUpdate);
			window.removeEventListener("resize", scheduleUpdate);
			window.removeEventListener("scroll", scheduleUpdate);
			resizeObserver.disconnect();
			thumb.removeEventListener("touchstart", onThumbTouchStart);
			document.removeEventListener("touchmove", onThumbTouchMove);
			document.removeEventListener("touchend", onThumbTouchEnd);
			if (rafId !== null) cancelAnimationFrame(rafId);
			track.remove();
		},
	};
}

function initScrollbarForElement(el, theme = "default") {
	if (el._iosScrollbarInstance) return;
	const overflowY = getComputedStyle(el).overflowY;
	if (overflowY !== "auto" && overflowY !== "scroll") return;

	let elementTheme = theme;
	if (el.classList.contains("account-receipts-list")) {
		elementTheme = "light";
	} else if (el.classList.contains("faq-block")) {
		elementTheme = "light";
	}

	el._iosScrollbarInstance = createScrollbar(el, elementTheme);
}

function destroyScrollbarForElement(el) {
	if (el._iosScrollbarInstance) {
		el._iosScrollbarInstance.destroy();
		delete el._iosScrollbarInstance;
	}
}

function getSelectors(value) {
	if (!value) return null;
	if (Array.isArray(value)) return value;
	if (typeof value === "string") return [value];
	if (value && value.selectors) return value.selectors;
	return null;
}

function getTheme(value) {
	if (value && value.theme) return value.theme;
	return "default";
}

export default {
	mounted(el, binding) {
		if (!isIOS()) return;

		const selectors = getSelectors(binding.value);
		const theme = getTheme(binding.value);

		if (selectors && selectors.length > 0) {
			const initAll = () => {
				selectors.forEach((selector) => {
					try {
						const elements = el.querySelectorAll(selector);
						elements.forEach((target) => {
							if (target._iosScrollbarInstance) return;
							initScrollbarForElement(target, theme);
						});
					} catch (e) {
						// invalid selector
					}
				});
			};

			const destroyRemoved = (node) => {
				if (node.nodeType !== 1) return;
				if (node._iosScrollbarInstance) {
					destroyScrollbarForElement(node);
				}
				node.querySelectorAll && node.querySelectorAll("*").forEach(destroyRemoved);
			};

			initAll();
			const observer = new MutationObserver((mutations) => {
				mutations.forEach((m) => {
					m.removedNodes.forEach((node) => {
						if (node.nodeType === 1) {
							destroyRemoved(node);
						}
					});
				});
				initAll();
			});

			observer.observe(el, {
				childList: true,
				subtree: true,
			});

			el._iosScrollbarObserver = observer;
			el._iosScrollbarBinding = binding.value;
		} else {
			initScrollbarForElement(el, theme);
		}
	},

	unmounted(el) {
		if (!isIOS()) return;

		if (el._iosScrollbarObserver) {
			el._iosScrollbarObserver.disconnect();
			delete el._iosScrollbarObserver;
		}

		const selectors = getSelectors(el._iosScrollbarBinding);
		if (selectors && selectors.length > 0) {
			try {
				selectors.forEach((selector) => {
					el.querySelectorAll(selector).forEach(destroyScrollbarForElement);
				});
			} catch (e) {
				// ignore
			}
		}

		destroyScrollbarForElement(el);
		delete el._iosScrollbarBinding;
	},
};
