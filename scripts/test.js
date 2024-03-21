function run(city) {
    myAxios({
        url: 'https://hmajax.itheima.net/api/weather',
        params: {
            city: city,
        }
    }).then(res => {
        const data = res.data;
        const Hdate = document.querySelector('.header .left');
        Hdate.innerHTML = `<span>${data.dateShort}&nbsp;&nbsp; 农历&nbsp; ${data.dateLunar}</span>`;
        const Hcity = document.querySelector('.header .right span');
        Hcity.innerText = data.area;
        const Btem = document.querySelector('.body .bodytop');
        Btem.innerHTML = `<span class="tem">${data.temperature}°</span>
        <section class="bodyright">
            <div>${data.psPm25} ${data.psPm25Level}</div>
            <div><img src="${data.weatherImg}" alt="">
            <span>${data.weather} &nbsp;${data.windDirection} &nbsp;${data.windPower}</span>
            </div>
        </section>`;
        const Bbottom = document.querySelector('.body .bodybottom');
        const tw = data.todayWeather;
        Bbottom.innerHTML = `<span>今天：${tw.weather} ${tw.temNight}-${tw.temDay} ℃</span>
        <span>紫外线强度 ${tw.ultraviolet}</span>
        <span>湿度 ${tw.humidity}</span>
        <span>日出 ${tw.sunriseTime}</span>
        <span>日落 ${tw.sunsetTime}</span>`;

        const seventem = document.querySelector('.bottom .sevenbox');
        const sevenul = data.dayForecast.map((item) => {
            return `
            <ul>
            <li><span>${item.dateFormat}</span><br><span>${item.date}</span></li>
            <li><img src="${item.weatherImg}" alt=""></li>
            <li>${item.weather}</li>
            <li>${item.temNight}-${item.temDay}℃</li>
            <li>${item.windDirection} ${item.windPower}</li>
            </ul>
            `;
        }).join('');
        seventem.innerHTML = sevenul;

    })
};
run('110100')

// 城市搜索
const input = document.querySelector('.header .right input');
const citybox = document.querySelector('.header .right .cityBox');
input.addEventListener('blur', function () {
    setTimeout(() => {
        citybox.style.display = 'none';
    }, 100);
})
input.addEventListener('input', getcity())
function getcity() {
    let boo;
    return function (e) {
        if (boo) { return };
        boo = setTimeout(() => {
            myAxios({
                url: 'https://hmajax.itheima.net/api/weather/city',
                params: {
                    city: e.target.value,
                }
            }).then(res => {
                if (!e.target.value || res.data.length < 1 || res.data.length >= 365) {
                    citybox.style.display = 'none';
                } else {
                    citybox.style.display = 'block'
                    const citys = res.data.map(item => {
                        return `<p data-id="${item.code}">${item.name}</p>`;
                    }).join('');
                    citybox.innerHTML = citys;
                };
            })
            boo = false;
        }, 700);
    }
}

citybox.addEventListener('click', function (e) {
    if (e.target.tagName === 'P') {
        run(e.target.dataset.id)
    }
})