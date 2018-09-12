import tl = require('vsts-task-lib/task');
import trm = require('vsts-task-lib/toolrunner');

async function run() {
    try {
        // Get all inouts
        const solution = tl.getPathInput("solution", true);
        const specificationProject = tl.getInput("specificationProject", true);
        const productName = tl.getInput("productName", true);
        const version = tl.getInput("version", true);
        const endpoint = tl.getInput("connectedServiceName", true);
        const augurkUrl = tl.getEndpointUrl(endpoint, false);

        // Discover the location of the command line tool
        const csharpAnalyzerPath = process.platform === 'win32' ? tl.which('Augurk.CSharpAnalyzer.exe') : tl.which('Augurk.CSharpAnalyzer');

        // Build and run the analyze command
        tl.debug(`Running analyze command using ${csharpAnalyzerPath}`);
        const analyze = tl.tool(csharpAnalyzerPath)
                          .arg("analyze")
                          .arg(solution)
                          .arg(specificationProject);
        const analyzeResult = await analyze.exec();
        if (analyzeResult !== 0) {
            tl.error(`Analyze command failed with exit code ${analyzeResult}`);
            return;
        } else {
            tl.debug('Analyze command executed succesfully');
        }

        // Build and run the upload command
        tl.debug(`Running upload command using ${csharpAnalyzerPath}`);
        const upload = tl.tool(csharpAnalyzerPath)
                         .arg("upload")
                         .arg(augurkUrl)
                         .arg(productName)
                         .arg(version)
                         .arg(solution);
        const uploadResult = await upload.exec();
        if (uploadResult !== 0) {
            tl.error(`Upload command failed with exit code ${uploadResult}`);
            return;
        } else {
            tl.debug('Upload command executed succesfully');
        }
    }
    catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();