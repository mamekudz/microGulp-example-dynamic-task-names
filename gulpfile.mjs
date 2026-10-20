import * as Api from 'gulp-mu-gulp-api';
import {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {ReadStatus,AdvanceCounter} from './src/Status.mjs';
Api.InstallStringExtensions();
const ROOT=dirname(fileURLToPath(import.meta.url));
let snapshot;
export const µI18xContext={GetValues(){snapshot=ReadStatus(ROOT);return {version:snapshot.version,counter:snapshot.counter};}};
export async function SHOW_STATUS(){const value=ReadStatus(ROOT);Api.Log('Version <version/> | Counter <counter/><context="example log"/>',{version:value.version,counter:value.counter});}
SHOW_STATUS.µKeyBinding = { key: 'ctrl+shift+F7', mac: 'cmd+shift+F7' };
SHOW_STATUS.µDisplayName=()=>{
	const {display}=snapshot??ReadStatus(ROOT);
	if(display.version&&display.counter)return 'Example V<version/> | <counter/><context="µDisplayName"/>'.i18xRegister();
	if(display.version)return 'Example V<version/><context="µDisplayName"/>'.i18xRegister();
	if(display.counter)return 'Example | <counter/><context="µDisplayName"/>'.i18xRegister();
	return 'Example<context="µDisplayName"/>'.i18xRegister();
};
SHOW_STATUS.µGroup='Dynamic task names<context="µGroup"/>'.i18xRegister();
export async function ADVANCE_COUNTER(){AdvanceCounter(ROOT);Api.NotifyTasksChanged();await SHOW_STATUS();}
ADVANCE_COUNTER.µKeyBinding = { key: 'ctrl+shift+F11', mac: 'cmd+shift+F11' };
ADVANCE_COUNTER.µDisplayName='Advance example counter<context="µDisplayName"/>'.i18xRegister();
ADVANCE_COUNTER.µGroup=SHOW_STATUS.µGroup;
ADVANCE_COUNTER.µExecutionConcurrency=false;
