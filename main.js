const path = require("path"),
    url = require("url"),
    getPort = require("get-port"),
    shcoin = require("./SH-coin/src/server");

getPort().then(port => {
  const server = shcoin.app.listen(port, () => {
    console.log(`Running blockchain node on: ${port}`);
  });

  shcoin.startP2PServer(server);
  global.sharedPort = port;
});


const { app, BrowserWindow, Menu } = require("electron");

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: false,
    title: "SH-Coin Wallet"
  });

  const ENV = process.env.ENV;

  const template = [
    {
      label: "SH-coin Wallet",
      submenu: [
        {
          label: "About SH-coin Wallet",
          role: "about"
        },
        {
          type: "separator"
        },
        {
          label: "Services",
          role: "services",
          submenu: []
        },
        {
          type: "separator"
        },
        {
          label: "Hide SH-coin Wallet",
          accelerator: "Command+H",
          role: "hide"
        },
        {
          label: "Hide Others",
          accelerator: "Command+Shift+H",
          role: "hideothers"
        },
        {
          label: "Show All",
          role: "unhide"
        },
        {
          type: "separator"
        },
        {
          label: "Quit",
          accelerator: "Command+Q",
          click: function () {
            app.quit();
          }
        }
      ]
    },
    {
      label: "Edit",
      submenu: [
        {
          label: "Undo",
          accelerator: "CmdOrCtrl+Z",
          role: "undo"
        },
        {
          label: "Redo",
          accelerator: "Shift+CmdOrCtrl+Z",
          role: "redo"
        },
        {
          type: "separator"
        },
        {
          label: "Cut",
          accelerator: "CmdOrCtrl+X",
          role: "cut"
        },
        {
          label: "Copy",
          accelerator: "CmdOrCtrl+C",
          role: "copy"
        },
        {
          label: "Paste",
          accelerator: "CmdOrCtrl+V",
          role: "paste"
        },
        {
          label: "Select All",
          accelerator: "CmdOrCtrl+A",
          role: "selectall"
        }
      ]
    }
  ];

  if (ENV === "dev") {
    mainWindow.loadURL("http://localhost:3000");
    mainWindow.webContents.openDevTools();
  } else {
    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, "build/index.html"),
        protocol: "file",
        slashes: true
      })
    );
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
};

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on("ready", createWindow);