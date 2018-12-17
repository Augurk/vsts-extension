import tl = require('azure-pipelines-task-lib/task');
import trm = require('azure-pipelines-task-lib/toolrunner');

export async function publishCommand(tool: trm.ToolRunner) {
    // Build and run the publish command
    const features = tl.getPathInput('features', true);
    const featureFiles = tl.findMatch(process.cwd(), features);

    tl.debug(featureFiles.join(','));

    const publishCommand = tool;
    const publishResult = await publishCommand.exec();
    if (publishResult !== 0) {
        tl.error(`Publish command failed with exit code ${publishResult}`);
        return;
    }
    else {
        tl.debug('Publish command executed succesfully');
    }
}
