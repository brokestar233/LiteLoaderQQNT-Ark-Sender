import { slug } from '@/manifest'
import observeElement from './observeElement';

// TODO:添加菜单
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const onMessageLoad = async () => {
  const iconSvg = await (await fetch(`local:///${LiteLoader.plugins[slug].path.plugin}/assets/icon.svg`)).text();
  const qTooltips = document.createElement('div');
  const qTooltipsContent = document.createElement('div');
  const icon = document.createElement('i');
  const barIcon = document.createElement('div');
  barIcon.classList.add('ark-bar');
  barIcon.appendChild(qTooltips);
  
  qTooltips.classList.add('ark-q-tooltips');
  qTooltips.addEventListener('click', () => {
    const text = (document.querySelector('.ck.ck-content.ck-editor__editable p') as HTMLParagraphElement).textContent
    ark_sender.onBarClick(app?.__vue_app__?.config?.globalProperties?.$store?.state?.common_Auth?.authData?.uin, text);
  });
  qTooltips.appendChild(icon);
  qTooltips.appendChild(qTooltipsContent);
  
  qTooltipsContent.classList.add('ark-q-tooltips__content');
  qTooltipsContent.innerText = 'ark发送';
  
  icon.classList.add('ark-q-icon');
  icon.innerHTML = iconSvg;

  document.querySelector('.chat-func-bar')!.lastElementChild!.appendChild(barIcon);
  console.log('创建工具栏图标完成');
};

const style = document.createElement('link');
style.rel = 'stylesheet';
style.href = `local:///${LiteLoader.plugins[slug].path.plugin}/style/global.css`;
console.log('加载样式文件完成');

observeElement('.chat-func-bar', async () => {
  await onMessageLoad();
}, true);