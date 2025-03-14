// File: src/main.ts
import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

let mainWindow: BrowserWindow | null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Handle folder selection
ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'],
    defaultPath: path.join(app.getPath('desktop')),
  });
  
  if (!result.canceled) {
    const folderPath = result.filePaths[0];
    const files = fs.readdirSync(folderPath);
    const videoFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.mp4', '.webm', '.mkv', '.avi', '.mov', '.wmv'].includes(ext);
    });
    
    return {
      folderPath,
      videos: videoFiles.map(file => ({
        name: file,
        path: path.join(folderPath, file),
        type: path.extname(file).toLowerCase().substring(1)
      }))
    };
  }
  
  return null;
});