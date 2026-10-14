export default {
    mounted(el, binding) {
        const formatPhone = (value) => {
            const digits = value.replace(/\D/g, '').slice(0, 11);

            let formatted = '7 (';
            if (digits.length > 1) formatted += digits.slice(1, 4);
            if (digits.length >= 4) formatted += ') ' + digits.slice(4, 7);
            if (digits.length >= 7) formatted += '-' + digits.slice(7, 9);
            if (digits.length >= 9) formatted += '-' + digits.slice(9, 11);

            return formatted;
        };

        const mask = (e) => {
            let val = el.value || '';
            let digits = val.replace(/\D/g, '');

            // Принудительно начинаем с 7
            if (digits.length === 0) digits = '7';
            if (digits[0] !== '7') digits = '7' + digits.slice(1);

            digits = digits.slice(0, 11); // не больше 11 цифр

            const formatted = formatPhone(digits);
            el.value = formatted;

            // Передаём очищенный номер наружу (например, для модели)
            if (binding && binding.instance) {
                binding.instance.$emit?.('update:modelValue', formatted);
                binding.instance.storeField?.updateFields?.('phoneRaw', digits); // если нужно
            }
        };

        const handleBackspace = (event) => {
            if (event.key === "Backspace") {
                let pos = el.selectionStart;
                if (pos > 0) {
                    let valueBefore = el.value.slice(0, pos);
                    if (/[\s()-]/.test(valueBefore.slice(-1))) {
                        event.preventDefault();
                        el.setSelectionRange(pos - 1, pos - 1);
                    }
                }
            }
        };

        el.addEventListener("input", mask);
        el.addEventListener("focus", mask);
        el.addEventListener("blur", mask);
        el.addEventListener("keydown", handleBackspace);
    }
};
