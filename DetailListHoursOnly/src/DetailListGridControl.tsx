import * as React from 'react';
import { Link } from '@fluentui/react/lib/Link';
import { Sticky, StickyPositionType } from '@fluentui/react/lib/Sticky';
import { IRenderFunction, SelectionMode } from '@fluentui/react/lib/Utilities';
import { DetailsListLayoutMode, Selection, IColumn, ConstrainMode, IDetailsHeaderProps, IDetailsFooterProps, DetailsList } from '@fluentui/react/lib/DetailsList';
import { TooltipHost, ITooltipHostProps } from '@fluentui/react/lib/Tooltip';
import { initializeIcons } from '@fluentui/react/lib/icons';
import * as lcid from 'lcid';
import {IInputs} from "./generated/ManifestTypes";
import './time.extension'
import { Stack } from '@fluentui/react/lib/Stack';
import { IconButton } from '@fluentui/react/lib/Button';
import { ScrollablePane, ScrollbarVisibility } from '@fluentui/react/lib/ScrollablePane';
import { Label } from '@fluentui/react/lib/Label';


export interface Pagination {
    readonly currentPage:number;
    readonly pageSize:number;
    readonly firstItemNumber:number;
    readonly lastItemNumber:number;
    moveToFirst():void 
    moveNext():void
    movePrevious():void
    saveState():void

}

export interface IDetailListGridControlProps {
    pcfContext: ComponentFramework.Context<IInputs>,
    isModelApp: boolean,
    dataSetVersion: number,
    pagination:Pagination
    
    entityName?:string

}

type IColumnWidth = number

//Initialize the icons otherwise they will not display in a Canvas app.
//They will display in Model app because Microsoft initializes them in their controls.
initializeIcons();

