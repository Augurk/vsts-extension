# Augurk

Install this extension in order to integrate *Augurk* into your build pipeline. The extension currently provides 3 build tasks that can be
used together in order to get the most out of your living documentation.

To get started, use the following steps.

## 1. Install Augurk
Before you can integrate with Augurk you obviously have to install Augurk somewhere. Download the latest release of
Augurk from our [GitHub](https://github.com/augurk/Augurk/releases) page and install the WebDeploy package on a server that can be accessed by your build agents. If you're using Visual Studio Team Services hosted build agents this means that your Augurk installation must be accessible on the public internet.

**A note about security:**
Out of the box Augurk does not have an authentication mechanism. This is by design since Augurk should be easily accessible by users. However, you might want to secure Augurk's API so that new features can only be uploaded by specific users (for example your build server), especially if you're deploying Augurk in the cloud.

For example, we can add the following to the Web.config file for Augurk to allow only certain users or groups to access it:

```xml
<system.web>
   <authorization>
      <allow roles=“DOMAIN\GROUP NAME”/>
      <allow users=“DOMAIN\USER NAME”/>
      <deny users=“*” />
   </authorization>
</system.web>
```

Obviously you'll also need to enable some kind of authentication mechanism inside IIS, such as Windows Authentication, for this to work.

## 2. Add Augurk.CommandLine to your project
The actual publishing of feature files to Augurk is done through the Augurk.CommandLine tool. During the build this tool must be present in order to use the build task. The easiest way to accomplish this is to install the Augurk.CommandLine NuGet package into your project and ensure that NuGet packages are restored during the build. The build task will automatically pick this up.

Alternatively you can install the tool somewhere on your build agent and point the build task there through advanced configuration.

## 3. Add the Publish build task to your build definition
Edit an existing build definition or create a new one and add the *Publish features to Augurk* task to it. It can be found under the Utility group:

![](img/PublishFeaturesToAugurk-AddTask.png)

## 4. Configure an Augurk connection
After adding the task to the build definition you should configure a connection to Augurk. This can be done by using the + button next to the Augurk Instance option in the build definition editor. This will open up a dialog where you can enter the URL on which your Augurk instance is available and any credentials you need to supply in order to access Augurk. If you want to use Integrated Security you choose No Authentication here and check the box for Integrated Security when you configure the build task.

Once the connection has been established make sure it is selected as the Augurk instance to which features will be published.

## 5. Setup publishing
Finally, you'll need to configure a couple of parameters that are necessary for successfully publishing features.

![](img/PublishFeaturesToAugurk-BuildTask.png)

* **Feature(s)** - The set of feature files that need to be published. By default this is any .feature file in any directory.
* **Augurk Instance** - Connection (created above) to the Augurk instance that you want to publish the feature files to.
* **Product Name** - Name of the product under which the features files are to be published. You can select an existing product in Augurk, or enter the name of a new product.
* **Product Description** - Optionally specify the path to a Markdown file here that is published as the description for the previously selected product in Augurk.
* **Use folder structure** - Check this option if you want to use the existing folder structure as the names of groups within your Augurk.
* **Group Name** - If the **Use folder structure** option isn't checked, enter the name of the group that you want to publish these feature files under in Augurk.
* **Version** - Version number of the feature files being published. Ideally a build variable is used here so that the version matches the version of the build. Can also be left blank if you only want to see the latest published version of features in Augurk.
* **Embed images** - When checked images that are referenced in feature files (using Markdown syntax) are embedded and published together to Augurk so that they are visible there. If you're using relative paths for your images it is recommended to check this box.

## Advanced settings
To further customize how feature files are published to Augurk you can use the following advanced settings:

* **Use integrated security** - When checked the command line tool will use integrated security when communicating with Augurk. This can be useful in on-premises scenario's where you want to limit who can publish feature files to Augurk.
* **Language** - A .NET compatible culture name that is used to parse the feature files. Defaults to *en-US*. This is useful if you have your feature files written in another language but don't want to specify this language in every feature file.
* **augurk.exe Location** - Specifies the path to augurk.exe to use when publishing feature files. Defaults to a path that finds an augurk.exe in the packages folder. If you have the Augurk.CommandLine NuGet package installed, leave this value as is.
* **Additional argument(s)** - Specify any additional arguments that you want to pass to augurk.exe here. Refer to the documentation (augurk.exe -?) to see the available options.
* **Treat warning(s) as errors** - Check this option if warning(s) that are encountered during publishing should result in the build failing.

## 6. Add dependency analysis
Augurk also has the ability to visualize dependencies between the individual feature files automatically based on static code analysis. In order to use this, two additional tasks can be added to the build pipeline. The first of these is the Augurk CSharpAnalyzer Installer task. This task downloads a specific version of the CSharpAnalyzer onto the build agent and makes it available to the build to use:

![](img/AugurkCSharpAnalyzerInstaller-BuildTask.png)

* **Version** - The version of the analyzer to installer. Refer to [GitHub](https://github.com/Augurk/Augurk.CSharpAnalyzer/releases) for available versions.

If you prefer to not have the build install a version of the analyzer onto your build agent, you can also manage the installation yourself. To do so, install the Analyzer on the build agent, make sure that it is available on the path and add the **augurk-csharpanalyzer** capability to your build agent.

After that, you can use the Augurk CSharpAnalyzer task to perform the actual analysis and upload the results to Augurk. To do so, add the task to your build definition and configure the following settings:

![](img/AugurkCSharpAnalyzer-BuildTask.png)

* **Solution(s)** - Path(s) to one or more solution(s) that you want to analyze.
* **Specification project** - The name of the project within the solution that contains the feature files and automation logic.
* **Augurk instance** - Pick an instance of Augurk to publish the results to, or configure a new one (see above).
* **Product name** - The name of the product under which the results should be uploaded to Augurk.
* **Version** - The version of the product being analyzed.