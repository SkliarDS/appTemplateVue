# Example

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Для разработки локально

```sh
npm run dev
```

### Для сборки в тестовом режиме (тестовы api и т.д.)

```sh
npm run build:dev
```

### Для сборки на бой

```sh
npm run build:prod
```

## Переменные окружения

### Какой файл используется

| Команда              | Режим (`mode`) | Файл с переменными |
| -------------------- | -------------- | ------------------ |
| `npm run dev`        | `development`  | `.env.development` |
| `npm run build:dev`  | `development`  | `.env.development` |
| `npm run build:prod` | `production`   | `.env.production`  |

- В клиентский код попадают только переменные с префиксом `VITE_` (доступны через `import.meta.env`).
- Значения подставляются **в момент сборки**. После изменения `.env` нужно пересобрать проект или перезапустить `npm run dev`.
- Все значения — **строки**: `VITE_SHOW_STUB=false` в коде это `"false"`, поэтому сравнивать нужно со строкой (`=== "true"`).
- Для локальных переопределений можно создать `.env.development.local` / `.env.production.local` — они имеют приоритет и не попадают в git (`*.local` в `.gitignore`).

### Что означает каждая переменная

| Переменная               | Где используется                                                    | На что влияет |
| ------------------------ | ------------------------------------------------------------------- | ------------- |
| `VITE_API_URL`           | `src/utils/constans.js` → `API_URL`                                 | Базовый адрес API для всех запросов в `src/stores/storeRequests.js` и `src/stores/storeSettings.js`, а также ссылки на документы (правила, политика, соглашения) в `src/utils/provider.js` |
| `VITE_SITE_URL`          | `vite.config.js`; экспортируется как `SITE_URL` в `src/utils/constans.js` | Адрес сайта в строке `Sitemap:` файла `robots.txt` и в `<loc>` файла `sitemap.xml` (только при prod-сборке). Константа `SITE_URL` пока нигде в коде не импортируется |
| `VITE_YANDEX_METRIKA_ID` | `src/utils/metrika.js` → `YANDEX_METRIKA_ID`                        | ID счётчика Яндекс.Метрики в `initYandexMetrika()` и при отправке целей `sendMetrik()`. Метрика подключается в `App.vue` **в любом режиме**, в том числе при `npm run dev` |
| `VITE_SHOW_STUB`         | `src/App.vue`                                                       | `true` — вместо сайта показывается заглушка `TheStubPage`: не рендерятся шапка, футер, роутер, `BaseCookies`, `TheModals`, не сохраняются GET-параметры (`registration_params`). `false` — обычный сайт |
| `VITE_IS_PROD`           | —                                                                   | Сейчас в коде **не используется** |
| `VITE_DEBUG`             | —                                                                   | Сейчас в коде **не используется** |
| `VITE_TELEGRAM_ENABLED`  | `src/utils/constans.js` → `TELEGRAM_ENABLED`                         | Включает Telegram Mini App (см. раздел ниже). `true` — подключено, `false` — полностью отключено |

### Telegram Mini App: включение и отключение

Переключается одной переменной `VITE_TELEGRAM_ENABLED` в `.env.development` / `.env.production`, после чего нужно пересобрать проект или перезапустить `npm run dev`.

| | `true` | `false` |
| --- | --- | --- |
| SDK `@twa-dev/sdk` | Загружается отдельным чанком до старта приложения (`src/utils/telegram.js`), вызываются `ready()` и `expand()` | Не загружается и не выполняется |
| Маршруты `/webview/*` (`src/pages_telegram/`) | Работают | Не подключены — открывается 404 |
| `storeRequests.isTelegramPage` | `true`, если сайт открыт в Telegram или путь содержит `webview` | Всегда `false`: обычная шапка, куки, футер, модалки и редиректы сайта |

- Доступ к SDK в коде — только через `getWebApp()` из `src/utils/telegram.js` (вернёт `null`, если Telegram выключен) или composable `useTelegram()`. Не импортируйте `@twa-dev/sdk` напрямую — иначе SDK снова попадёт в сборку для всех.
- Если переменная не задана, Telegram считается **выключенным**.

### Чем отличаются сборки

Часть поведения зависит не от значений в `.env`, а от режима сборки (`mode`) в `vite.config.js`:

|                           | `build:dev` (`development`)                          | `build:prod` (`production`)                                         |
| ------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------- |
| Переменные                | `.env.development` (тестовые API, сайт)              | `.env.production` (боевые API, сайт)                                |
| `public/robots.txt`       | Генерируется с `Disallow: /` — сайт закрыт от индексации | Генерируется с `Allow: /` и `Sitemap: ${VITE_SITE_URL}/sitemap.xml` |
| `public/sitemap.xml`      | Не генерируется (остаётся файл от прошлой prod-сборки) | Генерируется по `VITE_SITE_URL`                                     |
| Vue Devtools в сборке     | Включены (`__VUE_PROD_DEVTOOLS__: true`)             | Выключены                                                           |
| Минификация / sourcemap   | Выключена / включены                                 | Выключена / включены                                                |

