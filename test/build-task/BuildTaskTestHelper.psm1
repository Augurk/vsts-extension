function Invoke-BuildTask {
	[CmdletBinding()]
	param (
		[Parameter(Mandatory=$true)]
		[string]$TaskDefinitionFile,
		
		[Parameter(Mandatory=$false, ValueFromRemainingArguments = $true)]
		[object[]]$Parameters
	)
	
	# Load task definition from json and determine the script to execute
	$taskDefinition = Get-Content $TaskDefinitionFile | ConvertFrom-Json
	$taskFolder = Split-Path $TaskDefinitionFile -Parent
	$scriptToExecute = $taskDefinition.execution.PowerShell.target.Replace('$(currentDirectory)', $taskFolder)
	
	# Turn the arguments into a hashtable so we can easily find them
	$argumentHash = @{}
	for ($i = 0; $i -lt $Parameters.Length; $i = $i + 2) {
		$argumentHash[$Parameters[$i]] = $Parameters[$i + 1]
	}
	
	# Go through the inputs for the task
	$buildTaskArguments = @{}
	foreach ($input in $taskDefinition.inputs) {
		$argumentName = "-$($input.name)"
		if ($Parameters -contains $argumentName) {
			Write-Verbose "Adding passed argument $argumentName"
			$buildTaskArguments[$argumentName] = "`"$($argumentHash[$argumentName])`""
		} elseif ($input.type -eq "boolean") {
			Write-Verbose "Adding default value for boolean argument $argumentName"
			$buildTaskArguments[$argumentName] = "`"$($input.defaultValue)`""
		} elseif ($input.defaultValue) {
			Write-Verbose "Adding default value for argument $argumentName"
			$buildTaskArguments[$argumentName] = "`"$($input.defaultValue)`""
		}
	}

	# Compile the argument list
	$argumentList = @()
	$buildTaskArguments.Keys | % { $argumentList += ("$($_)", $buildTaskArguments.Item($_)) }
	
	# Invoke the task
	Invoke-Expression "& `"$scriptToExecute`" $argumentList"
}

Export-ModuleMember Invoke-BuildTask