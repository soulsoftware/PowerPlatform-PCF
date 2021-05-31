// 
// Inspired By:
// https://github.com/brasov2de/ColorfulOptionsetGrid/blob/master/ColorfulOptionsetGrid/App/Generic/Hooks/usePaging.tsx
//

import { IDetailsList } from "@fluentui/react/lib/DetailsList";
import React = require("react");

export const useInfiniteScroll = (  
    dataset: ComponentFramework.PropertyTypes.DataSet, 
    detailListRef:React.MutableRefObject<IDetailsList|undefined>,
    pageSize:number, 
    deps?: React.DependencyList ) => {    

    const [currentPage, setCurrentPage] = React.useState<number>(0);
    
    function moveNextPage() {        
        if( dataset.paging.hasNextPage ) {
            const newPage = currentPage + 1
            setCurrentPage(newPage)
            // dataset.paging.loadExactPage(newPage)               
            dataset.paging.loadNextPage()
            return true 
        }   
        return false
    }

    React.useEffect(() => {
        if( dataset.loading ){ 
            setCurrentPage(0)
        }
        else {
            if( currentPage===0 ) { 
                moveNextPage()
            }
            else if( detailListRef?.current && currentPage > 1 ) {
                const ref = detailListRef?.current
                const index = (currentPage-1) * pageSize + 1
    
                setImmediate( () => {
                    console.log( 'scrollToIndex in effect', index  )
                    ref.scrollToIndex( index )
                    ref.focusIndex( index )  
                })  
            }
        }
            
    }, deps);
    
    
    return {
        currentPage,
        moveNextPage
    }
}

export const useExactPaging = (dataset: ComponentFramework.PropertyTypes.DataSet) => {    
      
    const [firstItemNumber, setFirstItemNumber] = React.useState<number>(0);
    const [lastItemNumber, setLastItemNumber] = React.useState<number>();
    const [totalRecords, setTotalRecords] = React.useState<number>();
    const [currentPage, setCurrentPage] = React.useState<number>(0);
    const [pageSize, setPageSize] = React.useState<number>(0);    
               

    React.useEffect(() => {
        if(!dataset.paging.hasPreviousPage){ //first page
            setPageSize(dataset.sortedRecordIds.length);
            setCurrentPage(1);
            setTotalRecords(dataset.paging.totalResultCount);      
        }               
        setFirstItemNumber((currentPage-1) * pageSize + 1);
        setLastItemNumber((currentPage-1) * pageSize + dataset.sortedRecordIds.length )       
    }, [dataset]);

    function moveToFirst() {        
        setCurrentPage(1)
        dataset.paging.loadExactPage(1)
    }

    function movePrevious(){        
        const newPage = currentPage-1;
        setCurrentPage(newPage);
        dataset.paging.loadExactPage(newPage);        
       
    }

    function moveNext(){        
        const newPage = currentPage+1;
        setCurrentPage(newPage);
        dataset.paging.loadExactPage(newPage);                
    }   

    return {       
        
        currentPage,
        firstItemNumber, 
        lastItemNumber, 
        totalRecords, 
        moveToFirst, 
        movePrevious,
        moveNext,       

    }
}