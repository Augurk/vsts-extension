import tl = require('azure-pipelines-task-lib/task');
import trm = require('azure-pipelines-task-lib/toolrunner');

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

async function publishCommand(tool: trm.ToolRunner) {
    // Build and run the analyze command
    const publishCommand = tool;
    const publishResult = await publishCommand.exec();
    if (publishResult !== 0) {
        tl.error(`Publish command failed with exit code ${publishResult}`);
        return;
    } else {
        tl.debug('Publish command executed succesfully');
    }
}

async function deleteCommand(tool: trm.ToolRunner) {
    // Build and run the delete command
    const featureName = tl.getInput("featureName", false);
    const version = tl.getInput("version", false);

    let deleteCommand = tool;
    if (featureName) {
        deleteCommand = deleteCommand.arg(["--featureName", featureName]);
    }
    if (version) {
        deleteCommand = deleteCommand.arg(["--version", version]);
    }

    const deleteResult = await deleteCommand.exec();
    if (deleteResult !== 0) {
        tl.error(`Delete command failed with exit code ${deleteResult}`);
        return;
    } else {
        tl.debug('Delete command executed succesfully');
    }
}

async function pruneCommand(tool: trm.ToolRunner) {
    // Build and run the prune command
    const prereleaseOnly = tl.getBoolInput("prereleaseOnly", true);
    const versionRegex = tl.getInput("versionRegex", false);

    let pruneCommand = tool;
    if (prereleaseOnly) {
        pruneCommand = pruneCommand.arg("--prerelease");
    } else {
        pruneCommand = pruneCommand.arg(["--versionRegex", versionRegex]);
    }

    const pruneResult = await pruneCommand.exec();
    if (pruneResult !== 0) {
        tl.error(`Prune command failed with exit code ${pruneResult}`);
        return;
    } else {
        tl.debug('Prune command executed succesfully');
    }
}

run();