export const DetailListGridControl: React.FC<IDetailListGridControlProps> = (props) => {                           

    const dataset = props.pcfContext.parameters.sampleDataSet
    
    const [columns, setColumns] = React.useState(getColumns(props));
    const [items, setItems]     = React.useState<Array<any>>( [] /*getItems(columns, props.pcfContext)*/ );

    // react hook to store the number of selected items in the grid which will be displayed in the grid footer.
    const [selectedItemCount, setSelectedItemCount] = React.useState(0);    

    console.log({
        'currentPage':props.pagination.currentPage, 
        'dataset.loading':dataset.loading, 
        'props.dataSetVersion': props.dataSetVersion
    })

    // When the component is updated this will determine if the sampleDataSet has changed.  
    // If it has we will go get the udpated items.
    React.useEffect(() => {
        const result = getItems(columns, props.pcfContext)

        setItems(result)
        
        console.log( 'setItems' )

    }, [props.dataSetVersion])
    
    // When the component is updated this will determine if the width of the control has changed.
    // If so the column widths will be adjusted.
    // React.useEffect(() => 
    //     setColumns(updateColumnWidths(columns, props.pcfContext)), [props.pcfContext.mode.allocatedWidth])      

    // the selector used by the DetailList
    const _selection = new Selection({
        onSelectionChanged: () => _setSelectedItemsOnDataSet()
    }); 
    
    // sets the selected record id's on the Dynamics dataset.
    // this will allow us to utilize the ribbon buttons since they need
    // that data set in order to do things such as delete/deactivate/activate/ect..
    const _setSelectedItemsOnDataSet = () => {
        let selections = _selection.getSelection();
        let selectedKeys = selections.map( s => s.key as string)

        setSelectedItemCount(selectedKeys.length);
        
        dataset.setSelectedRecordIds(selectedKeys);
    }      

    // when a column header is clicked sort the items
    const _onColumnClick = (ev?: React.MouseEvent<HTMLElement>, column?: IColumn): void => {
        let isSortedDescending = column?.isSortedDescending
    
        // If we've sorted this column, flip it.
        if (column?.isSorted) {
          isSortedDescending = !isSortedDescending
        }

        console.log( '_onColumnClick', column?.fieldName, isSortedDescending )

        // Reset the items and columns to match the state.
        const updateSortingInfo = (col: IColumn ) => {
            col.isSorted = col.key === column?.key
            col.isSortedDescending = isSortedDescending
        }
        columns.forEach( updateSortingInfo )

        const sortedItems = copyAndSort(items, column?.fieldName!, props.pcfContext, isSortedDescending)

        setItems( sortedItems )

        console.log( 'setItems Sorted' )
    }      
    
    const _onRenderDetailsHeader = (props: IDetailsHeaderProps | undefined, defaultRender?: IRenderFunction<IDetailsHeaderProps>): JSX.Element => {
  
        return (
            <Sticky stickyPosition={StickyPositionType.Header} isScrollSynced={true}>
                {defaultRender!({
                    ...props!,
                    onRenderColumnHeaderTooltip: (tooltipHostProps: ITooltipHostProps | undefined) => <TooltipHost {...tooltipHostProps} />
                })}
            </Sticky>
        )
    }      

    const _onRenderDetailsFooter = (footerProps: IDetailsFooterProps | undefined, defaultRender?: IRenderFunction<IDetailsFooterProps>): JSX.Element => {

        // const totalResultCount = items.length
        // const totalResultCount = dataset.sortedRecordIds.length
        const totalResultCount = dataset.paging.totalResultCount
        //const selectedItemCount = dataset.getSelectedRecordIds().length

        const totalRecordsString = (totalResultCount > 0 ) ? ` of ${totalResultCount}` : `  `

        // return (
        //     <Sticky stickyPosition={StickyPositionType.Footer} isScrollSynced={true} stickyBackgroundColor={'white'}>
        //         <Label className="footer-item">Records: {totalResultCount} ({selectedItemCount} selected)</Label>               
        //     </Sticky>
        // )
        return (
        <Sticky stickyPosition={StickyPositionType.Footer} isScrollSynced={true} stickyBackgroundColor={'white'}>
        <Stack grow horizontal horizontalAlign="space-between" styles={ { root: {  paddingLeft: 5} } } >
            <Stack.Item>
                <Stack grow horizontal horizontalAlign="space-between" verticalAlign="center">
                    <Label className="footer-item">{props.pagination.firstItemNumber} - {props.pagination.lastItemNumber} {totalRecordsString} with {selectedItemCount} selected</Label>
                    <Stack.Item grow={1} align="center" >
                        <IconButton iconProps={{ iconName: "ChevronLeftEnd6"}} onClick={ () => props.pagination.moveToFirst() } disabled={!dataset.paging.hasPreviousPage}/>
                        <IconButton iconProps={{ iconName: "ChevronLeftSmall"}} onClick={ () => props.pagination.movePrevious() } disabled={!dataset.paging.hasPreviousPage}/>
                    </Stack.Item>
                    <Label className="footer-item">page {props.pagination.currentPage}</Label>
                    <Stack.Item grow={1} align="center">
                        <IconButton iconProps={{ iconName: "ChevronRightSmall" }} onClick={ () => props.pagination.moveNext() } disabled={!dataset.paging.hasNextPage}/>
                    </Stack.Item>
                </Stack>
            </Stack.Item>
        </Stack> 
        </Sticky> )
    }
      
    const _onItemInvoked = (item?: any, index?: number, ev?: Event) => {
        props.pagination.saveState()
        dataset.openDatasetItem(item[ `_primary_ref`])
    }

    return (   
        <ScrollablePane scrollbarVisibility={ScrollbarVisibility.auto}>
            <DetailsList                
                items={items}
                columns={columns}
                setKey="set"                                                                                         
                selection={_selection} // updates the dataset so that we can utilize the ribbon buttons in Dynamics                                        
                onColumnHeaderClick={_onColumnClick} // used to implement sorting for the columns.                    
                selectionPreservedOnEmptyClick={true}
                ariaLabelForSelectionColumn="Toggle selection"
                ariaLabelForSelectAllCheckbox="Toggle selection for all items"
                checkButtonAriaLabel="Row checkbox"                        
                selectionMode={SelectionMode.single}
                layoutMode = {DetailsListLayoutMode.fixedColumns}
                constrainMode={ConstrainMode.unconstrained}
                onRenderDetailsHeader={_onRenderDetailsHeader}
                onRenderDetailsFooter={_onRenderDetailsFooter}
                onItemInvoked={_onItemInvoked}
                />               
        </ScrollablePane>
    );
}

// navigates to the record when user clicks the link in the grid.
const navigate = (item: any, linkReference: string | undefined, props: IDetailListGridControlProps) =>  {    
    props.pagination.saveState()
    props.pcfContext.parameters.sampleDataSet.openDatasetItem(item[ `${linkReference}_ref`])


}

// get the items from the dataset
const getItems = (columns: IColumn[], pcfContext: ComponentFramework.Context<IInputs>) => {
    const dataSet = pcfContext.parameters.sampleDataSet

    console.log( 'dataSet.sortedRecordIds.length', dataSet.sortedRecordIds.length)

    const resultSet = dataSet.sortedRecordIds.map( (key,index) => {
        const record = dataSet.records[key];
        const newRecord: any = {
            key: record.getRecordId()
        };

        for (let column of columns)
        {                
            newRecord[column.key] = record.getFormattedValue(column.key)
            if (isEntityReference(record.getValue(column.key)))
            {
                const ref = record.getValue(column.key) as ComponentFramework.EntityReference;
                newRecord[`${column.key}_ref`] = ref;
            }
            else if(column.data.isPrimary)
            {
                // newRecord[column.key] = `${index}) - ${record.getFormattedValue(column.key)}`
                newRecord[column.key] = record.getFormattedValue(column.key)
                newRecord[`${column.key}_ref`] = record.getNamedReference();
            }
        }  
        newRecord['_primary_ref'] = record.getNamedReference()     

        return newRecord;
    });          
    
    return resultSet;
}  

 // get the columns from the dataset
