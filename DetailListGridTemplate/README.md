## Goal

This project provide a template to develop a custom view in [Power Platform](https://powerplatform.microsoft.com/en-us/) [Model Driven Application](https://docs.microsoft.com/en-us/powerapps/maker/model-driven-apps/model-driven-app-overview)


This project is a combination of projects below

* [DetailListGrid](https://github.com/rwilson504/PCFControls/tree/master/DetailListGrid) 
  > Reused the code
* [pcf-template-dataset](https://github.com/rajyraman/pcf-template-dataset)  
  > Reused the actions

## The Control

![DetailsList Grid Control](https://github.com/rwilson504/Blogger/blob/master/Office-Fabric-UI-DetailsList-PCF/office-fabric-ui-detailslist.gif?raw=true)

Allows you to simulate the out of the box grid and subgrid controls using the Office-UI-Fabric DetailsList control.  It was built to provide a springboard when you need a customizable grid experience.  This component re-creates a mojority of the capabilities available out of the box in less than 300 lines of code and demonstrates the following: 

* Using the DataSet within a React functional component.
* Displaying and sorting data within the Office-UI-Fabric DetailsList component.
* Rendering custom formats for data with the DetailsList component such as links for Entity References, email addresses, and phone numbers.
* Displaying field data for related entities.
* React Hooks - the component uses both useState and useEffect.
* Loading more than 5k records in DataSet.
* Retaining the use of the standard ribbon buttons by using the setSelectedRecordIds function on the DataSet.
* Detecting and responding to control width updates.