import * as React from 'react';
import { Link } from '@fluentui/react/lib/Link';
import { Label } from '@fluentui/react/lib/Label';
import { ScrollablePane, ScrollbarVisibility } from '@fluentui/react/lib/ScrollablePane';
import { Sticky, StickyPositionType } from '@fluentui/react/lib/Sticky';
import { IRenderFunction, SelectionMode } from '@fluentui/react/lib/Utilities';
import { DetailsListLayoutMode, Selection, IColumn, ConstrainMode, IDetailsHeaderProps, IDetailsFooterProps, DetailsList } from '@fluentui/react/lib/DetailsList';
import { TooltipHost, ITooltipHostProps } from '@fluentui/react/lib/Tooltip';
import { initializeIcons } from '@fluentui/react/lib/icons';
import * as lcid from 'lcid';
import {IInputs} from "./generated/ManifestTypes";
import './time.extension'
import { IDetailsRowProps } from '@fluentui/react/lib/DetailsList';
import { useInfiniteScroll } from './hooks/paging';
import { ShimmeredDetailsList } from '@fluentui/react/lib/ShimmeredDetailsList';
import { IDetailsList } from '@fluentui/react/lib/DetailsList';

const USE_SHIMMEREDLIST = false

export interface IDetailListGridControlProps {
    pcfContext: ComponentFramework.Context<IInputs>,
    isModelApp: boolean,
    dataSetVersion: number,
    pageSize:number
    entityName?:string
}

type IColumnWidth = number

//Initialize the icons otherwise they will not display in a Canvas app.
//They will display in Model app because Microsoft initializes them in their controls.
initializeIcons();

