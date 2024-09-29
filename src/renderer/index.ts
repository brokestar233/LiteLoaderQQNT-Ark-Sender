import { slug } from '@/manifest'
import observeElement from './observeElement';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const onMessageLoad = async () => {
  const iconSvg = await (await fetch(`local:///${LiteLoader.plugins[slug].path.plugin}/assets/icon.svg`)).text();
  const qTooltips = document.createElement('div');
  const qTooltipsContent = document.createElement('div');
  const icon = document.createElement('i');
  const barIcon = document.createElement('div');
  //先借一下轻量工具箱的，下次一定改OVO
  barIcon.classList.add('lite-tools-bar');
  barIcon.appendChild(qTooltips);
  
  qTooltips.classList.add('lite-tools-q-tooltips');
  qTooltips.addEventListener('click', ark_sender.onBarClick);
  qTooltips.appendChild(icon);
  qTooltips.appendChild(qTooltipsContent);
  
  qTooltipsContent.classList.add('lite-tools-q-tooltips__content');
  qTooltipsContent.innerText = 'ark发送';
  
  icon.classList.add('lite-tools-q-icon');
  icon.innerHTML = iconSvg;

  document.querySelector('.chat-func-bar')!.lastElementChild!.appendChild(barIcon);
  console.log('创建工具栏图标完成');
};


observeElement('.chat-func-bar', async () => {
  await onMessageLoad();
}, true);