const getColumns = (props: IDetailListGridControlProps ) : IColumn[] => {
    let dataSet = props.pcfContext.parameters.sampleDataSet;
    
    // let columnWidthDistribution = getColumnWidthDistribution(props.pcfContext);

    const defaultDate = new Date( 1899, 11, 31, 0, 0)

    const isDefaultDate = ( dt:Date ) => 
        ( defaultDate.getFullYear()===dt.getFullYear() && 
            defaultDate.getMonth()===dt.getMonth() && 
            defaultDate.getDate()===dt.getDate())
    
    const toDate = ( itemValue:any|undefined ):Date|undefined => {
        
        if( itemValue ) {
            if( itemValue instanceof Date ) 
                return itemValue
            else if( typeof(itemValue) === 'string' ) {
                try {
                    return new Date(itemValue)
                }
                catch( err ) {
                    console.error( 'value is a not valid date', itemValue, err)
                }
            }    
        }

    }

    const isCustomField = ( fieldName:string ) => {
        if( props.entityName ) {
            const name_parts = props.entityName.split('_')

            return ( name_parts.length > 1 ) ? 
                    fieldName.startsWith( name_parts[0] ) : false
    
        }
    }
  
    return dataSet.columns.map( (column,index) => { 

        const iColumn: IColumn = {
            className:      'detailList-cell',
            // headerClassName:'detailList-gridLabels',
            key:            column.name,
            name:           column.displayName,
            fieldName:      column.alias,
            minWidth:       column.visualSizeFactor, 
            maxWidth:       column.visualSizeFactor + Math.floor( column.visualSizeFactor * 0.33 ),
            // currentWidth:   column.visualSizeFactor,
            isResizable:    true,
            isPadded:       true,
            data:           {isPrimary : column.isPrimary},
            sortAscendingAriaLabel: 'Sorted A to Z',
            sortDescendingAriaLabel:'Sorted Z to A',
        }

        //create links for primary field and entity reference.            
        if (column.dataType.startsWith('Lookup.') || column.isPrimary)
        {
            iColumn.onRender = (item: any, index: number | undefined, column: IColumn | undefined)=> (                                    
                <Link key={item.key} onClick={() => navigate(item, column!.fieldName, props) }>{item[column!.fieldName!]}</Link>                    
            );
        }
        else if(column.dataType === 'SingleLine.Email'){
            iColumn.onRender = (item: any, index: number | undefined, column: IColumn | undefined)=> (                                    
                <Link href={`mailto:${item[column!.fieldName!]}`} >{item[column!.fieldName!]}</Link>  
            );
        }
        else if(column.dataType === 'SingleLine.Phone'){
            iColumn.onRender = (item, index: number | undefined, column: IColumn | undefined)=> (                                    
                <Link href={`skype:${item[column!.fieldName!]}?call`} >{item[column!.fieldName!]}</Link>                    
            );
        }
        else if(column.dataType === 'DateAndTime.DateAndTime' ){
            
            iColumn.onRender = (item, index: number | undefined, column: IColumn | undefined)=> {

                const itemValue = item[column!.fieldName!]
                
                console.log( column!.fieldName!, itemValue)

                const dt = toDate( itemValue )

                let value = ( dt && isDefaultDate(dt) ) ? 
                    //dt.toTimeZoneIndependentString( { hour12:true } ) : itemValue
                    dt.toTimeZoneDependentString( { hour12:true } ) : itemValue

                return ( <div>{value}</div> )
            }

        }

        //set sorting information
        let isSorted = dataSet?.sorting?.findIndex( s => s.name === column.name) !== -1 || false
        iColumn.isSorted = isSorted;
        if (isSorted){
            iColumn.isSortedDescending = dataSet?.sorting?.find( s => s.name === column.name)?.sortDirection === 1 || false;
        }

        return iColumn
    })
}   

//sort the items in the grid.
const copyAndSort = <T, >(items: T[], columnKey: string, pcfContext: ComponentFramework.Context<IInputs>, isSortedDescending?: boolean): T[] =>  {
    let key = columnKey as keyof T;
    let sortedItems = items.slice(0);     
    
    const predicate = (a: T, b: T) => {

        const valueA = String(a[key]) || ''
        const valueB = String(b[key]) || ''

        const result = valueA.localeCompare( valueB, getUserLanguage(pcfContext), { numeric: true } )
        // console.log( `compare('${valueA}', '${valueB}') = ${result} `)
        
        return ( isSortedDescending ) ? result * -1 : result
    
    }

    sortedItems.sort( predicate);

    // if (isSortedDescending) {
    //     sortedItems.reverse();
    // }

    return sortedItems;
}

const getUserLanguage = (pcfContext: ComponentFramework.Context<IInputs>): string => {
    const language = lcid.from(pcfContext.userSettings.languageId);
    return language.substring(0, language.indexOf('_'));
} 

// determine if object is an entity reference.
const isEntityReference = (obj: any): obj is ComponentFramework.EntityReference => {
    return typeof obj?.etn === 'string';
}

