# BBj RM

<p>
  <a href="http://www.basis.cloud/downloads">
    <img src="https://img.shields.io/badge/BBj-v22.00-blue" alt="BBj v22.00" />
  </a>
  <a href="https://github.com/hyyan/BBj-RM/blob/master/README.md">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="BBj-RM is released under the MIT license." />
  </a>
  <a href="https://github.com/necolas/issue-guidelines/blob/master/CONTRIBUTING.md#pull-requests">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs welcome!" />
  </a>
</p>

The main purpose of this project is to avoid infamous change -> restart & wait -> check development lifecycle. Save & Reload during development

BBj RM (BBj Reload Module) is a standalone [NodeJs](https://nodejs.org/en/) server to bring Hot Reload & Live Reload support to BBj. It helps you quickly and easily experiment, build UIs, add features,fix bugs and view the effects of your changes directly in the browser.

The server is packaged into an executable that can be run on major operating systems. (Windows, Linux, and macOS) even on devices without Node.js installed.

## What does "Reload" mean?

Reload means automatically reloading the application in the browser after modifying its code, instead of manually restarting and refreshing the browser page.

## Live Reload vs Hot Reload

BBj RM supports two types of reloading mechanisms:

- `Live Reload`: Reloads or refreshes the entire application when a file changes.
- `Hot Reload`: Only refreshes the files that were changed without losing the state of the app.

The module handles CSS changes using the `Hot reload` strategy and everything else using the `Live reload` strategy.

## How does it work?

- BBj RM watches file changes in the `input` directory, the input directory is where your source code is located.
- BBj RM outputs changed files to the `output` directory. Usually should be the `bbx/htdocs` folder. (This step can be skipped if if you have your own deployment process).
- BBj RM starts a server and gives the developer a javascript URL to include in the DWC/BUI application.
- Whenever a change is detected in the watched BBj files, a `Live reload` will be requested.
- Whenever a change in the attached CSS files is detected a `Hot reload` will be requested.

## Installation  

### The Executable

- Download the executable file based on your system from [Github](https://github.com/hyyan/BBj-RM/tree/main/dist) folder.
- Move the executable file to some global place in your system.

### From npm

It is possible to install the server using [npm](https://www.npmjs.com/)

```bash
> npm install -g hyyan/BBj-RM
```

## Starting The Server

Run the following command based on your system:

```bash
> server-win.exe ./demo/ C:/bbj/htdocs/demo -f "**/*.{css,js}"
```

The previous command will start the sever and output a URL to include in your app.
The server then keeps watching for changes in the source code and updating the browser as required.

## Server Options

```bash
Usage: cli [options] <input> <output>

Arguments:
  input                    The input directory where your project files are located
  output                   The output directory (Usually the BBj htdocs folder)

Options:
  -V, --version            output the version number
  -p, --port <number>      The port of the server and the web socket (default: 5151)
  -nc                      When passed then the static resources won't be copied to the output folder
  -f, --filter <regex...>  A regular expression which describes what files to copy. (default: ["**/*.css"])
  -h, --help               display help for command
```

## Demo

* Download the demo source code from [Github](https://github.com/hyyan/BBj-RM/tree/main/demo/plain) 
* Inside the `plain` folder run the following command:

`> server-win.exe ./ C:/bbj/htdocs/bbj-rm-plain -f "**/*.{css,js}"`

Try changing the code and monitor how the browser reflects the updates directly.

[filename](https://user-images.githubusercontent.com/4313420/207696594-ced6a3cc-5724-45e3-8996-b0bdc6090e13.mp4 ':include :type=video')

## Integrate with gulp.

In case you are using [gulp](https://gulpjs.com/) to compile and build your assets files. You can 
[concurrently](https://www.npmjs.com/package/concurrently) to run the BBjRM sever and gulp watch server at the same time.

* Download the demo source code from [Github](https://github.com/hyyan/BBj-RM/tree/main/demo/gulp) 
* Inside the `gulp` folder run the following command:

```bash
> npm install && npm start
```

[filename](https://user-images.githubusercontent.com/4313420/207698137-94ab9922-bef1-4d0d-b097-631d754c4d05.mp4 ':include :type=video')


## FAQ

+ 1- Is this tool maintained by BASIS? +

  No. This tool was developed in my spare time and I making it available publicly 

+ 2- Does this tool work with the `GUI` client? +

  No. This tool works with the DWC and BUI clients only

+ 3- Is this tool free? +

  Yes.

+ 4- The browser keeps asking for confirmation to reload the page +

  In the Enterprise manger. Navigate to `Web -> Global Settings` and disable `Show confirm Close Dialog` then restart BBjServices.

+ 5- The browser is showing a console error `Access from origin has been blocked by CORS policy` ? +

  Make sure to access your DWC/BUI app from localhost

+ 6- Where to report issues and ask for new features? +

  Issues and feature requests should be reported on [Github](https://github.com/hyyan/BBj-RM/issues) 


