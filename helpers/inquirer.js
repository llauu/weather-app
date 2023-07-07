const inquirer = require('inquirer');
require('colors');

const questions = [
    {
        type: 'list',
        name: 'option',
        message: 'What do you want to do?'.bold,
        prefix: '',
        choices: [
            {
                value: 1,
                name: 'Search city',
            },
            {
                value: 2,
                name: 'History',
            },
            {
                value: 0,
                name: 'Leave',
            },
        ],
    },
];

const inquirerMenu = async () => {
    console.clear();
    console.log('  ┌───────────────────┐'.cyan);
    console.log('  │    '.cyan + 'Weather app'.bold + '    │'.cyan);
    console.log('  └───────────────────┘\n'.cyan);

    const { option } = await inquirer.prompt(questions);

    return option;
};

const listPlaces = async (places) => {
    console.log();

    const choices = places.map((place, i) => {
        const id = `${i + 1}.`.cyan;

        return {
            value: place.id,
            name: `${id} ${place.name}`,
        };
    });

    choices.push({
        value: 0,
        name: `${'0.'.cyan} Cancel`,
    });

    const { id } = await inquirer.prompt([
        {
            type: 'list',
            name: 'id',
            message: 'Select:'.bold,
            prefix: '',
            choices: choices,
        },
    ]);

    return id;
};

const confirm = async (message) => {
    const { ok } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'ok',
            message,
            prefix: '',
        },
    ]);

    return ok;
};

const pause = async () => {
    await inquirer.prompt([
        {
            type: 'input',
            name: 'pause',
            message: `\nPress ${'ENTER'.yellow} to continue.\n`,
            prefix: '',
        },
    ]);
};

const input = async (message) => {
    const { inputData } = await inquirer.prompt([
        {
            type: 'input',
            name: 'inputData',
            message: message,
            prefix: '',
            validate(value) {
                if (value.length === 0) {
                    return `${'[ERROR]'.red} Please enter a value.`;
                }
                return true;
            },
        },
    ]);

    return inputData; // inputData its what we give in the 'name: ' property
};

module.exports = {
    inquirerMenu,
    listPlaces,
    confirm,
    pause,
    input,
};
