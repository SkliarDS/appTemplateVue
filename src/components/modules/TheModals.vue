<script setup>
import { useModals } from "@/composables/useModals";
import { useRequestsStore } from "@/stores/storeRequests";
import { useSettingsStore } from "@/stores/storeSettings";
import { sendMetrik } from "@/utils/metrika";
import FormFeedback from "@/components/forms/FormFeedback.vue";
import FormAuthorization from "@/components/forms/FormAuthorization.vue";
import FormRegistration from "@/components/forms/FormRegistration.vue";
import FormRecoveryPassword from "@/components/forms/FormRecoveryPassword.vue";
import FormChangePassword from "@/components/forms/FormChangePassword.vue";
import FormChangeEmail from "@/components/forms/FormChangeEmail.vue";
import FormRepeatVerification from "@/components/forms/FormRepeatVerification.vue";

const storeSettings = useSettingsStore();
const storeRequests = useRequestsStore();

const { activeModal, modalId, modalContent, sizeWidthModal, closeModal, openModal } = useModals();
</script>
<template>
	<div style="position: absolute; bottom: 100%; overflow: hidden">
		<div id="apm-widget"></div>
	</div>
	<div :class="['modal', { 'is-open': activeModal, '--feedback': modalId === 'feedback' }]" @click.self="closeModal">
		<Transition>
			<div v-if="activeModal" :class="['modal__container', sizeWidthModal]">
				<button class="modal-close" @click="closeModal">
					<svg width="24" height="24"><use href="#x"></use></svg>
				</button>
				<!-- Формы (src/components/forms): у каждой своё состояние — закрыли модалку, форма сбросилась -->
				<!-- Обратная связь -->
				<div class="modal-content" v-if="modalId === 'feedback'">
					<h5 class="modal-title">Обратная связь</h5>
					<FormFeedback />
				</div>

				<!-- Авторизация -->
				<div class="modal-content" v-if="modalId === 'authorization'">
					<h5 class="modal-title">Авторизация</h5>
					<FormAuthorization />
				</div>

				<!-- Требуется авторизация -->
				<div class="modal-content" v-if="modalId === 'authorizationRequired'">
					<h5 class="modal-title">Требуется авторизация</h5>
					<form class="form form-grid">
						<div class="form__footer">
							<div class="form__btn-wrapper">
								<span>У меня уже есть аккаунт</span>
								<button @click="openModal('authorization')" class="send-button btn form__btn --big" type="button">Войти</button>
							</div>
							<div class="form__btn-wrapper" v-if="!storeSettings.statusStockPast">
								<span>У меня нет аккаунта</span>
								<button @click="openModal('registration'), sendMetrik('reachGoal', 'registration_open')" class="send-button btn form__btn --big" type="button">Регистрация</button>
							</div>
						</div>
					</form>
				</div>

				<!-- Регистрация -->
				<div class="modal-content" v-if="modalId === 'registration'">
					<h5 class="modal-title">Регистрация</h5>
					<p class="modal-subtitle">Вы получите 25 баллов после завершения регистрации</p>
					<FormRegistration />
				</div>

				<!-- Восстановление пароля -->
				<div class="modal-content" v-if="modalId === 'recoveryPassword'">
					<h5 class="modal-title">Восстановление пароля</h5>
					<FormRecoveryPassword />
				</div>

				<!-- Изменение пароля -->
				<div class="modal-content" v-if="modalId === 'changeUserPassword'">
					<h5 class="modal-title">Изменение пароля</h5>
					<FormChangePassword />
				</div>

				<!-- Изменение данных -->
				<div class="modal-content" v-if="modalId === 'changeUserProfile'">
					<h5 class="modal-title">Изменение данных</h5>
					<FormChangeEmail />
				</div>

				<!-- Регистрация завершена -->
				<div class="modal-content" v-if="modalId === 'registrationEnd'">
					<h5 class="modal-title">Регистрация завершена</h5>
					<p class="modal-subtitle">Пароль отправлен в СМС на указанный вами номер телефона.</p>
					<div class="form form-grid">
						<button class="send-button btn form__btn --blue" type="button" @click="openModal('authorization')">Войти</button>
					</div>
				</div>

				<!-- Пройти верефикацию -->
				<div class="modal-content" v-if="modalId === 'notVerified'">
					<h5 class="modal-title">Ваш аккаунт ещё не активирован</h5>
					<p class="modal-subtitle">Пожалуйста, перейдите по ссылке из письма, отправленного на ваш e-mail, чтобы завершить регистрацию.</p>
					<p class="modal-subtitle">Не нашли письмо? Проверьте папку «Спам» или запросите повторное письмо</p>
					<div class="form form-grid">
						<button class="send-button btn form__btn --blue" type="button" @click="storeRequests.repeatVerification()">Запросить повторно</button>
					</div>
				</div>

				<!-- Пройти верефикацию -->
				<div class="modal-content" v-if="modalId === 'errorVerified'">
					<h5 class="modal-title">Ошибка верификации</h5>
					<p class="modal-subtitle">Срок действия вашей ссылки для подтверждения истёк или ссылка недействительна. Пожалуйста, запросите новую ссылку.</p>
					<FormRepeatVerification />
				</div>

				<!-- Пройти верефикацию повторное письмо -->
				<div class="modal-content" v-if="modalId === 'endRepeatVerified'">
					<h5 class="modal-title">На ваш e-mail отправлено письмо с данными для входа</h5>
					<p class="modal-subtitle">Пожалуйста, перейдите по ссылке в письме, чтобы активировать ваш аккаунт и ознакомиться с паролем. Не нашли письмо? Проверьте папку «Спам» или запросите повторное письмо</p>
				</div>

				<!-- Восстановление пароля send Email -->
				<div class="modal-content" v-if="modalId === 'sentNewPassword'">
					<h5 class="modal-title">Восстановление пароля</h5>
					<p class="modal-subtitle">Пароль успешно обновлен. <br> Новый пароль отправлен в СМС на указанный вами номер телефона.</p>
					<div class="form form-grid">
						<button class="send-button btn form__btn --blue" @click="openModal('authorization')">Войти</button>
					</div>
				</div>

				<!-- Общая информация -->
				<div class="modal-content" v-if="modalId === 'responseText'">
					<h5 class="modal-title" v-if="!!modalContent.title">{{ modalContent.title }}</h5>
					<p class="modal-subtitle" :class="{'--width': !modalContent.title}">{{ modalContent.text }}</p>
				</div>

				<!-- Акция еще не началась-->
				<div class="modal-content" v-if="modalId === 'promoNotStart'">
					<h5 class="modal-title --center" style="text-align: center">Совсем скоро вы сможете вступить в клуб Planto Профи!</h5>
				</div>

				<!-- Акция закончилась -->
				<div class="modal-content" v-if="modalId === 'promoEnd'">
					<h5 class="modal-title --center" style="text-align: center">Программа Planto Профи завершилась!</h5>
				</div>
			</div>
		</Transition>
	</div>
