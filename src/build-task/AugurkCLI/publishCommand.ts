import tl = require('azure-pipelines-task-lib/task');
import path = require('path');
import { buildBaseToolRunner } from './cli';

export async function publishCommand() {
    // Find the feature files we're going to publish
    const features = tl.getPathInput('features', true);
    const featureFiles = tl.findMatch(process.cwd(), features);

    // Check whether we should use the folder structure
    if (tl.getBoolInput('useFolderStructure', true)) {
        await publishUsingFolderStructure(featureFiles);
    } else {
        await publishIndividualGroup(featureFiles);
    }
}

async function publishUsingFolderStructure(featureFiles: string[]) {
    // Group the found files by their parent directory
    const groupedFeatures = featureFiles.reduce<{ [index: string]: string[] }>((groups, item) => {
        const parent = path.dirname(item).split(path.sep).pop() as string;
        groups[parent] = groups[parent] || [];
        groups[parent].push(item);
        return groups;
    }, {});

    // Run the command for each group
    for (const key of Object.keys(groupedFeatures)) {
        const publishCommand = buildBaseToolRunner("publish");
        publishCommand.arg(['--featureFiles', groupedFeatures[key].join(',')]);
        publishCommand.arg(['--groupName', key]);

        const publishResult = await publishCommand.exec();
        if (publishResult !== 0) {
            tl.error(`Publish command failed with exit code ${publishResult}`);
        }
        else {
            tl.debug('Publish command executed succesfully');
        }
    }
}

async function publishIndividualGroup(featureFiles: string[]) {
    const publishCommand = buildBaseToolRunner('publish');
    publishCommand.arg(['--featureFiles', featureFiles.join(',')]);

    const publishResult = await publishCommand.exec();
    if (publishResult !== 0) {
        tl.error(`Publish command failed with exit code ${publishResult}`);
    } else {
        tl.debug('Publish command executed succesfully.');
    }
}