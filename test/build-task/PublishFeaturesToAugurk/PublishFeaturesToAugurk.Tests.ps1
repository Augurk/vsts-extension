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
			Mock Find-Files { return [PSCustomObject]@{FullName = "SomeInteresting.feature"} }
			Mock Invoke-Tool -Verifiable -ParameterFilter {	$Path -eq $augurk -and $Arguments -like "*--groupName=SomeGroupName*" }
			
			Invoke-BuildTask -TaskDefinitionFile $sut -- -connectedServiceName "SomeAugurkService" -productName "SomeProduct" -version "SomeVersion" -groupName "SomeGroupName" 
				
			It "Calls augurk.exe with the provided group name" {
				Assert-VerifiableMocks
			}
		}
		
		Context "When Folder Structure is used" {
			$augurk = New-Item TestDrive:\augurk.exe -Type File
			New-Item TestDrive:\SomeParentFolder -Type Directory | Out-Null
			New-Item TestDrive:\SomeParentFolder\SomeInteresting.feature -Type File | Out-Null
			New-Item TestDrive:\SomeOtherParentFolder -Type Directory | Out-Null
			New-Item TestDrive:\SomeOtherParentFolder\SomeOtherInteresting.feature -Type File | Out-Null
			Mock Find-Files { return @(
				"TestDrive:\SomeParentFolder\SomeInteresting.feature",
				"TestDrive:\SomeOtherParentFolder\SomeOtherInteresting.feature"
			)}
			Mock Invoke-Tool -Verifiable -ParameterFilter { $Path -eq $augurk -and $Arguments -like "*--groupName=SomeParentFolder*" }
			Mock Invoke-Tool -Verifiable -ParameterFilter { $Path -eq $augurk -and $Arguments -like "*--groupName=SomeOtherParentFolder*" }
			
			Invoke-BuildTask -TaskDefinitionFile $sut -- -connectedServiceName "SomeAugurkService" -productName "SomeProduct" -version "SomeVersion" -useFolderStructure "True"
				
			It "Calls augurk.exe with the provided group names" {
				Assert-VerifiableMocks
			}
		}
	}
}