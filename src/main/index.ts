import { hookWrapper } from '@/main/hook/hookWrapper'
import { EventEnum } from './enum/eventEnum'
import { run } from './getcookie'
import { ipcMain } from 'electron'
import { slug } from '@/manifest'
import type { forceFetchClientKeyRetType } from 'napcat.core'

(async () => {
  await hookWrapper({
    log: false,
    eventBlacklist: [EventEnum.sendLog, /tianshu/i],
    eventInterceptors: {
    }
  });
})()

ipcMain.handle(`LiteLoader.${slug}.onBarClick`, (event) => {
  console.log('BarClick')
  run()
})

// Hook IPC 必须在 onBrowserWindowCreated 中调用
// exports.onBrowserWindowCreated = (window: Electron.CrossProcessExports.BrowserWindow) => {
//   // window 为 Electron 的 BrowserWindow 实例
//   hookIPC(window)
// }
