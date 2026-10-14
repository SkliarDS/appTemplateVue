import { ref, computed, onUnmounted } from "vue";

/**
 * Список прикреплённых файлов для BaseFile / BaseFileDragDrop.
 * files — ref с массивом File (v-model компонента). Проверяет формат, размер и количество,
 * создаёт ссылки для превью и освобождает их при удалении файла и размонтировании компонента.
 */
export function useFileList(files, { maxFiles = 10, maxFileSizeMb = 5, allowedExtensions = [] } = {}) {
	const error = ref(null);
	const urls = new Map();

	const isMaxReached = computed(() => files.value.length >= maxFiles);

	const previewUrl = (file) => {
		if (!urls.has(file)) urls.set(file, URL.createObjectURL(file));
		return urls.get(file);
	};

	const previews = computed(() =>
		files.value.map((file) => ({ file, key: `${file.name}-${file.size}-${file.lastModified}`, url: previewUrl(file) })),
	);

	const addFiles = (fileList) => {
		const incoming = Array.from(fileList);
		const free = maxFiles - files.value.length;
		if (free <= 0) {
			error.value = `Максимальное количество файлов (${maxFiles}) уже достигнуто.`;
			return;
		}

		const accepted = [];
		error.value = null;
		for (const file of incoming.slice(0, free)) {
			const extension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
			if (!allowedExtensions.includes(extension)) {
				error.value = `Формат файла "${extension}" не поддерживается.`;
			} else if (file.size > maxFileSizeMb * 1024 * 1024) {
				error.value = `Файл "${file.name}" превышает ${maxFileSizeMb} MB и не был добавлен.`;
			} else {
				accepted.push(file);
			}
		}

		if (incoming.length > free) {
			error.value = `Добавлено ${Math.min(free, accepted.length)} из ${incoming.length} файлов. Максимум ${maxFiles} файлов.`;
		}
		if (accepted.length) files.value = [...files.value, ...accepted];
	};

	const removeFile = (file) => {
		if (urls.has(file)) {
			URL.revokeObjectURL(urls.get(file));
			urls.delete(file);
		}
		files.value = files.value.filter((item) => item !== file);
	};

	onUnmounted(() => {
		urls.forEach((url) => URL.revokeObjectURL(url));
		urls.clear();
	});

	return { error, previews, isMaxReached, addFiles, removeFile };
}
