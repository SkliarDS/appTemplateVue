<script setup>
import TheMainScreen from "@/components/sections/TheMainScreen.vue";
import ThePrizes from "@/components/sections/ThePrizes.vue";
import TheWinners from "@/components/sections/TheWinners.vue";
import TheFaq from "@/components/sections/TheFaq.vue";

</script>
<template>
	<TheMainScreen />	
 	<ThePrizes /> 
	<TheWinners />
	<TheFaq />
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
