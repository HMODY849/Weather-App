const apiKey = "CX6HUNPAWRAGH3TT77Y5TPSJQ";
const apiUrl = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline";

const currentDate = new Date();
let year = currentDate.getFullYear();
let month = currentDate.getMonth() + 1;
let day = currentDate.getDate();
const now = `${year}-${month}-${day}T13:00:00`;
const nowDate = `${day}-${month}-${year}`;

let inputvalue = `لبنان بيروت`;
let img = [
    "./img/sun.png",
    "./img/clouds.png",
    "./img/rainyday.png",
    "./img/thunderstorm.png"
];

const search = document.getElementById("search");
const city = document.getElementById("city");
const time = document.getElementById("time");
const date = document.getElementById("date");
const temp = document.getElementById("temp");
const wind = document.getElementById("wind");
const humdity = document.getElementById("humdity");
const sunRise = document.getElementById("sunrise");
const sunSet = document.getElementById("sunset");
const houres = document.getElementById("hours");
const days = document.getElementById("days");
const f = document.getElementById("F");
const c = document.getElementById("C");

function fahrenheitToCelsius(f) {
    return (f - 32) * 5 / 9;
}

function celsiusToFahrenheit(c) {
    return (c * 9 / 5) + 32;
}

let originalCurrent = null;
let originalMonthly = null;

let currentUnit = "F"; 

function renderWeather(unit) {

if (!originalCurrent) return;
    let t = originalCurrent.currentConditions.temp;
    if (unit === "C") t = fahrenheitToCelsius(t);

    temp.innerHTML = `درجة الحرارة: ${t.toFixed(1)}${unit}ْ`;
    time.innerHTML = `الساعة: ${originalCurrent.currentConditions.datetime.slice(0, 5)}`;
    city.innerHTML = originalCurrent.address;
    date.innerHTML = nowDate;
    wind.innerHTML = `الرياح: ${originalCurrent.days[0].windgust}km/h`;
    humdity.innerHTML = `الرطوبة: %${originalCurrent.currentConditions.humidity}`;
    sunRise.innerHTML = `الشروق: ${originalCurrent.days[0].sunrise.slice(0, 5)}`;
    sunSet.innerHTML = `الغروب: ${originalCurrent.days[0].sunset.slice(0, 5)}`;

    houres.innerHTML = "";
    for (let i = 0; i < 6; i++) {
        let h = i * 4;
        let hourlyTemp = originalCurrent.days[0].hours[h].temp;
        if (unit === "C") hourlyTemp = fahrenheitToCelsius(hourlyTemp);

        let condition = originalCurrent.days[0].conditions;
        let imgSrc = "";

        if (condition === "Clear") imgSrc = img[0];
        else if (condition === "Partially cloudy") imgSrc = img[1];
        else if (condition.includes("Rain")) imgSrc = img[2];
        else if (condition === "Snow") imgSrc = img[3];

        houres.innerHTML += `
            <div class="item">
                <p>الساعة: ${originalCurrent.days[0].hours[h].datetime.slice(0,5)}</p>
                <img src="${imgSrc}" class="item-img">
                <p>درجة الحرارة: ${hourlyTemp.toFixed(1)}${unit}ْ</p>
            </div>
        `;
    }

    if (!originalMonthly) return;

    days.innerHTML = "";
    for (let i = 0; i < 6; i++) {
        let dayTemp = originalMonthly.days[i].temp;
        if (unit === "C") dayTemp = fahrenheitToCelsius(dayTemp);

        let condition = originalMonthly.days[i].conditions;
        let imgSrc = "";

        if (condition === "Clear") imgSrc = img[0];
        else if (condition === "Partially cloudy") imgSrc = img[1];
        else if (condition.includes("Rain")) imgSrc = img[2];
        else if (condition === "Snow") imgSrc = img[3];

        let date = originalMonthly.days[i].datetime;
        let parts = date.split("-");
        let year = parts[0];
        let month = parseInt(parts[1]) + 1;
        let day = parts[2];
        let dayFormat = `${day}/${month}/${year}`;

        days.innerHTML += `
            <div class="item">
                <p>${dayFormat}</p>
                <img src="${imgSrc}" class="item-img">
                <p>درجة الحرارة: ${dayTemp.toFixed(1)}${unit}ْ</p>
            </div>
        `;
    }
}


search.addEventListener("click", () => {
    const cityName = document.getElementById("cityName").value;
    inputvalue = cityName;

    houres.innerHTML = "";
    days.innerHTML = "";

    getCurrentWeatherAndHoures();
    getMonthlyWeather();
});

c.addEventListener("click", () => {
    currentUnit = "C";
    renderWeather("C");
});

f.addEventListener("click", () => {
    currentUnit = "F";
    renderWeather("F");
});

async function getCurrentWeatherAndHoures() {
    const fullUrl = `${apiUrl}/${inputvalue}/${now}/?key=${apiKey}`;
    const response = await fetch(fullUrl);
    const data = await response.json();

    originalCurrent = data;
    renderWeather(currentUnit);
}


async function getMonthlyWeather() {
    const fullUrl = `${apiUrl}/${inputvalue}/last30days/?key=${apiKey}&include=days`;
    const response = await fetch(fullUrl);
    const data = await response.json();

    originalMonthly = data;
    renderWeather(currentUnit);
}

getCurrentWeatherAndHoures();
getMonthlyWeather();