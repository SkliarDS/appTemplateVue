import './assets/scss/style.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import iosScrollbar from '@/directives/iosScrollbar';
import { initTelegram } from '@/utils/telegram';

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.directive('ios-scrollbar', iosScrollbar);

// SDK Telegram загружаем до роутера: стор при создании проверяет, открыт ли сайт внутри Telegram
initTelegram()
	.catch((e) => console.error('Telegram SDK не загрузился:', e))
	.finally(() => {
		app.use(router)
		app.mount('#app')
	});


