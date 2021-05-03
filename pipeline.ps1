$ErrorActionPreference = "Stop"

# импорт модулей
if ($null -eq (Get-Module Eos.CI -ListAvailable)) { $env:PSModulePath += ";$env:EosSdk\PSModules" }
Import-EosSdkModules -Version "1.0"

# принудительная трассировка для локальной сборки
if ("$env:AGENT_OS" -eq "") { $env:SYSTEM_DEBUG = $true }

# сборка
try {
    try {
        Invoke-Log-Command { CI-Initialize }

        Invoke-Log-Command { Npm-Install -UseCI }
        Invoke-Log-Command { Npm-Run 'build-prod' }
    }
    # вывод ошибок сборки
    catch {
        $PSItem.Exception.Message, "", $PSItem.ScriptStackTrace | Log ERR
        throw
    }
    # должно быть сформировано даже при ошибках сборки!
    finally {
        Invoke-Log-Command { CI-Build-History }

        Invoke-Log-Command { CI-Publish-Artifact @{
                'dist'  = 'BuildResult\dist'
            } }
    }

    Invoke-Log-Command {CI-Publish-BuildUri} # должно быть самым последним (выполняться только при успешной сборке)!
}
# общий вывод ошибок
catch {
    $PSItem.Exception.Message, "", $PSItem.ScriptStackTrace | Log ERR
    throw
}
finally {
    Press-Any-Key
}