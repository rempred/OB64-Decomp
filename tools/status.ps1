param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]] $StatusArguments
)

$ErrorActionPreference = 'Stop'
$repositoryRoot = Split-Path -Parent $PSScriptRoot
$contract = Get-Content -LiteralPath (Join-Path $repositoryRoot 'config/phase7/conventional-build.json') -Raw | ConvertFrom-Json
$runtimeFolder = 'node-' + $contract.host.nodeVersion + '-win-x64'
$nodePath = Join-Path $repositoryRoot ('.toolchains/' + $runtimeFolder + '/node.exe')
if (-not (Test-Path -LiteralPath $nodePath -PathType Leaf)) {
    throw "Provision the pinned Node runtime at $nodePath before checking status."
}
$nodeStream = [System.IO.File]::OpenRead($nodePath)
$algorithm = [System.Security.Cryptography.SHA256]::Create()
try {
    $nodeHash = [System.BitConverter]::ToString($algorithm.ComputeHash($nodeStream)).Replace('-', '')
} finally {
    $nodeStream.Dispose()
    $algorithm.Dispose()
}
if ($nodeHash -ne $contract.host.nodeExeSha256) {
    throw "The Node runtime at $nodePath does not match the configured identity."
}
& $nodePath (Join-Path $PSScriptRoot 'status.js') @StatusArguments
exit $LASTEXITCODE
