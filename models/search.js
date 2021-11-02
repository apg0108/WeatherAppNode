'use strict';
const fs = require('fs');
const axios = require('axios').default;
const moment = require('moment');

const folder = './database';
const path = `${folder}/history.json`;

class Search {
    constructor() {
        this.historial = [];
    }

    get paramMapBox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        };
    }


    openWeather(lat, lng, forecast = false) {
        return forecast ? {
            'lat': lat,
            'lon': lng,
            'appid': process.env.OPENWEATHER_KEY,
            'units': 'metric',
            'lang': 'es',
            'cnt': 3
        } :
            {
                'lat': lat,
                'lon': lng,
                'appid': process.env.OPENWEATHER_KEY,
                'units': 'metric',
                'lang': 'es'
            };
    }

    async GetClima(lat, lng) {
        let clima = {};
        const instance = await axios.create({
            baseURL: 'https://api.openweathermap.org/data/2.5/weather',
            params: this.openWeather(lat, lng)
        });

        await instance.get()
            .then(function (resp) {
                const { description } = resp.data.weather[0];
                clima = {
                    'cond': description,
                    'temp': resp.data.main.temp,
                    'temp_min': resp.data.main.temp_min,
                    'temp_max': resp.data.main.temp_max,
                    'pressure': resp.data.main.pressure,
                    'humidity': resp.data.main.humidity
                };
            }).catch(function (err) {
                console.error(err);
            });

        return clima;
    }

    async GetPrevision(lat, lng) {
        let prevision = {};
        const instance = await axios.create({
            baseURL: 'https://api.openweathermap.org/data/2.5/forecast',
            params: this.openWeather(lat, lng, true)
        });

        await instance.get()
            .then(function (resp) {
                const [tomorrow, second_day, third_day] = resp.data.list;
                prevision = {
                    'tomorrow': {
                        'date': moment().add(1, 'd').format('DD-MM-YYYY'),
                        'temp': tomorrow.main.temp,
                        'temp_min': tomorrow.main.temp_min,
                        'temp_max': tomorrow.main.temp_max,
                        'pressure': tomorrow.main.pressure,
                        'humidity': tomorrow.main.humidity,
                        'cond': tomorrow.weather[0]['description']
                    },
                    'second_day': {
                        'date': moment().add(2, 'd').format('DD-MM-YYYY'),
                        'temp': second_day.main.temp,
                        'temp_min': second_day.main.temp_min,
                        'temp_max': second_day.main.temp_max,
                        'pressure': second_day.main.pressure,
                        'humidity': second_day.main.humidity,
                        'cond': second_day.weather[0]['description']
                    },
                    'third_day': {
                        'date': moment().add(3, 'd').format('DD-MM-YYYY'),
                        'temp': third_day.main.temp,
                        'temp_min': third_day.main.temp_min,
                        'temp_max': third_day.main.temp_max,
                        'pressure': third_day.main.pressure,
                        'humidity': third_day.main.humidity,
                        'cond': third_day.weather[0]['description']
                    }
                };
            },
                function (err) {
                    console.error(err);
                });

        return prevision;
    }


    async Cities(lugar = '') {

        let cities = [];
        const instance = await axios.create({
            baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
            params: this.paramMapBox
        });

        await instance.get()
            .then(function (resp) {
                cities = resp.data.features.map(r => ({
                    id: r.id,
                    city: r.place_name,
                    lng: r.center[0],
                    lat: r.center[1]
                }));
            })
            .catch(function (err) {
                console.error(err);
            });

        return cities;

    }

    async AddHistory(city = '') {
        try {
            if (fs.existsSync(path)) {
                const data = await fs.readFileSync(path);
                this.historial = JSON.parse(data);
            }
            const index = this.historial.find(h => h.id === city.id);
            if (index) return;
            this.historial.unshift(city);
            if (this.historial.length > 5)
                this.historial.pop();
            if (!fs.existsSync(folder)) {
                fs.mkdirSync(folder);
                fs.writeFileSync(path, JSON.stringify(this.historial));
            } else fs.writeFileSync(path, JSON.stringify(this.historial));
        } catch (error) {
            console.error(error);
        }
    }

    async GetHistorial() {
        let historial = [];
        if (fs.existsSync(path)) {
            const data = await fs.readFileSync(path, {encoding: 'utf-8'});
            historial = JSON.parse(data);
        }
        return historial;
    }
}

module.exports = Search;