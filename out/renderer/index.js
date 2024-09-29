const r = "ark_sender", d = (a, t, c = !1) => {
  let n = !1, e = null;
  try {
    const l = () => {
      const o = document.querySelector(a);
      o && !n ? (n = !0, t(), !c && e !== null && clearInterval(e)) : o || (n = !1);
    };
    e = setInterval(l, 100);
    const i = () => {
      e !== null && (clearInterval(e), e = null);
    };
    try {
      l();
    } catch (o) {
      console.error("Error executing callback:", o), i();
    }
  } catch (l) {
    console.error("Error in main function:", l);
  }
}, u = async () => {
  const a = await (await fetch(`local:///${LiteLoader.plugins[r].path.plugin}/assets/icon.svg`)).text(), t = document.createElement("div"), c = document.createElement("div"), n = document.createElement("i"), e = document.createElement("div");
  e.classList.add("ark-bar"), e.appendChild(t), t.classList.add("ark-q-tooltips"), t.addEventListener("click", () => {
    const l = document.querySelector(".ck.ck-content.ck-editor__editable p").textContent;
    ark_sender.onBarClick(app?.__vue_app__?.config?.globalProperties?.$store?.state?.common_Auth?.authData?.uin, l);
  }), t.appendChild(n), t.appendChild(c), c.classList.add("ark-q-tooltips__content"), c.innerText = "ark发送", n.classList.add("ark-q-icon"), n.innerHTML = a, document.querySelector(".chat-func-bar").lastElementChild.appendChild(e), console.log("创建工具栏图标完成");
}, s = document.createElement("link");
s.rel = "stylesheet";
s.href = `local:///${LiteLoader.plugins[r].path.plugin}/style/global.css`;
console.log("加载样式文件完成");
d(".chat-func-bar", async () => {
  await u();
}, !0);
