# Для сборки локально нужно установить переменные:
#
# Путь к nodejs версии 12 (или более поздней)
# $env:EOS_NODEJS_12 = "C:\Program Files\nodejs"

<# =========================VAR=============================== #>

$SourceBranchLongName = switch ($env:BUILD_REASON) {
      'PullRequest' { $env:BUILD_SOURCEBRANCH.Replace('refs/pull/','').Replace('/merge','') }
      default { $env:BUILD_SOURCEBRANCH.Replace('refs/heads/','').Replace('refs/tags/','') }
    }
$SourceBranchModName = $SourceBranchLongName.Replace('/','-').Replace('.','-')
<# =========================3.1=============================== #>

$ErrorActionPreference = "Stop"
Import-Module (Join-Path $PSScriptRoot "build_utils.psm1")
if ( "$env:SYSTEM_DEBUG" -eq "true")
{
    Get-ChildItem env:
}
<# =========================3.2=============================== #>

$Classif = (Get-Item $PSScriptRoot).FullName
"$(get-date) - INFO: Build started. Classif: $Classif" | Out-Host
<# =========================3.3.1============================= #>

$npm_cmd = Join-PathList $env:EOS_NODEJS_12 "npm.cmd"
if ( -not (Test-Path $npm_cmd -PathType Leaf) )
{
    throw "EOS_NODEJS_12 environment variable has wrong value. $npm_cmd not exists."
}
"$(get-date) - INFO: Find npm result: $npm_cmd" | Out-Host
<# =========================3.3.2============================= #>

if ( "$env:SYSTEM_ACCESSTOKEN" -ne "" )
{
    $npmrcDir = Join-PathList $env:BUILD_SOURCESDIRECTORY "npmrc"
    if ( -not ( Test-Path $npmrcDir ) ) { New-Item $npmrcDir -Type Directory -Force }
    $npmrc_file = Join-PathList $npmrcDir ".npmrc"
    $npmrc_auth_lines = `
        "//tfs:8080/tfs/DefaultCollection/_packaging/npmjs_org@Local/npm/registry/:_authToken=$env:SYSTEM_ACCESSTOKEN" + [System.Environment]::NewLine + `
        "//tfs:8080/tfs/DefaultCollection/_packaging/npmjs_org@Local/npm/:_authToken=$env:SYSTEM_ACCESSTOKEN"
    Set-Content $npmrc_file -Value $npmrc_auth_lines
    $userconfigparam = "--userconfig `"$npmrc_file`""
    "$(get-date) - INFO: Authenticated access to npmjs_org." | Out-Host
}
else
{
    $userconfigparam = $null
}
<# ==========================3.3.3============================ #>

Invoke-CommandText "Installing packages npm" `
    "& `"$npm_cmd`" install @angular/cli --scripts-prepend-node-path=true $userconfigparam `"2>&1`""

Invoke-CommandText "Installing packages npm" `
    "& `"$npm_cmd`" install --scripts-prepend-node-path=true $userconfigparam `"2>&1`""

Invoke-CommandText "Compiling source" `
    "& `"$npm_cmd`" run build-prod --no-progress --scripts-prepend-node-path=true `"2>&1`""
<# ==========================3.4============================== #>

if ( "$env:BUILD_BUILDID" -ne "" )
{
    $env:BuildVersion = $env:BUILD_BUILDID.Remove($env:BUILD_BUILDID.Length - 3)
    $env:RevisionVersion = $env:BUILD_BUILDID.Substring($env:BUILD_BUILDID.Length - 3)
    "$(get-date) - INFO: Vesion info. BuildVersion: $env:BuildVersion, RevisionVersion:: $env:RevisionVersion" | Out-Host
}

<# ===========================3.5============================== #>

$buildNumber = Read-EnvironmentOrDefaultValue $env:BUILD_BUILDNUMBER "BUILDNUMBER"
$DropSubdirUnc = Join-PathList "$env:SYSTEM_TEAMPROJECT" "$env:BUILD_REPOSITORY_NAME" "$SourceBranchModName" "$buildNumber"
$DropSubdir = Join-PathList "_$env:SYSTEM_TEAMPROJECT" "$env:BUILD_REPOSITORY_NAME" "$SourceBranchModName" "$buildNumber"
$DropStorageDir = Read-EnvironmentOrDefaultValue $env:EOS_TFBD_STORAGE "c:\tfbd\storage"
$DropRootDir = Join-PathList $DropStorageDir $DropSubdir
if ( Test-Path $DropRootDir )
{
    throw "Drop folder already exists: $DropRootDir"
}
<# ============================3.6.1============================ #>

$OutputDir = Join-PathList $DropRootDir "BuildResult"
$OutputFiles = Join-PathList $Classif "dist" "*"
<# ============================3.6.2============================ #>

Invoke-CommandText "Create Output folder" "New-Item -Type Directory `"$OutputDir`" -Force" | ForEach-Object FullName
Invoke-CommandText "Copying published files from Classif/dist" "Copy-Item `"$OutputFiles`" `"$OutputDir`" -Recurse"
<# ============================3.7============================== #>

$tfauth = if ( "$env:SYSTEM_ACCESSTOKEN" -eq "" ) { "" } else { "/loginType:OAuth /login:.,$env:SYSTEM_ACCESSTOKEN /noprompt" }
$tfsColUrl = Read-EnvironmentOrDefaultValue "$env:SYSTEM_TEAMFOUNDATIONCOLLECTIONURI" "http://tfs:8080/tfs/DefaultCollection/"
$tfsRestAuthToken = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes(("{0}:{1}" -f '', $env:SYSTEM_ACCESSTOKEN)))

