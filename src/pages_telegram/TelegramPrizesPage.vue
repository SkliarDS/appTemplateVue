<script setup>
import TelegramHeader from "@/pages_telegram/TelegramHeader.vue";
import ThePrizes from "@/components/sections/ThePrizes.vue";
</script>

<template>
    <div class="tg-page">
        <TelegramHeader />
        <h1 class="tg-page__title title3">Призы</h1>
        <ThePrizes /> 
    </div>
</template>

<style lang="scss" scoped>
.tg-page {
    padding: 2rem 0px;
    :deep(.user-prizes__header){
       display: none;
    }
}
.tg-page__title {
    margin-bottom: 1.6rem;
    text-align: center;
}
:deep(#prizes) {
    border-bottom: 1px solid var(--border-inverse-1);
    border-top: 1px solid var(--border-inverse-1);
    border-radius: 3.2rem 0;
    &::before {
        position: absolute;
        content: '';
        display: none;
    }
}
:deep(#superPrizes) {
    
}
</style>
