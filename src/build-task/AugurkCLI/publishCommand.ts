import tl = require('azure-pipelines-task-lib/task');
import trm = require('azure-pipelines-task-lib/toolrunner');
import path = require('path');

export async function publishCommand(tool: trm.ToolRunner) {
    // Find the feature files we're going to publish
    const features = tl.getPathInput('features', true);
    const featureFiles = tl.findMatch(process.cwd(), features);

    // Group the found files by their parent directory
    const groupedFeatures = featureFiles.reduce<{ [index: string]: string[] }>((groups, item) => {
        const parent = path.dirname(item).split(path.sep).pop() as string;
        groups[parent] = groups[parent] || [];
        groups[parent].push(item);
        return groups;
    }, {});

    // Run the command for each group
    for (const key of Object.keys(groupedFeatures)) {
        const publishCommand = Object.assign({}, tool);
        publishCommand.arg(['--featureFiles', groupedFeatures[key].join(',')]);
        publishCommand.arg(['--groupName', key]);

        const publishResult = await publishCommand.exec();
        if (publishResult !== 0) {
            tl.error(`Publish command failed with exit code ${publishResult}`);
            return;
        }
        else {
            tl.debug('Publish command executed succesfully');
        }
    }
}