</template>
<style lang="scss" scoped>

.v-enter-active,
.v-leave-active {
	transition: 0.5s ease;
}

.v-enter-from {
	opacity: 0;
	transform: translateY(-10%);
}
.v-leave-to {
	opacity: 0;
	transform: translateY(-10%);
}

.modal {
	--transition-time: 0.3s;
	position: fixed;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	z-index: 10001;
	background-color: rgba(0, 0, 0, 0.5);
	backdrop-filter: blur(10.800000190734863px);
	cursor: pointer;
	overflow-y: auto;
	overflow-x: hidden;
	-webkit-overflow-scrolling: touch;
	text-align: center;
	opacity: 0;
	visibility: hidden;
	transition: opacity var(--transition-time), visibility var(--transition-time);
}

.modal::before {
	content: "";
	display: inline-block;
	vertical-align: middle;
	height: 100%;
}

.modal__container {
	position: relative;
	width: 700px;
	margin: 50px auto;
	display: none;
	vertical-align: middle;
	background: var(--fill-inverse-1);
	border-radius: var(--border-radius) 0;
	cursor: default;
	text-align: left;
	padding: 0;

	&.--big {
		width: 710px;
	}
	&.full {
		background: rgba(0, 0, 0, 0.6);
		width: 1600px;
		.modal-close {
			background: var(--fill-inverse-1);
			svg {
				stroke: #573218;
			}
		}
	}
}

.modal.is-open {
	opacity: 1;
	visibility: visible;
	transition: opacity var(--transition-time), visibility var(--transition-time);
	.modal__container {
		display: inline-block;
	}
}

@media (max-width: $m) {
	.modal.--feedback {
		overflow: hidden;
		display: flex;
		align-items: flex-start;
		justify-content: center;
		.modal__container {
			display: block;
			overflow-y: auto;
			-webkit-overflow-scrolling: touch;
			max-height: 100dvh;
			margin: 0;
			width: 100%;
			border-radius: var(--border-radius) 0 0 0;
		}
	}
}

.modal__container.modal-open {
	display: inline-block;
}

.fade {
	opacity: 0;
	transition: opacity var(--transition-time);
}

.fade.animate-open {
	opacity: 1;
	transition: opacity var(--transition-time);
}

.fadeInUp {
	opacity: 0;
	transform: translateY(-100px);
	transition: opacity var(--transition-time), transform var(--transition-time);
}

.fadeInUp.animate-open {
	opacity: 1;
	transform: translateY(0);
	transition: opacity var(--transition-time), transform var(--transition-time);
}

.disable-scroll {
	position: relative;
	overflow: hidden;
	height: 100vh;
	position: fixed;
	left: 0;
	top: 0;
	width: 100%;
}

