const path = require('path')
const {
  app,
  dialog,
  shell,
  Tray,
  Menu
} = require('electron')

const isPlatform = require('./../common/is-platform')

let tray = null

/**
 * Create a tray for Windows and Linux users
 * @param win { BrowserWindow } - window instance
 * @returns tray
 */
exports.createTray = win => {
  if (isPlatform('macOS') || tray) {
    return
  }

  let iconName = null
  // Set tray icon
  if (isPlatform('windows')) {
    iconName = 'icon.ico'
  } else {
    iconName = 'icon-18x18.png'
  }

  const iconPath = path.join(__dirname, '../assets/' + iconName)
  const toggleWin = () => {
    if (isPlatform('windows')) {
      win.isMinimized() ? win.restore() : win.isVisible() ? win.hide() : win.show()
    } else {
      win.isVisible() ? win.hide() : win.show()
    }
  }

  // Create tray
  tray = new Tray(iconPath)

  const contextMenu = [{
    label: 'Geçiş',
    click () {
      toggleWin()
    }
  },
  {
    label: 'Önbelleği temizle',
    click () {
      win.webContents.session.clearCache(() => {
        dialog.showMessageBox({
          message: 'Başarılı!'
        })
      })
    }
  },
  {
    label: 'Çıkış',
    click () {
      win.webContents.session.clearStorageData(() => {
        win.webContents.loadURL('https://www.instagram.com/')
        dialog.showMessageBox({
          message: 'Başarılı!'
        })
      })
    }
  },
  {
    type: 'separator'
  },
  {
    label: 'GitHub',
    click () {
      shell.openExternal('https://github.com/bikalab/imu')
    }
  },
  {
    label: 'Hata Bildir',
    click () {
      shell.openExternal('https://github.com/bikalab/imu/issues')
    }
  },
  {
    type: 'separator'
  },
  {
    label: 'Çıkış',
    click () {
      app.quit()
    }
  }
  ]

  tray.setToolTip(`${app.getName()}`)
  tray.setContextMenu(Menu.buildFromTemplate(contextMenu))
  tray.on('click', () => {
    toggleWin()
  })

  // return tray
}
