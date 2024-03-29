# Базовое расширение для теста. <a id="UP"></a>

### 📑 Menu

🔗 [manifest.json](#manifest)\
🔗 [Предоставьте иконки расширения](#Предоставьте-иконки-расширения)\
🔗 [Запуск скриптов на каждой странице](#Запуск-скриптов-на-каждой-странице)\
🔗 [Доступ к DOM страницы из файла js в расширении](#Доступ-DOM-страницы-из-файла-js)\
🔗 [Chrome Storage API](#Chrome-Storage-API)\
🔗 [Получение данных из JSON](#Получение-данных-из-JSON)


### Ссылка на документацию. 

https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world?hl=ru

## manifest.json <a id="manifest"></a>

Обязательный файл, который должен находится в корне.

📚 **Обязательные свойства:**
- name - Представляет собой короткую текстовую строку (максимум 45 символов).
- version - От одного до четырех целых чисел, разделенных точками, определяющих версию этого расширения.
- description - Обычная текстовая строка (без HTML или другого форматирования; не более 132 символов), описывающая расширение. 

📚 **Не обязательные свойства:**
- action - Объект с "default_popup" / "default_icon"
- default_popup - Всплываюшее окно при нажатии на иконку расширения.
- default_icon - Иконка расширения.

## Предоставьте иконки расширения. <a id="Предоставьте-иконки-расширения"></a> [>UP](#UP)

Создайте папку images и поместите туда значки. Затем добавьте выделенный код в свой манифест для объявления значков:


```
{
  ...
  "icons": {
    "16": "images/icon-16.png",
    "32": "images/icon-32.png",
    "48": "images/icon-48.png",
    "128": "images/icon-128.png"
  }
  ...
}
```
Мы рекомендуем использовать файлы PNG, но допускаются и другие форматы файлов, кроме файлов SVG.

❗❗❗ При добавлении массива иконок удаляем из manifest.json данные о default_icon.


Размер значка | Использование значков
:--: | :--
16x16 | Фавиконка на страницах расширения и в контекстном меню.
32x32 | Компьютерам под управлением Windows часто требуется этот размер.
48x48 | Отображается на странице «Расширения».
128x128 | Отображается при установке и в Интернет-магазине Chrome.

## Запуск скриптов на каждой странице. <a id="Запуск-скриптов-на-каждой-странице"></a> [>UP](#UP)

Объявите сценарий содержимого в manifest.json:

```
"content_scripts": [
  {
  	"js": ["scripts/content.js"],
  	"matches": [
        "https://developer.chrome.com/docs/extensions/*", 
        "https://developer.chrome.com/docs/webstore/*",
        "https://*/*"
    ]
  }
]
```
`"js":` - В папке scripts файл content.js будет отрабатывать на каждой странице.

`"matches":` - Перечесление доступных для воздействия адресов.

Примеры шаблонов для matches:
- `https://*/*` -  Соответствует любому URL-адресу, использующему схему https.

>Скрипт прописанный в файле content.js будет отрабатывать автоматически отрабатывать на всех страницах которые указаны в массиве разрешонных адресов "matches".

## Доступ к DOM страницы из файла js в расширении. <a id="Доступ-DOM-страницы-из-файла-js"></a> [>UP](#UP)

manifest.json :
```
{
    ...
    "action": {
		"default_popup": "hello.html"
	},
    "permissions": [
        "activeTab", "scripting"
    ],
    "host_permissions": [
        "<all_urls>"
    ]
    ...
}
```
> - Добавляем разрешения в manifest.json.

hello.html :
```
<html>
    <head>
        <meta charset="UTF-8">
        <link rel="stylesheet" href="/css/style.css">
    </head>
	<body>
        <div class="wrapper">
            <h1>Hello Extensions !!!</h1>
            <form action="">
                <label for="worker" >Введите данные сотрудника</label>
                <input type="text" name="worker" id="worker" class="input" >
                <button type="submit" class="button" >вставить</button>
            </form>
        </div>
        <script src="popup.js"></script>
	</body>
</html>
```

popup.js :
```
document.addEventListener('DOMContentLoaded', () => {
	const form = document.querySelector('form');

	form.addEventListener('submit', e => {
		e.preventDefault();

        const value = 'Какие либо данные тут...';

		const getTitle = (value) => {
            console.log('Выводим сообщение в консоли страницы пользователя.', value);
			return 'все ok';
		};

		chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
			chrome.scripting.executeScript(
				{
					target: { tabId: tabs[0].id },
					func: getTitle, // Функция отработает на странице пользователя.
                    args: [value] // Передаем значения в функцию  getTitle.
				},
				result => {
					console.log('Возврат в окружение extension = ', result[0].result);
				}
			);
		});

	});
});
```
> - Функция getTitle отработает в браузере у пользователя и выведет в консоле браузера сообщение.
> - Далее вернент ответ в окружение extension ответ.

## Chrome Storage API. <a id="Chrome-Storage-API"></a> [>UP](#UP)

manifest.json :
```
{
    ...
    "permissions": [
        "storage"
    ]
    ...
}
```

Сохранение данных в хранилище :
```
chrome.storage.local.set({ key: 'value' }, function() {
    console.log('Данные сохранены');
});
```

Получение данных из хранилища :
```
chrome.storage.local.get('key', function(result) {
    console.log('Значение key:', result.key);
});
```

Удаление данных из хранилища :
```
chrome.storage.local.remove('key', function() {
    console.log('Данные удалены');
});
```

## Получение данных из JSON <a id="Получение-данных-из-JSON"></a> [>UP](#UP)

data.json :
```
{
    "companies": {
        "Company_1": "Компания 1", 
        "Company_2": "Компания 2"
    }
}
```
`<script type="module" src="popup.js"></script>`\
popup.js :
```
const response = await fetch(chrome.runtime.getURL('data.json'));
const data = await response.json();
console.log(data.companies);
```

>Данным образом можно получать начальные данные для расширения либо для других целей.