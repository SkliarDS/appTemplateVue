import { ref, computed } from "vue";
import { useScrollStore } from "@/stores/storeScroll";

export const isOIS = ref(false);
export const isIphone = ref(false);
export const isAddHeight = ref(false);

const getAgentSystem = () => {
	if (!("navigator" in window)) {
		return "windows";
	}
	const platform = (navigator.userAgentData?.platform || navigator.platform)?.toLowerCase();

	if (platform.startsWith("win") || platform.startsWith("and")) {
		isOIS.value = true;
	}
	if (platform.startsWith("mac") || platform.startsWith("ip")) {
		isOIS.value = false;
	}
	if (platform.startsWith("ip")) {
		isIphone.value = true;
	}
	if (platform.startsWith("linux") || platform.startsWith("and")) {
		isOIS.value = true;
	}
	return "windows";
};
getAgentSystem();

export const scrollToSection = (id) => {
	const storeScroll = useScrollStore();
	const headerHeight = storeScroll.header?.offsetHeight || 0;
	const isMobile = window.innerWidth <= 576;
	const filterHeight = isMobile ? (storeScroll.headerProfile?.offsetHeight || 0) : 0;
	const headerOffset = (headerHeight + filterHeight) || 100;
	const el = document.getElementById(id);

	if (el) {
		const elementPosition = el.getBoundingClientRect().top;
		const offsetPosition = elementPosition - headerOffset;
		window.scrollBy({
			top: offsetPosition - 20,
			behavior: "smooth",
		});
	}
};

export const formatDate = (dateString) => {
	const date = new Date(dateString);
	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const year = date.getFullYear();
	return `${day}.${month}.${year}`;
};

export const formatDateWithoutYear = (dateString) => {
	const date = new Date(dateString);
	if (isNaN(date.getTime())) {
		return "";
	}
	const day = String(date.getDate()).padStart(2, "0");
	const month = date.toLocaleString("ru-RU", { month: "long", day: "numeric" }).split(" ")[1];
	return `${day} ${month}`;
};

export const formatDateWithoutYearStartEnd = (start, end) => {
	const dateSart = new Date(start);
	const dateEnd = new Date(end);
	if (isNaN(dateSart.getTime())) {
		return "";
	}
	const dayStart = String(dateSart.getDate()).padStart(2, "");
	const dayEnd = String(dateEnd.getDate()).padStart(2, "");
	const monthEnd = dateEnd.toLocaleString("ru-RU", { month: "long", day: "numeric" }).split(" ")[1];
	if (dateSart.getMonth() !== dateEnd.getMonth()) {
		const monthStart = dateSart.toLocaleString("ru-RU", { month: "long", day: "numeric" }).split(" ")[1];
		return `${dayStart} ${monthStart} - ${dayEnd} ${monthEnd}`;
	}
	return `${dayStart} - ${dayEnd} ${monthEnd}`;
};

export const formatTime = (dateString) => {
	const date = new Date(dateString);
	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");
	return `${hours}:${minutes}`;
};

export const formattedText = (text) => {
	// return text.replace(/&nbsp;/g, " ");
	return text.replace(/&nbsp;/g, "\u00A0");
};

export function phoneFormatter(phone) {
	if (!phone) return '';

	// Удаляем все нецифровые символы
	const digitsOnly = phone.replace(/\D/g, '');

	// Если номер начинается с 7, заменяем на +7
	if (digitsOnly.startsWith('7')) {
		return `+${digitsOnly}`;
	}

	// Если номер начинается с 8, заменяем на +7
	if (digitsOnly.startsWith('8')) {
		return `+7${digitsOnly.slice(1)}`;
	}

	// Для других случаев просто добавляем +
	return `+${digitsOnly}`;
};

export function normalizePhone(phone) {

  return phone.replace(/[\s()–-]/g, '');

}

export function debounce(func, delay) {
	let timeoutId;
	return function(...args) {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			func.apply(this, args);
		}, delay);
	};
}