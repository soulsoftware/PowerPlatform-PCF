declare namespace ComponentFramework {

    interface Mode {
		// If used as 'Subgrid' contains the value sei in 'Maximum number of rows'
        rowSpan?:number
    }

    /**
     * The entire property bag interface available to control via Context Object
     */
    interface Context<TInputs> {
            // @autoExpand: Not documented, but it seems to be the check box: 
            // “Automatically expand to use available space”
            parameters: TInputs & { autoExpand?:ComponentFramework.PropertyTypes.TwoOptionsProperty };
    }

    namespace PropertyHelper {

        namespace DataSetApi {

            interface Paging {

                loadExactPage( pageIndex:number ):void
                readonly pageSize?:number
            }
        }
    }

}