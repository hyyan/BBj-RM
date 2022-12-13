# BBj RM

BBj Reload Module is standalone server which helps you quickly and easily experiment, build UIs, add features,fix bugs and view the effects of your changes directly in the browser.


## How to use ?

  * Download the executable file based on your system from the `./dist` folder.
  * Move the executable file to some place global in your system
  * Run the following command: 
  
    `> server-win.exe .\demo\ C:\bbj\htdocs\demo -f "**/*.{css,js}"`


## Options 

```
Usage: server [options] <input> <output>

Arguments:
  input                 The input directory where your project files are located
  output                The output directory (Usually the BBj htdocs folder)

Options:
  -V, --version         output the version number
  -p, --port <number>   The port of the server and the web socket (default: 5555)
  -f, --filter <regex>  A regular expression which describes what files to copy. (default: "**/*.css")
  -h, --help            display help for command
```