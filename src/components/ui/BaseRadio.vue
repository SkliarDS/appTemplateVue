<script setup>
// Радиокнопка. Несколько BaseRadio с одним v-model и одинаковым name — одна группа:
// <BaseRadio v-model="values.category" name="category" value="1">Вариант 1</BaseRadio>
const model = defineModel();

defineProps({
    name: {
        type: String,
    },
    value: {
        type: [String, Number, Boolean],
    },
})

</script>
<template>
    <label :class="['radio']">
        <input
            type="radio"
            :name="name"
            :value="value"
            v-model="model"
            class="radio__real-radio"
        >
        <span class="radio__custom-radio"></span>
        <span class="radio__text"><slot></slot></span>
    </label>
</template>
<style lang='scss' scoped>
.radio {
	display: flex;
    align-items: center;
}
.radio__real-radio {
	width: 0;
	height: 0;
	position: absolute;
	opacity: 0;
	z-index: -1;
}

.radio__custom-radio {
	position: relative;
	display: inline-block;
	width: 16px;
	height: 16px;
	background: #ffffff;
	border: 2px solid #7e9bbd;
	border-radius: 50%;
	vertical-align: text-top;
	margin-right: 5px;
}

.radio__custom-radio::before {
	content: '';	
	display: inline-block;
	width: 8px;
	height: 8px;
	background: #1647ed;
	border-radius: 50%;	
	position: absolute;
	left: 50%;
	top: 50%;
    transform: translate(-50%, -50%) scale(0);
    transition: 0.2s ease-in;    
}

.radio__real-radio:checked + .radio__custom-radio::before {    
    transform: translate(-50%, -50%) scale(1);
}
.radio__real-radio:focus + .radio__custom-radio {
	box-shadow: 0px 0px 0px 1px #38577a, 0px 0px 10px #7e9bbd;
}
</style>