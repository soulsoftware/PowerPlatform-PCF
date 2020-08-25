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

* Articles
    * [Cross-platform development with the PowerApps Component Framework](https://blog.yannickreekmans.be/cross-platform-development-with-the-powerapps-component-framework/)
    * [PCF component in Canvas App setting](https://www.dancingwithcrm.com/pcf-component-in-canvas-app/  )
* Microsoft Learning Path
    * [Create components with Power Apps Component Framework](https://docs.microsoft.com/en-us/learn/paths/use-power-apps-component-framework/)
* POWERFulDevs 2020 episodes
    * [Javascript loves PCF](https://channel9.msdn.com/Shows/POWERful-Devs/JavaScript-Loves-PCF)
    * [Get Started with Power Apps Component Framework PCF](https://channel9.msdn.com/Shows/POWERful-Devs/Get-Started-with-Power-Apps-Component-Framework-PCF)
