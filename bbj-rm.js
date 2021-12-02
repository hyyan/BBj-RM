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

const prefix = () => {
  const date = new Date();
  return `${chalk.bold.blackBright(`[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}]`)} `
};

const watch = (input, output, io, filter, noCopy) => {
  const watcher = chokidar.watch(input);

  fs.emptyDirSync(output);
  watcher.on('all', async (event, currentPath) => {
    const report = () => {
      const message = `${chalk.green(event.charAt(0).toUpperCase() + event.slice(1))} ` +  currentPath;
      log(`${prefix()}${message}`)
    }

    if (!noCopy) {
      await copy(input, output, {
        overwrite: true,
        filter: [filter]
      });
    }

    const ext = path.extname(currentPath).toLowerCase();

    if (ext === ".css") {
      io.emit('reload css', path.basename(currentPath));
      report();
    } else {
      if (ext === ".bbj" || fs.pathExistsSync(path.resolve(currentPath))) {
        io.emit('reload page', null);
        report();
      }
    }
  });
}

program
  .version('0.0.1')
  .option('-p, --port <number>', 'The port of the server and the web socket', 5555)
  .option('-nc', `When passed then the static resources won't be copied to the output folder`)
  .option('-f, --filter <regex>', 'A regular expression which describes what files to copy.', '**/*.css')
  .argument('<input>', 'The input directory')
  .argument('<output>', 'The output directory')
  .action(async (input, output, options) => {
    const port = await getPort({ port: Number(options.port) });
    const filter = options.filter;
    const server = http.createServer(function (req, res) {
      if (req.url == '/bbj-rm.js') {
        res.writeHead(200, { 'Content-Type': ' application/javascript' });
        res.write(fs.readFileSync(path.join(__dirname, '/js/socket.io.js'), 'utf8'));
        res.write(fs.readFileSync(path.join(__dirname, '/js/client.js'), 'utf8').replace(/\[port\]/g, port));
        res.end();
      }
    });
    const io = require('socket.io')(server, {
      cors: { origin: "*" }
    });
    let watching = false;

    io.on('connection', socket => {
      if (!watching) {
        watching = true;
        watch(input, output, io, filter, options.Nc);
      }

      log(prefix() +  chalk.green(`client Connected`) + ` on ${socket.id}`);
      socket.on('disconnect', () => {
        log(prefix() +  chalk.yellow(`client Disconnected`) + ` from ${socket.id}`);
      });
    });


    server.listen(port, () => {
      log(chalk(`\nBBj RM v${program.version()} By Hyyan Abo Fakher`));
      log('Version: ' + chalk(program.version()));
      log(chalk(`Github: https://github.com/hyyan/BBj-RM\n`));
      log(chalk.cyan(
        boxen(
          "To connect to the BBj RM include the following in your DWC application:\n\n" +
          `wnd!.setAttribute("@app-script", "src=http://localhost:${port}/bbj-rm.js")`,
        )
      ) + '\n');
      log(prefix() + `${chalk.green('running')} on port ${port}`);
    })
  })
  .parse(process.argv);




