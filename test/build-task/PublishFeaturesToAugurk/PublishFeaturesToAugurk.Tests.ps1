Import-Module "$PSScriptRoot\..\BuildTaskTestHelper.psm1"

Describe "Publishes Features To Augurk" {
	InModuleScope BuildTaskTestHelper {
		$sut = "$PSScriptRoot\..\..\..\src\build-task\PublishFeaturesToAugurk\task.json"
		
		# Dummy function definitions so that we can Mock them
		Function Find-Files { }
		Function Get-ServiceEndpoint { }
		Function Invoke-Tool { param($Path, $Arguments) }
		
		Mock Import-Module
		Mock Get-ServiceEndpoint { return "UrlToAugurkService" }
		
		Context "When Group Name Is Provided" {
			$augurk = New-Item TestDrive:\augurk.exe -Type File
			Mock Find-Files { return [PSCustomObject]@{FullName = "DisplayingFeatures.feature"} }
			Mock Invoke-Tool -Verifiable -ParameterFilter {	$Path -eq $augurk -and $Arguments -like "*--groupName=Gherkin*" }
			
			Invoke-BuildTask -TaskDefinitionFile $sut -- -connectedServiceName "SomeAugurkService" -productName "Augurk" -version "2.4.0" -groupName "Gherkin" 
				
			It "Calls augurk.exe with the provided group name" {
				Assert-VerifiableMock
			}
		}
		
		Context "When Folder Structure is used" {
			$augurk = New-Item TestDrive:\augurk.exe -Type File
			New-Item TestDrive:\Gherkin -Type Directory | Out-Null
			New-Item TestDrive:\Gherkin\DisplayFeatures.feature -Type File | Out-Null
			New-Item TestDrive:\Versioning -Type Directory | Out-Null
			New-Item TestDrive:\Versioning\VersioningV1.feature -Type File | Out-Null
			Mock Find-Files { return @(
				"TestDrive:\Gherkin\DisplayFeatures.feature",
				"TestDrive:\Versioning\VersioningV1.feature"
			)}
			Mock Invoke-Tool -Verifiable -ParameterFilter { $Path -eq $augurk -and $Arguments -like "*--groupName=Gherkin*" }
			Mock Invoke-Tool -Verifiable -ParameterFilter { $Path -eq $augurk -and $Arguments -like "*--groupName=Versioning*" }
			
			Invoke-BuildTask -TaskDefinitionFile $sut -- -connectedServiceName "SomeAugurkService" -productName "Augurk" -version "2.4.0" -useFolderStructure "True"
				
			It "Calls augurk.exe with the provided group names" {
				Assert-VerifiableMock
			}
		}

		Context "When Product Description is provided" {
			$augurk = New-Item TestDrive:\augurk.exe -Type File
			Mock Find-Files { return [PSCustomObject]@{FullName = "DisplayingFeatures.feature"} }
			Mock Invoke-Tool -Verifiable -ParameterFilter {	$Path -eq $augurk -and $Arguments -like "*--groupName=Gherkin*" -and $Arguments -like "**--productDesc=Augurk.md*" }
			
			Invoke-BuildTask -TaskDefinitionFile $sut -- -connectedServiceName "SomeAugurkService" -productName "Augurk" -version "2.4.0" -groupName "Gherkin" -embedImages "true" -productDescription "Augurk.md"
				
			It "Calls augurk.exe with the --productDesc flag and the appropriate value" {
				Assert-VerifiableMock
			}
		}

		Context "When Embed Images is checked" {
			$augurk = New-Item TestDrive:\augurk.exe -Type File
			Mock Find-Files { return [PSCustomObject]@{FullName = "DisplayingFeatures.feature"} }
			Mock Invoke-Tool -Verifiable -ParameterFilter {	$Path -eq $augurk -and $Arguments -like "*--groupName=Gherkin*" -and $Arguments -like "**--embed*" }
			
			Invoke-BuildTask -TaskDefinitionFile $sut -- -connectedServiceName "SomeAugurkService" -productName "Augurk" -version "2.4.0" -groupName "Gherkin" -embedImages "true" 
				
			It "Calls augurk.exe with the --embed flag" {
				Assert-VerifiableMock
			}
		}

		Context "When Additional Arguments are provided" {
			$augurk = New-Item TestDrive:\augurk.exe -Type File
			Mock Find-Files { return [PSCustomObject]@{FullName = "DisplayingFeatures.feature"} }
			Mock Invoke-Tool -Verifiable -ParameterFilter {	$Path -eq $augurk -and $Arguments -like "*--groupName=Gherkin*" -and $Arguments -like "*--branchName=MyFeature*" -and $Arguments -notlike "*--productDescription=*" }
			
			Invoke-BuildTask -TaskDefinitionFile $sut -- -connectedServiceName "SomeAugurkService" -productName "Augurk" -version "2.4.0" -groupName "Gherkin" -additionalArguments "--branchName=MyFeature" 
				
			It "Calls augurk.exe with the provided additional arguments" {
				Assert-VerifiableMock
			}
		}
	}
}