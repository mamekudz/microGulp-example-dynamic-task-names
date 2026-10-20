import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
async function Fixture(_t){const root=await fs.mkdtemp(path.join(os.tmpdir(),'microgulp-example-'));_t.after(async()=>{if(path.dirname(root)!==os.tmpdir()||!path.basename(root).startsWith('microgulp-example-'))throw Error('Unsafe cleanup');await fs.rm(root,{recursive:true,force:true});});return root;}
import {ReadStatus,AdvanceCounter} from '../src/Status.mjs';
test('same imported module reads release edits and persisted counter without freezing metadata',async _t=>{
 const root=await Fixture(_t),release={main:1,minor:2,revision:3,date:'2026-10-12 00:00',beta:false,info:['Example.<context="release info"/>']};
 await fs.writeFile(path.join(root,'RELEASES.json'),JSON.stringify({releases:[release]}));await fs.writeFile(path.join(root,'example.json'),JSON.stringify({schemaVersion:1,display:{version:true,counter:true}}));
 assert.equal(ReadStatus(root).version,'1.2.3');assert.equal(AdvanceCounter(root).counter,1);
 release.revision=4;await fs.writeFile(path.join(root,'RELEASES.json'),JSON.stringify({releases:[release]}));assert.equal(ReadStatus(root).version,'1.2.4');assert.equal(ReadStatus(root).counter,1);
 await fs.writeFile(path.join(root,'.example-state/status.json'),'bad');assert.throws(()=>ReadStatus(root));
});
test('invalid display options are rejected before state writes',async _t=>{
 const root=await Fixture(_t);for(const display of [{version:'yes',counter:true},{version:true,counter:true,typo:true},null]){await fs.writeFile(path.join(root,'example.json'),JSON.stringify({schemaVersion:1,display}));assert.throws(()=>AdvanceCounter(root),/INVALID_CONFIG/);}await assert.rejects(fs.stat(path.join(root,'.example-state')),{code:'ENOENT'});
});
test('CLI names stay stable and all four display combinations have registered phrases',async()=>{
 const module=await import('../gulpfile.mjs');assert.equal(typeof module.SHOW_STATUS,'function');assert.equal(typeof module.ADVANCE_COUNTER,'function');assert.equal(typeof module.µI18xContext.GetValues,'function');
 const source=await fs.readFile(new URL('../gulpfile.mjs',import.meta.url),'utf8');
 for(const locale of ['de-DE','en-US']){const dictionary=JSON.parse(await fs.readFile(new URL('../i18x/gulp/'+locale+'.json',import.meta.url)));for(const match of source.matchAll(/'([^'\n]*<context="[^"\n]+"\/>[^'\n]*)'/g))assert.ok(Object.hasOwn(dictionary,match[1]),match[1]);}
});
