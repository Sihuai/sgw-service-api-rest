export const isEmptyObject = (object: any) => {

    // function to check if the passed in parameter
    // is an empty Object
    if( typeof(object) === 'undefined'){
        // object is not defined
        return true;
    }
    if( typeof(object) === null){
        // object is not defined
        return true;
    }

    if( object === null){
        // object is not defined
        return true;
    }

    if( Object.keys(object).length === 0){
        // object is empty
        return true;
    }else{
        // object is not empty
        return false;
    }
}

export const isEmptyArray = (array: any[]) => {
    
    // function to check if the passed in parameter
    // is an empty Array

    if( typeof(array) === 'undefined'){
        // object is not defined
        return true;
    }

    if( Array.isArray(array) && array.length === 0 ){
        // array is empty
        return true;
    }else{
        // array is not empty
        return false;
    }
}

export const isValidJSON = (jsonString : string) => {
    try{
        JSON.parse(jsonString);
        return true;
    }catch(err){
        return false;
    }
}