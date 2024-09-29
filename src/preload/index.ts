import type { ConfigType } from '@/defaultConfig'
import { contextBridge, ipcRenderer } from 'electron'
import { slug } from '@/manifest'


contextBridge.exposeInMainWorld(slug, {
  configUpdate: (config: ConfigType) => ipcRenderer.invoke(
    `LiteLoader.${slug}.configUpdate`,
    config
  ),
  onBarClick: () => ipcRenderer.invoke(
    `LiteLoader.${slug}.onBarClick`
  )
})
