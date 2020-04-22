import * as taskLib from 'azure-pipelines-task-lib/task';
import * as toolLib from 'azure-pipelines-tool-lib/tool';

async function run() {
    try {
        // Get task inputs
        const version = taskLib.getInput('version', true);
        if (!version) {
            throw new Error("Version is required");
        }
        
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

        // Check if the tool is already installed
        let toolPath: string = toolLib.findLocalTool('augurk-cli', version, platform);
        if (!toolPath) {
            // Tool is not installed, so construct the download URL
            const safeVersion = encodeURIComponent(version);
            const url = `https://github.com/Augurk/Augurk.CommandLine/releases/download/${safeVersion}/Augurk.CommandLine-${platform}-${version.replace("+", ".")}.${extension}`;

            // Download the NuGet package and extract it
            const temp: string = await toolLib.downloadTool(url);
            let extractRoot: string;
            if (process.platform === 'win32') {
                extractRoot = await toolLib.extractZip(temp);
            } else if (process.platform === 'linux' ||
                    process.platform === 'darwin') {
                extractRoot = await toolLib.extractTar(temp);
            } else {
                throw new Error(`Unknown platform ${process.platform}`);
            }

            // Cache the tool
            toolPath = extractRoot;
            toolLib.cacheDir(toolPath, 'augurk-cli', version, platform);
        }

        // The Node binary is in the bin folder of the extracted directory
        toolLib.prependPath(toolPath);
    }
    catch (err) {
        taskLib.setResult(taskLib.TaskResult.Failed, taskLib.loc('AugurkCLIInstallerFailed', err.message));
    }
}

run();