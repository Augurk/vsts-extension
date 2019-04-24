# vsts-extension
Contains the ~~VSTS~~ Azure DevOps Services (or TFS) extension that integrates [Augurk](https://augurk.github.io) into the Azure DevOps (Server) environment.

[![Build Status](https://dev.azure.com/augurk/Augurk/_apis/build/status/Augurk.vsts-extension)](https://dev.azure.com/augurk/Augurk/_build/latest?definitionId=1)

# Prerequisites
This repository requires the following to be installed on your machine:
- NodeJS (suggest using LTS version)
- TypeScript (npm i -g typescript)
- Mocha (npm i -g mocha)

# Contents
This extension consists of several tasks that can be used with Azure Pipelines (both build and release pipelines) which allows the user to interact with Augurk.

- AugurkCLI: Performs a command supported by the [Augurk CLI](https://github.com/augurk/Augurk.CommandLine)
- AugurkCLIInstaller: Downloads and installs a specific version of the Augurk CLI onto the build agent
- AugurkCSharpAnalyzer: Uses the [Augurk.CSharpAnalyzer](https://github.com/augurk/Augurk.CSharpAnalyzer) to perform static code analysis and uploads the results to Augurk.
- AugurkCSharpAnalyzerInstaller: Downloads and installs a specific version of the Augurk.CSharpAnalyzer onto the build agent
- PublishFeaturesToAugurk: A legacy PowerShell based version of the AugurkCLI task that supports versions of Augurk.CLI < 4.0.0

# Build and run
To build and run a task, move into its appropriate directory (see above) and run the following commands:

```shell
tsc
node <task-name>.js
```

For example, to build and run the AugurkCLI task, use this command:

```shell
tsc
node cli.js
```

Obviously this will fail since the required inputs aren't set. These can be set by using environment variables. To discover the available inputs, check the **task.json**. To set the input, set an environment variable with the name INPUT_*input-name*. For example, to set the command to run for the Augurk CLI:

```shell
# In PowerShell
$env:INPUT_COMMAND=publish

# In Bash (or a simular shell)
export INPUT_COMMAND=publish
```

# Running tests
In order to run tests for this project, move into the folder of the appropriate task (see above) and run the following commands:

```shell
tsc
mocha tests/_suite.js
```

# Versioning
Important to know is that with Azure DevOps extensions there are several levels of versioning. First of all there is the version of the extension itself. We set this using [GitVersion](https://gitversion.readthedocs.io), which calculates a [semantic version](https://semver.org/) number based on Git history. This is done automatically by the build and release pipeline.

Additionally the build tasks themselves are also versioned, indepedently of the extension. These version numbers must be set manually when making changes to the build task in order for the new version to be used during a build or release. This is because the build tasks are cached by the build agents.

In general, when making non breaking changes (ie. no new or renamed inputs), bumping the patch version should suffice. When new features are being added that require new inputs in the **task.json**, but the task will continue to work without them, the minor version should be bumped. Finally, if new inputs are required, or if existing inputs are renamed, the major version should be updated. This allows users of the task to gracefully upgrade to the new version.

# Testing the extension
Once satisfied with the changes, create a pull request on GitHub. This will trigger an automatic build and publishes a preview version of the extension (with a monotonically updating version number). This version is then automatically used within our own Azure DevOps organization.

The preview extension currently isn't publicly available. If there is a demand we can look at making it publicly available, or sharing it with specific accounts.