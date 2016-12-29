const {app, globalShortcut} = require('electron')
const {BrowserWindow} = require('electron')
const {ipcMain} = require('electron')
const {Menu} = require('electron')
const {session} = require('electron')

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
    frame: false,
    toolbar: false,
    show: false,
  });
  app.commandLine.appendSwitch('--enable-experimental-web-platform-features');
  // Load a remote URL
  win.loadURL('file://'+__dirname+'/index.html');

  win.once('ready-to-show', () => {
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

  // Open new window and play movie
  ipcMain.on('play', (event, arg) => {
    console.log("Laddar "+arg)

    // Create a window to track the raw-movie url
    var loaderWindow = new BrowserWindow({
      width: 710,
      height: 400,
      titleBarStyle:'hidden',
      title: "Spelar film",
      show: false,
    })
    // Create a windows to show the movie
    var playerWindow = new BrowserWindow({
      width: 710,
      height: 400,
      titleBarStyle:'hidden',
      title: "Spelar film",
      show: true,
    })
    playerWindow.loadURL('file://'+__dirname+'/player/index.html',{
      httpReferrer: 'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36',
      userAgent: 'http://www.dreamfilmhd.org/API/api.php',
    });
    loaderWindow.loadURL(arg,{
      httpReferrer: 'http://dreamfilmhd.bz/'
    });

    var movie_url='';

    loaderWindow.webContents.session.webRequest.onBeforeRequest((details, callback) => {
      var url = details.url;

      //Search for mp4
      url = url.split('.');
      if(url[url.length-1]=='mp4' || details.url.includes(".mp4") || details.url.includes("googlevideo.com")){
        var first = (movie_url=='')? true : false;
        movie_url = details.url;
        console.log("Boom");

        if(first){
          playerWindow.webContents.send('url', movie_url);
        }
      }
      callback({});
    })

    playerWindow.webContents.openDevTools()

  });
})
