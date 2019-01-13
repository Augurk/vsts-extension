import tl = require('azure-pipelines-task-lib/task');
import { publishCommand } from './publishCommand';
import { deleteCommand } from './deleteCommand';
import { pruneCommand } from './pruneCommand';
import { ToolRunner } from 'azure-pipelines-task-lib/toolrunner';

async function run() {
    try {
        tl.debug(`PATH: ${process.env.PATH}`);

        // Check the command that we're going to execute
        const command = tl.getInput("command", true);
        switch (command)
        {
            case "publish":
                await publishCommand();
                break;
            case "delete":
                await deleteCommand();
                break;
            case "prune":
                await pruneCommand();
                break;
            default:
                throw `Unknown command: ${command}`;
        }
    }
    catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

export function buildBaseToolRunner(command: string): ToolRunner {
    // Determine the basic input values we'll always need
    const endpoint = tl.getInput("augurkInstance", true);
    const augurkUrl = tl.getEndpointUrl(endpoint, false);
    const productName = tl.getInput("productName", true);
    const groupName = tl.getInput("groupName", false);

    // Discover the location of the CLI and make sure it is available
    const cliPath = process.platform === 'win32' ? tl.which('augurk.exe', true) : tl.which('augurk', true);

    // Build the basic template for running the tool
    return tl.tool(cliPath)
             .arg(command)
             .arg(["--url", augurkUrl])
             .arg(["--productName", productName])
             .argIf(groupName, ["--groupName", groupName]);
}

run();