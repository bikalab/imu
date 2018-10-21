const os = require('os')
const path = require('path')
const isPlatform = require('./../common/is-platform')
const {app, BrowserWindow, Menu, shell, dialog, nativeImage} = require('electron')
const config = require('./config')
const win = BrowserWindow.getAllWindows()[0]
const appName = app.getName()

function sendAction (action) {
  const win = BrowserWindow.getAllWindows()[0]
  if (isPlatform('macOS')) {
    win.restore()
  }

  win.webContents.send(action)
}

const helpSubmenu = [
  {
    label: `${appName} Website`,
    click () {
      shell.openExternal('https://github.com/bikalab/imu')
    }
  },
  {
    label: 'Hata bildirin...',
    click () {
      const body = `
            <!-- Lütfen sorununuzu kısa bir şekilde açıklayın ve yeniden üretme adımlarını belirtin.. -->

            -

            ${app.getName()} ${app.getVersion()}
            Electron ${process.versions.electron}
            ${process.platform} ${process.arch} ${os.release()}`

      shell.openExternal(`https://github.com/bikalab/imu/issues/new?body=${encodeURIComponent(body)}`)
    }
  }
]

if (process.platform !== 'darwin') {
  helpSubmenu.push({
    type: 'separator'
  }, {
    role: 'about',
    click () {
      console.log(nativeImage.createFromPath(path.join(__dirname, 'assets/icon.png')))
      dialog.showMessageBox({
        title: `${appName} Hakkında`,
        message: `${appName} ${app.getVersion()}`,
        detail: 'Bikalab tarafından uyarlanmıştır.',
        icon: nativeImage.createFromPath(path.join(__dirname, 'assets/icon.png')),
        buttons: []
      })
    }
  })
}

const template = [{
  label: 'Düzen',
  submenu: [{
    label: 'Geri',
    accelerator: 'Backspace',
    enabled: false,
    click () {
      sendAction('go-back')
      const win = BrowserWindow.getAllWindows()[0]
      if (win.webContents.canGoBack()) {
        win.webContents.goBack()
      }
    }
  },
  {
    type: 'separator'
  },
  {
    role: 'undo'
  },
  {
    role: 'redo'
  },
  {
    type: 'separator'
  },
  {
    role: 'cut'
  },
  {
    role: 'copy'
  },
  {
    role: 'paste'
  },
  {
    role: 'pasteandmatchstyle'
  },
  {
    role: 'delete'
  },
  {
    role: 'selectall'
  }
  ]
},
{
  label: 'Görünüm',
  submenu: [{
    label: 'Yenile',
    accelerator: 'CmdOrCtrl+R',
    click (item, focusedWindow) {
      if (focusedWindow) focusedWindow.reload()
    }
  },
  {
    label: 'Önbelleği Temizle',
    click (item, focusedWindow) {
      if (focusedWindow) {
        focusedWindow.webContents.session.clearCache(() => {
          dialog.showMessageBox({
            message: 'Temizlendi!'
          })
          focusedWindow.reload()
        })
      }
    }
  },
  {
    type: 'separator'
  },
  {
    label: 'Ana Sayfa',
    accelerator: 'CmdOrCtrl+1',
    click () {
      sendAction('navigate-home')
    }
  },
  {
    label: 'Keşfet',
    accelerator: 'CmdOrCtrl+2',
    click () {
      sendAction('navigate-discover')
    }
  },
  {
    label: 'Yükle',
    accelerator: 'CmdOrCtrl+3',
    click () {
      sendAction('navigate-upload')
    }
  },
  {
    label: 'Bildirimler',
    accelerator: 'CmdOrCtrl+4',
    click () {
      sendAction('navigate-notifications')
    }
  },
  {
    label: 'Profil',
    accelerator: 'CmdOrCtrl+5',
    click () {
      sendAction('navigate-profile')
    }
  },
  {
    type: 'separator'
  },
  {
    label: 'Önceki Gönderi',
    accelerator: 'Shift+Up',
    click () {
      sendAction('navigate-up')
    }
  },
  {
    label: 'Sonraki Gönderi',
    accelerator: 'Shift+Down',
    click () {
      sendAction('navigate-down')
    }
  },
  {
    type: 'separator'
  },
  {
    label: 'Çıkış',
    click () {
      win.webContents.session.clearStorageData(() => {
        win.webContents.loadURL('https://www.instagram.com/')
        dialog.showMessageBox({
          message: 'Başarıyla çıkış yapıldı!'
        })
      })
    }
  },
  {
    type: 'separator'
  },
  {
    type: 'checkbox',
    checked: config.get('darkMode'),
    label: 'Koyu Tema',
    accelerator: 'CmdOrCtrl+D',
    click () {
      sendAction('toggle-dark-mode')
    }
  },
  {
    label: 'Geliştirici Modu',
    type: 'checkbox',
    accelerator: (function () {
      if (process.platform === 'darwin') {
        return 'Alt+Command+I'
      } else {
        return 'Ctrl+Shift+I'
      }
    })(),
    click: function (item, focusedWindow) {
      if (focusedWindow) {
        focusedWindow.toggleDevTools()
      }
    }
  }
  ]
},
{
  role: 'window',
  submenu: [{
    role: 'minimize'
  }, {
    role: 'close'
  }, {
    role: 'quit'
  }]
},
{
  role: 'help',
  submenu: helpSubmenu
}
]

if (process.platform === 'darwin') {
  template.unshift({
    label: appName,
    submenu: [{
      role: 'about'
    },
    {
      type: 'separator'
    },
    {
      label: 'Koyu Tema',
      accelerator: 'CmdOrCtrl+D',
      click () {
        sendAction('toggle-dark-mode')
      }
    },
    {
      type: 'separator'
    },
    {
      role: 'services',
      submenu: []
    },
    {
      type: 'separator'
    },
    {
      role: 'hide'
    },
    {
      role: 'hideothers'
    },
    {
      role: 'unhide'
    },
    {
      type: 'separator'
    },
    {
      role: 'quit'
    }
    ]
  })
  // Edit menu.
  template[1].submenu.push({
    type: 'separator'
  }, {
    label: 'Speech',
    submenu: [{
      role: 'startspeaking'
    },
    {
      role: 'stopspeaking'
    }
    ]
  })
  // Window menu.
  template[3].submenu = [{
    label: 'Kapat',
    accelerator: 'CmdOrCtrl+W',
    role: 'close'
  },
  {
    label: 'Küçült',
    accelerator: 'CmdOrCtrl+M',
    role: 'minimize'
  },
  {
    label: 'Yaklaş',
    role: 'zoom'
  },
  {
    type: 'separator'
  },
  {
    label: 'Öne Getir',
    role: 'front'
  }
  ]
}

module.exports = Menu.buildFromTemplate(template)
