<script setup>
import TheMainScreen from '@/components/sections/TheMainScreen.vue';
</script>
<template>
    <section class="stub-page">
        <TheMainScreen />
    </section>
</template>
<style lang='scss' scoped>

.stub-page {
	width: 100%;
	height: 100dvh;

	:deep(.main-screen) {
		height: 100%;
	}

	:deep(.main-screen__container) {
		height: 100%;
		grid-template-rows: 1fr 1fr 1fr 1fr;

		@media (max-width: $l) {
			grid-template-rows: repeat(6, 1fr);
		}

		@media (max-width: $t) {
			grid-template-rows: repeat(6, 1fr);
		}

		@media (max-width: $xx) {
			grid-template-rows: 1fr 1fr 1fr;
		}

		@media (max-width: $xx) {
			grid-template-rows: 1fr 1.5fr 1fr;
		}
	}
    :deep(.main-screen__btn){
        pointer-events: none;
    }
    :deep(.main-screen__item.--content){
        justify-content: center;
    }
}
</style>