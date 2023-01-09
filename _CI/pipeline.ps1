$ErrorActionPreference = "Stop"

# начальная инициализация переменных
$PipelineWorkDir = Join-Path (Split-Path -Parent $MyInvocation.MyCommand.Path) '..'  # локальный аналог маппинга в рабочую директорию (относительно этого скрипта)

# подключение модулей
if ($null -eq (Get-Module Eos.Init -ListAvailable)) { $env:PSModulePath += ";$env:EosSdk\PSModules" }
Import-EosSdkModules -Version "1.0"

# принудительная трассировка для локальной сборки
if ("$env:AGENT_OS" -eq "") { $env:SYSTEM_DEBUG = $true }

# сборка
try {
    try {
        Invoke-Log-Command { CI-Initialize "$PipelineWorkDir\_CI\settings.json" }
        Invoke-Log-Command { Npm-Set-Version NODEJS14 -UseAnyOnFail:$("$env:AGENT_OS" -eq "") }

        Invoke-Log-Command { CI-Use-PipelineBoard }

        Invoke-Log-Command { Npm-Install -UseCI -Project "$PipelineWorkDir" }
        Invoke-Log-Command { Npm-Run 'build-prod' -Project "$PipelineWorkDir" }
    }

    # вывод ошибок сборки
    catch {
        $PSItem.Exception.Message, "", $PSItem.ScriptStackTrace | Log ERR
        throw
    }
    # должно быть сформировано даже при ошибках сборки!
    finally {
        Invoke-Log-Command { CI-Publish-Artifact @{
            "$PipelineWorkDir\dist" = 'BuildResult\classif'
            }
        }
    }

    Invoke-Log-Command { CI-Finalize } # должно быть самым последним (выполняться только при успешной сборке)!

}
# общий вывод ошибок
catch {
    $PSItem.Exception.Message, "", $PSItem.ScriptStackTrace | Log ERR
    throw
}
finally {
    Press-Any-Key
}