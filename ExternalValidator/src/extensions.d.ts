declare namespace ComponentFramework {

    interface Mode {
		// If used as 'Subgrid' contains the value sei in 'Maximum number of rows'
        rowSpan?:number
    }

    interface Page {
        appId: string
        entityId: string|null
        entityTypeName: string
        getClientUrl: () => string
        isPageReadOnly: boolean
    }

    interface Reporting {
        _controlId: string
    }

    interface Context<TInputs> {
        page?:Page
        reporting?:Reporting

    }
}