<script setup>
import { ref } from "vue";
import { useFileList } from "@/composables/useFileList";

// Загрузка файлов с перетаскиванием. v-model — массив File
const files = defineModel({ type: Array, default: () => [] });

const props = defineProps({
	maxFiles: {
		type: Number,
		default: 10
	},
	maxFileSizeMb: {
		type: Number,
		default: 5
	},
	allowedExtensions: {
		type: Array,
		default: () => [".jpg", ".jpeg", ".png", ".webp", ".tiff", ".pdf", ".gif"]
	}
});

const { error: responseError, previews, isMaxReached: isMaxFilesReached, addFiles, removeFile } = useFileList(files, props);

const isDragging = ref(false);

// Обработчик выбора файлов через input
const handleFileSelect = (e) => {
	if (e.target.files.length) addFiles(e.target.files);
	e.target.value = '';
};

// Drag & Drop логика
const dragOver = () => {
	isDragging.value = true;
};

const dragLeave = () => {
	isDragging.value = false;
};

const handleDrop = (e) => {
	isDragging.value = false;
	if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
};
</script>
<template>
	<div class="file-drag-drop">

		<div class="drop-zone" @dragover.prevent="dragOver" @dragleave.prevent="dragLeave" @drop.prevent="handleDrop" :class="{ active: isDragging }">
			<label :class="['file', { '--disabled': isMaxFilesReached }]">
				<p class="file__text">Добавьте или перенесите файлы сюда</p>
				<input type="file" class="file__real" :accept="allowedExtensions.join(', ')" multiple @change="handleFileSelect" :disabled="isMaxFilesReached" />
				<span class="file__btn btn" v-if="!isMaxFilesReached">Добавить</span>
				<span class="file__text" v-else>Максимум файлов достигнут</span>
			</label>
			<p class="file__error" v-if="!!responseError">{{ responseError }}</p>
		</div>
		<ul class="file-list">
			<li class="file-item">
				Разрешенные форматы файлов: {{ allowedExtensions.join(', ') }}. <br /> Максимальный размер файла: {{ maxFileSizeMb }} MB.
			</li>
			<li class="file-item">Максимальное количество файлов: {{ maxFiles }}.</li>
		</ul>
		<Transition name="slide-up" mode="out-in">
			<div v-if="previews.length" class="preview-file">
				<ul class="preview-file__list">
					<li class="preview-file__item" v-for="{ file, key, url } in previews" :key="key">
						<img class="preview-file__file-image" width="40" height="40" :src="url" alt="изображение" />
						<button class="preview-file__btn" type="button" @click="removeFile(file)">
							<svg width="20" height="20"><use href="#x"></use></svg>
						</button>
					</li>
				</ul>
			</div>
		</Transition>
	</div>
</template>
<style lang="scss" scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.25s ease-out;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
.drop-zone {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1rem;
	border: 1px dashed rgba(0, 0, 0, 0.24);
	background: var(--system-fill-light);
	border-radius: var(--border-radius) 0;
	padding: 6.4rem 2.4rem;
	text-align: center;
	// cursor: pointer;
	transition: all 0.3s;
	margin-bottom: 16px;
	@media (max-width: $xx) {
		padding: 2.4rem 1.6rem;
	}
	.file {
		width: 100%;
		display: flex;
		align-items: center;
		flex-direction: column;
		gap: 2rem;
		margin-left: 0px;
		cursor: auto;
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
		background-size: auto; /* w h*/
		width: 20px;
		height: 20px;
		&.--not-icon {
			width: 0;
			height: 0;
			background-image: none;
		}
	}

	.file__text {
		font-family: var(--second-family);
		font-weight: 400;
		font-size: 28px;
		line-height: 120%;
		text-align: center;
		color: var(--text-default-100);
		@media (max-width: $xx) {
			font-size: 24px;
		}
	}
	.file__btn {
		cursor: pointer;
	}
}
.file-list {
	
}
.file-item {
	font-family: var(--second-family);
	font-weight: 400;
	font-size: 24px;
	line-height: 100%;
	color: var(--text-default-100);
	@media (max-width: $xx) {
		font-size: 12px;
		line-height: 120%;
	}
}

.drop-zone.active {
	border-color: #42b983;
	background-color: rgba(66, 185, 131, 0.1);
}

.drop-content span {
	color: #42b983;
	text-decoration: underline;
	cursor: pointer;
}

.preview-file {
	width: 100%;
	margin-top: 40px;
	@media (max-width: $xx) {
		margin-top: 20px;
	}
}
.preview-file__list {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
	grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr));
	gap: 1.6rem;
	@media (max-width: $xx) {
		grid-template-columns: repeat(auto-fill, minmax(6rem, 1fr));
		gap: .8rem;
	}
}
.preview-file__item {
	position: relative;
	overflow: hidden;
	border: 1px solid var(--border-inverse-1);
	border-radius: 1.6rem;
	width: 100%;
	aspect-ratio: 1/1;
	@media (max-width: $xx) {
		border-radius: 1.2rem;
	}
}

.preview-file__file-image {
	width: 100%;
	height: 100%;
	object-fit: cover;
}
.preview-file__btn {
	position: absolute;
	top: 8px;
	right: 8px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 0.8rem;
	width: 3.2rem;
	height: 3.2rem;
	background: var(--fill-default-1);
	color: var(--text-accent-1-100);
	@media (max-width: $xx) {
		width: 2rem;
		height: 2rem;
		top: 3px;
		right: 3px;
		
	}
	svg {
		width: 2.4rem;
		height: 2.4rem;
		stroke-width: 2px;
		fill: transparent;
	}
}
.file__error {
	color: red;
}

</style>
