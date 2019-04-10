import tmrm = require('azure-pipelines-task-lib/mock-run');
import path = require('path');

let taskPath = path.join(__dirname, '..', 'cli.js');
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

tmr.setInput('command', 'publish');
tmr.setInput('features', '**/*.feature');
tmr.setInput('augurkInstance', 'SomeAugurkInstance');
tmr.setInput('productName', 'Augurk');
tmr.setInput('useFolderStructure', 'true');

process.env["ENDPOINT_URL_SomeAugurkInstance"] = "https://some.augurk.instance";

tmr.setAnswers({
    findMatch: {
        "**/*.feature": [
            "Configuration/RetentionPolicy.feature",
            "Gherkin/ChildOfTag.feature",
        ]
    },
    which: {
        "augurk": "/some/path/to/augurk"
    },
    checkPath: {
        "/some/path/to/augurk": true
    },
    exec: {
        "/some/path/to/augurk publish --url https://some.augurk.instance --productName Augurk --featureFiles Configuration/RetentionPolicy.feature --groupName Configuration": {
            code: 0,
        },
        "/some/path/to/augurk publish --url https://some.augurk.instance --productName Augurk --featureFiles Gherkin/ChildOfTag.feature --groupName Gherkin": {
            code: 0,
        },
    }
});

tmr.run();