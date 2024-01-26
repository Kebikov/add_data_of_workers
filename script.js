document.addEventListener('DOMContentLoaded', async () => {

    const response = await fetch(chrome.runtime.getURL('data.json'));
    const data = await response.json();

    const listCompany = Object.keys(data.companies);
    const companiesObj = data.companies;

    setRadioButton(companiesObj);

    const form = document.querySelector('form');
    
    // Получение данных из хранилища и установка активной radio-button
    chrome.storage.local.get('company', function(result) {
        // Если есть в массиве данная компания, отмечаем выбор.
        if(listCompany.includes(result.company)) {
            const radioActive = form.querySelector(`#${result.company}`);
            radioActive.checked = true;
        }
    });

    form.addEventListener('submit', e => {
        e.preventDefault();

        const text = form.worker.value;
        const radioValue = form.FIRMA.value;

        // Сохранение данных в хранилище
        chrome.storage.local.set({ company: radioValue }, () => {});

        if(text && typeof text === 'string') {
            // Убираем перенос строки
            const textReplace = text.replace('\n', ' ');
            const textSplitArray = textReplace.split(' ');
            // Убираем элементы массива с пробелами.
            const splitFilter = textSplitArray.filter(item => item !== '');
            const resultArray = splitFilter.map(item => item.charAt(0).toUpperCase() + item.slice(1));

            chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
                chrome.scripting.executeScript(
                    {
                        target: { tabId: tabs[0].id },
                        func: workOnPage, // Функция отработает на странице пользователя.
                        args: [{resultArray, radioValue, companiesObj}] // Передаем значения в функцию  getTitle.
                    },
                    result => {
                        if(result) {
                            console.info('Возврат в окружение extension = ', result[0].result);
                        }
                    }
                );
            });

        }

    });
});

/**
 * @typedef {Object} TWorkOnPage
 * @property {string[]} resultArray Массив введенных данных. 
 * - Example : ['Иванов', 'Иван', 'Иванович', '0296665544']
 * @property {string} radioValue Выбранное значение из radio-button.
 * - Example : 'OZON'
 * @property {Object} companiesObj Объект с данными о компаниях.
 * - Example : { 'OZON': 'Озон', ... }
 */

/**
 * Добавление данных на странице пользователя в form.
 * @param {TWorkOnPage} 
 */
function workOnPage({resultArray, radioValue, companiesObj}) {

    if(resultArray.length > 0) {

	 const inputSurname = document.querySelector('[placeholder="Фамилия"]');
        if(inputSurname && resultArray[0]) {
            inputSurname.value = resultArray[0];
            inputSurname.dispatchEvent(new Event('input', { bubbles: true }));
        }
        
	const inputName = document.querySelector('[placeholder="Имя"]');
        if(inputName && resultArray[1]) {
            inputName.value = resultArray[1];
            inputName.dispatchEvent(new Event('input', { bubbles: true }));
        }

	const inputSecondName = document.querySelector('[placeholder="Отчество"]');
        if(inputSecondName && resultArray[2]) {
            inputSecondName.value = resultArray[2];
            inputSecondName.dispatchEvent(new Event('input', { bubbles: true }));
        }

	const inputPhone = document.querySelector('[placeholder="Номер телефона"]');
        if(inputPhone && resultArray[3]) {
            inputPhone.value = resultArray[3];
            inputPhone.dispatchEvent(new Event('input', { bubbles: true }));
        }

    const pro = new Promise((resolve, reject) => {
        const inputModule = document.querySelectorAll('[placeholder="Подразделение"]');
        if(inputModule.length > 0) {
            setTimeout(() => {
                if(inputModule.length === 2) {
                    inputModule[1].click();
                    resolve();
                } else {
                    inputModule[0].click();
                    resolve();
                }
            },50);
        }
    });

    pro
        .then(() => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const spanModule = document.querySelector(`span[title="${companiesObj[radioValue]}"]`);
                    spanModule.click();
                    resolve();
                }, 50);
            });
        })
        .then(() => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const inputJobTitle = document.querySelector('[placeholder="Должность"]');
                    inputJobTitle.click();
                    resolve();
                }, 50);
            });
        })
        .then(() => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const spanJobTitle = document.querySelector(`span[title="Специалист склада"]`);
                    spanJobTitle.click();
                    resolve();
                }, 50);
            });
        })
        .then(() => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const inputCalendar = document.querySelector('[placeholder="График работы"]');
                    inputCalendar.click();
                    resolve();
                }, 50);
            });
        })
        .then(() => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const spanCalendar = document.querySelector(`span[title="По присутствию на объекте"]`);
                    spanCalendar.click();
                }, 50);
            });
        })
        .catch(error => console.error(error));

    }

    return 'все ok';
};


/**
 * Добавление radio-buttons в html.
 * @param {Object} data Объект с данными о компаниях.
 * - Example : { 'OZON': 'Озон', ... }
 */
function setRadioButton(data) {
    /**
     * Массив ключей обьекта.
     */
    const keys = Object.keys(data);
    let radioButtons = '';
    keys.forEach(item => {
        radioButtons = 
            radioButtons 
            + 
            `<div class="box">
                <input type="radio" name="FIRMA" id="${item}" value="${item}" class="class__radio" checked > 
                <label for="${item}" class="class__label">${item}</label>
            </div>`;
    });
    const radioGroup = document.querySelector('.box-radio__body');
    radioGroup.insertAdjacentHTML('beforeend', radioButtons);
}

