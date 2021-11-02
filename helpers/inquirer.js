'use strict';
const inquirer = require('inquirer');
require('colors');

const question = [
    {
        type: 'list',
        name: 'opcion',
        message: 'Que desea hacer?',
        choices: [
            {
                value: 1,
                name: `${'1.'.green} Buscar ciudad`
            },
            {
                value: 2,
                name: `${'2.'.green} Historial`
            },
            {
                value: 0,
                name: `${'0.'.red} Salir`
            }
        ]
    }
];

const questionActualFuturo = [
    {
        type: 'list',
        name: 'opcion',
        message: 'Desea ver el clima actual o futuro?',
        choices : [
            {
                value: 1,
                name : `${'1.'.green} Clima actual`
            },
            {
                value: 2,
                name : `${'2.'.green} Clima para los proximos 3 dias`
            },
            {
                value: 0,
                name : `${'0.'.red} Cancelar`
            },
            {
                value: -1,
                name : `${'*.'.red} Salir`
            }
        ]
    }
];

const questionRegresarClima = [
    {
        type: 'list',
        name: 'backClima',
        message: 'Que desea hacer?',
        choices: [
            {
                value: 0,
                name: `${'0.'.red} Salir`
            },
            {
                value: 1,
                name: `${'1.'.green} Regresar`
            }            
        ]
    }
];

async function inquirerMenu() {
    console.clear();
    console.log('================================='.green);
    console.log('     Seleccione una opcion:'.white);
    console.log('=================================\n'.green);

    const { opcion } = await inquirer.prompt(question);
    return opcion;
}

async function menuClimaActualFuturo(){
    const {opcion} = await inquirer.prompt(questionActualFuturo);
    return opcion;
}

async function regresarClima(){
    const {backClima} = await inquirer.prompt(questionRegresarClima);
    return backClima;
}

async function pause(){
    const question = [
        {
            type: 'input',
            name: 'enter',
            message: `Presione ${'ENTER'.green} para continuar`
        }
    ];
    console.log('\n');
    await inquirer.prompt(question);
}

async function leerCiudad(message) {
    const question = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate (value) {
                if (value.length === 0)
                    return 'Por favor ingrese una ciudad o lugar';
                return true;
            } 
        }
    ];
    const {desc} = await inquirer.prompt(question);
    return desc;
}

async function listarLugares(lugares = []) {
    const opciones = lugares.map((t, i) => {
        const idx = `${i + 1}.`.green;
        return {
            value: t.id,
            name: `${idx} ${t.city}`
        };
    });  
    opciones.unshift(
        
        {
            value: -1,
            name: `${'*.'.red} Salir`
        },
        {
            value: 0,
            name: '0. '.green + 'Cancelar'
        }        
    );
    const question = [
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione un lugar',
            choices : opciones
        }
    ]; 
    const {id} = await inquirer.prompt(question);
    return id;
}

async function listadoCheckList(tareas = []) {
    const choicesDeleted = tareas.map((t, i) => {
        const idx = `${i + 1}.`;
        return {
            value: t.id,
            name: `${idx} ${t.desc}`,
            checked: t.completadoEn ? true : false
        };
    });  

    const question = [
        {
            type: 'checkbox',
            name: 'ids',
            message: 'Seleccione',
            choices : choicesDeleted
        }
    ]; 
    const {ids} = await inquirer.prompt(question);
   return ids;
}

module.exports = { inquirerMenu, pause, leerCiudad, listarLugares, regresarClima, listadoCheckList, menuClimaActualFuturo }
