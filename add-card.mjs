import {readFile,mkdir,copyFile,writeFile,access} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const [sourceArg,id]=process.argv.slice(2);
if(!sourceArg||!id||!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id))throw Error('Usage: node add-card.mjs <card-project/web> <unique-slug>');
const source=path.resolve(sourceArg),web=path.join(root,'web'),dest=path.join(web,'cards',id);
const manifestPath=path.join(web,'collection.json'),manifest=JSON.parse(await readFile(manifestPath,'utf8'));
if(manifest.cards.some(c=>c.id===id))throw Error('Card already exists: '+id);
try{await access(dest);throw Error('Destination already exists: '+dest);}catch(e){if(e.code!=='ENOENT')throw e;}
const config=JSON.parse(await readFile(path.join(source,'card-config.json'),'utf8'));
const assets=[];
for(const [key,value] of Object.entries(config.assets)){
 if(/^[a-z]+:/i.test(value))throw Error('Use local packaged assets for '+key);
 const src=path.resolve(source,value);
 if(!src.startsWith(source+path.sep))throw Error('Asset outside source project: '+key);
 await access(src);assets.push({key,src,name:key+path.extname(src)});
}
for(const key of ['model','subject','background','text'])if(!assets.some(a=>a.key===key))throw Error('Missing required asset '+key);
await mkdir(path.join(dest,'assets'),{recursive:true});
for(const {key,src,name} of assets){await copyFile(src,path.join(dest,'assets',name));config.assets[key]='./assets/'+name;}
await writeFile(path.join(dest,'card-config.json'),JSON.stringify(config,null,2));
manifest.cards.push({id,title:config.title,english:config.gallery?.english||id.toUpperCase(),series:config.gallery?.series||config.collection||'',role:config.gallery?.role||config.subtitle||'',theme:config.technique||'',quote:config.tagline||'',description:config.description||'',config:`./cards/${id}/card-config.json`,thumbnail:`./cards/${id}/assets/subject${path.extname(assets.find(a=>a.key==='subject').src)}`,number:String(manifest.cards.length+1).padStart(3,'0'),palette:config.gallery?.palette||'全息典藏'});
await writeFile(manifestPath,JSON.stringify(manifest,null,2));console.log('Added '+config.title+' to the collection.');
