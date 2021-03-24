Directory for tools which contain all the project templates that would be supported.

If there is any change in the project template folder:

1. Please make sure to update copyTemplates task in bolt.csproj to either include or exclude the updated files.
2. Please make sure to update TemplateContent section in corresponding .vstemplate file to either include or exclude the updated files.
3. Virtual dataset template and virtual field template are not part of vs template. To enable these template type please follow the above two steps.