<# =========================3.8================================= #>

$DropStorageUnc = Read-EnvironmentOrDefaultValue $env:EOS_TFBD_STORAGE_UNC "\\tfbd\Storage"
$DropRootUnc = (Join-PathList $DropStorageUnc $DropSubdir) -replace "/","\\" # UNC - always with Windows path separator
Invoke-BuildDropLocationTfsRest $DropRootUnc
<# =========================3.9================================= #>

$tbdServerPath = "`$/$env:SYSTEM_TEAMPROJECT/TeamBuildDrops/classif_"
$tbdServerRootPath = Join-PathList "$tbdServerPath$SourceBranchModName" "buildUri"
$tbdServerRootPathRepl = $tbdServerRootPath.Replace('\','/')

$resp = Invoke-TfsRest "Get buildUri path and version" `
    -Uri "${tfsColUrl}$env:SYSTEM_TEAMPROJECT/_apis/tfvc/items?scopePath=$tbdServerRootPath&api-version=4.1"
$buildUriPath = $resp.value[0].url
$buildUriVersion = $resp.value[0].version
<# =============================Test============================= #>
$buildUriLines = Invoke-TfsRest "Get buildUri file" `
     -Uri "$buildUriPath"

$buildUriLinesArr = $buildUriLines.Split("`n")
$counterBuild = "$(([int]$buildUriLinesArr[1]) + 1)"

if ( "$buildUriVersion" -ne "" ){
    #__Object for update
    $objUpdate = [ordered]@{
    	changes = @(
    		[ordered]@{
    			item = [ordered]@{
    				version = "$buildUriVersion"
    				path = "$tbdServerRootPathRepl"
    				contentMetadata = [ordered]@{
    					encoding = 1250
    					contentType = "text/plain"
    				}
    			}
    			changeType = "edit"
    			newContent = @{
    				content = "$env:BUILD_BUILDURI`n$counterBuild`n$DropRootUnc"
    			}
    		}
    	)
    	comment = "- Compilation Succeeded ($env:BUILD_DEFINITIONNAME)"
    }

    $jsonRequest = $objUpdate|ConvertTo-Json -Depth 10
    echo "jsonRequest===" $jsonRequest

$resp = Invoke-TfsRest "Post buildUri" `
    -Uri "${tfsColUrl}$env:SYSTEM_TEAMPROJECT/_apis/tfvc/changesets?api-version=4.1" "$jsonRequest"

}
    else
{
    "$(get-date) - WRN. buildUriVersion not set. " | Out-Host
}

"$(get-date) - INFO: Done." | Out-Host
