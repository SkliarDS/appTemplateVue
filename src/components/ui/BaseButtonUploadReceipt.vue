<script setup>
import { useModals } from '@/composables/useModals';

const { triggerQrScan } = useModals();

</script>
<template>
    <button @click="triggerQrScan()" class="btn"><slot></slot></button>  
</template>
<style lang='scss' scoped>
</style>