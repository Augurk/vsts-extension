import ma = require('azure-pipelines-task-lib/mock-answer');
import tmrm = require('azure-pipelines-task-lib/mock-run');
import path = require('path');

let taskPath = path.join(__dirname, '..', 'cli.js');
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

tmr.setInput('command', 'prune');
tmr.setInput('augurkInstance', 'SomeAugurkInstance');
tmr.setInput('productName', 'Augurk');
tmr.setInput('prereleaseOnly', 'true');

process.env["ENDPOINT_URL_SomeAugurkInstance"] = "https://some.augurk.instance";

tmr.setAnswers({
    which: {
        "augurk": "/some/path/to/augurk"
    },
    checkPath: {
        "/some/path/to/augurk": true
    },
    exec: {
        "/some/path/to/augurk prune --url https://some.augurk.instance --productName Augurk --prerelease": {
            code: 0,
        },
    }
});

tmr.run();