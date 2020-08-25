## MACOSX development with the PowerApps Component Framework (PCF)

### Install Office365 CLI

```
npm i -g @pnp/office365-cli
```

### Scaffold a PCF component

from Office365 cli prompt run
```
pa pcf init --name <name> --namespace <namespace> --template <Single|Dataset>
```

set LOCALAPPDATA environment variable
```
export LOCALAPPDATA=<local data folder>
```

## References

* [Cross-platform development with the PowerApps Component Framework](https://blog.yannickreekmans.be/cross-platform-development-with-the-powerapps-component-framework/)
* [PCF component in Canvas App setting](https://www.dancingwithcrm.com/pcf-component-in-canvas-app/  )
