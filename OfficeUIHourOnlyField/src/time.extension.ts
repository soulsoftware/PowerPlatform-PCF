type TimeObject  = { 
    hh:number, 
    mm:number
} 

type Time12Object = TimeObject & { am: boolean } 


declare interface Date {
    getTimeObject():TimeObject
    getTime12Object():Time12Object
    getUTCTimeObject():TimeObject
    getUTCTime12Object():Time12Object

    setUTCTimeObject( t:TimeObject ):void
    setTimeObject( t:TimeObject  ):void

    addMinutes( minutes:number ):Date
    
    toLocaleTimeObjectString(ocales?: string | string[]):string
    
}

Date.prototype.addMinutes = function( minutes:number) {

    const mm = this.getMinutes() + minutes
    const result = new Date( this.getTime() ) 
    result.setMinutes( mm )
    return result
}

Date.prototype.getTime12Object = function() { 

    const result:Time12Object = { hh:this.getHours() - 12, mm:this.getMinutes(), am:false }
    
    if( result.hh === 0 ) {
        result.hh = 12
        result.am = ( result.mm === 0 ) 
    }
    else if( result.hh < 0 ) {
        result.hh = Math.abs(result.hh) 
        result.am = true
    }

    return result 
}

Date.prototype.getTimeObject = function() { 
    return { hh:this.getHours(), mm:this.getMinutes() }  
}

Date.prototype.getUTCTimeObject = function() {  
    return { hh:this.getUTCHours(), mm:this.getUTCMinutes() }  
}

Date.prototype.getUTCTime12Object = function() { 
    const result:Time12Object = { hh:this.getUTCHours() - 12, mm:this.getUTCMinutes(), am:false }
    
    if( result.hh === 0 ) {
        result.hh = 12
        result.am = ( result.mm === 0 ) 
    }
    else if( result.hh < 0 ) {
        result.hh = Math.abs(result.hh) 
        result.am = true
    }

    return result 
}

Date.prototype.setUTCTimeObject = function(t:TimeObject) { 
    this.setUTCHours(t.hh)
    this.setUTCMinutes(t.mm)
} 

Date.prototype.setTimeObject = function(t:TimeObject) { 
    this.setHours(t.hh)
    this.setMinutes(t.mm)
} 


Date.prototype.toLocaleTimeObjectString = function(locales?: string | string[]) {

    let options: Intl.DateTimeFormatOptions = {  
        //weekday: "short", 
        //year: "numeric", 
        //month: "short",  
        //day: "numeric", 
        hour: "2-digit", 
        minute: "2-digit"  
    };  
    
    return this.toLocaleTimeString(locales, options); 

}