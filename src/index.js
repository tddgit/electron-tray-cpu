const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const url = require('url');
// const log = require('electron-log');

// Set env
process.env.NODE_ENV = 'development';

require('electron-reload')(__dirname, {
    electron: path.join(process.cwd(), 'node_modules', '.bin', 'electron'),
    hardResetMethod: 'exit',
});

const isDev = process.env.NODE_ENV !== 'production';
const isMac = process.platform === 'darwin';

let mainWindow;

function createMainWindow() {
    mainWindow = new BrowserWindow({
        title: 'APP NAME',
        width: isDev ? 800 : 500,
        height: 600,
        icon: `${__dirname}/assets/icons/icon.png`,
        resizable: !!isDev,
        backgroundColor: 'white',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            // webSecurity: false,
            // allowRunningInsecureContent: true,
        },
    });

    if (isDev) {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.loadURL(`file://${__dirname}/index.html`);
}

const menu = [
    ...(isMac ? [{ role: 'appMenu' }] : []),
    {
        role: 'fileMenu',
    },
    ...(isDev
        ? [
              {
                  label: 'Developer',
                  submenu: [
                      { role: 'reload' },
                      { role: 'forcereload' },
                      { type: 'separator' },
                      { role: 'toggledevtools' },
                  ],
              },
          ]
        : []),
];

app.on('ready', () => {
    createMainWindow();

    const mainMenu = Menu.buildFromTemplate(menu);
    Menu.setApplicationMenu(mainMenu);
});

app.on('window-all-closed', () => {
    if (!isMac) {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
    }
});

app.allowRendererProcessReuse = true;
