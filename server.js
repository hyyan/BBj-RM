#!/usr/bin/env node

const fs = require('fs-extra');
const path = require("path");
const { program } = require('commander');
const chokidar = require('chokidar');
const http = require('http');
const copy = require('recursive-copy');
const getPort = require('get-port');
const chalk = require('chalk');
const boxen = require('boxen');
const log = console.log;
const ws = require('ws');

const prefix = () => {
  const date = new Date();
  return `${chalk.bold.blackBright(`[${date.toLocaleString()}]`)} `
};

const watch = (input, output, send, filter, noCopy) => {
  const watcher = chokidar.watch(input);

  fs.emptyDirSync(output);
  watcher.on('all', async (event, currentPath) => {
    const report = () => {
      const message = `${chalk.green(event.charAt(0).toUpperCase() + event.slice(1))} ` + currentPath;
      log(`${prefix()}${message}`)
    }

    if (!noCopy) {
      await copy(input, output, {
        overwrite: true,
        filter
      });
    }

    const ext = path.extname(currentPath).toLowerCase();

    if (ext === ".css") {
      send({
        action: 'reload css',
        data: {
          path: path.basename(currentPath)
        }
      });
      report();
    } else {
      // we always monitor the bbj files 
      if ([".bbj", ".src"].indexOf(ext) > -1 || fs.pathExistsSync(path.resolve(currentPath))) {
        send({
          action: 'reload page',
          data: null
        });
        report();
      }
    }
  });
}

program
  .version('0.0.1')
  .option('-p, --port <number>', 'The port of the server and the web socket', 5151)
  .option('-nc', `When passed then the static resources won't be copied to the output folder`)
  .option('-f, --filter <regex>', 'A regular expression which describes what files to copy.', '**/*.css')
  .argument('<input>', 'The input directory where your project files are located')
  .argument('<output>', 'The output directory (Usually the BBj htdocs folder)')
  .action(async (input, output, options) => {
    const port = await getPort({ port: Number(options.port) });
    const filter = options.filter;
    const server = http.createServer((req, res) => {
      if (req.url == '/server.js') {
        res.writeHead(200, { 'Content-Type': ' application/javascript' });
        res.write(fs.readFileSync(path.join(__dirname, '/client.js'), 'utf8').replace(/\[port\]/g, port));
        res.end();
      } else {
        res.writeHead(404);
        res.end();
      }
    });
    let watching = false;

    wss = new ws.WebSocketServer({ server });
    wss.on('connection', ws => {
      log(prefix() + chalk.green(`client Connected`));
      if (!watching) {
        watching = true;
        watch(
          input,
          output,
          (message) => {
            wss.clients.forEach(client => {
              if (client.readyState === ws.OPEN) {
                client.send(JSON.stringify(message));
              }
            });
          },
          filter,
          options.Nc);
      }

      ws.isAlive = true;
      ws.on('pong', () => ws.isAlive = true);
      ws.on('close', () => {
        log(prefix() + chalk.yellow(`client Disconnected`));
      });
    });

    wss.on('close', () => {
      clearInterval(heartbeatCheck);
    });

    const heartbeatCheck = setInterval(function ping() {
      wss.clients.forEach(function each(ws) {
        if (ws.isAlive === false) return ws.terminate();

        ws.isAlive = false;
        ws.ping();
      });
    }, 30000);

    server.listen(port, () => {
      log(chalk(`\nBBj RM v${program.version()} By Hyyan Abo Fakher`));
      log('Version: ' + chalk(program.version()));
      log(chalk(`Github: https://github.com/hyyan/BBj-RM\n`));
      log(chalk.cyan(
        boxen(
          "To connect to the BBj RM include the following in your DWC or BUI application:\n\n" +
          `BBjAPI().getWebManager().injectScriptUrl("http://localhost:${port}/server.js")`,
        )
      ) + '\n');
      log(prefix() + `${chalk.green('running')} on port ${port}`);
    })
  })
  .parse(process.argv);




