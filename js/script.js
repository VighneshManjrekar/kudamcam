import AQI_KEY from './config.js'

navigator.geolocation.getCurrentPosition((position) => {
    const p = position.coords;
    createMap(p.latitude, p.longitude)
})


const createMap = (lon, lat) => {
    const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

    const map = L.map('map').setView([lon, lat], 16);
    L.tileLayer(tileUrl, { attribution }).addTo(map)

    const marker = L.marker([lon, lat], {
        draggable: true
    }).addTo(map)
    getAQI(marker, lat, lon)
    marker.on('dragend', function (e) {
        const { lat, lng } = e.target._latlng
        getAQI(marker, lat, lng)
    })
}

const getAQI = (marker, lat, lon) => {
    fetch(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${AQI_KEY}`)
        .then(res => res.json())
        .then(data => {
            makeTable(data.list[0])
            marker.bindPopup(`AQI: ${data.list[0].main.aqi}`).openPopup()
        }).catch(err => console.warn(err))
}

const makeTable = (data) => {

    const table = document.querySelector('.table');
    table.innerHTML = ""
    const tHead = document.createElement('thead');
    const thRow = document.createElement('tr');
    const th1 = document.createElement('th');
    const th1Data = document.createTextNode("Components");
    const th2 = document.createElement('th');
    const th2Data = document.createTextNode("Amount");
    const tBody = document.createElement('tbody')

    th1.appendChild(th1Data)
    th2.appendChild(th2Data)

    thRow.appendChild(th1)
    thRow.appendChild(th2)
    tHead.appendChild(thRow);
    table.appendChild(tHead);
    table.appendChild(tBody)




    const compoArray = ["co",
        "no",
        "no2",
        "o3",
        "so2",
        "pm2_5",
        "pm10",
        "nh3"]


    compoArray.forEach(r => {
        const tr = document.createElement("tr");
        const td1 = document.createElement("td");
        const td2 = document.createElement("td");

        const name = document.createTextNode(r)
        const amount = document.createTextNode(data.components[r])
        // console.log(data)
        // const moleculte = document.createTextNode(i);

        td1.appendChild(name);
        td2.appendChild(amount);
        tr.appendChild(td1)
        tr.appendChild(td2)
        tBody.appendChild(tr);
    })

}