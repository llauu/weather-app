require('dotenv').config();

const { inquirerMenu, listPlaces, pause, input } = require('./helpers/inquirer.js');
const Searches = require('./models/searches.js');

//console.log(process.env); // show all environment variables, and in the .env we create a new environment variable    
                            // called MAPBOX_KEY using the dotenv package ---> process.env.MAPBOX_KEY
// console.log(process.env.MAPBOX_KEY)

const main = async () => {
    let opt;

    const searches = new Searches();

    do {
        opt = await inquirerMenu();

        switch (opt) {
            case 1:
                // Show message
                const term = await input('Search for location:');

                // Search places
                const places = await searches.searchLocation(term);

                // Select place
                let id = await listPlaces(places);
                if (id === 0) continue;

                const place = places.find(p => p.id === id)
                searches.addHistory(place.name);

                // Weather
                const weather = await searches.searchWeatherByPlace(place.lat, place.lon);

                // Show results
                console.clear();
                console.log('  ┌────────────────────┐'.cyan);
                console.log('  │  '.cyan + 'City information'.bold + '  │'.cyan);
                console.log('  └────────────────────┘\n'.cyan);
                console.log(`City: ${place.name.green}`);
                console.log(`Lat: ${place.lat}`);
                console.log(`Lon: ${place.lon}`);
                console.log(`Temperature: ${weather.temp}`);
                console.log(`Min: ${weather.min}`);
                console.log(`Max: ${weather.max}`);
                console.log(`Desc: ${weather.desc}`);
                break;

            case 2:
                searches.history.forEach(search => {
                    console.log(search.green);
                })
                break;
        }

        if (opt !== 0) await pause();
    } while (opt !== 0);

    searches.saveDB();
};

main();
