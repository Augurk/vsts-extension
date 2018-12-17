import tl = require('azure-pipelines-task-lib/task');
import trm = require('azure-pipelines-task-lib/toolrunner');

export async function deleteCommand(tool: trm.ToolRunner) {
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
    }
    else {
        tl.debug('Delete command executed succesfully');
    }
}
