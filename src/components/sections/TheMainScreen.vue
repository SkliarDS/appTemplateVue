<script setup>
import { ref, onMounted, computed } from "vue";
import { useScrollStore } from "@/stores/storeScroll";
import { useSettingsStore } from "@/stores/storeSettings";
import { useRequestsStore } from "@/stores/storeRequests";
import { useModals } from "@/composables/useModals";
import { useRoute, RouterLink } from "vue-router";
import { sendMetrik } from "@/utils/metrika";
const route = useRoute();
const isNotFinedPage = computed(() => route.name === "404");

const storeSettings = useSettingsStore()
const storeScroll = useScrollStore();
const storeRequests = useRequestsStore();
const logoImage = ref("logoImage");

onMounted(async () => {
	storeScroll.logoImage = logoImage.value;
});
</script>
<template>
	<section class="main-screen" ref="mainScreen">
		
	</section>
</template>
<style lang="scss" scoped>



.v-enter-active,
.v-leave-active {
	transition: opacity 0.8s ease, transform 0.8s ease;
}

.v-enter-from,
.v-leave-to {
	opacity: 0;
	transform: translateY(100%);
}
</style>
