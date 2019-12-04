#!/usr/bin/env node

'use strict';

const process = require('process');
const fs = require('fs-extra');
const { exec } = require('child_process');
const chalk = require('chalk');
const logUpdate = require('log-update');

logUpdate(chalk.magenta('━━━━━ Creating Brewkit Project ━━━━━'));
logUpdate.done();
logUpdate(chalk.cyan('Copying project files...'));

fs.copySync(
    `${__dirname}/scaffolding`,
    process.cwd(),
    {
        overwrite: false,
        errorOnExist: true,
    }
);

logUpdate(chalk.green('Copied project files.'));
logUpdate.done();
logUpdate(chalk.cyan('Installing packages...'));

exec('npm i && npm i --save @brewkit/components @brewkit/loader', () => {
    logUpdate(chalk.green('Installed packages.'));
    logUpdate.done();
    logUpdate(chalk.magenta('━━━━━━━━━━━━━   :)   ━━━━━━━━━━━━━━━'));
    logUpdate.done();
});
