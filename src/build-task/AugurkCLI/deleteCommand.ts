import tl = require('azure-pipelines-task-lib/task');
import trm = require('azure-pipelines-task-lib/toolrunner');
import { buildBaseToolRunner } from './cli';

export async function deleteCommand() {
    // Build and run the delete command
    const featureName = tl.getInput("featureName", false);
    const version = tl.getInput("version", false);
    const deleteCommand = buildBaseToolRunner("delete")
                          .argIf(featureName, ["--featureName", featureName])
                          .argIf(version, ["--version", version]);

    const deleteResult = await deleteCommand.exec();
    if (deleteResult !== 0) {
        tl.error(`Delete command failed with exit code ${deleteResult}`);
        return;
    }
    else {
        tl.debug('Delete command executed succesfully');
    }
}
