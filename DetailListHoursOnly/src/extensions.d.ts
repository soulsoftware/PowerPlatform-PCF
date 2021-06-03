declare namespace ComponentFramework {

    interface Mode {
		// If used as 'Subgrid' contains the value sei in 'Maximum number of rows'
        rowSpan?:number
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