.modal-close {
	display: flex;
	align-items: center;
	justify-content: center;
	position: absolute;
	width: 56px;
	height: 56px;
	border-radius: 32px 0;
	background: var(--fill-default-1);
	top: 28px;
	right: 28px;
	@media (max-width: $xx) {
		top: 15px;
        right: 15px;
		width: 36px;
    	height: 36px;
		border-radius: 18px 0;
	}
	svg {
		width: 2.4rem;
    	height: 2.4rem;
		stroke-width: 2px;
		stroke:  var(--fill-inverse-1);
		transition: transform var(--transition) ease-in;
	}
	@media (hover: hover) {
		&:hover {
			svg {
				transform: scale(1.1);
			}
		}
	}
}

.modal-content {
	display: grid;
	gap: 25px;
	padding: 49px 30px 49px 30px;
	@media (max-width: $xx) {
		padding: 35px 25px;
		gap: 20px;
	}
}

.modal-title {
	font-weight: 400;
	font-size: 42px;
	line-height: 100%;
	max-width: 55rem;
	@media (max-width: $xx) {
		font-size: 28px;
	}
	@media (max-width: $xx) {
		max-width: 32rem;
	}
	@media (max-width: $x) {
		// font-size: 28px;
	}
	&.--center {
		text-align: center;
	}
}
.modal-subtitle {
	font-family: var(--second-family);
	font-weight: 400;
	font-size: 28px;
	line-height: 120%;
	@media (max-width: $xx) {
		font-size: 18px;
	}
	@media (max-width: $xx) {
		font-size: 16px;
	}
	a {
		color: inherit;
		@media (hover: hover) {
			&:hover {
				text-decoration: underline;
			}
		}
	}
	&.--center {
		text-align: center;
	}
	&.--width {
		max-width: 580px;
		@media (max-width: $xx) {
			max-width: 430px;
		}
		@media (max-width: $xx) {
			max-width: 37rem;
		}
		@media (max-width: $xx) {
			max-width: 320px;
		}
	}
}
.buttons {
	display: grid;
	gap: 56px;
}

.modal-image {
	width: 100%;
	img {
		aspect-ratio: 74 / 29 ;
	}
}
.modal-decs {
	@extend .modal-subtitle;
	max-height: 500px;
	display: grid;
    gap: 15px;
	white-space: pre-line;
	overflow-y: auto;
	
}
.modal-list {
	@extend .modal-subtitle;
	p {
		margin-bottom: 24px;
	}
	ul {
		padding-left: 50px;
		li {
			position: relative;
			&::before {
				position: absolute;
				content: '';
				width: 5px;
				height: 5px;
				border-radius: 50%;
				background-color: var(--fill-default-1);
				left: -25px;
				top: 50%;
				transform: translateY(-50%);
			}
			&:not(:last-child) {
				margin-top: 5px;
			}
		}
	}
}
.modal-video {
	display: grid;
	place-content: center;
	padding-top: 3rem;
}
.modal-content__desc {
	font-weight: 400;
	font-size: 2.4rem;
	line-height: 140%;
	color: var(--fill-default-1);
	@media (max-width: $xx) {
		font-size: 1.8rem;
	}
	ul {
		padding-left: 3rem;
		list-style-type: disc;
		@media (max-width: $xx) {
			padding-left: 1.5rem;
		}
		li {
		}
	}
}
.modal-content__desc-title {
	font-weight: 400;
	font-size: 2.4rem;
	line-height: 140%;
	margin-bottom: 4rem;
	@media (max-width: $xx) {
		font-size: 1.8rem;
		margin-bottom: 1rem;
	}
}

.modal-prizes {
	display: grid;
	gap: 15px;
	img {
		flex-shrink: 0;
	}
	.btn {
		font-size: 1.6rem;
		padding: 1.8rem 4rem;
		@media (max-width: $xx) {
			    padding: 1.4rem 4rem;
		}
	}
}
.modal-prizes__btn {
	position: relative;
	display: flex;
	align-items: center;
	gap: 20px;
	border: 1px solid var(--border-inverse-3);
	border-radius: var(--border-radius);
	padding: 20px 10px;
	color: var(--text-accent-1-100);	
	@media (max-width: $xx) {
		flex-direction: column;
		text-align: start;
	}
	@media (hover: hover){
		&:hover {
			background: var(--fill-accent-1-3);
		}
	}
	&.active {
		color: var(--text-inverse-100);
		background: var(--fill-accent-1-1);
		border-color: var(--fill-accent-1-1);
		svg {
			display: block;
		}
		&.pointer-events-none {
			pointer-events: auto;
		}
	}
	&.pointer-events-none {
		pointer-events: none;
	}
	svg {
		display: none;
		position: absolute;
		top: 24px;
		right: 24px;
		width: 2.4rem;
		height: 2.4rem;
		stroke: transparent;
	}
}
.modal-prizes__content {
}
.modal-prizes__title {
	font-weight: 500;
	font-size: 2rem;
	line-height: 120%;
	margin-bottom: 20px;
	text-align: start;
}
.modal-prizes__subtitle {
	font-weight: 400;
	font-size: 1.4rem;
	line-height: 140%;
}
</style>
