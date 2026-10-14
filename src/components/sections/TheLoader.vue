<script setup>
</script>
<template>
    <div class="loader">
        <img class="loader__img" width="36" height="36" src="@/assets/img/icons/loader.svg" alt="изображение" />
    </div>
</template>
<style lang='scss' scoped>
.loader {
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.5);
    inset: 0;
    opacity: .9;
    z-index: 999;
}
.loader__img {
    width: 70px;
    height: 70px;
    animation: loader .7s linear infinite;
}
@keyframes loader {
    0% {transform: rotate(0);}
    100% {transform: rotate(360deg);}
}
</style>