export const DetailListGridControl: React.FC<IDetailListGridControlProps> = (props) => {                           
    
    const dataset = props.pcfContext.parameters.sampleDataSet
    const detailListRef = React.useRef<IDetailsList>()

    const [columns, setColumns] = React.useState(getColumns(props.pcfContext, props.entityName));
    const [items, setItems] = React.useState(getItems(columns, props.pcfContext));
    // react hook to store the number of selected items in the grid which will be displayed in the grid footer.
    const [selectedItemCount, setSelectedItemCount] = React.useState(0);    
    
    // When the component is updated this will determine if the sampleDataSet has changed.  
    // If it has we will go get the udpated items.
    React.useEffect(() => {
        //console.log('TSX: props.dataSetVersion was updated');        
        setItems(getItems(columns, props.pcfContext));
    
    }, [props.dataSetVersion]);  
    
    // When the component is updated this will determine if the width of the control has changed.
    // If so the column widths will be adjusted.
    React.useEffect(() => {
        //console.log('width was updated');
        setColumns(updateColumnWidths(columns, props.pcfContext));
        }, [props.pcfContext.mode.allocatedWidth]);        
    

    const { currentPage, moveNextPage } = 
        useInfiniteScroll(dataset, detailListRef, props.pageSize, [items])

    console.log( 'currentPage', currentPage )

    // the selector used by the DetailList
    const _selection = new Selection({
        onSelectionChanged: () => _setSelectedItemsOnDataSet()
    }); 
    
    // sets the selected record id's on the Dynamics dataset.
    // this will allow us to utilize the ribbon buttons since they need
    // that data set in order to do things such as delete/deactivate/activate/ect..
    const _setSelectedItemsOnDataSet = () => {
        let selectedKeys = [];
        let selections = _selection.getSelection();
        for (let selection of selections)
        {
            selectedKeys.push(selection.key as string);
        }
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

        // Reset the items and columns to match the state.
        setItems(copyAndSort(items, column?.fieldName!, props.pcfContext, isSortedDescending))
        setColumns(
            columns.map(col => {
                col.isSorted = col.key === column?.key
                col.isSortedDescending = isSortedDescending
                return col
            })
        );
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

    const _onRenderDetailsFooter = (props: IDetailsFooterProps | undefined, defaultRender?: IRenderFunction<IDetailsFooterProps>): JSX.Element => {

        // const totalResultCount = items.length
        // const totalResultCount = pcfctx.parameters.sampleDataSet.paging.totalResultCount
        const totalResultCount = dataset.sortedRecordIds.length

        return (
            <Sticky stickyPosition={StickyPositionType.Footer} isScrollSynced={true} stickyBackgroundColor={'white'}>
                <Label className="footer-item">Records: {totalResultCount} ({selectedItemCount} selected)</Label>               
            </Sticky>
        )
    }      

    const _onRenderMissingItem = (index?: number | undefined, rowProps?: IDetailsRowProps | undefined) => {

        console.log( 'onRenderMissingItem', index )

        moveNextPage()

        return null
    }

    const _onRenderCustomPlaceholder = (rowProps: IDetailsRowProps, index?: number, defaultRender?: (props: IDetailsRowProps) => React.ReactNode)  => {

        console.log( 'onRenderCustomPlaceholder', index )

        moveNextPage()

        return defaultRender!( rowProps )

    }
       
    const DetailsListControl = () => {
        if( USE_SHIMMEREDLIST ) {
            return (
                <ShimmeredDetailsList
                    enableShimmer={dataset.loading}
                    items={items}
                    columns={columns}
                    setKey="set"                                                                                         
                    selection={_selection} // updates the dataset so that we can utilize the ribbon buttons in Dynamics                                        
                    onColumnHeaderClick={_onColumnClick} // used to implement sorting for the columns.                    
                    selectionPreservedOnEmptyClick={true}
                    ariaLabelForSelectionColumn="Toggle selection"
                    ariaLabelForSelectAllCheckbox="Toggle selection for all items"
                    checkButtonAriaLabel="Row checkbox"                        
                    selectionMode={SelectionMode.multiple}
                    layoutMode = {DetailsListLayoutMode.justified}
                    constrainMode={ConstrainMode.unconstrained}
                    onRenderDetailsHeader={_onRenderDetailsHeader}
                    onRenderDetailsFooter={_onRenderDetailsFooter}
                    onRenderCustomPlaceholder={_onRenderCustomPlaceholder}
                    componentRef={ (ref) => detailListRef.current = ref! }
                />      

            )
        }
        else {
            return <DetailsList                
                items={items}
                columns={columns}
                setKey="set"                                                                                         
                selection={_selection} // updates the dataset so that we can utilize the ribbon buttons in Dynamics                                        
                onColumnHeaderClick={_onColumnClick} // used to implement sorting for the columns.                    
                selectionPreservedOnEmptyClick={true}
                ariaLabelForSelectionColumn="Toggle selection"
                ariaLabelForSelectAllCheckbox="Toggle selection for all items"
                checkButtonAriaLabel="Row checkbox"                        
                selectionMode={SelectionMode.multiple}
                layoutMode = {DetailsListLayoutMode.justified}
                constrainMode={ConstrainMode.unconstrained}
                onRenderDetailsHeader={_onRenderDetailsHeader}
                onRenderDetailsFooter={_onRenderDetailsFooter}
                onRenderMissingItem={_onRenderMissingItem}
                componentRef={ (ref) => detailListRef.current = ref! }
            />      

        }
    }
    return (   
        <ScrollablePane scrollbarVisibility={ScrollbarVisibility.auto}>
            <DetailsListControl/>           
        </ScrollablePane>
    );
};

// navigates to the record when user clicks the link in the grid.
const navigate = (item: any, linkReference: string | undefined, pcfContext: ComponentFramework.Context<IInputs>) =>        
    pcfContext.parameters.sampleDataSet.openDatasetItem(item[ `${linkReference}_ref`])

// get the items from the dataset
const getItems = (columns: IColumn[], pcfContext: ComponentFramework.Context<IInputs>) => {
    const dataSet = pcfContext.parameters.sampleDataSet

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
                newRecord[column.key] = `${index}) - ${record.getFormattedValue(column.key)}`
                newRecord[`${column.key}_ref`] = record.getNamedReference();
            }
        }            

        return newRecord;
    });          
    
    if( !USE_SHIMMEREDLIST ) {
        if( dataSet.paging.hasNextPage ) {
            console.log( 'add null row for trigger "onMissingItem"')
            resultSet.push( null )
        }
    }

    return resultSet;
}  

 // get the columns from the dataset
