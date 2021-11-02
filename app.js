'use strict';
require('dotenv').config();
const colors = require('colors');
const { leerCiudad, inquirerMenu, pause, listarLugares, menuClimaActualFuturo, regresarClima } = require("./helpers/inquirer");
const Search = require("./models/search");

async function main() {
    let opt = 0;
    let opcionClima = 0;
    let regresar = false;
    const search = new Search();

    do {
        opt = await inquirerMenu();
        switch (opt) {
            case 1:
                do {
                    const lugar = await leerCiudad('Ciudad: ');
                    const cities = await search.Cities(lugar);
                    const idSelect = await listarLugares(cities);
                    if (idSelect === 0) continue;
                    if (idSelect === -1) {
                        opt = 0;
                        break;
                    }
                    const lugarSel = cities.find(l => l.id === idSelect);
                    await search.AddHistory(lugarSel);
                    console.log('\n Información de la ciudad \n'.green);
                    console.log('Ciudad: ', colors.green(lugarSel.city));
                    console.log('Lat: ', colors.green(lugarSel.lat));
                    console.log('Lng: ', colors.green(lugarSel.lng));
                    do {
                        opcionClima = await menuClimaActualFuturo('Elija una opcion: ');
                        switch (opcionClima) {
                            case 1:
                                const clima = await search.GetClima(lugarSel.lat, lugarSel.lng);
                                console.log('Condiciones: ', colors.green(clima.cond));
                                console.log('Temperatura: ', colors.green(`${clima.temp}°`));
                                console.log('Temperatura minima: ', colors.green(`${clima.temp_min}°`));
                                console.log('Temperatura máxima: ', colors.green(`${clima.temp_max}°`));
                                console.log('Humedad: ', colors.green(`${clima.humidity}%`));
                                console.log('Presion: ', colors.green(`${clima.pressure} hPa`));
                                const accion = await regresarClima('Seleccione: ');
                                switch (accion) {
                                    case 1:
                                        regresar = true;
                                        break;
                                    default:
                                        opt = 0;
                                        regresar = false;
                                        break;
                                }
                                break;
                            case 2:
                                const prevision = await search.GetPrevision(lugarSel.lat, lugarSel.lng);
                                console.log('==============================='.green);
                                console.log(colors.blue('          ' + prevision.tomorrow.date));
                                console.log('==============================='.green);
                                console.log('Condiciones: ', colors.green(prevision.tomorrow.cond));
                                console.log('Temperatura: ', colors.green(prevision.tomorrow.temp + '°'));
                                console.log('Temperatura minima: ', colors.green(prevision.tomorrow.temp_min + '°'));
                                console.log('Temperatura maxima: ', colors.green(prevision.tomorrow.temp_max + '°'));
                                console.log('Humedad: ', colors.green(prevision.tomorrow.humidity + '%'));
                                console.log('Presion: ', colors.green(prevision.tomorrow.pressure + ' hPa'));
                                console.log('==============================='.green);
                                console.log(colors.blue('          ' + prevision.second_day.date));
                                console.log('==============================='.green);
                                console.log('Condiciones: ', colors.green(prevision.second_day.cond));
                                console.log('Temperatura: ', colors.green(prevision.second_day.temp + '°'));
                                console.log('Temperatura minima: ', colors.green(prevision.second_day.temp_min + '°'));
                                console.log('Temperatura maxima: ', colors.green(prevision.second_day.temp_max + '°'));
                                console.log('Humedad: ', colors.green(prevision.second_day.humidity + '%'));
                                console.log('Presion: ', colors.green(prevision.second_day.pressure + ' hPa'));
                                console.log('==============================='.green);
                                console.log(colors.blue('          ' + prevision.third_day.date));
                                console.log('==============================='.green);
                                console.log('Condiciones: ', colors.green(prevision.third_day.cond));
                                console.log('Temperatura: ', colors.green(prevision.third_day.temp + '°'));
                                console.log('Temperatura minima: ', colors.green(prevision.third_day.temp_min + '°'));
                                console.log('Temperatura maxima: ', colors.green(prevision.third_day.temp_max + '°'));
                                console.log('Humedad: ', colors.green(prevision.third_day.humidity + '%'));
                                console.log('Presion: ', colors.green(prevision.third_day.pressure + ' hPa'));
                                const accion2 = await regresarClima('Seleccione: ');
                                switch (accion2) {
                                    case 1:
                                        regresar = true;
                                        break;
                                    default:
                                        opt = 0;
                                        regresar = false;
                                        break;
                                }
                                break;
                            case 0:
                                continue;
                            case -1:
                                opt = 0;
                                regresar = false;
                                break;
                        }
                    } while (regresar)
                } while (opcionClima === 0)
                break;

            case 2:
                const history = await search.GetHistorial();
                if (history) {
                    history.forEach((h, i) => {
                        i === 0 && console.log();
                        console.log(`${i + 1}.`.green, `${h.city}`);
                    });
                }
                break;
            default:
                break;
        }
        opt !== 0 && await pause();
    } while (opt !== 0);
}

main();
