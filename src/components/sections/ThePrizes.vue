<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useSettingsStore } from "@/stores/storeSettings";
import { useRequestsStore } from "@/stores/storeRequests";
import BaseFilter from "@/components/modules/BaseFilter.vue";
import { useModals } from "@/composables/useModals";

import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Pagination } from "swiper/modules";

const storeSettings = useSettingsStore();
const storeRequests = useRequestsStore();
const { openModal } = useModals();


onMounted(async () => {
	
});

</script>
<template>
	<section class="prizes section" id="prizes">
		<div class="container">
		</div>
	</section>
</template>
<style lang="scss" scoped>

</style>
