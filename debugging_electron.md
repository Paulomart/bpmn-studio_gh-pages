# Debugging the Electron Application

In the current Electron setup you will find 2 Threads running:

1. The UI thread.
1. The main thread.

To retrieve the logs from both is a little bit tricky; this is the description
how to obtain them.

## Logs of the UI Thread

Add `mainWindow.toggleDevTools();` to your application, and it will start with
the Chrome DevTools opened.

This works for bundled and non-bundled applications.

## Logs of the main thread

We have two scenarios:

1. The non-bundled application.
1. The bundled application.

**Non-bundled Application**

When launching the electron application from your terminal (e.g.  `electron
electron_app/electron.js`), the logs of your main thread will appear in your
terminal.

**The bundled Application**

The tricky thing about the logs in the bundled application is to start the
bundled application from the terminal.

This is different, depending on the target platform; this describes:

1. Windows and
1. MacOS instructions.

**On Windows**

Just run the `.exe` from cmd and you'll get the logs in your cmd window

**On MacOS**

The bundled application (the thing that ends with `.app`) is just a folder.

Use your terminal and navigate to `your-app.app/Contents/MacOS`. In there is a
single executable file. Execute it from your terminal (`./your-app`). You'll
see the logs of your main thread appear in your terminal

## Warnings

When executing the bundled application from a terminal, the working directory
of the application is different to when you execute it by double-clicking.

This effects everything in the application that is based on the working
directory, for example something like a default config path.

In OS X, the working directory is `/`.

## How to Bundle Config With Your Application

- Add the config to your bundle. Add this to your package.json:

   ```JavaScript
   "build": {
     "extraFiles": [
       "config/**/*"
     ]
   }
   ```

- Install the electron-is-dev package.

   ```bash
   npm install --save electron-is-dev
   ```

- Make the config settable via environment variable.
- Set that environment variable in your electron.js:

   ```JavaScript
   const isDev = require('electron-is-dev');
   if (!isDev) {
     // __dirname is (in this case) ./your-app.app/Contents/Resources/app.asar/electron_app
     // config is in ./your-app/Contents/config
     process.env.CONFIG_PATH = path.join(__dirname, '..', '..', '..', 'config');
   }
   ```

## Extract Info From the Bundled Application Without Starting it from the Terminal

You can tell Node.js to write out the current working directory to a file:

```JavaScript
const fs = require('fs');

// tell me where your current working-directory is!
fs.writeFileSync('~/Desktop/working_dir.txt', process.cwd(), 'utf8');
```

This is useful when you are unable to change or manipulate the working
directory (in which the application is executed). Node.js will then write a
file with the location of the current process.

## Debugging the UI Thread

Use the regular Chrome DevTools to debug your ui.

## Debugging the Main Thread

See https://electronjs.org/docs/tutorial/debugging-main-process.

Start your application with the `--inspect` or `inspect-brk` flags, just like
you would do with a regular node application:

```bash
./node_modules/.bin/electron --inspect electron_app/electron.js
```
