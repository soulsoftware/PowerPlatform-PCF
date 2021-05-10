type TimeObject  = { 
    hh:number, 
    mm:number
} 

type Time12Object = TimeObject & { am: boolean } 


declare interface Date {
    getTimeObject():TimeObject
    getTime12Object():Time12Object

    setTimeObject( t:TimeObject  ):void

    addMinutes( minutes:number ):Date
    
    toLocaleTimeObjectString(locales?: string | string[]):string
    
    toTimeZoneIndependentString( options?: Intl.DateTimeFormatOptions ):string
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

Date.prototype.setTimeObject = function(t:TimeObject) { 
    this.setHours(t.hh)
    this.setMinutes(t.mm)
} 

Date.prototype.toTimeZoneIndependentString = function( options?: Intl.DateTimeFormatOptions ) {

    const twodigit = ( v:number) =>  (v < 10) ? `0${v}` : `${v}` 

    const tmpDate = this.addMinutes( this.getTimezoneOffset() )

    if( options?.hour12 ) {
        const t = tmpDate.getTime12Object()
        return `${twodigit(t.hh)}:${twodigit(t.mm)} ${(t.am) ? 'AM': 'PM'}`
    }
    
    const t = tmpDate.getTimeObject()
    return `${twodigit(t.hh)}:${twodigit(t.mm)}`
    
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