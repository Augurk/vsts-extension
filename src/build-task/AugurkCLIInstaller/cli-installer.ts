import * as taskLib from 'azure-pipelines-task-lib/task';
import * as toolLib from 'vsts-task-tool-lib/tool';
import * as fs from 'fs';
import * as path from 'path';

async function run() {
    try {
        // Get task inputs
        const version: string = taskLib.getInput('version', true);
        
        // Determine the correct path in the tools folder for the current platform
        let platform: string;
        let extension: string;
        if (process.platform === 'win32') {
            platform = 'win-x64';
            extension = 'zip';
        } else if (process.platform === 'linux') {
            platform = 'linux-x64';
            extension = 'tar.gz';
        } else if (process.platform === 'darwin') {
            platform = 'osx-x64';
            extension = 'tar.gz';
        } else {
            throw new Error(`Unknown platform ${process.platform}`);
        }

        // Construct the download URL
        const url = `https://github.com/Augurk/Augurk.CommandLine/releases/download/${version}/Augurk.CommandLine-${platform}-${version}.${extension}`;

        // Download the NuGet package and extract it
        const temp: string = await toolLib.downloadTool(url);
        let extractRoot: string;
        if (process.platform === 'win32') {
            extractRoot = await toolLib.extractZip(temp);
        } else if (process.platform === 'linux' ||
                   process.platform === 'darwin') {
            extractRoot = await toolLib.extractTar(temp);

            // HACK: Set executable permissions for everyone, otherwise we can't find it later
            //       This is a workaround for this bug: https://github.com/Microsoft/azure-pipelines-task-lib/issues/420
            fs.chmodSync(path.join(extractRoot, 'augurk'), '0777');
        } else {
            throw new Error(`Unknown platform ${process.platform}`);
        }

        // The Node binary is in the bin folder of the extracted directory
        toolLib.prependPath(extractRoot);
    }
    catch (err) {
        taskLib.setResult(taskLib.TaskResult.Failed, taskLib.loc('AugurkCLIInstallerFailed', err.message));
    }
}

run();