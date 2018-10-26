import * as taskLib from 'azure-pipelines-task-lib/task';
import * as toolLib from 'vsts-task-tool-lib/tool';

async function run() {
    try {
        // Get task inputs
        const version: string = taskLib.getInput('version', true);
        
        // Determine the correct path in the tools folder for the current platform
        let platform: string;
        if (process.platform === 'win32') {
            platform = 'win-x64';
        } else if (process.platform === 'linux') {
            platform = 'linux-x64';
        } else if (process.platform === 'darwin') {
            platform = 'osx-x64';
        } else {
            throw new Error(`Unknown platform ${process.platform}`);
        }

        // Construct the download URL
        const url = `https://github.com/Augurk/Augurk.CommandLine/releases/download/${version}/Augurk.CommandLine-${platform}-${version}.zip`;

        // Download the NuGet package and extract it
        const temp: string = await toolLib.downloadTool(url);
        const extractRoot: string = await toolLib.extractZip(temp);

        // The Node binary is in the bin folder of the extracted directory
        toolLib.prependPath(extractRoot);
    }
    catch (err) {
        taskLib.setResult(taskLib.TaskResult.Failed, taskLib.loc('AugurkCommandlineInstallerailed', err.message));
    }
}

run();