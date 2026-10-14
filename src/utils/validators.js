// Правила валидации для useForm (src/composables/useForm.js).
// Правило — функция (value, values) => true | "текст ошибки". values — все значения формы.
// Пустое значение пропускают все правила, кроме required и isTrue: необязательное поле можно оставить пустым.

export const isEmpty = (value) =>
	value === null ||
	value === undefined ||
	(typeof value === "string" && value.trim() === "") ||
	(Array.isArray(value) && value.length === 0);

const digitsOf = (value) => String(value ?? "").replace(/\D/g, "");

export const EMAIL_PATTERN = /^(?![._%+-])[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
export const TELEGRAM_PATTERN = /^(?:https?:\/\/)?(?:t\.me\/)?([A-Za-z0-9_]{5,32})$/;
export const VK_PATTERN = /^(?:https?:\/\/)?(?:vk\.com\/)?([A-Za-z0-9_.]{1,})$/;

export const required = (message = "Заполните поле") => (value) => !isEmpty(value) || message;

// Чекбокс должен быть отмечен. По умолчанию без текста ошибки — подсвечивается сам чекбокс
export const isTrue = (message = "") => (value) => value === true || message;

export const minLength = (min, message = `Минимум ${min} символов`) => (value) =>
	isEmpty(value) || String(value).trim().length >= min || message;

export const email = (message = "Введите email") => (value) =>
	isEmpty(value) || (EMAIL_PATTERN.test(value) && value.length >= 5) || message;

// Телефон РФ: 11 цифр (маска +7 (999) 999-99-99)
export const phone = (message = "Введите номер телефона") => (value) =>
	isEmpty(value) || digitsOf(value).length === 11 || message;

// Ровно столько цифр: digits(6) или один из вариантов: digits([10, 12])
export const digits = (count, message) => (value) =>
	isEmpty(value) || [].concat(count).includes(digitsOf(value).length) || message;

export const pattern = (regexp, message) => (value) => isEmpty(value) || regexp.test(String(value).trim()) || message;

// Совпадает со значением другого поля формы: sameAs("password", "Пароли не совпадают")
export const sameAs = (fieldName, message) => (value, values) => value === values[fieldName] || message;

// Правила применяются, только если condition(values) истинно:
// when((v) => !v.vkNone, [required("Укажите VK"), pattern(VK_PATTERN, "Неверный формат")])
export const when = (condition, rules) => (value, values) => {
	if (!condition(values)) return true;
	for (const rule of rules) {
		const result = rule(value, values);
		if (result !== true) return result;
	}
	return true;
};
