import tl = require('azure-pipelines-task-lib/task');
import { publishCommand } from './publishCommand';
import { deleteCommand } from './deleteCommand';
import { pruneCommand } from './pruneCommand';

async function run() {
    try {
        // Determine the basic input values we'll always need
        const endpoint = tl.getInput("connectedServiceName", true);
        const augurkUrl = tl.getEndpointUrl(endpoint, false);
        const productName = tl.getInput("productName", true);
        const groupName = tl.getInput("groupName", false);

        // Discover the location of the CLI and make sure it is available
        const cliPath = process.platform === 'win32' ? tl.which('augurk.exe', true) : tl.which('augurk', true);

        // Build the basic template for running the tool
        const command = tl.getInput("command", true);
        let tool = tl.tool(cliPath)
                      .arg(command)
                      .arg(["--url", augurkUrl])
                      .arg(["--productName", productName])

        if (groupName) {
            tool = tool.arg(["--groupName", groupName]);
        }

        // Check the command that we're going to execute
        tl.debug(`Running ${command} using ${cliPath}`);
        switch (command)
        {
            case "publish":
                await publishCommand(tool);
                break;
            case "delete":
                await deleteCommand(tool);
                break;
            case "prune":
                await pruneCommand(tool);
                break;
            default:
                throw `Unknown command: ${command}`;
        }
    }
    catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();