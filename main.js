const { app, BrowserWindow } = require("electron");

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      worldSafeExecuteJavaScript: true,
      contextIsolation: true,
    },
  });

  win.loadURL("https://www.github.com/amlanpatra");
}

app.whenReady().then(createWindow);
