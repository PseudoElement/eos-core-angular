$ErrorActionPreference = "Stop"

# начальная инициализация переменных
$env:BuildRootDir = Join-Path (Split-Path -Parent $MyInvocation.MyCommand.Path) '..'  # корневая директория сборки; задается относительно этого скрипта; используется ci для вычисления относительных путей

# подключение модулей
if ($null -eq (Get-Module Eos.Init -ListAvailable)) { $env:PSModulePath += ";$env:EosSdk\PSModules" }
Import-Module Eos.Init; Import-EosSdkModules -Version "1.0"

# принудительная трассировка для локальной сборки
if ("$env:AGENT_OS" -eq "") { $env:SYSTEM_DEBUG = $true }

# сборка
try {
    try {
        Invoke-Log-Command {CI-Initialize "$env:BuildRootDir\_CI\settings.json"}

        Invoke-Log-Command {CI-Use-PipelineBoard}
        
	    Invoke-Log-Command { Npm-Set-Version NODEJS14 -UseAnyOnFail:$("$env:AGENT_OS" -eq "") }

        Invoke-Log-Command { Npm-Install -UseCI -Project "$env:BuildRootDir" }
        Invoke-Log-Command { Npm-Run 'build-prod' -Project "$env:BuildRootDir" }
    }

    # вывод ошибок сборки
    catch {
        $PSItem.Exception.Message, "", $PSItem.ScriptStackTrace | Log ERR
        throw
    }
    # должно быть сформировано даже при ошибках сборки!
    finally {
        Invoke-Log-Command { CI-Publish-Artifact "$env:BuildRootDir\_CI\artifacts.json" }
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