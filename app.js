

const LS_WRONG='ielts_wrong',LS_TESTED='ielts_tested';
function lsLoad(k,d){try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}}
function lsSave(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
function getWrong(){return lsLoad(LS_WRONG,[])}
function addWrong(w){const a=getWrong();if(!a.includes(w)){a.push(w);lsSave(LS_WRONG,a)}}
function removeWrong(w){lsSave(LS_WRONG,getWrong().filter(x=>x!==w))}
function getTested(){return lsLoad(LS_TESTED,[])}
function markTested(id){const t=getTested();if(!t.includes(id)){t.push(id);lsSave(LS_TESTED,t)}}
function getNextTestBatch(){const t=getTested();for(let i=BATCHES.length-1;i>=0;i--){const b=BATCHES[i];if(b.testable&&!t.includes(b.id))return b}return null}
function findWord(w){for(const b of BATCHES)for(const x of b.words)if(x.word===w)return x;return null}
function allWords(){const o=[];for(const b of BATCHES)o.push(...b.words);return o}
window.IELTSApp={BATCHES,getWrong,addWrong,removeWrong,getTested,markTested,getNextTestBatch,findWord,allWords,lsLoad,lsSave};
function exportData(){const d={wrong:getWrong(),tested:getTested(),exportedAt:new Date().toISOString()};const b=new Blob([JSON.stringify(d,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='ielts-backup-'+new Date().toISOString().slice(0,10)+'.json';a.click();URL.revokeObjectURL(a.href)}
function importData(ev){const f=ev.target.files[0];if(!f)return;const r=new FileReader();r.onload=function(e){try{const d=JSON.parse(e.target.result);let aw=0,at=0;if(Array.isArray(d.wrong))d.wrong.forEach(w=>{if(!getWrong().includes(w)){addWrong(w);aw++}});if(Array.isArray(d.tested))d.tested.forEach(t=>{if(!getTested().includes(t)){markTested(t);at++}});renderErrors();renderTest();alert('导入成功：合并错词 +'+aw+' 个，已测批次 +'+at+' 个\n当前错词共 '+getWrong().length+' 个')}catch(err){alert('导入失败：文件格式不对')}};r.readAsText(f);ev.target.value=''}
const $=id=>document.getElementById(id);
let testBatch=null,testIdx=0,testRevealed=false,testResult=null,testDone=false;
function switchTab(n){document.querySelectorAll('.tab-btn').forEach(b=>b.classList.toggle('active',b.dataset.panel===n));document.querySelectorAll('.panel').forEach(p=>p.classList.toggle('active',p.id==='panel-'+n));if(n==='new')renderBatches();if(n==='test')renderTest();if(n==='err')renderErrors()}
document.querySelectorAll('.tab-btn').forEach(b=>b.onclick=()=>switchTab(b.dataset.panel));
function updateCounts(){const e=getWrong().length;$('cnt-new').textContent=allWords().length+' 词';$('cnt-err').textContent=e+' 词';const nb=getNextTestBatch();$('cnt-test').textContent=nb?nb.words.length+' 词待测':'无';$('err-num').textContent=e;$('err-empty').style.display=e?'none':'block'}
