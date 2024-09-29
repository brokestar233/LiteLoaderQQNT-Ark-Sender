const r = "ark_sender", i = (a, t, l = !1) => {
  let n = !1, e = null;
  try {
    const o = () => {
      const c = document.querySelector(a);
      c && !n ? (n = !0, t(), !l && e !== null && clearInterval(e)) : c || (n = !1);
    };
    e = setInterval(o, 100);
    const s = () => {
      e !== null && (clearInterval(e), e = null);
    };
    try {
      o();
    } catch (c) {
      console.error("Error executing callback:", c), s();
    }
  } catch (o) {
    console.error("Error in main function:", o);
  }
}, d = async () => {
  const a = await (await fetch(`local:///${LiteLoader.plugins[r].path.plugin}/assets/icon.svg`)).text(), t = document.createElement("div"), l = document.createElement("div"), n = document.createElement("i"), e = document.createElement("div");
  e.classList.add("lite-tools-bar"), e.appendChild(t), t.classList.add("lite-tools-q-tooltips"), t.addEventListener("click", ark_sender.onBarClick), t.appendChild(n), t.appendChild(l), l.classList.add("lite-tools-q-tooltips__content"), l.innerText = "ark发送", n.classList.add("lite-tools-q-icon"), n.innerHTML = a, document.querySelector(".chat-func-bar").lastElementChild.appendChild(e), console.log("创建工具栏图标完成");
};
i(".chat-func-bar", async () => {
  await d();
}, !0);
