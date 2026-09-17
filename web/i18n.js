const supported=['zh-Hant','zh-Hans'];
const params=new URLSearchParams(location.search);
let saved;try{saved=localStorage.getItem('archive-language');}catch{}
const preferred=(navigator.languages||[navigator.language]).find(x=>/^zh\b/i.test(x))||'';
export const locale=supported.includes(params.get('lang'))?params.get('lang'):supported.includes(saved)?saved:/^zh(?:-(?:Hans|CN|SG)|$)/i.test(preferred)?'zh-Hans':'zh-Hant';
export let translate=value=>value;
document.documentElement.lang=locale;
export function configForLocale(value){return locale==='zh-Hans'?value.replace(/card-config(?:\.zh-Hans)?\.json$/,'card-config.zh-Hans.json'):value.replace(/card-config\.zh-Hans\.json$/,'card-config.json');}
export function changeLanguage(value){
 if(!supported.includes(value))return;
 try{localStorage.setItem('archive-language',value);}catch{}
 const url=new URL(location.href);url.searchParams.set('lang',value);
 if(url.searchParams.has('config'))url.searchParams.set('config',value==='zh-Hans'?url.searchParams.get('config').replace(/card-config(?:\.zh-Hans)?\.json$/,'card-config.zh-Hans.json'):url.searchParams.get('config').replace(/card-config\.zh-Hans\.json$/,'card-config.json'));
 location.assign(url.href);
}
export const languageReady=fetch(new URL(`./ui.${locale}.json`,import.meta.url)).then(r=>{if(!r.ok)throw Error('Language unavailable');return r.json();}).then(dictionary=>{
 const keys=Object.keys(dictionary).sort((a,b)=>b.length-a.length);
 const pattern=new RegExp(keys.join('|'),'g');
 translate=value=>value.replace(pattern,s=>dictionary[s]);
 const skip=node=>node.parentElement?.closest('script,style,[data-language-control]');
 function visit(root){
  if(root.nodeType===Node.TEXT_NODE){if(!skip(root)){const text=translate(root.data);if(text!==root.data)root.data=text;}return;}
  if(root.nodeType!==Node.ELEMENT_NODE&&root!==document)return;
  if(root.nodeType===Node.ELEMENT_NODE){
   if(root.matches('script,style,[data-language-control]'))return;
   for(const attr of ['title','alt','aria-label','placeholder'])if(root.hasAttribute(attr)){const value=root.getAttribute(attr),text=translate(value);if(value!==text)root.setAttribute(attr,text);}
  }
  for(const child of root.childNodes)visit(child);
 }
 visit(document);
 new MutationObserver(records=>{for(const r of records){if(r.type==='childList')r.addedNodes.forEach(visit);else visit(r.target);}}).observe(document.documentElement,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['title','alt','aria-label','placeholder']});
 return translate;
});
function mount(){
 if(params.has('embed'))return;
 const host=document.querySelector('.mast,.header-actions');if(!host)return;
 const label=document.createElement('label');label.className='language-switch';label.dataset.languageControl='';
 const select=document.createElement('select');select.id='language-select';select.setAttribute('aria-label',locale==='zh-Hans'?'网站语言':'網站語言');
 for(const [value,text] of [['zh-Hant','繁體中文'],['zh-Hans','简体中文']]){const option=new Option(text,value);select.add(option);}
 select.value=locale;select.addEventListener('change',()=>changeLanguage(select.value));label.append(select);host.append(label);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
