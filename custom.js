// 🔅요소 가져오기
let input = document.querySelector("input");
let button = document.querySelector("#searchBtn");
let place = document.querySelector("#location");

// apikey
let APIkey = "b7455a97bd38920b2060fb02411125c9";

let cityname = "seoul";

// 🔅현재 위치로 날씨 가져오기
getLocation();
function getLocation() {
  navigator.geolocation.getCurrentPosition((position) => {
    nowWeather(position); // 현재 날씨
    nowHourWeather(position); // 3시간 예보
    nowWeekWeather(position); // 3시간 예보
  });
}

async function nowWeather(position) {
  // 위경도 현재

  let lat = position.coords.latitude;
  let lon = position.coords.longitude;

  let response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}&units=metric&lang=kr`
  );

  let data = await response.json(); // json은 서버에서 뭘 가져오는 것? 그래서 비동기로 바꿔줘야함

  console.log(data);

  mainRender(data);
}

//
// 🔅
async function nowHourWeather(position) {
  // 위경도 하루 3시간

  let lat = position.coords.latitude;
  let lon = position.coords.longitude;

  let response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIkey}&units=metric&lang=kr`
  );
  let data = await response.json(); // json은 서버에서 뭘 가져오는 것? 그래서 비동기로 바꿔줘야함

  console.log(data);

  hourRender(data);
}

// 🔅
nowWeekWeather = async (position) => {
  // 위경도 일주일

  let lat = position.coords.latitude;
  let lon = position.coords.longitude;

  let response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIkey}&units=metric&lang=kr`
  );

  let data = await response.json();
  // let nowWeekData = data.list.filter((item, index) => index % 8 == 0);
  let nowWeekData = data.list.filter((item) => {
    return item.dt_txt.slice(11, 16) == "09:00";
  });

  console.log(nowWeekData);

  weekRender(nowWeekData);
};

//
//
//
//
//
//

// 🔅도시 이름으로 날씨 가져오기
cityWeather = async (cityname) => {
  // 도시 현재

  if (/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(cityname)) {
    console.log("한글");
    data = await cityLocate(cityname, (type = "city"));
  } else {
    let response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${APIkey}&units=metric&lang=kr`
    );
    data = await response.json();
  }

  console.log(data);

  mainRender(data);
};

// 🔅
async function cityHourWeather(cityname) {
  // 도시 하루 3시간

  if (/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(cityname)) {
    console.log("한글");
    data = await cityLocate(cityname, (type = "hour"));
  } else {
    let response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${cityname}&appid=${APIkey}&units=metric&lang=kr`
    );
    data = await response.json();
  }

  console.log(data);

  hourRender(data);
}

//🔅
cityWeekWeather = async (cityname) => {
  // 도시 일주일

  if (/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(cityname)) {
    console.log("한글");
    data = await cityLocate(cityname, (type = "week"));
  } else {
    let response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${cityname}&appid=${APIkey}&units=metric&lang=kr`
    );
    data = await response.json();
  }

  // let cityWeekData = data.list.filter((item, index) => index % 8 == 0);

  let cityWeekData = data.list.filter((item) => {
    return item.dt_txt.slice(11, 16) == "09:00";
  });
  console.log("확인용", data);
  console.log(cityWeekData);

  weekRender(cityWeekData);
};

// 🔅날씨 정보 화면에 출력
let mainIcon = document.querySelector(".mainIcon");
let mainTemp = document.querySelector(".mainTemp");
let description = document.querySelector(".description");
let cityName = document.querySelector(".cityName");
let mainImg = document.querySelector(".weatherInfo img");

let hum = document.querySelector(".hum");
let windy = document.querySelector(".windy");
let air = document.querySelector(".air");

async function mainRender(data) {
  console.log("메인", data);
  mainIcon.src = findIcon(data.weather[0].icon);
  // mainIcon.title = `${data.weather[0].description}`;

  mainTemp.innerText = `${data.main.temp.toFixed(1)}℃`;
  description.innerText = data.weather[0].description;
  cityName.innerText = data.name;
  // mainImg.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

  //
  hum.innerText = `${data.main.humidity}%`;

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

  // 360° / 8 = 45°
  let windDeg2 = Math.round(windDeg / 45) % 8;

  console.log(windDeg);
  console.log(windDirection[windDeg2]);

  windy.innerHTML = `${
    windDirection[windDeg2]
  }풍 <br> ${data.wind.speed.toFixed(1)}m/s`;

  console.log("되니", data.coord.lat);
  let lat = data.coord.lat;
  let lon = data.coord.lon;
  let airResponse = await fetch(
    `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${APIkey}&units=metric&lang=kr`
  );

  let airData = await airResponse.json(); // json은 서버에서 뭘 가져오는 것? 그래서 비동기로 바꿔줘야함

  console.log("공기", airData);

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

  //
  findVideo(data.weather[0].icon);
}

let dailyIcon = document.querySelectorAll(".dailyHourBoard li img");
let dailyTime = document.querySelectorAll(".dailyHourBoard li p");
let dailyTemp = document.querySelectorAll(".dailyHourBoard li .temp");

