import fs from 'node:fs';
import path from 'node:path';
import {GetCurrentRelease,GetVersionString} from '../tools/RecipeRelease.mjs';
export function ReadStatus(_root){
	const config=JSON.parse(fs.readFileSync(path.join(_root,'example.json'),'utf8'));
	if(config.schemaVersion!==1 || Object.keys(config).some(_key=>!['schemaVersion','display'].includes(_key)) || !config.display || Array.isArray(config.display) || Object.keys(config.display).some(_key=>!['version','counter'].includes(_key)) || ['version','counter'].some(_key=>typeof config.display[_key]!=='boolean'))throw Error('INVALID_CONFIG');
	let counter=0;
	try{const state=JSON.parse(fs.readFileSync(path.join(_root,'.example-state/status.json'),'utf8'));counter=state.counter;if(!Number.isSafeInteger(counter)||counter<0)throw Error('INVALID_COUNTER');}catch(_error){if(_error.code!=='ENOENT')throw _error;}
	return {version:GetVersionString(GetCurrentRelease(_root)),counter,display:config.display};
}
export function AdvanceCounter(_root){
	const state=ReadStatus(_root);if(state.counter===Number.MAX_SAFE_INTEGER)throw Error('COUNTER_OVERFLOW');
	const directory=path.join(_root,'.example-state');fs.mkdirSync(directory,{recursive:true});
	if(fs.lstatSync(directory).isSymbolicLink())throw Error('UNSAFE_STATE');
	const file=path.join(directory,'status.json');
	try{const stat=fs.lstatSync(file);if(!stat.isFile()||stat.isSymbolicLink()||stat.nlink>1)throw Error('UNSAFE_STATE');}catch(_error){if(_error.code!=='ENOENT')throw _error;}
	fs.writeFileSync(file,JSON.stringify({counter:state.counter+1})+'\n');return ReadStatus(_root);
}
