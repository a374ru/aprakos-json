const workBox = require('request-promise'); // Библиотека запросов http
const element = require('cherio'); // библиотека парсинга html документа
const fs = require('fs');


/**  
 * Cсылка на webpage используется локальный сервер. 
 * Перед использованием в терминале запустите в папке проекта сервер: 
 * ```python -m SimpleHTTPServer 3000```
 * 
*/

// Динамические сегменты пути
var url1 = 'http://localhost:3000/currentday/APRAKOS/' // можно заменить на `webhost` 
var sed = 1;
let slash = "/";
var weekDay = 1;
let ext = '.html';
var id = "000";

// array for write to json file 
arrayJson = [];

// Рекурсивная функция обхода всех страниц web-ресурса
function rec() {

	// Условие при котором сегмент URL дня возвращается к единице и седмица увеличивается на единицу
	if (weekDay == 8) {
		weekDay = 1;
		sed = sed + 1;
	}

	// Конкатенация URL для запроса
	var url = url1 + sed + slash + weekDay + ext

	// Запрос ресурса по URL
	workBox(url).then(function (param) {

		// Ограничение по `id` в соответствии с допустимым диапазоном, `id` равнозначно ключу `aprakos`
		if (id == 507) {
			return;
		}

		else {

			// id  равнозначен седмице и дню по Пасхе в одном числе
			id = "" + sed + weekDay
			// console.log("\n\n=-=-=-=-=-=-=- Aprakos •••••••• " + id + "\n\n");
			// console.log(element('.name', param).text());
			// console.log(element('#date', param).text());
			// console.log(element('#1', param).text());
			// console.log(element('#apstl',html).text());
			// console.log(element('#2', param).text());
			// console.log(element('#evngl',html).text());

			arrayJson.push({
				aprakos: id,
				sedmica: element('.name', param).text(),
				day: element('#date', param).text(),
				zapstl: element('#1', param).text(),
				apstl: element('#apstl', param).text(),
				zevngl: element('#2', param).text(),
				evngl: element('#evngl', param).text()
			})
			weekDay = weekDay + 1;


		}

		// рекурсивный вызов себя
		rec();

	})


		// error case
		.catch(function (err) {
			writeJSONFile()

			console.log('Конец связи с сервером.');
		})

}

// вызов фуннкции
rec()

function writeJSONFile() {
	// console.log("Массив", arrayJson);

	let strfy = JSON.stringify(arrayJson);
	fs.writeFileSync('aprakos.json', strfy);
}

