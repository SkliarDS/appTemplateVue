import { reactive, computed, ref } from "vue";
import { isEmpty } from "@/utils/validators";

/**
 * Состояние и валидация одной формы. Живёт в компоненте формы: компонент размонтирован — форма сброшена.
 *
 * const { values, field, isValid, handleSubmit } = useForm({
 *   email:     { value: "",    rules: [required("Введите email"), email()] },
 *   agreement: { value: false, rules: [isTrue()], validateOn: "change" },
 * });
 * <BaseInput v-bind="field('email')">Email</BaseInput>
 * <button :disabled="!isValid">Отправить</button>
 *
 * Опции поля: value — начальное значение, rules — правила из src/utils/validators.js,
 * validateOn — когда показывать ошибку:
 *   "blur" (по умолчанию) — после ухода с поля; пока пользователь печатает, ошибка скрыта;
 *   "change" — сразу при изменении (чекбоксы, селекты, файлы — у них нет ввода с клавиатуры).
 * Кнопку блокирует isValid — он считается сразу, независимо от показа ошибок.
 */
export function useForm(schema) {
	const names = Object.keys(schema);
	const initialValues = () => Object.fromEntries(names.map((name) => [name, copy(schema[name].value)]));

	const values = reactive(initialValues());
	const touched = reactive({}); // поле проверено: ушли с него или изменили (validateOn: "change")
	const editing = reactive({}); // пользователь печатает в поле — ошибку не показываем до ухода с него
	const isSubmitting = ref(false);

	// null — поле валидно, строка (может быть пустой) — поле невалидно
	const check = (name) => {
		for (const rule of schema[name].rules ?? []) {
			const result = rule(values[name], values);
			if (result !== true) return typeof result === "string" ? result : "";
		}
		return null;
	};

	const results = computed(() => Object.fromEntries(names.map((name) => [name, check(name)])));
	const isValid = computed(() => names.every((name) => results.value[name] === null));

	const isShown = (name) => touched[name] && !editing[name];

	// Ошибки показываем только у проверенных полей и не во время ввода
	const errors = computed(() =>
		Object.fromEntries(names.map((name) => [name, isShown(name) ? (results.value[name] ?? "") : ""])),
	);

	// CSS-класс поля: "" | "valid" | "not-valid"
	const status = (name) => {
		if (!isShown(name)) return "";
		if (results.value[name] !== null) return "not-valid";
		return isEmpty(values[name]) ? "" : "valid";
	};

	// Проверить поле и показать результат
	const touch = (name) => {
		touched[name] = true;
		editing[name] = false;
	};

	// Показать ошибки всех полей и вернуть результат
	const validate = () => {
		names.forEach(touch);
		return isValid.value;
	};

	const setValues = (newValues) => Object.assign(values, newValues);

	const reset = (newValues = {}) => {
		Object.assign(values, initialValues(), newValues);
		names.forEach((name) => {
			delete touched[name];
			delete editing[name];
		});
	};

	// Пропсы для Base-инпута: <BaseInput v-bind="field('email')" />
	const field = (name) => ({
		modelValue: values[name],
		"onUpdate:modelValue": (value) => {
			values[name] = value;
			if (schema[name].validateOn === "change") touch(name);
			else editing[name] = true;
		},
		onBlur: () => touch(name),
		error: errors.value[name],
		status: status(name),
	});

	// Обёртка для @submit: проверяет форму, не даёт отправить дважды, передаёт копию значений
	const handleSubmit = (callback) => async () => {
		if (!validate() || isSubmitting.value) return;
		isSubmitting.value = true;
		try {
			return await callback({ ...values });
		} finally {
			isSubmitting.value = false;
		}
	};

	return { values, errors, touched, isValid, isSubmitting, field, touch, validate, setValues, reset, handleSubmit };
}

const copy = (value) => (Array.isArray(value) ? [...value] : value);