function hourRender(data) {
  for (let i = 0; i < dailyTime.length; i++) {
    // 아이콘
    // dailyIcon[
    //   i
    // ].src = `https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}.png`;

    console.log(i);
    dailyIcon[i].title = `${data.list[i].weather[0].description}`;
    dailyIcon[i].src = findIcon(data.list[i].weather[0].icon);

    // 온도
    dailyTemp[i].innerText = `${data.list[i].main.temp.toFixed(1)}℃`;

    // 시간
    // timeEls[i].textContent = data.list[i].dt_txt; -> 입력되어 있는 전체 날짜&시간 말고 딱 [ 시:분 ]만 가져오고 싶음 >> 글자수를 계산해서 가져와야함
    // [ "2025-11-12 06:00:00" ] -> 시:분의 순번?은 11~15
    let label = data.list[i].dt_txt.slice(11, 16); // 11번째부터 15번째까지의(16번째 이전까지의) 글자를 잘라줌 (<-slice)
    dailyTime[i].textContent = label;
  }
}

//🔅오늘 날짜 넣기
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
    // 아이콘
    // weekIcon[
    //   i
    // ].src = `https://openweathermap.org/img/wn/${data[i].weather[0].icon}.png`;

    weekIcon[i].title = `${data[i].weather[0].description}`;

    weekIcon[i].src = findIcon(data[i].weather[0].icon);

    // 온도
    let temp = data[i].main.temp.toFixed(1);
    weekTime[i].innerText = `${temp}℃`;

    // 시간
    // timeEls[i].textContent = data.list[i].dt_txt; -> 입력되어 있는 전체 날짜&시간 말고 딱 [ 시:분 ]만 가져오고 싶음 >> 글자수를 계산해서 가져와야함
    // [ "2025-11-12 06:00:00" ] -> 시:분의 순번?은 11~15
    let label = data[i].dt_txt.slice(5, 10);

    // 요일
    let weekDate = new Date(data[i].dt_txt);
    let dayName = weekdays[weekDate.getDay()];

    weekTemp[i].textContent = `${label} (${dayName})`;

    //
    //
    //
    // 차트용

    temps.push(temp); // 온도를 temps 배열에 추가
    labels.push(label); // 시간을 labels 배열에 추가
  }

  drawChart(labels, temps);
}

//
//
//
//
//
// 배경 동영상

let video = document.querySelector(".bg video");
// video.playbackRate = 0.5;

function findVideo(weatherIconDes) {
  console.log(weatherIconDes);
  let findWeather = weatherIconDes.slice(0, 2);
  // findWeather = "09";

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

//
//
//
//
//
// 이모지 넣기
function findIcon(IconDes) {
  console.log(IconDes);

  let iconCode = IconDes.slice(0, 2);
  // iconCode = "09";

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

//
//
//
//
//
//
//
//
//
// 🔅그래프 함수

let chart;

function drawChart(labels, temps) {
  let ctx = document.querySelector("#weatherChart").getContext("2d");
  // let chartBoard = document.querySelector(".chartBoard");

  // // 숨긴 상태에서 그려야 하는 경우
  // chartBoard.style.display = "block";
  // chartBoard.style.visibility = "hidden";

  if (chart) {
    // 만약에 chart 안에 뭐라도 있으면(그러면 참이 됨)
    chart.destroy(); // 기존 차트를 삭제 -> 삭제를 안하면 새로운 차트를 그릴 수가 없음, 오류 뜸
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
      responsive: true, // CSS 크기에 맞게 조절
      // maintainAspectRatio: false // 부모 높이에 맞춤
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
            // display: false,
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

  // chartBoard.style.visibility = "visible";
  // chartBoard.style.display = "none"; // 버튼 누르면 block으로 바뀌게
}

//
//
//
//
// 스위치
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
      // 그래프 함수 호출 (온도, 시간을 가지고 감)
      drawChart(labels, temps);
    }
  });
});

//
//
//
//
//

// 검색함수
button.addEventListener("click", () => {
  let city = input.value;
  input.value = "";
  cityWeather(city);
  cityHourWeather(city);
  cityWeekWeather(city);
});

// 🔅입력창에서 엔터키 눌러 도시명 가져오기
input.addEventListener("keydown", (e) => {
  // key가 눌리는 이벤트가 발생할 때
  if (e.key == "Enter") {
    // 만약 눌린 그 key가 enter키 라면
    city = input.value;
    input.value = "";
    cityWeather(city);
    cityHourWeather(city);
    cityWeekWeather(city);
  }
});

async function cityLocate(cityname, type) {
  // let cityname = "서울";

  let response = await fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${cityname}&appid=${APIkey}&units=metric&lang=kr`
  );

  let cityData = await response.json();
  console.log(cityData);

  // console.log(data);

  let lat = cityData[0].lat;
  let lon = cityData[0].lon;

  if (type == "city") {
    response2 = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}&units=metric&lang=kr`
    );
  } else if (type == "hour" || type == "week") {
    response2 = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIkey}&units=metric&lang=kr`
    );
  }

  let data = await response2.json();
  console.log(data);
  return data;
}
