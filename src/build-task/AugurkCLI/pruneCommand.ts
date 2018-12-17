import tl = require('azure-pipelines-task-lib/task');
import trm = require('azure-pipelines-task-lib/toolrunner');

export async function pruneCommand(tool: trm.ToolRunner) {
    // Build and run the prune command
    const prereleaseOnly = tl.getBoolInput("prereleaseOnly", true);
    const versionRegex = tl.getInput("versionRegex", false);
    let pruneCommand = tool;
    if (prereleaseOnly) {
        pruneCommand = pruneCommand.arg("--prerelease");
    }
    else {
        pruneCommand = pruneCommand.arg(["--versionRegex", versionRegex]);
    }
    const pruneResult = await pruneCommand.exec();
    if (pruneResult !== 0) {
        tl.error(`Prune command failed with exit code ${pruneResult}`);
        return;
    }
    else {
        tl.debug('Prune command executed succesfully');
    }
}
