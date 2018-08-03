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


const { app, BrowserWindow } = require("electron");

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: false,
    title: "SH-Coin Wallet"
  });

  const ENV = process.env.ENV;

  if (ENV === "dev") {
    mainWindow.loadURL("http://localhost:3000");
  } else {
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