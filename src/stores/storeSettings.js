import { ref, computed, onMounted } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import { API_URL } from "@/utils/constans.js";

export const useSettingsStore = defineStore("settings", () => {
	const settings = ref({});

	const statusStockActive = computed(() => settings.value?.status === "active"); // активный
	const statusStockFuture = computed(() => settings.value?.status === "future"); // еще не начался
	const statusStockPast = computed(() => settings.value?.status === "past"); // прошел
	const loaderActive = ref(false);
	const isPageLoaded = ref(false);
	const hasPlayedLogoIntro = ref(localStorage.getItem("hasPlayedLogoIntro") === "1");
	const hasPlayedMainScreenIntro = ref(localStorage.getItem("hasPlayedMainScreenIntro") === "1");
	const scrollY = ref(0);
	const widthWindow = ref(window.innerWidth);
	const heightWindow = ref(window.innerHeight);

	const mainSettings = async () => {
		try {
			const response = await axios.get(`${API_URL}/api/main/settings`);
			settings.value = response.data;
		} catch (error) {
			console.log("error:", error);
		}
	};

	const getFaq = async (type, offset = 0, limit = 10) => {
		try {
			const { data } = await axios.get(`${API_URL}/api/feedback/faq`, {
				params: { visibility: type, offset, limit },
			});
			return data;
		} catch (error) {
			console.log("getFaq:", error);
		}
	};

	const updateWidthWindow = () => {
		widthWindow.value = window.innerWidth;
		heightWindow.value = window.innerHeight;
	};

	const pageLoaded = () => {
		setTimeout(() => (isPageLoaded.value = true), 1000);
	};

	const setPlayedLogoIntro = (value) => {
		hasPlayedLogoIntro.value = value;
		localStorage.setItem("hasPlayedLogoIntro", value ? "1" : "0");
	};

	const setPlayedMainScreenIntro = (value) => {
		hasPlayedMainScreenIntro.value = value;
		localStorage.setItem("hasPlayedMainScreenIntro", value ? "1" : "0");
	};

	onMounted(async () => {
		window.addEventListener("resize", updateWidthWindow);
		if (document.readyState === "complete") {
			pageLoaded();
		} else {
			window.onload = () => pageLoaded();
		}
	});

	return {
		mainSettings,
		getFaq,
		setPlayedLogoIntro,
		setPlayedMainScreenIntro,

		settings,
		loaderActive,
		isPageLoaded,
		widthWindow,
		heightWindow,
		statusStockActive,
		statusStockFuture,
		statusStockPast,
		hasPlayedMainScreenIntro,
		hasPlayedLogoIntro,
		scrollY,
	};
});
