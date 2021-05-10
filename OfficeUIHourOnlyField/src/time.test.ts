import  './time.extension'

const options: Intl.DateTimeFormatOptions = {  
    weekday: "short", 
    year: "numeric", 
    month: "short",  
    day: "numeric", 
    hour: "2-digit", 
    minute: "2-digit"  
};  

it( 'first date', () => {
    const firstDate = new Date( 0,0, 0, 0,0 )

    expect( firstDate.getFullYear() ).toBe( 1899 )
    expect( firstDate.getMonth() ).toBe( 11 )
    expect( firstDate.getDate() ).toBe( 31 )
    expect( firstDate.getHours() ).toBe( 0 )
    expect( firstDate.getMinutes() ).toBe( 0 )

    expect( firstDate.toLocaleTimeString('en-us', options) ).toEqual( 'Sun, Dec 31, 1899, 12:00 AM' ) 

})

it( 'add minutes ', () => {

    const firstDate = new Date( 0,0, 0, 0,0 )

    const mm = firstDate.getMinutes() + 61

    const newDate = new Date( firstDate )
    newDate.setMinutes( mm )

    expect( newDate.getHours() ).toBe( 1 )
    expect( newDate.getMinutes() ).toBe( 1 )

    expect( newDate.toLocaleTimeString('en-us', options) ).toEqual( 'Sun, Dec 31, 1899, 01:01 AM' ) 

})

it( 'time util tests', () => {

    const dt = new Date( 1899, 11, 31, 0, 0)

    const to = dt.getTimeObject()

    expect(to).toEqual( { hh:0, mm:0 })

    dt.setTimeObject( { hh:24, mm:0 } )
    
    expect(dt.getTimeObject()).toEqual( { hh:0, mm:0 })
    expect(dt.getTime12Object()).toEqual( { hh:12, mm:0, am:true })
    expect(dt.toLocaleTimeObjectString()).toEqual( '00:00' )
    expect(dt.toLocaleTimeObjectString('en-us')).toEqual( '12:00 AM' )

    dt.setTimeObject( { hh:23, mm:0 } )

    expect(dt.getTimeObject()).toEqual( { hh:23, mm:0 })
    expect(dt.getTime12Object()).toEqual( { hh:11, mm:0, am:false })
    expect(dt.toLocaleTimeObjectString()).toEqual( '23:00' )
    expect(dt.toLocaleTimeObjectString('en-us')).toEqual( '11:00 PM' )

    dt.setTimeObject( { hh:12, mm:59 } )

    expect(dt.getTimeObject()).toEqual( { hh:12, mm:59 })
    expect(dt.getTime12Object()).toEqual( { hh:12, mm:59, am:false })
    expect(dt.toLocaleTimeObjectString()).toEqual( '12:59' )
    expect(dt.toLocaleTimeObjectString('en-us')).toEqual( '12:59 PM' )

})


it( 'time util UTC tests', () => {

    const dt = new Date( 1899, 11, 31, 0, 0)

    const to = dt.getUTCTimeObject()

    expect(to).toEqual( { hh:23, mm:0 })

})


it( 'parse date from string', () => {
    const defaultDate = new Date( 1899, 11, 31, 0, 0)

    //const dt = new Date( '1899-12-31 10:00 PM')
    const dt = new Date( `${defaultDate.toDateString()} 10:00 PM`)

    expect(dt.getTime()).not.toBeNaN()

    console.log( 'parsed date', dt )
    console.log( 'parsed date', dt.toLocaleDateString('en-us', options) )

    const dterr = new Date( '1899-12-31 10:BB P')

    expect(dterr.getTime()).toBeNaN()

    console.log( 'parsed date', dterr.toLocaleDateString('en-us', options) )
})
