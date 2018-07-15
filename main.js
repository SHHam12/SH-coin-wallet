const path = require("path");
    url = require("url");

const { app, BrowserWindow } = require("electron");

let mainWindow;

function createWindow(){
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: false,
    title: "SH-Coin Wallet"
  });

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "index.html"),
      protocol: "file",
      slashes: true
    })
  );
}

app.on("closed", () => {
  mainWindow = null;
});

app.on("window-all-closed", () => {
  if(process.platform !== "darwin"){
    app.quit();
  }
});

app.on("activate", () => {
  if(mainWindow === null){
    createWindow();
  }
});

app.on("ready", createWindow);