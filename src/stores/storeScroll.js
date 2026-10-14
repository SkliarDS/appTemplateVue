import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";
import { defineStore } from "pinia";
import { useThrottleScroll } from "@/composables/useThrottleScroll";
import { useRoute } from "vue-router";
import { useSettingsStore } from "./storeSettings";
import { useRequestsStore } from "./storeRequests";

export const useScrollStore = defineStore("scroll", () => {
	const { throttleScroll } = useThrottleScroll();
	const route = useRoute();
	const storeSettings = useSettingsStore();
	const storeRequests = useRequestsStore();
	const isProfilePage = computed(() => route.name === "profile");
	const header = ref(null);
	const paddingTop = ref(null);
	const headerProfile = ref(null);
	const headerFixed = ref(false);
	const fixedButton = ref(null);
	const isFixedButton = ref(true);
	const footer = ref(null);
	const logoImage = ref(null);
	const isShowLogo = ref(false);

	const handleScroll = () => {
		headerFixed.value = (window.scrollY + header.value.offsetHeight) > header.value.offsetHeight;
	};
	const hideFixedButton = () => {
		const footerRect = footer.value.getBoundingClientRect();
		const buttonRect = fixedButton.value?.getBoundingClientRect();

		if (Math.abs(footerRect.top) <= Math.abs(buttonRect?.bottom)) {
			isFixedButton.value = false;
		} else {
			isFixedButton.value = true;
		}
	};

	function updatePadding() {
		nextTick(() => {
			paddingTop.value =  header.value?.offsetHeight + "px";
		});
	}

	const onScroll = () => {
		throttleScroll(() => {
			handleScroll();
			hideFixedButton();
		});
	};

	onMounted(() => {
		window.addEventListener("scroll", onScroll);
		updatePadding()
	});

	onUnmounted(() => {
		window.removeEventListener("scroll", onScroll);
		updatePadding()
	});
	return {
		handleScroll,

		header,
		headerProfile,
		headerFixed,
		isProfilePage,
		footer,
		fixedButton,
		isFixedButton,
		paddingTop,
		isShowLogo,
		logoImage,
	};
});
