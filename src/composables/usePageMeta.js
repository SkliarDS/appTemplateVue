import { onMounted, onUnmounted, watch } from "vue";

const DEFAULT_TITLE = "Greenfield Club исполняет мечты";
const DEFAULT_DESCRIPTION =
	"Присоединяйтесь к программе лояльности Greenfield Club, регистрируйте чеки на сайте или чат-боте, выбирайте подарки от любимого бренда, а также участвуйте в розыгрышах призов.";

const setMetaTag = (selector, attribute, value) => {
	const element = document.querySelector(selector);

	if (element) {
		element.setAttribute(attribute, value);
	}
};

const applyPageMeta = ({ title, description }) => {
	if (typeof document === "undefined") {
		return;
	}

	document.title = title;
	setMetaTag('meta[name="description"]', "content", description);
	setMetaTag('meta[property="og:title"]', "content", title);
	setMetaTag('meta[property="og:description"]', "content", description);
	setMetaTag('meta[name="twitter:title"]', "content", title);
	setMetaTag('meta[name="twitter:description"]', "content", description);
};

const resetPageMeta = () => {
	applyPageMeta({
		title: DEFAULT_TITLE,
		description: DEFAULT_DESCRIPTION,
	});
};

export const usePageMeta = (meta) => {
	const updateMeta = () => {
		applyPageMeta({
			title: meta.title,
			description: meta.description,
		});
	};

	onMounted(updateMeta);

	watch(
		() => [meta.title, meta.description],
		() => updateMeta()
	);

	onUnmounted(resetPageMeta);
};
