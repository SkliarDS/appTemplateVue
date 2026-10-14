<script setup>
import { useFileList } from "@/composables/useFileList";

// Кнопка «Прикрепить файл». v-model — массив File
const files = defineModel({ type: Array, default: () => [] });

const MAX_FILES_COUNT = 10;
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".tiff", ".pdf", ".gif"];

const { error: responseError, previews, isMaxReached: isMaxFilesReached, addFiles, removeFile } = useFileList(files, {
	maxFiles: MAX_FILES_COUNT,
	maxFileSizeMb: 5,
	allowedExtensions: ALLOWED_EXTENSIONS,
});

const handleFiles = (e) => {
	addFiles(e.target.files);
	e.target.value = '';
};
</script>
<template>
	<div class="file-holder">

		<label :class="['file', { '--disabled': isMaxFilesReached }]">
			<input type="file" class="file__real" accept=".jpg, .jpeg, .png, .gif, .tiff, .webp, .pdf" multiple @change="handleFiles" :disabled="isMaxFilesReached" />
			<span class="file__custom"></span>
			<span class="file__text" v-if="!isMaxFilesReached">Прикрепить файл</span>
			<span class="file__text" v-else>Максимум файлов достигнут</span>
		</label>

		<ul class="file-desc__list">
			<li class="file-desc__item">Разрешенные форматы файлов: .jpg, .jpeg, .png, .gif, .tiff, .webp, .pdf.</li>
			<li class="file-desc__item">Максимальный размер файла: 5 MB.</li>
			<li class="file-desc__item">Максимальное количество файлов: 10 (добавлено: {{ files.length }}/10).</li>
		</ul>
		<p class="file-error" v-if="!!responseError">{{ responseError }}</p>
		<div class="preview-file">
			<TransitionGroup name="list" tag="ul" class="preview-file__list">
				<li class="preview-file__item" v-for="{ file, key, url } in previews" :key="key">
					<img class="preview-file__file-image" width="40" height="40" :src="url" alt="изображение" />
					<button class="preview-file__btn" type="button" @click="removeFile(file)">
						<svg width="20" height="20"><use href="#x"></use></svg>
					</button>
				</li>
			</TransitionGroup>
		</div>
	</div>
</template>
<style lang="scss" scoped>
.file-holder {
	display: grid;
	gap: 10px;
}
.file {
	width: fit-content;
	display: flex;
	align-items: center;
	gap: 0.8rem;
	cursor: pointer;
	@media (hover: hover) {
		&:hover {
			.file__text {
				text-decoration: underline;
			}
		}
	}
}
.file__real {
	width: 0;
	height: 0;
	opacity: 0;
	position: absolute;
	z-index: -1;
}
.file__custom {
	background-image: url("@/assets/img/icons/paperclip.svg");
	background-repeat: no-repeat;
	background-position: 0px 0px; /* x y*/
	background-size: 20px;
    width: 20px;
    height: 20px;
	@media (max-width: $xx) {
		background-size: 20px; /* w h*/
		width: 20px;
		height: 20px;
	}
}

.file__text {
	font-weight: 400;
	font-size: 16px;
	line-height: 160%;
	color: var(--text-default-100);
	@media (max-width: $xx) {
	}
}
.file-desc__list {
	
}
.file-desc__item {
	font-weight: 400;
	font-size: 14px;
	line-height: 160%;
	color: var(--text-default-100);
	@media (max-width: $xx) {
		
	}
}
.preview-file {
	// margin-top: 20px;
}
.preview-file__list {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
	gap: 0.8rem;
	@media (max-width: $xx) {
		grid-template-columns: repeat(auto-fill, minmax(6rem, 1fr));
	}
}
.preview-file__item {
	position: relative;
	overflow: hidden;
	border: 2px solid rgba(197, 198, 202, 0.24);
	border-radius: 0.8rem;
	width: 100%;
	aspect-ratio: 1/1;
}
.file-error {
	display: inline-block;
	margin-top: 10px;
	color: red;
}
.preview-file__file-image {
	width: 100%;
	height: 100%;
	object-fit: cover;
}
.preview-file__btn {
	position: absolute;
	top: 3px;
	right: 3px;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 2px solid #0c4ca3;
	border-radius: 0.2rem;
	width: 2rem;
	height: 2rem;
	background: #fff;
	svg {
		width: 100%;
		height: 100%;
		stroke-width: 2px;
		fill: transparent;
		stroke: #0c4ca3;
	}
}

.list-enter-active,
.list-leave-active {
	transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
	opacity: 0;
	transform: translateX(30px);
}
</style>