> `robots.txt` и `sitemap.xml` записываются прямо в папку `public/` при каждом запуске сборки, в том числе при `npm run dev` (там создаётся закрывающий `robots.txt`). Перед деплоем на бой убедитесь, что последней была выполнена `npm run build:prod`.

### Как добавить новую переменную

1. Добавить её в **оба** файла `.env.development` и `.env.production` с префиксом `VITE_`.
2. Экспортировать константу в `src/utils/constans.js`:
    ```js
    export const MY_VALUE = import.meta.env.VITE_MY_VALUE;
    ```
3. Импортировать константу там, где она нужна. Булевы флаги сравнивать со строкой: `import.meta.env.VITE_FLAG === "true"`.

## Конвертация изображений в WebP и AVIF

```sh
npm run images
```

Запускается **только вручную**: в `dev` и сборки не встроена. Скрипт — `scripts/generate-images.js`, работает на [sharp](https://sharp.pixelplumbing.com/) (установлен в `devDependencies`).

### Что делает

- Рекурсивно обходит папки `public/img` и `src/assets/img`.
- Для каждого растрового изображения (`png`, `jpg`, `jpeg` и т. п.) создаёт рядом с ним `.webp` и `.avif` с тем же именем:
  `img/banner.png` → `img/banner.webp` + `img/banner.avif`.
- Пропускает файлы `.webp`, `.avif`, `.svg`, `.ico` и файлы без расширения.
- Исходные файлы **не удаляет и не изменяет**.

### Настройки (в начале скрипта)

| Константа         | Значение                          | Что задаёт                        |
| ----------------- | --------------------------------- | --------------------------------- |
| `INPUT_DIRS`      | `['./public/img', './src/assets/img']` | Папки для обработки          |
| `QUALITY_WEBP`    | `85`                              | Качество WebP (1–100)             |
| `QUALITY_AVIF`    | `80`                              | Качество AVIF (1–100)             |
| `SKIP_EXTENSIONS` | `.avif`, `.webp`, `.svg`, `.ico`, без расширения | Какие файлы не конвертировать |

### Важно

- Если `.webp` / `.avif` уже существует, он **не перезаписывается**. После замены исходника удалите старые `.webp` и `.avif` вручную и запустите `npm run images` снова.
- Если исходник не удалось сконвертировать в WebP, для него не создаётся и AVIF (в консоли будет `пропущен`).
- Скрипт только создаёт файлы. Использовать их в вёрстке нужно самостоятельно: картинки из `src/assets/img` — через импорт в компоненте, из `public/img` — по абсолютному пути (`/img/banner.webp`). Например:
    ```html
    <picture>
    	<source srcset="/img/banner.avif" type="image/avif" />
    	<source srcset="/img/banner.webp" type="image/webp" />
    	<img src="/img/banner.png" alt="" />
    </picture>
    ```

## Формы

У каждой формы своё состояние — глобального стора полей нет. Закрыли модалку → компонент формы размонтирован → форма чистая.

| Что | Где |
| --- | --- |
| Компоненты форм | `src/components/forms/Form*.vue` (регистрация, вход, обратная связь, восстановление и смена пароля, смена email) |
| Состояние и валидация | `src/composables/useForm.js` |
| Правила валидации | `src/utils/validators.js`: `required`, `minLength`, `email`, `phone`, `digits`, `pattern`, `isTrue`, `sameAs`, `when` |
| Поля ввода | `src/components/ui/Base*.vue` — только `v-model` + `error` + `status`, о сторах не знают |
| Отправка | `storeRequests.*(data)` — данные формы приходят аргументом |

```js
const { field, isValid, handleSubmit } = useForm({
	email: { value: "", rules: [required("Введите email"), email()] },
	agreement: { value: false, rules: [isTrue()] },
});
const onSubmit = handleSubmit((data) => storeRequests.changeUserProfile(data));
```
```html
<form @submit.prevent="onSubmit">
	<BaseInput type="email" v-bind="field('email')">Email</BaseInput>
	<BaseCheckbox v-bind="field('agreement')">Согласен…</BaseCheckbox>
	<button :disabled="!isValid">Отправить</button>
</form>
```

Ошибка текстового поля показывается после ухода с поля; пока пользователь печатает, она скрыта. Чекбоксам, селектам и файлам в схеме указывайте `validateOn: "change"` — они проверяются сразу при выборе. Кнопка отправки блокируется по `isValid` без ожидания ухода с полей.

Своё правило — функция `(value, values) => true | "текст ошибки"`. Пустое значение пропускают все правила, кроме `required` и `isTrue`, поэтому необязательное поле можно оставить пустым.

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
