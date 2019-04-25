import tmrm = require('azure-pipelines-task-lib/mock-run');
import path = require('path');

let taskPath = path.join(__dirname, '..', 'cli.js');
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

tmr.setInput('command', 'publish');
tmr.setInput('features', '**/*.feature');
tmr.setInput('augurkInstance', 'SomeAugurkInstance');
tmr.setInput('productName', 'Augurk');
tmr.setInput('groupName', 'Configuration');
tmr.setInput('useFolderStructure', 'false');
tmr.setInput('includeProductDescription', 'false');

process.env["ENDPOINT_URL_SomeAugurkInstance"] = "https://some.augurk.instance";

tmr.setAnswers({
    findMatch: {
        "**/*.feature": [
            "RetentionPolicy.feature",
        ]
    },
    which: {
        "augurk": "/some/path/to/augurk"
    },
    checkPath: {
        "/some/path/to/augurk": true
    },
    exec: {
        "/some/path/to/augurk publish --url https://some.augurk.instance --productName Augurk --groupName Configuration --featureFiles RetentionPolicy.feature": {
            code: 0,
        },
    }
});

tmr.run();