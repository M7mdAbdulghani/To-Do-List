/*
        Now we put that code in date.js file. And after that put it in a separate function
        This is now considered a module by its own and can be used in any place in the code. 

        This module can be accessed using the module variable and needs to be require it (in order to be used by other modules)
        When requiring the module, all the code inside of that module will be run directly. 

*/
//When requiring the module, this code directly will be run. (The function is not run because it is not called).
//This is the module variable that will allow to access this module. 
// console.log(module);
// console.log("Hello World");

/*
    VERY IMPORTANT
    The module variable has a property (it is an object) called exports
    This property exports will allow to 
        - The data that this module will exports are the data that will be available to other modules
        - So if I have 3 functions, and I am exporting 1 function, only this exported function will be available to 
            other modules. 

    - In the first example, We are exporting "Hello World", that means when using this module, we will be using this "Hello World" 
    - Second example is more realistic example


    Now what if we want to export more than one function,
*/
//First Example
// module.exports = "Hello World";

//Second Example (Realistic Example)
// module.exports = getDate;

//Exporting more than one function
module.exports.getDate = function(){
    var options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };
    var day = new Date();
    return day.toLocaleDateString('en-US', options);
};
//We can also remove module. and only use exports
exports.getDay = function(){
    var options = {
        weekday: "long",
    };
    var day = new Date();
    return day.toLocaleDateString('en-US', options);
};




