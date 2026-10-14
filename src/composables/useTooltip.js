import { ref } from "vue";

let tooltipInstance;

export const useTooltip = () => {
	if (tooltipInstance) {
		return tooltipInstance;
	}

	const activeTooltipId = ref(null);

	const showTooltip = (id) => {
		activeTooltipId.value = id;
	};

	const hideTooltip = (id) => {
		if (activeTooltipId.value !== id) return;
		activeTooltipId.value = null;
	};

	return (tooltipInstance = { activeTooltipId, showTooltip, hideTooltip });
};
