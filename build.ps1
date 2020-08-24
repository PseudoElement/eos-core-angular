# Для сборки локально нужно установить переменные:
#
# Путь к nodejs версии 12 (или более поздней)
# $env:EOS_NODEJS_12 = "C:\Program Files\nodejs"
#
# Путь к tf.exe или алиас
# Set-Alias tf "C:\Program Files (x86)\Microsoft Visual Studio\2019\Enterprise\Common7\IDE\CommonExtensions\Microsoft\TeamFoundation\Team Explorer\TF.exe"

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
    $env:BuildVersion = $env:BUILD_BUILDID.Remove($env:BUILD_BUILDID.Length - 2)
    $env:RevisionVersion = $env:BUILD_BUILDID.Substring($env:BUILD_BUILDID.Length - 2)
    "$(get-date) - INFO: Vesion info. BuildVersion: $env:BuildVersion, RevisionVersion:: $env:RevisionVersion" | Out-Host
}
<# ===========================3.5============================== #>
$buildNumber = Read-EnvironmentOrDefaultValue $env:BUILD_BUILDNUMBER "BUILDNUMBER"
$DropSubdir = Join-PathList "Classif" "${env:BUILD_DEFINITIONNAME}_$buildNumber"
$DropStorageDir = Read-EnvironmentOrDefaultValue $env:EOS_TFBD_STORAGE "c:\tfbd\storage"
$DropRootDir = Join-PathList $DropStorageDir $DropSubdir
if ( Test-Path $DropRootDir )
{
    throw "Drop folder already exists: $DropRootDir"
}
<# ============================3.6.1============================ #>
$OutputSubdir = Join-PathList "dev"
<# $OutputSubdir = Join-PathList "release-1-0"
$OutputSubdir = Join-PathList "release-v20-1" #>
$OutputDir = Join-PathList $DropRootDir $OutputSubdir
$OutputFiles = Join-PathList $Classif "dist" "*"
<# ============================3.6.2============================ #>
Invoke-CommandText "Create Output folder" "New-Item -Type Directory `"$OutputDir`" -Force" | ForEach-Object FullName
Invoke-CommandText "Copying published files from Classif/dist" "Copy-Item `"$OutputFiles`" `"$OutputDir`" -Recurse"
<# ============================3.7============================== #>
$tf_cmd = Get-Command tf -ErrorAction Ignore
$tfauth = if ( "$env:SYSTEM_ACCESSTOKEN" -eq "" ) { "" } else { "/loginType:OAuth /login:.,$env:SYSTEM_ACCESSTOKEN /noprompt" }
$tfsColUrl = Read-EnvironmentOrDefaultValue "$env:SYSTEM_TEAMFOUNDATIONCOLLECTIONURI" "http://tfs:8080/tfs/DefaultCollection/"
$tfsRestAuthToken = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes(("{0}:{1}" -f '', $env:SYSTEM_ACCESSTOKEN)))
"$(get-date) - INFO: Find tf result: $tf_cmd" | Out-Host
<# =============================Test============================= #>
<#
$ClassifBuildUriFile = Invoke-TfCli "Resolve workspace mappings for dev-delo-classif_dev buildUri" `
    "tf vc resolvepath $/Delo96/TeamBuildDrops/dev-delo-classif_dev/buildUri"

$ClassifBuildVstfsUrl = (Get-Content $ClassifBuildUriFile)[0]
$ClassifBuildId = $ClassifBuildVstfsUrl.Substring($ClassifBuildVstfsUrl.LastIndexOf("/") + 1)
#>



<# ====================================================== #>

"$(get-date) - INFO: Done." | Out-Host
