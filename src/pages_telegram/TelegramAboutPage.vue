<script setup>
import TelegramHeader from "@/pages_telegram/TelegramHeader.vue";
import TheMainScreen from "@/components/sections/TheMainScreen.vue";
import ThePrizes from "@/components/sections/ThePrizes.vue";

import TheWinners from "@/components/sections/TheWinners.vue";
import TheFaq from "@/components/sections/TheFaq.vue";
</script>

<template>
    <div class="tg-page">
        <TelegramHeader />
        <TheMainScreen />	
        <ThePrizes /> 
        <TheWinners />
        <TheFaq />
    </div>
</template>

<style lang="scss" scoped>
.tg-page {
    padding: 2rem 0;
    z-index: 1;
}
:deep(.main-screen__container) {
    @media (max-width: $xx) {
        grid-template-rows: 19.6rem 26rem 19.6rem;
    }
    @media (max-width: $xx) {
        grid-template-rows: 19.6rem 23rem 19.6rem;
    }
}
:deep(#winners) {
    &::before {
        position: absolute;
        content: '';
        display: none;
    }
}
:deep(.faq__block) {
    display: none;
}
:deep(.faq) {
    &::before {
        position: absolute;
        content: '';
        display: none;
    }
}
</style>
