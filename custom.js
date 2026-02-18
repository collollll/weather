// 요소 가져오기
let input = document.querySelector("input");
let button = document.querySelector("#searchBtn");
let place = document.querySelector("#location");

// apikey
let APIkey = "b7455a97bd38920b2060fb02411125c9";

let cityname = "seoul";

// 현재 위치로 날씨 가져오기
getLocation();
function getLocation() {
  navigator.geolocation.getCurrentPosition((position) => {
    nowWeather(position);
    nowHourWeather(position);
    nowWeekWeather(position);
  });
}

// 위경도 현재
async function nowWeather(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;

  let response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}&units=metric&lang=kr`,
  );

  let data = await response.json();

  console.log(data);

  mainRender(data);
}

// 위경도 하루 3시간
async function nowHourWeather(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;

  let response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIkey}&units=metric&lang=kr`,
  );
  let data = await response.json();

  console.log(data);

  hourRender(data);
}

// 위경도 일주일
nowWeekWeather = async (position) => {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;

  let response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIkey}&units=metric&lang=kr`,
  );

  let data = await response.json();
  // let nowWeekData = data.list.filter((item, index) => index % 8 == 0);
  let nowWeekData = data.list.filter((item) => {
    return item.dt_txt.slice(11, 16) == "09:00";
  });

  console.log(nowWeekData);

  weekRender(nowWeekData);
};

// 도시 이름으로 날씨 가져오기
// 도시 현재
cityWeather = async (cityname) => {
  if (/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(cityname)) {
    data = await cityLocate(cityname, (type = "city"));
  } else {
    let response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${APIkey}&units=metric&lang=kr`,
    );
    data = await response.json();
  }

  console.log(data);

  mainRender(data);
};

// 도시 하루 3시간
async function cityHourWeather(cityname) {
  if (/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(cityname)) {
    data = await cityLocate(cityname, (type = "hour"));
  } else {
    let response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${cityname}&appid=${APIkey}&units=metric&lang=kr`,
    );
    data = await response.json();
  }

  console.log(data);

  hourRender(data);
}

// 도시 일주일
cityWeekWeather = async (cityname) => {
  if (/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(cityname)) {
    console.log("한글");
    data = await cityLocate(cityname, (type = "week"));
  } else {
    let response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${cityname}&appid=${APIkey}&units=metric&lang=kr`,
    );
    data = await response.json();
  }

  let cityWeekData = data.list.filter((item) => {
    return item.dt_txt.slice(11, 16) == "09:00";
  });
  console.log("확인용", data);
  console.log(cityWeekData);

  weekRender(cityWeekData);
};

// 날씨 정보 화면에 출력
let mainIcon = document.querySelector(".mainIcon");
let mainTemp = document.querySelector(".mainTemp");
let description = document.querySelector(".description");
let cityName = document.querySelector(".cityName");
let mainImg = document.querySelector(".weatherInfo img");

let hum = document.querySelector(".hum");
let windy = document.querySelector(".windy");
let air = document.querySelector(".air");

// 상단 렌더링
async function mainRender(data) {
  console.log("메인", data);
  mainIcon.src = findIcon(data.weather[0].icon);

  mainTemp.innerText = `${data.main.temp.toFixed(1)}℃`;
  description.innerText = data.weather[0].description;
  cityName.innerText = data.name;

  // 습도
  hum.innerText = `${data.main.humidity}%`;

  // 풍속/풍향
  let windDeg = data.wind.deg;
  let windDirection = [
    "북", // 0°
    "북동", // 45°
    "동", // 90°
    "남동", // 135°
    "남", // 180°
    "남서", // 225°
    "서", // 270°
    "북서", // 315°
  ];
  let windDeg2 = Math.round(windDeg / 45) % 8;

  windy.innerHTML = `${
    windDirection[windDeg2]
  }풍 <br> ${data.wind.speed.toFixed(1)}m/s`;

  // 대기질
  let lat = data.coord.lat;
  let lon = data.coord.lon;
  let airResponse = await fetch(
    `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${APIkey}&units=metric&lang=kr`,
  );

  let airData = await airResponse.json();

  if (airData.list[0].main.aqi == 1) {
    air.innerText = "좋음";
    air.style.color = "blue";
  } else if (airData.list[0].main.aqi == 2) {
    air.innerText = "양호";
    air.style.color = "green";
  } else if (airData.list[0].main.aqi == 3) {
    air.innerText = "보통";
    air.style.color = "black";
  } else if (airData.list[0].main.aqi == 4) {
    air.innerText = "나쁨";
    air.style.color = "orange";
  } else if (airData.list[0].main.aqi == 5) {
    air.innerHTML = "매우<br> 나쁨";
    air.style.color = "red";
  }

  findVideo(data.weather[0].icon);
}

let dailyIcon = document.querySelectorAll(".dailyHourBoard li img");
let dailyTime = document.querySelectorAll(".dailyHourBoard li p");
let dailyTemp = document.querySelectorAll(".dailyHourBoard li .temp");

// 하단 렌더링
function hourRender(data) {
  for (let i = 0; i < dailyTime.length; i++) {
    dailyIcon[i].title = `${data.list[i].weather[0].description}`;
    dailyIcon[i].src = findIcon(data.list[i].weather[0].icon);

    // 온도
    dailyTemp[i].innerText = `${data.list[i].main.temp.toFixed(1)}℃`;

    // 시간
    let label = data.list[i].dt_txt.slice(11, 16);
    dailyTime[i].textContent = label;
  }
}

//오늘 날짜 넣기
let today = document.querySelector(".today");
let today2 = document.querySelector(".today2");

