#!/usr/bin/env node

'use strict';

const process = require('process');
const fs = require('fs-extra');
const { exec } = require('child_process');
const chalk = require('chalk');
const logUpdate = require('log-update');
const inquirer = require('inquirer');


/**
 * Configuration
 */
const destinationToCopyTo = process.cwd();
const scaffoldingDirectory = `${__dirname}/scaffolding`;


/**
 * Set up our loading icons
 */
const frames = ['🌑', '🌘', '🌗', '🌖', '🌕', '🌔', '🌓', '🌒'];
let i = 0;
let frame = frames[0];


/**
 * Brewkit splash
 */
console.log();
console.log(chalk.white('  █') + '▓▟▓▛▓' + chalk.white('█') + '                                  ' + chalk.white('█') + '▓▟▓▓▓' + chalk.white('█'));
console.log(chalk.white('▄▀█') + chalk.yellow('░▀░▀░' + chalk.white('█')) + '  ╭────────────────────────────╮  '  + chalk.white('█') + chalk.yellow('░▀░░░' + chalk.white('█▀▄')));
console.log(chalk.white('█ █' + chalk.yellow('░▀░░░' + chalk.white('█'))) + '  │  Creating ' + chalk.blue('Brewkit') + ' Project  │  ' + chalk.white('█' + chalk.yellow('░░▀░░' + chalk.white('█ █'))));
console.log(chalk.white('▀▄█') + chalk.yellow('░░░▀░' + chalk.white('█')) + '  ╰────────────────────────────╯  ' + chalk.white('█') + chalk.yellow('░▀░▀░') + chalk.white('█▄▀'));
console.log(chalk.white('  ▀▀▀▀▀▀▀') + '                                  ' + chalk.white('▀▀▀▀▀▀▀'));
console.log();


inquirer
    .prompt([
        {
            type: 'input',
            name: 'projectName',
            message: 'Project Name:',
            prefix: chalk.blue('?'),
            validate: input => input.length > 0 || 'Please specify a project name.',
        }
    ])
    .then(answers => {
        fs.copySync(
            scaffoldingDirectory,
            destinationToCopyTo,
            {
                overwrite: false,
                errorOnExist: true,
            }
        );
        logUpdate(chalk.blue('┣━ ✅  ') + chalk.green('Copied scaffolding.'));
        logUpdate.done();

        insertProjectName(answers.projectName);

        let interval = setInterval(() => {
            frame = frames[i = ++i % frames.length];
            logUpdate(chalk.blue(`┗━ ${frame} ` + chalk.cyan('Installing packages...')));
        }, 100);

        exec('npm i && npm i --save @brewkit/components @brewkit/loader', () => {
            clearInterval(interval);
            logUpdate(chalk.blue('┗━ ✅  ') + chalk.green('Installed packages.'));
            logUpdate.done();
            console.log();
            logUpdate(chalk.blue('You\'re all set! 🍺~(ˇ◡ˇღ)'));
            logUpdate.done();
        });
    });


/**
 * Insert the value for projectName into placeholders within scaffolding
 */
function insertProjectName(projectName) {

    const fileToModify = destinationToCopyTo + '/app/src/index.html';

    fs.readFile(fileToModify, 'utf8', function (err,data) {
        if (err) return console.log(err);

        const result = data.replace(/{{projectName}}/g, projectName);

        fs.writeFile(fileToModify, result, 'utf8', function (err) {
            if (err) return console.log(err);
        });
    });

}