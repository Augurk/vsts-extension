import tl = require('azure-pipelines-task-lib/task');
import { buildBaseToolRunner } from './cli';

export async function pruneCommand() {
    // Build and run the prune command
    const prereleaseOnly = tl.getBoolInput("prereleaseOnly", true);
    const versionRegex = tl.getInput("versionRegex", false);
    const pruneCommand = buildBaseToolRunner("prune")
                         .argIf(prereleaseOnly, "--prerelease")
                         .argIf(!prereleaseOnly, ["--versionRegex", versionRegex]);

    const pruneResult = await pruneCommand.exec();
    if (pruneResult !== 0) {
        tl.error(`Prune command failed with exit code ${pruneResult}`);
        return;
    }
    else {
        tl.debug('Prune command executed succesfully');
    }
}