const getColumns = (pcfContext: ComponentFramework.Context<IInputs>, entityName?:string ) : IColumn[] => {
    let dataSet = pcfContext.parameters.sampleDataSet;
    

    let columnWidthDistribution = getColumnWidthDistribution(pcfContext);

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
        if( entityName ) {
            const name_parts = entityName.split('_')

            return ( name_parts.length > 1 ) ? 
                    fieldName.startsWith( name_parts[0] ) : false
    
        }
    }
  
    return dataSet.columns.map( (column,index) => { 

        const iColumn: IColumn = {
            className:      'detailList-cell',
            headerClassName:'detailList-gridLabels',
            key:            column.name,
            name:           column.displayName,
            fieldName:      column.alias,
            // currentWidth:   column.visualSizeFactor,
            minWidth:       column.visualSizeFactor,                
            // maxWidth:       columnWidthDistribution[index],
            isResizable:    true,
            data:           {isPrimary : column.isPrimary},
            sortAscendingAriaLabel: 'Sorted A to Z',
            sortDescendingAriaLabel:'Sorted Z to A',
        }

        // console.table( [{
        //         'name': column.name,
        //         'displayName': column.displayName, 
        //         'type': column.dataType, 
        //         'isPrimary': column.isPrimary,
        //         'isCustom': isCustomField(column.name),
        //         'visualSizeFactor':column.visualSizeFactor, 
        //         'maxWidth':columnWidthDistribution[index]
        // }])

        //create links for primary field and entity reference.            
        if (column.dataType.startsWith('Lookup.') || column.isPrimary)
        {
            iColumn.onRender = (item: any, index: number | undefined, column: IColumn | undefined)=> (                                    
                <Link key={item.key} onClick={() => navigate(item, column!.fieldName, pcfContext) }>{item[column!.fieldName!]}</Link>                    
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

const getColumnWidthDistribution = (pcfContext: ComponentFramework.Context<IInputs>): IColumnWidth[] => {
        
    let columnsOnView = pcfContext.parameters.sampleDataSet.columns;

    let widthDistribution = Array<IColumnWidth>(columnsOnView.length);

    // Considering need to remove border & padding length
    let totalWidth:number = pcfContext.mode.allocatedWidth - 250;
    //console.log(`new total width: ${totalWidth}`);
    
    let widthSum = columnsOnView.reduce( (result, columnItem) => result + columnItem.visualSizeFactor, 0)

    let remainWidth = totalWidth;
    
    columnsOnView.forEach((item, index) => {
        let widthPerCell = 0;
        if (index !== columnsOnView.length - 1) {
            let cellWidth = Math.round((item.visualSizeFactor / widthSum) * totalWidth);
            remainWidth = remainWidth - cellWidth;
            widthPerCell = cellWidth;
        }
        else {
            widthPerCell = remainWidth;
        }
        widthDistribution[index] = widthPerCell
    });

    return widthDistribution;

}

// Updates the column widths based upon the current side of the control on the form.
const updateColumnWidths = (columns: IColumn[], pcfContext: ComponentFramework.Context<IInputs>) : IColumn[] => {
    let columnWidthDistribution = getColumnWidthDistribution(pcfContext);        
    let currentColumns = columns;    

    //make sure to use map here which returns a new array, otherwise the state/grid will not update.
    return currentColumns.map( (col,index) => {           
        col.maxWidth = columnWidthDistribution[index]
        return col;
    });        
}

//sort the items in the grid.
const copyAndSort = <T, >(items: T[], columnKey: string, pcfContext: ComponentFramework.Context<IInputs>, isSortedDescending?: boolean): T[] =>  {
    let key = columnKey as keyof T;
    let sortedItems = items.slice(0);        
    sortedItems.sort((a: T, b: T) => (a[key] || '' as any).toString().localeCompare((b[key] || '' as any).toString(), getUserLanguage(pcfContext), { numeric: true }));

    if (isSortedDescending) {
        sortedItems.reverse();
    }

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