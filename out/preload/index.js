"use strict";const r=require("electron"),n="ark_sender";r.contextBridge.exposeInMainWorld(n,{configUpdate:e=>r.ipcRenderer.invoke(`LiteLoader.${n}.configUpdate`,e),onBarClick:(e,i)=>r.ipcRenderer.invoke(`LiteLoader.${n}.onBarClick`,e,i)});
