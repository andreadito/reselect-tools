#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const yargs = require('yargs');
const findUp = require('find-up');
const chalk = require("chalk");
const boxen = require("boxen");
const CodeBlockWriter = require('code-block-writer').default;

const { locateSelectors } = require('./locateSelectors');

const boxenOptions = {
    padding: 1,
    margin: 1,
    borderStyle: "round",
    borderColor: "green",
    color: "red"
};
const configPath = findUp.sync(['.reselect', 'reselect.config.json']);
const config = configPath ? JSON.parse(fs.readFileSync(configPath)) : {};

const {src, out, tsConfigPath} = yargs
    .config(config)
    .option('src', {
        alias: 's',
        describe: 'source pattern'
    })
    .option('out', {
        alias: 'o',
        describe: 'output for generated file'
    })
    .option('tsConfigPath', {
        alias: 'tc',
        describe: 'tsConfig path'
    })
    .demandOption(['src', 'out', 'tsConfigPath'], 'Please provide src, out, tsConfigPath arguments to work with this tool ‼️')
    .help()
    .argv;

try {

    const options = {
        src, out, tsConfigPath
    };

    const writer = new CodeBlockWriter({
        // optional options
        newLine: "\r\n",         // default: "\n"
        indentNumberOfSpaces: 2, // default: 4
        useTabs: false,          // default: false
        useSingleQuote: true     // default: false
    });
    const selectorPaths = locateSelectors(options.src, options.tsConfigPath);
    const from = path.parse(options.out).dir;

    writer.writeLine('// AUTOGENERATED CODE //');

    selectorPaths.forEach((absolutePath, index) => {
        const { dir, name, ext } = path.parse(absolutePath);

        const relativePath = path.relative(from, dir);

        const dot = !relativePath.startsWith('../') ? './': '';

        writer.writeLine(`export * from '${dot}${relativePath}/${name}';`);
    });

    const fileContent = writer.toString();

    fs.writeFile(options.out, fileContent, 'utf8', (err) => {
        if (err) throw err;

        const msgBox = boxen( chalk.green.bold("SELECTORS INDEX CREATED! 🎊"), boxenOptions );

        console.log(msgBox);

    });
} catch (e) {
    const msgBox = boxen( chalk.red.bold('SOMETHING WENT WRONG 🤕 \n', e.toString()), boxenOptions );
    console.log(msgBox);
}