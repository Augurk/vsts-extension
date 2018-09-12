import * as path from 'path';
import * as fs from 'fs';

import * as taskLib from 'vsts-task-lib/task';
import * as toolLib from 'vsts-task-tool-lib/tool';

async function run() {
    try {
        // Get task inputs
        const version: string = taskLib.getInput('version', true);

        // Construct the download URL
        const url = `https://www.nuget.org/api/v2/package/Augurk.CSharpAnalyzer/${version}`;

        // Download the NuGet package and extract it
        const temp: string = await toolLib.downloadTool(url);
        const extractRoot: string = await toolLib.extractZip(temp);

        // Determine the correct path in the tools folder for the current platform
        let platform: string;
        if (process.platform === 'win32') {
            platform = 'win-x64';
        } else if (process.platform === 'linux') {
            platform = 'linux-x64';
            // TODO: Nasty hack for now so that it's executable, we'll need to figure out how to handle this
            fs.chmodSync(path.join(extractRoot, 'tools', platform, 'Augurk.CSharpAnalyzer'), '777');
        } else if (process.platform === 'darwin') {
            platform = 'osx-x64';
        } else {
            throw new Error(`Unknown platform ${process.platform}`);
        }

        // The Node binary is in the bin folder of the extracted directory
        toolLib.prependPath(path.join(extractRoot, 'tools', platform));
    }
    catch (err) {
        taskLib.setResult(taskLib.TaskResult.Failed, taskLib.loc('AugurkCSharpAnalyzerFailed', err.message));
    }
}

run();