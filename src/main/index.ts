import { hookWrapper } from '@/main/hook/hookWrapper'
import { EventEnum } from './enum/eventEnum'
import { run } from './signandsendark'
import { ipcMain } from 'electron'
import { slug } from '@/manifest'

(async () => {
  await hookWrapper({
    log: false,
    eventBlacklist: [EventEnum.sendLog, /tianshu/i],
    eventInterceptors: {
    }
  });
})()

ipcMain.handle(`LiteLoader.${slug}.onBarClick`, (event, uin, text) => {
  console.log('BarClick')
  run(uin,text)
})
