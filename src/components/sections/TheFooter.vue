<script setup>
import { onMounted, ref } from "vue";
import { useScrollStore } from "@/stores/storeScroll";
import  { useRequestsStore } from "@/stores/storeRequests";
import { useModals } from "@/composables/useModals";
import { policyUrl, rulesUrl, userAgreementUrl, loyaltyProgramUrl } from "@/utils/provider";
import { sendMetrik } from '@/utils/metrika';
import { sendAdriver } from '@/utils/metrika';

const { openModal } = useModals();
const storeScroll = useScrollStore();
const storeRequests = useRequestsStore();

const footerRef = ref(null);

onMounted(async () => {
	storeScroll.footer = footerRef.value;
});
</script>
<template>
	<footer class="footer" ref="footerRef" id="footer">
		<div class="container --footer">			
			<div class="footer__container">	
				<div class="logos">
					<RouterLink to="/#header" class="logo">
						<img class='' width="218" height="61" src='@/assets/img/icons/logo.webp' srcset='@/assets/img/icons/logo@2x.webp 2x' alt='изображение логотипа'>
					</RouterLink>
				</div>
				<nav class="footer__nav">
					<a @click="sendAdriver('rules_click'), sendMetrik('reachGoal','Rules_Click')" target="_blank" rel="noopener noreferrer" :href="policyUrl">Политика конфиденциальности</a>
					<a target="_blank" rel="noopener noreferrer" :href="rulesUrl">Правила программы</a>
					<a target="_blank" rel="noopener noreferrer" :href="loyaltyProgramUrl">Программа лояльности</a>
					<a target="_blank" rel="noopener noreferrer" :href="userAgreementUrl">Пользовательское соглашение</a>
				</nav>
				<button v-if="!storeRequests.isTelegramPage" class="footer__btn btn" @click="openModal('feedback')">Задать вопрос</button>
			</div>
			<div class="footer__text">
				ООО «МИРВЕСТ» (ОГРН 1127746704821), Российская Федерация, 125167, город Москва, вн.тер.г. муниципальный округ Хорошевский, улица Викторенко, дом 5, стр. 1, помещение 6/5. Общий срок проведения Акции с 01.07.2026 г. по 30.12.2026 г., включая период выдачи призов. Срок покупки призов за баллы при условии авторизации на сайте Акции или в чат-боте Акции с 01.07.2026 г. по 30.12.2026 г. включительно. Изображение призов на рекламных материалах может отличаться от фактически разыгрываемых призов. С информацией об Организаторе Акции, правилах и сроках проведения, количестве призов по результатам Акции, месте и порядке их получения можно ознакомиться на сайте www.planto-profi.ru или в чат-боте Акции.
			</div>
		</div>
	</footer>
</template>
<style lang="scss" scoped>

.footer {
	position: relative;
	border-top: 1px solid var(--border-inverse-1);
	background: var(--fill-accent-4-1);
	padding: 4.8rem 0rem;
	z-index: 1;
    @media (max-width: $xx) {
        padding: 40px 0 ;
    }
}
.footer__container {	
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 1rem;
	@media (max-width: $xx) {
		flex-direction: column;
		gap: 32px;
	}
}

.logos {
}
.logo {
	position: relative;
    z-index: 1;
	width: 21.8rem;
}

.footer__nav {
	display: flex;
	align-items: center;
	gap: 4.8rem;
	@media (max-width: $l) {
		flex-wrap: wrap;
		justify-content: center;
		gap: 2rem 3.2rem;
	}
    @media (max-width: $t) {
        // flex-direction: column;
        gap: 1.8rem;
    }
	a {
		font-family: var(--second-family);
		font-weight: 400;
		font-size: 2.4rem;
		line-height: 75%;
		color: var(--text-default-100);
		border-bottom: 2px solid transparent;
		@media (hover: hover) {
			&:hover {
				border-color: currentColor;
			}
		}
		@media (max-width: $xx) {
			font-size: 2.4rem;
		}
	}
}
.footer__btn {
	@media (max-width: $xx) {
		width: 100%;
	}
}
.footer__text {
	font-family: var(--second-family);
	font-weight: 400;
	font-size: 1.8rem;
	line-height: 120%;
	margin-top: 4rem;
}
</style>
