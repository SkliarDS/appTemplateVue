import axios from "axios";
import { ref, computed, watch } from "vue";
import { defineStore } from "pinia";
import { useRouter, useRoute } from "vue-router";
import { useModals } from "@/composables/useModals";
import { useSettingsStore } from "./storeSettings";
import { sendMetrik } from "@/utils/metrika";
import { sendAdriver } from '@/utils/metrika';
import { phoneFormatter } from "@/utils/functions";
import { API_URL, TELEGRAM_ENABLED } from "@/utils/constans";
import { getWebApp } from "@/utils/telegram";
import { get } from "browser-cookies";

export const useRequestsStore = defineStore("request", () => {
	const router = useRouter();
	const route = useRoute();
	const storeSettings = useSettingsStore();
	const { responseOk, closeModal, openModal } = useModals();

	const token = ref(localStorage.getItem("token"));

	const setToken = (newToken) => {
		token.value = newToken;
		localStorage.setItem("token", newToken);
	};

	const removeToken = () => {
		token.value = null;
		localStorage.removeItem("token");
	};

	const loaderBtn = ref(false);
	const isLoading = ref(false);
	const userData = ref({});
	const userLegalData = ref({});
	const userReceiptsData = ref({});
	const userReceiptReults = ref([]);
	const userPrizesData = ref({});
	const listUserPrizes = ref([]);
	const winnersList = ref([]);
	const responseError = ref("");
	const isRegistrationSuccess = ref(false);
	const suggestCityOptions = ref([]);
	const positions = ref([]);
	const pointsList = ref([]);
	const pointsHasMore = ref(false);
	const pointsLoading = ref(false);
	const pointsOffset = ref(0);
	const POINTS_PAGE_SIZE = 10;
	const newsList = ref([]);
	const userTasksList = ref([]);
	const qrImage = ref("");
	const referralUserData = ref({});
	const pointsAmount = ref(0);
	const taskName = ref('');
	const isAuthenticated = computed(() => !!token.value);
	const isApprovedChecksCount = computed(() => userData.value?.approved_checks_count >= 1);
	const isMobile = computed(() => storeSettings.widthWindow <= 576);
	const _isTelegramApp = !!getWebApp()?.initData;
	const isTelegramPage = computed(() => TELEGRAM_ENABLED && (_isTelegramApp || route.path?.includes("webview")));

	const phoneQuery = ref('');
	const tgIdQuery = ref('');
	const refQuery = ref('');
	 watch(
		() => route.query,
		(query) => {
			phoneQuery.value = query.phone || ''
			tgIdQuery.value = query.tg_id || ''
			refQuery.value = query.ref || ''
		},
		{ immediate: true }
	)

	axios.interceptors.response.use(
		(response) => response,
		(error) => {
			if (error.response && error.response.status === 401) {
				removeToken();
				delete axios.defaults.headers.common["Authorization"];
			}
			return Promise.reject(error);
		}
	);

	const setAuthHeader = () => {
		const urlParams = new URLSearchParams(window.location.search);
		const tokenURL = urlParams.get("token");
		if (tokenURL) {
			token.value = tokenURL;
		} else {
			token.value = localStorage.getItem("token");
		}
		if (token.value) {
			axios.defaults.headers.common["Authorization"] = `Bearer ${token.value}`;
		} else {
			delete axios.defaults.headers.common["Authorization"];
		}
	};

	// data — значения формы регистрации (FormRegistration.vue)
	const registration = async (data) => {
		loaderBtn.value = true;
		const registrationParams = localStorage.getItem("registration_params") || "";
		const ref = localStorage.getItem("ref") || "";
		const source = isTelegramPage.value ? "telegram" : "website";
		try {
			const formData = new FormData();

			formData.append("full_name", data.fullName);
			formData.append("phone_number", data.phone || phoneFormatter(phoneQuery.value));
			formData.append("email", data.email);
			formData.append("city", data.city ?? "");
			formData.append("workplace", data.workplace);
			formData.append("position", data.position);
			formData.append("telegram_username", data.telegram ?? "");
			formData.append("vk_username", data.vk ?? "");
			formData.append("max_username", phoneFormatter(data.max ?? ""));
			formData.append("query", registrationParams);
			formData.append("referral_code", ref);
			formData.append("referral_source", source);
			formData.append("is_policy", data.agreement);
			formData.append("is_rules", data.rules);
			formData.append("agree_to_advertising", data.agreeToAdvertising);

			const res = await axios.post(`${API_URL}/api/users/registration`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			isRegistrationSuccess.value = true;
			
			sendMetrik("reachGoal", "register");
			if(isTelegramPage.value){
				getWebApp()?.sendData("ok")
				router.push({ name: "tg-auth" });
			} else {
				openModal("registrationEnd");
			}
		} catch (error) {
			console.log("Error sendRegistration", error);
			responseError.value = error.response?.data?.detail || "Ошибка при отправке данных.";
			console.log("error.response:", error.response);
		} finally {
			loaderBtn.value = false;
		}
	};

	// data: { phone, password }. В Telegram телефон берётся из ?phone=
	const authorization = async (data) => {
		loaderBtn.value = true;
		const parameters = {
			phone_number: data.phone || phoneFormatter(phoneQuery.value),
			password: data.password,
		};

		try {
			const res = await axios.post(`${API_URL}/api/users/authorization`, parameters);
			setToken(res.data.access);
			setAuthHeader();
			await userInfo();
			if(isTelegramPage.value){
				router.push({ name: "tg-profile" });
			} else {

				router.push({ name: "profile" });
			}
			closeModal();
			sendMetrik("reachGoal", "login");
		} catch (error) {
			console.log("error sendAuthorization:", error);
			responseError.value = error.response?.data?.detail || "Ошибка при отправке данных.";
			if(error.response.status === 557) {
				openModal('notVerified')
			}
		} finally {
			loaderBtn.value = false;
		}
	};

	const userInfo = async () => {
		try {
			setAuthHeader();
			const res = await axios.get(`${API_URL}/api/users/me`);
			userData.value = res.data;
			if(userData.value.legal_entity) {
				await getLegalEntity();
			}
			await getPoints(true);
		} catch (error) {
			if (error.response && error.response.status === 401) {
				console.warn("Пользователь не авторизован");
				userData.value = null;
			} else {
				console.error("Error getUserInfo", error);
				throw error;
			}
		}
	};
	
	const verification = async (token, uuid) => {
		try {
			const params = {
				verification_token: token,
				uuid: uuid,
			}
			await axios.post(`${API_URL}/api/users/confirm-email/finalize`, params );
			// очищаем query, чтобы при перезагрузке запрос не уходил повторно
			router.replace({ query: {} });

			if (localStorage.getItem("token")) {
				await userInfo();
			}
		} catch (error) {
			console.error("Error verification", error);
			responseError.value = error.response?.data?.detail || "Ошибка при отправке данных.";
			// openModal("errorVerified");
		} 
	};
	const isSendingVerification = ref(false); 
	const repeatVerification = async () => {
		if (isSendingVerification.value) return null; 
		isSendingVerification.value = true;
		try {
			
			await axios.get(`${API_URL}/api/users/confirm-email/request`);
			
			setTimeout(() => { isSendingVerification.value = false; }, 60000);
			return { text: 'Письмо отправлено.', duration: 2000 };
		} catch (error) {
			console.error("Error repeatVerification", error);
			isSendingVerification.value = false; 
			if (error.response?.status === 429) {
				return { text: 'Письмо уже отправлено. Повторите через минуту.', duration: 4000 };
			}
			return { text: 'Не удалось отправить письмо. Попробуйте позже.', duration: 4000 };
		}
	};

	// data: { phone }. В Telegram телефон берётся из ?phone=
	const recoveryPassword = async (data = {}) => {
		loaderBtn.value = true;
		const parameters = {
			phone_number: data.phone || phoneFormatter(phoneQuery.value),
		};
		try {
			const res = await axios.post(`${API_URL}/api/users/recovery-password`, parameters);
			sendMetrik("reachGoal", "forget");
			openModal("sentNewPassword");
		} catch (error) {
			console.log("error sendRecoveryPassword:", error);
			responseError.value = error.response?.data?.detail || "Ошибка при отправке данных.";
		} finally {
			loaderBtn.value = false;
		}
	};

	// data: { email }
	const changeUserProfile = async (data) => {
		const parameters = {
			email: data.email || userData.value.email,
		};
		loaderBtn.value = true;
		try {
			setAuthHeader();
			const res = await axios.put(`${API_URL}/api/users/me`, parameters);
			await userInfo();
			setTimeout(() => {
				closeModal("responseText");
			}, 2000);
			openModal("responseText", {content:{
				title: 'Изменение данных',
				text: 'Ваш email успешно изменен',
			}});
			setTimeout(() => {
				closeModal("sentChangeUserProfile");
			}, 2000);
		} catch (error) {
			console.log("error changeUserProfile", error);
			responseError.value = error.response?.data?.detail || "Ошибка при отправке данных.";
		} finally {
			loaderBtn.value = false;
		}
	};

	// data: { password }
	const changeUserPassword = async (data) => {
		loaderBtn.value = true;
		const new_password = { new_password: data.password };
		try {
			setAuthHeader();
			await axios.patch(`${API_URL}/api/users/change-password`, new_password);
			// openModal("sentChangeNewPassword");
			setTimeout(() => {
				closeModal("responseText");
			}, 2000);
			openModal("responseText", {content:{
				title: 'Изменение пароля',
				text: 'Ваш пароль успешно изменен',
			}});
		} catch (error) {
			console.error("Error changePassword", error);
			responseError.value = error.response?.data?.detail || "Ошибка при отправке данных";
		} finally {
			loaderBtn.value = false;
		}
	};

	const getLegalEntity = async () => {
		try {
			let url = `${API_URL}/api/users/me/legal-entity`;
			const { data } = await axios.get(url);
			userLegalData.value = data;
		} catch (error) {
			console.log("Error getLegalEntity:", error.response.data.detail);
		}
	};

	const getReferralQr = async () => {
		try {
			setAuthHeader();
			if (qrImage.value) {
				URL.revokeObjectURL(qrImage.value);
				qrImage.value = "";
			}
			const { data } = await axios.get(`${API_URL}/api/users/me/referral-qr`, {
				responseType: "blob",
				params: { _t: Date.now() },
			});
			qrImage.value = URL.createObjectURL(data);
		} catch (error) {
			console.log("Error getReferralQr:", error);
		}
	};

	const getReferral = async () => {
		try {
			setAuthHeader();
			let url = `${API_URL}/api/users/me/referral`;
			const { data } = await axios.get(url);
			referralUserData.value = data;
		} catch (error) {
			console.log("Error getReferral:", error);
		}
	};

	const getPoints = async (reset = false) => {
		if (pointsLoading.value) return;
		if (reset) {
			pointsList.value = [];
			pointsOffset.value = 0;
			pointsHasMore.value = false;
		}
		try {
			setAuthHeader();
			pointsLoading.value = true;
			const [pointsRes, userRes] = await Promise.all([
				axios.get(`${API_URL}/api/points/history/?limit=${POINTS_PAGE_SIZE}&offset=${pointsOffset.value}`),
				axios.get(`${API_URL}/api/users/me`),
			]);
			pointsList.value = [...pointsList.value, ...pointsRes.data.results];
			pointsOffset.value += pointsRes.data.results.length;
			pointsHasMore.value = !!pointsRes.data.next;
			userData.value = { ...userData.value, ...userRes.data };
		} catch (error) {
			console.log("getPoints:", error);
		} finally {
			pointsLoading.value = false;
		}
	};

	const getTasks = async () => {
		try {
			let url = `${API_URL}/api/assignments/public/`;
			let allResults = [];
			while (url) {
				const { data } = await axios.get(url);
				allResults = [...allResults, ...data.results];
				url = data.next;
			}
			return allResults;
		} catch (error) {
			console.log("getTasks:", error);
		}
	};

	const getUserTasks = async () => {
		try {
			let url = `${API_URL}/api/assignments/`;
			let allResults = [];
			while (url) {
				const { data } = await axios.get(url);
				allResults = [...allResults, ...data.results];
				url = data.next;
			}
			userTasksList.value = allResults;
			return allResults;
		} catch (error) {
			console.log("getTasks:", error);
		}
	};

	const getWelcomeTask = async () => {
		try {
			setAuthHeader();
			const { data } = await axios.get(`${API_URL}/api/welcome-task/`);
			return data;
		} catch (error) {
			console.log("getWelcomeTask:", error.response?.data?.detail);
		}
	};

	const subsribeTask = async (id) => {
		loaderBtn.value = true;
		try {
			setAuthHeader();
			const { data } = await axios.post(`${API_URL}/api/assignments/${id}/sms-subscribe/`);
			openModal("responseText", { 
				content: {
					title: 'Запрос отправлен',
					text: 'Когда задание станет доступным, на указанный при регистрации номер будет отправлено СМС-уведомление о старте',
				}
			});
			return data;
		} catch (error) {
			console.log("subsribeTask:", error.response?.data?.detail);
			openModal("responseText", { 
				content: {
					text: `${error.response?.data?.detail}`,
				}
			});
		} finally {
			loaderBtn.value = false;
		}
	};

	const unsubscribeTask = async (id) => {
		loaderBtn.value = true;
		try {
			setAuthHeader();
			const { data } = await axios.delete(`${API_URL}/api/assignments/${id}/sms-subscribe/`);
			openModal("responseText", { 
				content: {
					text: 'Вы успешно отписались от СМС рассылки.',
				}
			});
			return data;
		} catch (error) {
			console.log("unsubscribeTask:", error.response?.data?.detail);
			openModal("responseText", { 
				content: {
					text: `${error.response?.data?.detail}`,
				}
			});
		} finally {
			loaderBtn.value = false;
		}
	};

	const getTasksDetail = async (id) => {
		isLoading.value = true;
		try {
			let url = `${API_URL}/api/assignments/${id}/`;				
			const { data } = await axios.get(url);		
			pointsAmount.value = data.points_amount;
			taskName.value = data.task_name;
			return data;
		} catch (error) {
			console.log("getNewsDetail:", error);
			openModal("responseText", { 
				content: {
					text: 'Что-то пошло не так, попробуйте еще раз или обратитесь в службу поддержки.',
				}
			});
		} finally {
			isLoading.value = false;
		}
	};

	const submitTasksDetail = async (id, type, { message = "", files = [] } = {}) => {
		loaderBtn.value = true;
		const parameters = {
			message,
			files,
		}
		try {
			const formData = new FormData();

			if (parameters.files && parameters.files.length > 0 && type === 'photo') {
				for (const file of parameters.files) {
					formData.append("files", file);
				}
			}

			if (parameters.message && parameters.message.trim().length > 0) {
				formData.append("message", parameters.message.trim());
			}

			let url = `${API_URL}/api/assignments/${id}/submit/`;				
			await axios.post(url, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});		
			await getUserTasks();
			await getPoints(true);
			console.log('tast:',);
			openModal("responseText", {
				content: {
					title: 'Задание успешно отправлено!',
					text: 'Баллы будут начислены после прохождения модерации. Проверка может занять до 3 рабочих дней',
				}
			});
		} catch (error) {
			console.log("getNewsDetail:", error);
			responseError.value = error.response?.data?.detail || "Ошибка при отправке данных.";
		} finally {
			loaderBtn.value = false;
		}
	};

	const getSurveysActive = async () => {
		isLoading.value = true;
		try {
			let url = `${API_URL}/api/surveys/active/`;				
			const { data } = await axios.get(url);		
			data.amount = pointsAmount.value;
			data.name = taskName.value;
			return data;
		} catch (error) {
			console.log("getNewsDetail:", error);
		} finally {
			isLoading.value = false;
		}
	};

	const submitSurveys = async (id, answers) => {
		loaderBtn.value = true;
		const parameters = {
			answers:answers
		}
		try {
			let url = `${API_URL}/api/surveys/${id}/submit/`;				
			await axios.post(url, parameters);	
			await getUserTasks();
			await getPoints(true);
			openModal("responseText", {
				content: {
					title: 'Опрос успешно отправлен!',
					text: 'Вам начислено ' + pointsAmount.value + ' баллов',
				}
			});
		} catch (error) {
			console.log("getNewsDetail:", error);
			responseError.value = error.response?.data?.detail || "Ошибка при отправке данных.";
		} finally {
			loaderBtn.value = false;
			
		}
	};

	const getNews = async (type='news') => {
		try {
			let url = `${API_URL}/api/news/`;
			let allResults = [];
			const params = {
				type: type
			}
			while (url) {
				const { data } = await axios.get(url, { params });
				allResults = [...allResults, ...data.results];
				url = data.next;
			}
			return allResults;
		} catch (error) {
			console.log("getNews:", error);
		}
	};
	
	const getNewsDetail = async (id) => {
		try {
			let url = `${API_URL}/api/news/${id}/`;				
			const { data } = await axios.get(url);		
			return data;
		} catch (error) {
			console.log("getNewsDetail:", error);
			openModal("responseText", { 
				content: {
					text: 'Что-то пошло не так, попробуйте еще раз или обратитесь в службу поддержки.',
				}
			});
		}
	};
	
	const getKnowledge = async (type) => {
		try {
			setAuthHeader();
			let url = `${API_URL}/api/knowledge/content/`;
			let allResults = [];
			const params = {
				content_type: type
			}
			while (url) {
				const { data } = await axios.get(url, { params });
				allResults = [...allResults, ...data.results];
				url = data.next;
			}

			return allResults.filter(item => {
				if (userData.value.legal_entity !== null) {
					return item.access_level === 'basic';
				} else {
					return item;
				}
			});
		} catch (error) {
			console.error("Error getCollections:", error);
		}
	};

	const getKnowledgeDetail = async (id) => {
		isLoading.value = true;
		try {
			setAuthHeader();
			let url = `${API_URL}/api/knowledge/content/${id}/`;				
			const { data } = await axios.get(url);		
			return data;
		} catch (error) {
			console.log("getKnowledgeDetail:", error);
			openModal("responseText", { 
				content: {
					text: 'Что-то пошло не так, попробуйте еще раз или обратитесь в службу поддержки.',
				}
			});
		} finally {
			isLoading.value = false;
		}
	};

	const getPrizes = async (user_type, category) => {
		try {
			let url = `${API_URL}/api/prizes/`;
			let allResults = [];
			setAuthHeader();
			while (url) {

				const { data } = await axios.get(url, { params: { user_type, category } });
				allResults = [...allResults, ...data.results];
				url = data.next;
			}

			return allResults;
		} catch (error) {
			console.log("Error getCollections:", error);
		}
	};

	const exchangePoints = async (id) => {
		loaderBtn.value = true;
		try {
			setAuthHeader();
			const { data } = await axios.post(`${API_URL}/api/prizes/${id}/exchange/`);
			openModal("responseText", {
				content: {
					text: 'Вы успешно обменяли баллы на приз! Информация о получении отправлена на ваш email',
				}
			});
			await getPoints(true);
			prizesRefreshKey.value++;
			return data;
		} catch (error) {
			console.log("Error exchangePoints:", error);
			openModal("responseText", { 
				content: {
					text: `${error.response?.data?.detail}`,
				}
			});
		} finally {
			loaderBtn.value = false;
		}
	}

	const userPrizes = async (offset = 0, limit = 1000) => {
		try {
			setAuthHeader();
			const { data } = await axios.get(`${API_URL}/api/prizes/my-orders/`, {
				params: { offset, limit }
			});
			return data;
		} catch (error) {
			console.log("Error userPrizes", error);
		}
	};

	const prizesRefreshKey = ref(0);
	const isChangedPrize = ref(false);
	const getInn = async (inn) => {
		responseError.value = 'Проверяем ИНН...';
		try {
			setAuthHeader();
			const { data } = await axios.get(`${API_URL}/api/users/inn-lookup`, { params: { inn }});	
			return data;
		} catch (error) {
			console.log(" getInn:", error);
		} finally {
			// responseError.value = '';
		}
	}

	// data: { inn }
	const transferToLegalEntity = async (data, confirmed) => {
		loaderBtn.value = true;
		try {
			setAuthHeader();
			const { data } = await axios.post(`${API_URL}/api/users/me/legal-entity`, { 
				inn : data.inn,
  				confirmed : confirmed
			});	
			userLegalData.value = data;
			await userInfo();
			if (isTelegramPage.value) {
				getWebApp()?.close();
			} else {
				openModal("responseText", {
					content: {
						text: 'Данные о вашем заведении успешно отправлены. Ваш профиль переведён в статус юридического лица',
					}
				});
			}
		} catch (error) {
			console.log(" getInn:", error);
			responseError.value = error.response?.data?.detail || "Ошибка при отправке данных. Проверьте инн и повторите попытку.";
		} finally {
			loaderBtn.value = false;
		}
	}

	const offsetReceipt = ref(0);
	let limitReceipt;
	const loading = ref(false);
	const allLoaded = ref(false);
	const nextList = ref(null);

	if(isMobile.value) {
		limitReceipt = 4;
	} else {
		limitReceipt = 6;
	}

	const mergeReceipts = (current, incoming) => {
		const map = new Map();
		[...incoming, ...current].forEach((r) => {
			map.set(r.id, r);
		});
		// возвращаем массив, отсортированный по дате (новые сверху)
		return Array.from(map.values()).sort((a, b) => new Date(b.upload_date) - new Date(a.upload_date));
	};

	const putRecieptInListReceipts = async () => {
		try {
			const res = await axios.get(`${API_URL}/api/quiz/user/receipts?limit=1000`);
			const results = res.data?.results || [];
			userReceiptsData.value = res.data;
			userReceiptReults.value = mergeReceipts(userReceiptReults.value, results);
		} catch (error) {
			console.log("putRecieptInListReceipts error:", error);
		}
	};	

	const userReceipts = async () => {
		if (loading.value || allLoaded.value) return;
		loading.value = true;
		try {
			setAuthHeader();
			const { data } = await axios.get(`${API_URL}/api/quiz/user/receipts?offset=${offsetReceipt.value}&limit=${limitReceipt}`);
			const results = data?.results || [];
			
			if (results.length < limitReceipt) {
				allLoaded.value = true;
			}
			if(isMobile.value) {
				allLoaded.value = true;
				nextList.value = data.next;
			}

			userReceiptReults.value = mergeReceipts(userReceiptReults.value, results);
			offsetReceipt.value += limitReceipt;

		} catch (error) {
			console.log("userReceipts:", error);
		} finally {
			loading.value = false;
		}
	};

	const showMoreReceipts = async () => {
		offsetReceipt.value += limitReceipt;
		await userReceipts();
	};

	const offsetPrize = ref(0);
	const limitPrize = 10;
	const loadingPrize = ref(false);
	const allLoadedPrize = ref(false);	

	const updateWinnings = () => {
		winnersList.value = [];
		offsetPrize.value = 0;
		allLoadedPrize.value = false;
	};

	const getWinnings = async () => {
		
		if (loadingPrize.value || allLoadedPrize.value) return;
		loadingPrize.value = true;

		try {
			const { data } = await axios.get(`${API_URL}/api/prizes/winners/?offset=${offsetPrize.value}&limit=${limitPrize}`);
			const results = data?.results || [];
		
			if (results.length < limitPrize) {
				allLoadedPrize.value = true;
			}

			winnersList.value.push(...results);
			offsetPrize.value += limitPrize;
		} catch (error) {
			console.log("getWinnings error:", error);
		} finally {
			loadingPrize.value = false;
		}
	};

	const getSuggestCity = async (value) => {
		try {
			
			const params = {
				query: value
			}
			let url = `${API_URL}/api/users/suggest-city`;
			const { data } = await axios.get(url, { params });

			suggestCityOptions.value = data.suggestions.filter(item => item.city);
		} catch (error) {
			console.log("getSuggestCity error:", error);
		} 
	};

	const getPositions = async () => {
		try {
			
			let url = `${API_URL}/api/users/positions`;
			const { data } = await axios.get(url);

			positions.value = data.map((item , index) => {
				return {
					id: index,
					title: item.name
				}
			});
		} catch (error) {
			console.log("getSuggestCity error:", error);
		} 
	};

	const offsetPrizeChange = () => {
		offsetPrize.value = 0;
	};

	// data — значения формы обратной связи (FormFeedback.vue)
	const feedback = async (data) => {
		loaderBtn.value = true;

		const parameters = {
			topic: data.topic,
			name: data.name || userData.value?.full_name,
			email: data.email || userData.value?.email,
			files: data.files,
			text: data.message,
			is_personal_data_consent: data.agreement,
			agree_to_advertising: data.agreeToAdvertising,
		};

		const formData = new FormData();

		if (parameters.files && parameters.files.length > 0) {
			for (const file of parameters.files) {
				formData.append("files", file);
			}
		}

		formData.append("topic", parameters.topic);
		formData.append("name", parameters.name);
		formData.append("email", parameters.email);
		formData.append("text", parameters.text);
		formData.append("is_personal_data_consent", parameters.is_personal_data_consent);
		formData.append("agree_to_advertising", parameters.agree_to_advertising);

		try {
			 await axios.post(`${API_URL}/api/feedback/send`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			openModal("responseText", {
				content: {
					title: 'Обращение отправлено',
					text: 'Ваше обращение успешно отправлено. Мы ответим на него в течение 3 рабочих дней',
				}
			});
			responseError.value = "";
			sendMetrik("reachGoal", "feedback");
		} catch (error) {
			responseError.value = error.response?.data?.detail || "Ошибка при отправке данных.";
			console.error("Error sendFeedback", error);
		} finally {
			loaderBtn.value = false;
		}
	};

	const topics = async () => {
		try {
			const res = await axios.get(`${API_URL}/api/feedback/topics?limit=1000`);
			return res.data.results;
		} catch (error) {
			console.error("Error sendFeedback", error);
		}
	};

	const logout = async () => {
		removeToken();
		if (qrImage.value) {
			URL.revokeObjectURL(qrImage.value);
			qrImage.value = "";
		}
		userData.value = {};
		referralUserData.value = {};
		userReceiptsData.value = {};
		userReceiptReults.value = [];
		listUserPrizes.value = [];
		router.push({ name: "home" });
		localStorage.removeItem("ref");
		localStorage.removeItem("registration_params");
	};



	return {
		setAuthHeader,
		registration,
		authorization,
		recoveryPassword,
		logout,
		userInfo,
		verification,
		repeatVerification,
		userReceipts,
		showMoreReceipts,
		userPrizes,
		getInn,
		changeUserProfile,
		changeUserPassword,
		topics,
		feedback,
		updateWinnings,
		getWinnings,
		getSuggestCity,
		offsetPrizeChange,
		getLegalEntity,
		getKnowledge,
		getPrizes,
		getPositions,
		getReferralQr,
		getReferral,
		getNews,
		getNewsDetail,
		getTasks,
		getTasksDetail,
		submitTasksDetail,
		getSurveysActive,
		submitSurveys,
		getWelcomeTask,
		getUserTasks,
		subsribeTask,
		unsubscribeTask,
		getKnowledgeDetail,
		exchangePoints,
		transferToLegalEntity,
		setToken,

		isAuthenticated,
		loaderBtn,
		userData,
		userTasksList,
		userReceiptReults,
		userReceiptsData,
		userPrizesData,
		listUserPrizes,
		responseError,
		allLoaded,
		loading,
		nextList,
		allLoadedPrize,
		loadingPrize,
		winnersList,
		isApprovedChecksCount,
		isChangedPrize,
		isRegistrationSuccess,
		suggestCityOptions,
		positions,
		userLegalData,
		pointsList,
		pointsHasMore,
		pointsLoading,
		getPoints,
		prizesRefreshKey,
		qrImage,
		referralUserData,
		isLoading,
		isTelegramPage,
		phoneQuery,
	};
});
