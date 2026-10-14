<script setup>
</script>
<template>
    <div class="loader">
        <img class="loader__img" width="36" height="36" src="@/assets/img/icons/loader_black.svg" alt="изображение" />
    </div>
</template>
<style lang='scss' scoped>
.loader {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    inset: 0;
    opacity: .9;
    z-index: 1;
}
.loader__img {
    width: 40px;
    height: 40px;
    animation: loader .7s linear infinite;
}
@keyframes loader {
    0% {transform: rotate(0);}
    100% {transform: rotate(360deg);}
}
</style>