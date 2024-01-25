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

    const inputAll = document.querySelectorAll('input');
    console.log(resultArray);
    console.log(companiesObj);
    console.log('Пришло = ', companiesObj[radioValue]);

    if(resultArray.length > 0 && inputAll.length > 0) {

        if(inputAll[0]) {
            inputAll[0].value = resultArray[0];
            inputAll[0].dispatchEvent(new Event('input', { bubbles: true }));
        }
        

        if(inputAll[1]) {
            inputAll[1].value = resultArray[1];
            inputAll[1].dispatchEvent(new Event('input', { bubbles: true }));
        }

        if(inputAll[2]) {
            inputAll[2].value = resultArray[2];
            inputAll[2].dispatchEvent(new Event('input', { bubbles: true }));
        }

        const pro = new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log('Вызов 1');
                resolve();
            }, 50);
        });
        
        pro
            .then(() => {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        console.log('Вызов 2');
                        resolve();
                    }, 50);
                });
            })
            .then(() => {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        console.log('Вызов 3');
                        resolve();
                    },50);
                })
            })
            .catch((error) => console.error('Error :', error));
    
        // inputAll[10].value = 'Cпециалист склада';
        // inputAll[11].value = 'По присутствию на обЪекте'
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

