const $=id=>document.getElementById(id),frame=$('card-frame');
let cards=[],index=0,loadToken=0;
const h=()=>frame.contentWindow?.__holo;
const pad=n=>String(n).padStart(2,'0');
const controls=['flip','motion','reset','finish-open'];
function sync(){const state=h()?.getState();if(!state)return;$('flip').innerHTML=state.flipped?'正面 <span>↻</span>':'翻面 <span>↻</span>';$('motion').innerHTML=state.auto?'暫停旋轉 <span>Ⅱ</span>':'自動旋轉 <span>▷</span>';$('motion').setAttribute('aria-pressed',String(state.auto));document.querySelectorAll('[data-finish]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.finish===state.finish)));}
async function select(i,{historyMode='push'}={}){
 if(!cards.length)return;index=(i+cards.length)%cards.length;const card=cards[index],token=++loadToken;
 for(const id of controls)$(id).disabled=true;
 document.querySelector('.installation').classList.remove('ready');$('load-status').hidden=false;$('load-status').textContent='正在布展…';
 for(const id of ['title','english','series','role','quote','theme'])$(id).textContent=card[id]||'';
 $('folio').textContent=card.number;$('side-number').textContent='N° '+card.number;$('position').textContent=`${pad(index+1)} / ${pad(cards.length)}`;
 $('story-title').textContent=card.title;$('story-theme').textContent=card.theme;document.querySelector('.story-description').textContent=card.description;$('story-series').textContent=card.series;$('story-palette').textContent=card.palette;$('story-number').textContent='/ '+card.number;
 const viewer=new URL('./viewer.html',location.href);viewer.searchParams.set('config',card.config);$('full-view').href=viewer.href;viewer.searchParams.set('embed','1');frame.title=card.title+'互動 3D 卡牌';frame.contentWindow.location.replace(viewer.href);
 document.title=`${card.title} — 靈境典藏`;
 const url=new URL(location.href);url.search='';url.searchParams.set('card',card.id);if(historyMode==='push')history.pushState({},'',url);else if(historyMode==='replace')history.replaceState({},'',url);
 document.querySelectorAll('.catalog-card').forEach((b,j)=>b.setAttribute('aria-current',String(j===index)));
 const start=Date.now();while(token===loadToken&&Date.now()-start<45000){await new Promise(r=>setTimeout(r,160));const holo=h();if(holo?.ready||holo?.fallback3d){document.querySelector('.installation').classList.add('ready');$('load-status').hidden=true;for(const id of controls)$(id).disabled=false;$('gallery-foil').value=holo.config?.parameters?.foil??.45;$('foil-output').value=Math.round($('gallery-foil').value*100)+'%';sync();return;}}
 if(token===loadToken){$('load-status').textContent='作品暫時無法載入，請重新整理重試。';}
}
function open(id){$(id).showModal();if(id==='finish-dialog')sync();}
for(const [button,dialog] of [['catalog-open','catalog'],['story-open','story'],['finish-open','finish-dialog']])$(button).onclick=()=>open(dialog);
document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>$(b.dataset.close).close());
document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}}));
$('flip').onclick=()=>{h()?.flip();sync();};$('reset').onclick=()=>{h()?.reset();sync();};$('motion').onclick=()=>{const card=h();card?.setAuto?.(!card.getState().auto);sync();};
document.querySelectorAll('[data-finish]').forEach(b=>b.onclick=()=>{frame.contentDocument.querySelector(`[data-finish="${b.dataset.finish}"]`)?.click();sync();});
$('gallery-foil').oninput=e=>{const input=frame.contentDocument.getElementById('foil');if(input){input.value=e.target.value;input.dispatchEvent(new frame.contentWindow.Event('input',{bubbles:true}));}$('foil-output').value=Math.round(e.target.value*100)+'%';};
$('prev').onclick=()=>select(index-1);$('next').onclick=()=>select(index+1);
window.addEventListener('popstate',()=>{const i=cards.findIndex(c=>c.id===new URLSearchParams(location.search).get('card'));select(Math.max(0,i),{historyMode:'none'});});
window.addEventListener('keydown',e=>{if(document.querySelector('dialog[open]')||e.target.matches('input'))return;if(e.key==='ArrowRight'&&cards.length>1)select(index+1);if(e.key==='ArrowLeft'&&cards.length>1)select(index-1);});
frame.addEventListener('load',()=>{frame.contentDocument?.addEventListener('pointerup',()=>setTimeout(sync,50));});
async function init(){try{const res=await fetch('./collection.json');if(!res.ok)throw Error('missing collection');const data=await res.json();cards=data.cards;if(!Array.isArray(cards)||!cards.length)throw Error('empty collection');$('total').textContent=pad(cards.length);$('prev').disabled=$('next').disabled=cards.length<2;cards.forEach((c,i)=>{const b=document.createElement('button');b.className='catalog-card';b.setAttribute('aria-label','觀賞 '+c.title);const img=document.createElement('img');img.src=c.thumbnail;img.alt=c.title;const title=document.createElement('strong');title.textContent=c.title;const small=document.createElement('small');small.textContent=`${c.series} · ${c.theme}`;const n=document.createElement('em');n.textContent=c.number;b.append(img,title,small,n);b.onclick=()=>{$('catalog').close();select(i);};$('card-list').append(b);});const initial=cards.findIndex(c=>c.id===new URLSearchParams(location.search).get('card'));await select(Math.max(initial,0),{historyMode:'replace'});}catch(error){$('load-status').textContent='典藏目錄暫時無法載入，請重新整理。';console.error(error);}}
window.__gallery={select,getState:()=>({index,count:cards.length,card:cards[index]?.id,ready:!!h()?.ready})};init();
