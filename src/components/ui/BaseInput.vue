<script setup>
import { ref, computed } from 'vue';

// Состояние и валидация — снаружи (useForm): <BaseInput v-bind="field('email')">Email</BaseInput>
const value = defineModel();
const emit = defineEmits(['blur']);
const errorText = ref(null)

defineProps({
    type: {
        type: String,
        default: 'text',
    },
    placeholder: {
        type: String,
        default: ''
    },
    required: {
        type: Boolean,
        default: true
    },
    readonly : {
        type: Boolean,
        default: false
    },
    // Текст ошибки
    error: {
        type: String,
        default: ''
    },
    // CSS-класс состояния: '' | 'valid' | 'not-valid'
    status: {
        type: String,
        default: ''
    },
})

const heightErrorText = computed(() => {
    if (errorText.value) {
        return errorText.value.offsetHeight;
    }
})

const isFilled = computed(() => !!value.value)
</script>
<template>
    <label :class="['input', { '--readonly': readonly }]">
        <input
        :type="type"
        :placeholder="placeholder"
        :required="required"
        :readonly="readonly"
        :class="['input__field', status, { '--readonly': readonly, 'filled': isFilled }]"
        @blur="emit('blur')"
        v-model="value"
        >
        <span class="input__title"><slot></slot></span>

        <Transition mode="out-in">
            <span v-if="!!error" ref="errorText" class="input__error" :style="{ bottom: `${(heightErrorText + 10) * -1}px` }">{{ error }}</span>
        </Transition>

    </label>
</template>
<style lang='scss' scoped>



.input.--readonly {
    pointer-events: none;
    cursor: default;
}
.input__field.--readonly {
    opacity: 0.4;
}

.v-enter-active,
.v-leave-active {
    transition: all 0.25s ease-out;
}

.v-enter-from{
    opacity: 0;
  transform: translate(-50%, 10px);
}
.v-leave-to {
  opacity: 0;
  transform: translate(-50%, 10px);
}

</style>