const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(__dirname+'/site/admin/admin.js','utf8');
const content=JSON.parse(fs.readFileSync(__dirname+'/site/content.json','utf8'));
class Element{constructor(){this.value='';this.children=[];this.disabled=false;}append(...v){this.children.push(...v);}replaceChildren(...v){this.children=v;}addEventListener(){}click(){}}
async function run(){const nodes=new Map();const get=id=>{if(!nodes.has(id))nodes.set(id,new Element());return nodes.get(id);};let mode='ok',puts=0,reads=0;const context={document:{getElementById:get,createElement:()=>new Element(),querySelectorAll:()=>[]},window:{addEventListener(){}},TextEncoder,TextDecoder,Uint8Array,Date,Blob,URL,setTimeout,confirm:()=>true,btoa:s=>Buffer.from(s,'binary').toString('base64'),atob:s=>Buffer.from(s,'base64').toString('binary'),fetch:async(url,o)=>{
 if(url==='../content.json')return{ok:true,json:async()=>structuredClone(content)};
 assert.ok(url.startsWith('https://api.github.com/repos/NYAYNA/ender-run-wiki/contents/site/content.json'));
 assert.equal(o.headers.Authorization,'Bearer test-only-token');
 if(mode==='unauthorized')return{ok:false,status:401};
 if(o.method==='PUT'){puts++;const body=JSON.parse(o.body);assert.equal(body.branch,'main');assert.equal(body.sha,'sha-current');const d=JSON.parse(Buffer.from(body.content,'base64').toString('utf8'));assert.equal(d.title,content.title);if(mode==='conflict')return{ok:false,status:409};return{ok:true,json:async()=>({content:{sha:'sha-next'}})};}
 reads++;return{ok:true,json:async()=>({sha:'sha-current',content:Buffer.from(JSON.stringify(content)).toString('base64')})};
 }};vm.createContext(context);vm.runInContext(source,context);await new Promise(setImmediate);assert.ok(get('editor').children.length>0);assert.equal(vm.runInContext('connection',context),null);
 for(const [k,v]of Object.entries({owner:'NYAYNA',repo:'ender-run-wiki',branch:'main'}))get(k).value=v;
 await get('connect').onclick();assert.match(get('status').textContent,/입력/);assert.equal(reads,0);
 mode='unauthorized';get('token').value='test-only-token';await get('connect').onclick();assert.equal(get('save').disabled,true);assert.equal(get('token').value,'');assert.match(get('status').textContent,/권한/);
 mode='ok';get('token').value='test-only-token';await get('connect').onclick();assert.equal(get('save').disabled,false);assert.equal(get('token').value,'');assert.equal(reads,1);
 mode='conflict';await get('save').onclick();assert.match(get('status').textContent,/다른 수정/);assert.equal(vm.runInContext('sha',context),'sha-current');
 mode='ok';await get('save').onclick();assert.equal(vm.runInContext('sha',context),'sha-next');assert.match(get('status').textContent,/저장했습니다/);assert.equal(puts,2);
 get('disconnect').onclick();assert.equal(get('save').disabled,true);assert.equal(vm.runInContext('connection',context),null);
 assert.throws(()=>vm.runInContext('validate({})',context));const bad=structuredClone(content);bad.sections[0].cards[0].image='https://evil.invalid/pixel';context.bad=bad;assert.throws(()=>vm.runInContext('validate(bad)',context));
 assert.equal(source.includes('localStorage'),false);assert.equal(source.includes('innerHTML'),false);
 for(const s of content.sections)for(const c of s.cards)if(c.image)assert.ok(fs.existsSync(__dirname+'/site/assets/'+c.image));
 console.log('PASS: content + images, missing credentials, 401, authenticated load, 409 preserves SHA, UTF-8 save, disconnect, invalid data and image rejection. No external requests.');}
run().catch(e=>{console.error(e);process.exitCode=1;});
