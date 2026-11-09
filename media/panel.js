/* global acquireVsCodeApi */
'use strict';
const api=acquireVsCodeApi();let data={issues:[],principles:[]},tab='issues',ui={};
const $=id=>document.getElementById(id);
function t(key,values={}){let text=ui[key]||key;for(const [k,v] of Object.entries(values))text=text.replaceAll('{'+k+'}',String(v));return text;}
function el(tag,text,cls){const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;}
function send(type,index,group){api.postMessage({type,index,group,uri:data.uri,version:data.version});}
function button(text,fn){const b=el('button',text);b.type='button';b.addEventListener('click',fn);return b;}
function preview(item){const code=el('code');code.dir='ltr';if(item.preview)code.append(document.createTextNode(item.preview.before),el('mark',item.preview.mark),document.createTextNode(item.preview.after));else code.textContent=item.display||item.word||'';return code;}
function original(item,card){if(!item.original)return;const d=el('details'),body=el('div');d.append(el('summary',t('original')));body.lang='nl';body.dir='ltr';for(const x of [item.original.message||item.original.title,item.original.why,item.original.detail])if(x)body.append(el('p',x));if(item.original.steps?.length){const list=el('ol');for(const s of item.original.steps)list.append(el('li',s));body.append(list);}d.append(body);card.append(d);}
function render(){
 ui=data.ui||ui;document.documentElement.lang=data.language||'nl';document.documentElement.dir=data.language==='ar'?'rtl':'ltr';
 $('language').value=data.language||'nl';$('language-label').textContent=t('language');$('version').textContent=data.extensionVersion?'v'+data.extensionVersion:'';$('version').title=t('version');
 $('eyebrow').textContent=t('eyebrow');$('tagline').textContent=t('tagline');$('footer-text').textContent=t('footer');$('settings').textContent=t('settings');$('spelling-label').textContent=t('spelling');$('principles').textContent=t('principles');
 document.querySelector('nav').setAttribute('aria-label',t('spelling')+' / '+t('principles'));
 $('file').textContent=data.file||'';$('file').dir='ltr';$('pause').textContent=t(data.paused?'resume':'pause');
 $('spelling').setAttribute('aria-pressed',String(tab==='issues'));$('principles').setAttribute('aria-pressed',String(tab==='principles'));
 const count=data.total??data.issues.length;$('spelling-count').textContent=String(count);$('spelling-count').hidden=count===0;$('spelling').setAttribute('aria-label',t('spelling')+': '+t('found',{n:count}));
 const cards=$('cards');cards.replaceChildren();const list=data[tab]||[];
 if(tab==='issues'&&data.patternGuide?.length){const guide=el('details');guide.append(el('summary',t('guide')),el('p',t('guideIntro')));for(const p of data.patternGuide)guide.append(el('h3',p.title),el('p',p.text));cards.append(guide);}
 $('summary').textContent=(tab==='issues'||data.paused||data.enabled===false?data.notice:data.principleNotice)||(tab==='issues'?(list.length?t('found',{n:count}):t('none')):(list.length?t('ideas'):t('noIdeas')));
 list.forEach((item,index)=>{
  const card=el('article',undefined,'card');card.append(el('p',`${t('line')} ${item.line} · ${t('column')} ${item.column||1}`,'eyebrow'));
  if(tab==='issues'){
   if(item.family)card.append(el('p',item.family,'eyebrow'));
   card.append(el('h2',item.message),el('p',item.context),preview(item));if(item.why)card.append(el('p',item.why,'reason'));if(item.steps?.length)card.append(el('p',`${t('start')}: ${item.steps[0]}`,'question'));
   const details=el('details');details.append(el('summary',t('extra')),el('p',item.detail));if(item.steps?.length){details.append(el('h3',t('steps')));const steps=el('ol');for(const s of item.steps)steps.append(el('li',s));details.append(steps);}
   if(item.example){const code=el('code',item.example);code.dir='ltr';details.append(el('h3',t('example')),code,el('p',t('examplePrompt')));}card.append(details);
  }else{card.append(el('h2',item.title),preview(item),el('p',item.definition),el('p',item.reason,'reason'),el('p',item.question,'question'));const details=el('details');details.append(el('summary',t('explain')),el('p',item.explanation));card.append(details);}
  original(item,card);const group=tab;card.append(button(t('locate'),()=>send('locate',index,group)));if(group==='issues'&&item.ignorable!==false)card.append(button(t('ignore'),()=>send('ignore',index,group)));cards.append(card);
 });
 if(tab==='issues'&&data.total>list.length&&list.length<100)cards.append(button(t('more',{n:list.length,total:data.total}),()=>send('more')));
}
$('spelling').onclick=()=>{tab='issues';api.setState({tab});render();};$('principles').onclick=()=>{tab='principles';api.setState({tab});render();};$('pause').onclick=()=>send('pause');$('settings').onclick=()=>send('settings');$('language').onchange=()=>api.postMessage({type:'language',language:$('language').value});window.addEventListener('message',e=>{if(e.data?.type==='update'){data=e.data.data;render();}});api.postMessage({type:'ready'});
