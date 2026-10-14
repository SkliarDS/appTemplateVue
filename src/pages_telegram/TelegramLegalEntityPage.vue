<script setup>
import { watch } from "vue";
import { useRequestsStore } from "@/stores/storeRequests";
import { useForm } from "@/composables/useForm";
import { required, digits } from "@/utils/validators";
import { debounce } from "@/utils/functions";
import TelegramHeader from "@/pages_telegram/TelegramHeader.vue";
import BaseInput from '@/components/ui/BaseInput.vue';
import BaseNumberInput from "@/components/ui/BaseNumberInput.vue";

const storeRequests = useRequestsStore();

// Название и адрес заполняются автоматически по ИНН и обязательны для отправки
const { values, field, isValid, setValues, handleSubmit } = useForm({
    inn: { value: "", rules: [required("Введите 10-12 цифр"), digits([10, 12], "Введите 10-12 цифр")] },
    companyName: { value: "", rules: [required()] },
    legalAddress: { value: "", rules: [required()] },
});

// Поиск компании по ИНН: один запрос после паузы в вводе, только для 10 или 12 цифр
const lookupInn = debounce(async (inn) => {
    if (![10, 12].includes(inn.length)) return;
    const data = await storeRequests.getInn(inn);
    if (inn !== values.inn) return; // пока шёл запрос, ИНН изменили
    setValues({ companyName: data?.company_name ?? "", legalAddress: data?.legal_address ?? "" });
    if (data?.company_name && data?.legal_address) {
        storeRequests.responseError = "";
    } else {
        storeRequests.responseError = "ИНН не найден.";
        setTimeout(() => {
            storeRequests.responseError = "";
        }, 3000);
    }
}, 500);

watch(() => values.inn, lookupInn);

const onSubmit = handleSubmit((data) => storeRequests.transferToLegalEntity(data, true));
</script>

<template>
    <div class="tg-page">
        <TelegramHeader />
        <div class="modal-content">
            <h5 class="modal-title">Заполните данные о вашем заведении</h5>
            <form class="form form-grid" @submit.prevent="onSubmit">
                <div class="form__block-inputns">
                    <div class="form__wrap">
                        <BaseNumberInput
                            :required="true"
                            placeholder="ИНН компании"
                            mask="999999999999"
                            maskPlaceholder=""
                            v-bind="field('inn')"
                        >
                            ИНН компании
                        </BaseNumberInput>
                    </div>
                    <div class="form__wrap">
                        <BaseInput :readonly="true" type="text" placeholder="Название компании" :required="false" :model-value="values.companyName">Название компании</BaseInput>
                    </div>
                    <div class="form__wrap">
                        <BaseInput :readonly="true" type="text" :required="false" placeholder="Юридический адрес" :model-value="values.legalAddress">Юридический адрес</BaseInput>
                    </div>
                </div>
                <div class="form__footer --small-gap">
                    <p class="form__text-error" v-if="storeRequests.responseError">{{ storeRequests.responseError }}</p>
                    <button type="submit" :disabled="!isValid" :class="['send-button form__btn btn --big', { 'not-hover': storeRequests.loaderBtn }]">
                        <span v-if="!storeRequests.loaderBtn">Перейти</span>
                        <img v-else class="form__loader" width="36" height="36" src="@/assets/img/icons/loader.svg" alt="изображение" />
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.tg-page {
    padding: 2rem 0 ;
}
.modal-content {
	display: grid;
	gap: 35px;
	padding: 0px 15px;
	@media (max-width: $xx) {
		padding: 0px 15px;
		gap: 20px;
	}
}

.modal-title {
	font-weight: 400;
	font-size: 48px;
	line-height: 100%;
	max-width: 75rem;
    text-align: center;
	@media (max-width: $xx) {
		font-size: 28px;
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
	font-size: 32px;
	line-height: 120%;
	max-width: 75rem;
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
}
.buttons {
	display: grid;
	gap: 56px;
}
</style>
