
$environmenturl=$args[0]
((Get-Content -path "./BPF-API.swagger.json" -Raw) -replace '<environmenturl>',$environmenturl) | Set-Content -Path "bin/BPF-API.swagger.json"
