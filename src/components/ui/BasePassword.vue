<script setup>
import { ref, computed } from 'vue';

// Пароль с кнопкой «показать». Совпадение с другим полем — правилом sameAs в useForm
const value = defineModel();
const emit = defineEmits(['blur']);
const errorText = ref(null)

const heightErrorText = computed(() => {
    if (errorText.value) {
        return errorText.value.offsetHeight;
    }
})

const isPassword = ref(false);
const togglePassword = () => isPassword.value = !isPassword.value;

defineProps({
    placeholder: {
        type: String,
        default: ''
    },
    required: {
        type: Boolean,
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

</script>
<template>
    <label :class="['input']">
        <div class="input__holder">
            <button class="input__password-btn" @click="togglePassword" type="button">
                <svg width='24' height='24'><use :href="isPassword ? '#eye_closed' : '#eye'"></use></svg>
            </button>
            <input
                :type="isPassword ? 'text' : 'password'"
                :placeholder="placeholder"
                :required="required"
                :class="['input__field', status]"
                @keydown.space.prevent
                @blur="emit('blur')"
                v-model="value"
            >
            <span class="input__title"><slot></slot></span>
        </div>

        <Transition mode="out-in">
            <span v-if="!!error" ref="errorText" class="input__error" :style="{ bottom: `${(heightErrorText + 10) * -1}px` }">{{ error }}</span>
        </Transition>

    </label>
</template>
<style lang='scss' scoped>

input[type="password"] {
    // font-family: auto;
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