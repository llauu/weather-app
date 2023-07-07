const fs = require('fs');

const axios = require('axios');

class Searches {
    history = [];
    dbPath = './db/history.json';

    constructor() {
        this.readDB();
    }

    get history() {
        return this.history;
    }

    get paramsMapbox() {
        return {
            limit: 5,
            access_token: process.env.MAPBOX_KEY,
        };
    }

    get paramsOpenWeather() {
        return {
            appid: process.env.OPENWEATHER_KEY,
            units: 'metric',
            lang: 'en'
        }
    }

    async searchLocation(location = '') {
        try {
            // http request
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json`,
                params: this.paramsMapbox,
            });

            const res = await instance.get();

            return res.data.features.map( place => ({
                id: place.id,
                name: place.place_name,
                lon: place.center[0],
                lat: place.center[1]
            })) 
        } catch (err) {
            return [];
        }
    }

    async searchWeatherByPlace(lat, lon) {
        try {
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {
                    lat,
                    lon,
                    appid: process.env.OPENWEATHER_KEY,
                    units: 'metric',
                    lang: 'en'
                },
            });

            const res = await instance.get();
            const {weather, main} = res.data;

            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp,
            }
        }
        catch(err) {
            console.log(err);
        }
    } 

    addHistory(place = '') {
        if (!this.history.includes(place)) {
            this.history.unshift(place);
        }
    }

    saveDB() {
        const payload = {
            history: this.history
        }
        
        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    }

    readDB() {
        if (fs.existsSync(this.dbPath)){
            const info = fs.readFileSync(this.dbPath, {encoding: 'utf-8'});
            const data = JSON.parse(info);
            this.history = data.history;
        }
    }
}

module.exports = Searches;
