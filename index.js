const {app, globalShortcut} = require('electron')
const {BrowserWindow} = require('electron')
const {ipcMain} = require('electron')
const {Menu} = require('electron')
let mainWindow;

app.on('activate', () => {
  if(mainWindow==null){
    mainWindow = createMainWindow();
    mainWindow.show();
  }
  console.log("activate");
});

function createMainWindow(){
  const win = new BrowserWindow({
    width: 900,
    height: 650,
    titleBarStyle:'hidden',
    title: "Dreamfilm",
    transparent: true,
    frame: false,
    toolbar: false,
    show: false,
    "web-preferences":{
      experimentalFeatures:true
    }
  });
  app.commandLine.appendSwitch('--enable-experimental-web-platform-features');
  // Load a remote URL
  win.loadURL('file://'+__dirname+'/index.html');

  win.once('ready-to-show', () => {
    var electronVibrancy = require('electron-vibrancy');

    // Whole window vibrancy with Material 0 and auto resize
    electronVibrancy.SetVibrancy(win, 9);


    win.show();
  });
  // On mainwindow close, quit the app
  win.on('closed', () => {
    console.log('closed');
    mainwindow = null;
  });

  return win;
}
app.on('ready', () => {

  globalShortcut.register('CommandOrControl+H', () => {
    app.hide();
  });
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
  mainWindow = createMainWindow();



  mainWindow.on('app-command', (e, cmd) => {
    // Navigate the window back when the user hits their mouse back button
    if (cmd === 'browser-backward' && mainWindow.webContents.canGoBack()) {
      mainWindow.webContents.goBack()
    }
  });


  mainWindow.setMenu(menu);


  //mainWindow.webContents.openDevTools()

  // Open new window and play movie
  ipcMain.on('play', (event, arg) => {
    console.log("Laddar "+arg)
    var playerWindow = new BrowserWindow({
      width: 710,
      height: 400,
      titleBarStyle:'hidden',
      title: "Spelar film",
      show: true,
    })
    playerWindow.loadURL(arg,{
      httpReferrer: 'http://dreamfilmhd.bz/'
    });
    let contents = playerWindow.webContents;
    console.log(contents);

    playerWindow.on('new-window', (e) => {
      console.log("popup blockeed");
      alert("popup blockeed");
      e.preventDefault();
    });

  });
})
