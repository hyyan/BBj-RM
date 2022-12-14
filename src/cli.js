#!/usr/bin/env node
const { program } = require('commander');
const package = require('../package.json');
const chalk = require('chalk');
const originalLog = console.log;
const Box = require("cli-box");

program
  .version(package.version)
  .option('-p, --port <number>', 'The port of the server and the web socket', 5151)
  .option('-nc', `When passed then the static resources won't be copied to the output folder`)
  .option('-f, --filter <regex...>', 'A regular expression which describes what files to copy.', ['**/*.css'])
  .argument('<input>', 'The input directory where your project files are located')
  .argument('<output>', 'The output directory (Usually the BBj htdocs folder)')
  .action(async (input, output, options) => {
    require('better-logging')(console, {
      color: {
        base: chalk.greenBright,
        type: {
          debug: chalk.magentaBright,
          info: chalk.magentaBright,
          log: chalk.magentaBright,
          error: chalk.blue,
          warn: chalk.blue,
        }
      },
    });

    require('./server')(
      input,
      output,
      Object.assign(options, {
        cb: () => {
          originalLog(
            Box("20x8", {
              text: [
                `BBj Reload Module v${program.version()} By Hyyan Abo Fakher.`,
                `Github: https://github.com/hyyan/BBj-RM`,
                '-----',
                `To connect include the following in your DWC/BUI application:`,
                `BBjAPI().getWebManager().injectScriptUrl("http://localhost:${options.port}/server.js")`,
              ].join('\n'),
              stretch: true,
              autoEOL: true,
            })
          );
          console.log('Server is running on port ' + options.port)
        }
      }));

  })
  .parse(process.argv);
