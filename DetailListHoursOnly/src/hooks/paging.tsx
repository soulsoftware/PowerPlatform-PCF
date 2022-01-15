// 
// Inspired By:
// https://github.com/brasov2de/ColorfulOptionsetGrid/blob/master/ColorfulOptionsetGrid/App/Generic/Hooks/usePaging.tsx
//

import React = require("react");

export interface InfiniteScrolling {
    readonly currentPage:number;
    moveToNextPage(formIndex:number):boolean 
    currentScrollIndex( cb:(index:number) => void ):void

}

/**
 * 
 */
 class InfiniteScrollingImpl implements InfiniteScrolling {
	private _currentPage = 1
	private _lastIndex = 0
	private _lastScrollIndex = 0

	constructor( private _dataset: ComponentFramework.PropertyTypes.DataSet, private _pageSize:number ) {
		_dataset.paging.setPageSize(_pageSize);
	}
	
	get currentPage() { 

		// console.log( 'dataset.sortedRecordIds.length', dataset.sortedRecordIds.length )
		if( this._dataset.sortedRecordIds.length <= this._pageSize ) {
			this._currentPage = 1
		}
		return this._currentPage 
	}

	private get _scrollIndex() { 
		return (this._currentPage-1) * this._pageSize + 1 
	}

	currentScrollIndex( cb:(index:number) => void ) {
		const index = this._scrollIndex

        if( this.currentPage > 1 && index > this._lastScrollIndex ) {
            
            this._lastScrollIndex = index

            setImmediate( cb, index )

			return true
        }   
		return false
	}

	moveToNextPage( fromIndex:number) { 
			
		const paging = this._dataset.paging

		if( paging.hasNextPage && fromIndex > this._lastIndex ) {

			this._lastIndex = fromIndex
			this._currentPage++
			paging.loadNextPage()
			return true 
			
		}
		return false
	
	}

}

export const useInfiniteScroll = ( dataset:ComponentFramework.PropertyTypes.DataSet, pagesize:number ) => {
    const [ is ] = React.useState( () => (new InfiniteScrollingImpl(dataset, pagesize) ) )
    const ref = React.useRef( is )

    return ref
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