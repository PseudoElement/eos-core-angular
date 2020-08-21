$ErrorActionPreference = "Stop"

function Read-EnvironmentOrDefaultValue ($envValue, $defaultValue) {
    if ( "$envValue" -ne "" )
    {
        return $envValue
    }
    else
    {
        return $defaultValue
    }
}

function Join-PathList() {
    $res = $args[0] 
    for ($i = 1; $i -lt $args.Length; $i += 1)
    {
        $res = Join-Path $res $args[$i]
    }
    return $res 
}

function Get-ToolCommand (    
    [string] $toolInfo,    
    [scriptblock] $toolPathBlock,    
    [string] $toolName
    ) {
    $toolPath = & $toolPathBlock
    if ( "$toolPath" -eq "" )
    {
        throw "Tool path not set. ${toolInfo}: $toolPathBlock"
    }
    $tool_filename = if ( "$toolName" -ne "" ) { (Join-Path $toolPath $toolName) } else { $toolPath }
    $tool_cmd = (Get-Item $tool_filename -ErrorAction Ignore).FullName
    if ( "$tool_cmd" -eq "" )
    {
        throw "Tool not found. ${toolInfo}: $tool_filename"
    }
    "$(get-date) - INFO: Find tool success: $tool_cmd" | Out-Host
    return $tool_cmd
}

function Invoke-CommandText(    
	[string] $commandInfo,    
	[string] $commandText,    
	[Switch] $ignoreExitCode) {    
		"$(get-date) - INFO:${commandInfo}: $commandText" | Out-Host
		$commandScriptBlock = [scriptblock]::Create($commandText)
		& $commandScriptBlock
		if ( -not $ignoreExitCode -and $lastexitcode -ne 0)
		{
			throw "Command-line program failed. Exit code: $lastexitcode"
		}
}

function Invoke-TfCli(    [string] $commandInfo,    [string] $commandText){
    $saveEncoding = [Console]::OutputEncoding
    try
    {
        [Console]::OutputEncoding = [System.Text.Encoding]::GetEncoding(0)
        Invoke-CommandText $commandInfo ($commandText + " " + $tfauth)
    }
    finally
    {
        [Console]::OutputEncoding = $saveEncoding
    }
}

function Invoke-TfsRest (    [string] $commandInfo,    [uri] $uri,    [object]$body){
    "$(get-date) - INFO: ${commandInfo}: $uri" | Out-Host
    $parameters = @{
        Uri = $uri
        ContentType = 'application/json'
        Headers = @{}
    }

    if ( $null -ne ( (Get-Command Invoke-WebRequest).Parameters.AllowUnencryptedAuthentication ) )
    {
        $parameters.Add("AllowUnencryptedAuthentication", $true)
    }
    
    if ( "$env:SYSTEM_ACCESSTOKEN" -eq "" )
    {
        $parameters.Add("UseDefaultCredentials", $true)
    }
    else
    {
        $tfsRestAuthToken = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes(("{0}:{1}" -f '', $env:SYSTEM_ACCESSTOKEN)))
        $parameters.Headers.Add("Authorization", "Basic {0}" -f $tfsRestAuthToken)
    }

    if ( $null -eq $body)
    {
        $parameters.Add("Method", [Microsoft.PowerShell.Commands.WebRequestMethod]::Get)
    }
    else
    {
        $parameters.Add("Method", [Microsoft.PowerShell.Commands.WebRequestMethod]::Post)
        $parameters.Add("Body", $body)
    }

    return Invoke-RestMethod @parameters
}





<#
function Invoke-BuildDropLocationTfsRest (    
    [string]$DropRootUnc) {    
        ${tfsColUrl} = Read-EnvironmentOrDefaultValue "$env:SYSTEM_TEAMFOUNDATIONCOLLECTIONURI" "http://tfs:8080/tfs/DefaultCollection/"

    if ( "$env:BUILD_BUILDID" -ne "" )
    {
        $artifact = @{name="Drop"; resource=@{type="filepath"; data="$DropRootUnc"}}
        $resp = Invoke-TfsRest "Link Drop Location to Build" `
            "${tfsColUrl}$env:SYSTEM_TEAMPROJECTID/_apis/build/builds/$env:BUILD_BUILDID/artifacts?api-version=5.0" `
            ($artifact|ConvertTo-Json)
        
        $resp | ConvertTo-Json -Depth 5 | Out-Host
    }
    else
    {
        "$(get-date) - WRN. BUILD_BUILDID not set. Assume this is a local build run. Artifacts linking skipped." | Out-Host
    }
}
#>