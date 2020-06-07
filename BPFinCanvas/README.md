## Using Business Process Flows in a Canvas App

inspired by this [Blog Post](https://powerapps.microsoft.com/en-us/blog/using-business-process-flows-in-a-canvas-app/)

### Getting started

1. Setting **environmenturl** in swagger file
    > Open from Powerapps console `Settings/Admin Center` select your environment and in `Details` panel copy the `Environment Url`. Then open `BPF-API.swagger.json` and replace all occurrence of `<environmenturl>` placeholder with value of `Environment Url` previously copied.
1. Registering an application in the Microsoft Azure Portal.
    >  Sign into the https://portal.azure.com with an account that has permissions to make Azure Active Directory applications. and follow article [here](https://docs.microsoft.com/en-us/powerapps/developer/common-data-service/walkthrough-register-app-azure-active-directory).  
    > **Note:**
    > Add the connector auto generated `Redirect URL` to the Azure Active Directory application in `Authentication/Web Platform/Redirect URIs`
1. Setting OAuth 2.0 `Resource Url`
    > After import `BPF-API.swagger.json` as custom connector in `Security` panel on `OAuth 2.0` section set `Resource URL` equals to `Environment Url` got in the step 1

### References

* [HOW TO: Register app in azure active directory](https://docs.microsoft.com/en-us/powerapps/developer/common-data-service/walkthrough-register-app-azure-active-directory)
* [HOW TO: Make a custom connector for PowerApps and Flow that calls the Microsoft Graph API](https://toddbaginski.com/blog/how-to-make-a-custom-connector-for-powerapps-and-flow-that-calls-the-microsoft-graph-api/)


[Register app in azure active directory]: (https://docs.microsoft.com/en-us/powerapps/developer/common-data-service/walkthrough-register-app-azure-active-directory)
