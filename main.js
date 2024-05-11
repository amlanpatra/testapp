const {
  app,
  BrowserWindow,
  systemPreferences,
  navigator,
  desktopCapturer,
} = require("electron");

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      worldSafeExecuteJavaScript: true,
      contextIsolation: true,
    },
  });

  const constraints = {
    audio: {
      mandatory: {
        chromeMediaSource: "desktop",
      },
    },
    video: {
      mandatory: {
        chromeMediaSource: "desktop",
      },
    },
  };

  if (isConnected()) {
    console.log("connected to net");
    win.loadURL("http://localhost:3011");
    test();
    desktop();
    getMedia(constraints);
  }
}

app.whenReady().then(createWindow);

async function test() {
  // if (process.platform === "darwin") {
  try {
    // prompt for permissions on macOS
    const types = ["camera", "microphone"];
    let accessPerms = {};

    for (const type of types) {
      systemPreferences
        .askForMediaAccess(type)
        .then((success) => {
          console.log("\n\n\npermission granted", type, success);
        })
        .catch((err) => {
          console.log("\n\n\nnot granted", type, err);
        });

      // const status = systemPreferences.getMediaAccessStatus(type);
      // accessPerms[type] = status;
    }
    console.log(accessPerms);
  } catch (e) {
    console.log("cant take permissions", e);
  }
  // }
}

async function desktop() {
  desktopCapturer
    .getSources({ types: ["window", "screen"] })
    .then(async (sources) => {
      for (const source of sources) {
        if (source.name === "Electron") {
          mainWindow.webContents.send("SET_SOURCE", source.id);
          return;
        }
      }
    });
}

async function getMedia(constraints) {
  let stream = null;

  try {
    stream = await navigator.mediaDevices.getUserMedia(constraints);
    /* use the stream */
    console.log("successful");
    console.log(stream);
  } catch (err) {
    /* handle the error */
    console.log(err);
  }
}

async function isConnected() {
  require("dns").lookup("google.com", function (err) {
    if (err && err.code == "ENOTFOUND") {
      return false;
    } else {
      return true;
    }
  });
}