let day1 = new Date();
let weekdays = ["일", "월", "화", "수", "목", "금", "토"];
today.textContent = `${day1.getFullYear()}.${
  day1.getMonth() + 1
}.${day1.getDate()} (${weekdays[day1.getDay()]})`;
today2.textContent = `${day1.getMonth() + 1}.${day1.getDate()} (${
  weekdays[day1.getDay()]
})`;

let weekIcon = document.querySelectorAll(".weekBoard li img");
let weekTime = document.querySelectorAll(".weekBoard li p");
let weekTemp = document.querySelectorAll(".weekBoard li .temp");
let time = document.querySelector(".time");

let temps = []; // 온도
let labels = []; // 시간

function weekRender(data) {
  console.log(time);
  time.textContent = `AM ${data[0].dt_txt.slice(11, 16)} 기준`;

  temps = []; // 온도
  labels = []; // 시간

  for (let i = 0; i < weekTime.length; i++) {
    weekIcon[i].title = `${data[i].weather[0].description}`;
    weekIcon[i].src = findIcon(data[i].weather[0].icon);

    // 온도
    let temp = data[i].main.temp.toFixed(1);
    weekTime[i].innerText = `${temp}℃`;

    // 시간
    let label = data[i].dt_txt.slice(5, 10);

    // 요일
    let weekDate = new Date(data[i].dt_txt);
    let dayName = weekdays[weekDate.getDay()];

    weekTemp[i].textContent = `${label} (${dayName})`;

    // 그래프용
    temps.push(temp);
    labels.push(label);
  }

  drawChart(labels, temps);
}

// 배경 동영상
let video = document.querySelector(".bg video");

function findVideo(weatherIconDes) {
  console.log(weatherIconDes);
  let findWeather = weatherIconDes.slice(0, 2);

  if (findWeather == "01") {
    video.src = `img/clearsky.mp4`;
    video.style.filter = "none";
    video.playbackRate = 0.7;
  } else if (findWeather == "02") {
    video.src = `img/fewclouds.mp4`;
    video.style.filter = "brightness(140%)";
  } else if (findWeather == "03") {
    video.src = `img/scatteredclouds.mp4`;
    video.style.filter = "brightness(110%)";
  } else if (findWeather == "04") {
    video.src = `img/overcast.mp4`;
  } else if (findWeather == "09" || findWeather == "10") {
    video.src = `img/rain.mp4`;
    video.playbackRate = 0.7;
    video.style.filter = "none";
  } else if (findWeather == "11") {
    video.src = `img/thunder.mp4`;
    video.playbackRate = 1.3;
    video.style.filter = "none";
  } else if (findWeather == "13") {
    video.src = `img/snow.mp4`;
    video.style.filter = "none";
  } else if (findWeather == "50") {
    video.src = `img/mist.mp4`;
    video.playbackRate = 0.6;
    video.style.filter = "none";
  }
}

// 아이콘 넣기
function findIcon(IconDes) {
  let iconCode = IconDes.slice(0, 2);

  if (iconCode == "01") {
    return `img/sun.png`;
  } else if (iconCode == "02") {
    return `img/few cloud.png`;
  } else if (iconCode == "03") {
    return `img/cloud.png`;
  } else if (iconCode == "04") {
    return `img/overcast.png`;
  } else if (iconCode == "09" || iconCode == "10") {
    return `img/rain.png`;
  } else if (iconCode == "11") {
    return `img/thunder.png`;
  } else if (iconCode == "13") {
    return `img/snow.png`;
  } else if (iconCode == "50") {
    return `img/mist.png`;
  }
}

// 그래프 함수
let chart;

function drawChart(labels, temps) {
  let ctx = document.querySelector("#weatherChart").getContext("2d");

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels, // x축 - 시간
      datasets: [
        {
          data: temps, // y축 - 온도
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          grid: { display: false },
          border: { display: false },
          ticks: { color: "black" },
        },
        y: {
          min: -10,
          max: 30,
          ticks: {
            stepSize: 5,
            color: "black",
          },
          title: {
            display: true,
            text: "온도",
            color: "black",
            font: {
              size: 12,
            },
          },
          grid: {
            drawTicks: false,
          },
        },
      },
      elements: {
        point: {
          radius: 7,
          pointStyle: "rectRot",
        },
      },
    },
  });
}

// 스위치 버튼
let switchImg = document.querySelectorAll(".switch img");
let boardList = document.querySelectorAll(".board > div");

switchImg.forEach((img, index) => {
  img.addEventListener("click", function () {
    switchImg.forEach((img) => {
      img.classList.remove("active");
    });
    img.classList.add("active");

    boardList.forEach((board) => {
      board.classList.remove("show");
    });
    boardList[index].classList.add("show");

    let findShow = document.querySelector(".board .week");
    if (findShow.classList.contains("show")) {
      drawChart(labels, temps);
    }
  });
});

// 검색함수
button.addEventListener("click", () => {
  let city = input.value;
  input.value = "";
  cityWeather(city);
  cityHourWeather(city);
  cityWeekWeather(city);
});

// 입력창에서 엔터키 눌러 도시명 가져오기
input.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    city = input.value;
    input.value = "";
    cityWeather(city);
    cityHourWeather(city);
    cityWeekWeather(city);
  }
});

async function cityLocate(cityname, type) {
  let response = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${cityname}&appid=${APIkey}&units=metric&lang=kr`,
  );

  let cityData = await response.json();
  console.log(cityData);

  let lat = cityData[0].lat;
  let lon = cityData[0].lon;

  if (type == "city") {
    response2 = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}&units=metric&lang=kr`,
    );
  } else if (type == "hour" || type == "week") {
    response2 = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIkey}&units=metric&lang=kr`,
    );
  }

  let data = await response2.json();
  console.log(data);
  return data;
}
