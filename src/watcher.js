const chokidar = require('chokidar');
const fs = require('fs-extra');
const path = require('path');
const micromatch = require('micromatch');

module.exports = async (input, output, broadcast, options) => {
  const defaultOptions = Object.assign({
    filter: ['**/*.css'],
    Nc: false,
  }, options);

  // start clean
  fs.emptyDirSync(output);

  // sync dir with chokidar
  const watcher = chokidar.watch(input);
  watcher.on('all', async (event, currentPath) => {
    const report = () => {
      console.log(`[${event.charAt(0).toUpperCase() + event.slice(1)}] ${currentPath}`)
    }

    switch (event) {
      case 'add':
      case 'change':
        console.log(micromatch.isMatch(currentPath, defaultOptions.filter));
        if (micromatch.isMatch(currentPath, defaultOptions.filter)) {
          const dir = path.dirname(currentPath);
          fs.ensureDirSync(path.resolve(output, dir));
          console.log( `${path.resolve(output, dir)}/${path.basename(currentPath)}`);
          fs.copySync(currentPath, `${path.resolve(output, dir)}/${path.basename(currentPath)}`);
        }
        break;
      case 'unlink':
        if (micromatch.isMatch(currentPath, defaultOptions.filter)) {
          const dir = path.dirname(currentPath);
          fs.removeSync(`${path.resolve(output, dir)}/${path.basename(currentPath)}`);
        }
        break;
      default:
        break;
    }

    const ext = path.extname(currentPath).toLowerCase();
    if (ext === ".css") {
      broadcast({
        action: 'reload css',
        data: {
          path: path.basename(currentPath)
        }
      });
      report();
    } else {
      // we always monitor the bbj files 
      if ([".bbj", ".src"].indexOf(ext) > -1 || fs.pathExistsSync(path.resolve(currentPath))) {
        broadcast({
          action: 'reload page',
          data: null
        });
        report();
      }
    }
  });

  return watcher;
};