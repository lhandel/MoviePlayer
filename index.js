const {app, globalShortcut} = require('electron')
const {BrowserWindow} = require('electron')
const {ipcMain} = require('electron')
const {Menu} = require('electron')


app.on('ready', () => {

  var menu = Menu.buildFromTemplate([
  {
    label: 'Dreamfilm',
    submenu: [
      {label: 'About App', selector: 'orderFrontStandardAboutPanel:'},
      {label: 'Quit', accelerator: 'CmdOrCtrl+Q', click: function() {app.quit();}}
    ]
  }]);
  Menu.setApplicationMenu(menu);

  // Create the main window
  let mainWindow = new BrowserWindow({
    width: 900,
    height: 650,
    titleBarStyle:'hidden',
    title: "Dreamfilm"
  })
  // On mainwindow close, quit the app
  mainWindow.on('closed', () => {
    mainWindow = null
    app.quit();
  });
  mainWindow.setMenu(menu);

  // Load a remote URL
  mainWindow.loadURL('file://'+__dirname+'/index.html');
  //mainWindow.webContents.openDevTools()

  // Open new window and play movie
  ipcMain.on('play', (event, arg) => {
    console.log("Laddar "+arg)
    var playerWindow = new BrowserWindow({
      width: 800,
      height: 400,
      titleBarStyle:'hidden',
      title: "Spelar film",
      show: true,
    })
    playerWindow.loadURL(arg);
  });
})
