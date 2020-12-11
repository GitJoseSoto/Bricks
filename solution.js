// Object with N, M input diemensions
var dimensions = {
    height : 0,
    width : 0
};

// Array of input tiles
var inputTiles = [];

// Array of output tiles
var outputTiles = [];

// Array of Squares 
var squares = [];

// String that hold the error message
var errorMessage = "";

/* Object Contructor for squares, that are individual groups of 2 x 2 tiles, they have the following properties

    id - used in array storage
    topLeft - refers to the brick that occupies the top-left tile of the Square
    topRight - refers to the brick that occupies the top-right tile of the Square
    botLeft - refers to the brick that occupies the bot-left tile of the Square
    botRight - refers to the brick that occupies the bot-right tile of the Square

*/
function Square(){
    this.id = squares.length;
    this.topLeft = {index:0 , brick:null},
    this.topRight = {index:0 , brick: null},
    this.botLeft = {index:0 , brick: null},
    this.botRight =  {index:0 , brick: null},
    squares[this.id] = this;
}

/* Object Contructor for Bricks, they have the following properties

    number - the number value given in the input
    rotation - the rotation of the Brick "Horizontal" or "Vertical"
    position - the position of the whole brick in relation to the Square "full or "half"
*/
function Brick(number){
    this.number = number;
    this.rotation = "";
    this.position = "";
}

Square.prototype = {
    // Function that Sets the Brick rotation and position properties
    setBrickProperties: function(brick , rotation , position){

        brick.rotation = rotation;
        brick.position = position;
    },

    // Function that returns the Square above the current square
    topSquare:function(){

        return squares[this.id - (dimensions.width /2)];
    },

    // Function that returns the square to left of the current square
    leftSquare:function()
    {
        return squares[this.id - 1];
    },

    // Function that handles all the logic in order to add the top-left tile to the Square and its propeties
    addTopLeft: function(number , index){

        if(typeof this.leftSquare() !== "undefined" && this.leftSquare().topRight.brick.number == number ){
            
            this.topLeft.brick = this.leftSquare().topRight.brick;
            this.setBrickProperties(this.topLeft.brick , "horizontal" , "half")

        }else if(typeof this.topSquare() !== "undefined" && this.topSquare().botLeft.brick.number == number){
    
            this.topLeft.brick = this.topSquare().botLeft.brick;
            this.setBrickProperties(this.topLeft.brick , "vertical" , "half")

        }else{

            this.topLeft.brick = new Brick(number);
        }

        this.topLeft.index = index;
    },

    // Function that handles all the logic in order to add the top-right tile to the Square and its propeties
    addTopRigth: function(number , index){

        if(typeof this.topLeft.brick.number == number )
        {
            this.topRight.brick = this.topLeft.brick;
            this.setBrickProperties(this.topRight.brick , "horizontal" , "full");
           
        }else if(typeof this.topSquare() !== "undefined" && this.topSquare().botRight.brick.number == number){
    
            this.topRight.brick = this.topSquare().botRight.brick;
            this.setBrickProperties(this.topRight.brick , "vertical" , "half");

        }else{

            this.topRight.brick = new Brick(number);
        }
        
        this.topRight.index = index;
    },

    // Function that handles all the logic in order to add the bot-left tile to the Square and its propeties
    addBotLeft: function(number , index){
        
        if(typeof this.leftSquare() !== "undefined" && this.leftSquare().botRight.brick.number == number ){
            
            this.botLeft.brick = this.leftSquare().botRight.brick;
            this.setBrickProperties(this.botLeft.brick , "horizontal" , "half")

        }else if(this.topLeft.brick.number == number){
            
            this.botLeft.brick = this.topLeft.brick;
            this.setBrickProperties(this.botLeft.brick , "vertical" , "full")

        }else{

            this.botLeft.brick = new Brick(number);
        }

        this.botLeft.index = index;
    },

    // Function that handles all the logic in order to add the bot-right tile to the Square and its propeties
    addBotRigth: function(number , index){

        if(this.botLeft.brick.number == number )
        {
            this.botRight.brick = this.botLeft.brick;
            this.setBrickProperties(this.botRight.brick , "horizontal" , "full");

        }else if(this.topRight.brick.number == number){

            this.botRight.brick = this.botLeft.brick;
            this.setBrickProperties(this.botRight.brick , "vertical" , "full");

        }else{

            this.botRight.brick = new Brick(number);
        }

        this.botRight.index = index;
    },

    // Function that generates the output tiles in the array selected as Parameter
    generateTiles: function(outPutArray){

        if( this.isfullVertical() ){

            outPutArray[this.topLeft.index] = this.getOutputBrickNumber(true);
            outPutArray[this.topRight.index] = this.getOutputBrickNumber(false);
            outPutArray[this.botLeft.index] = this.getOutputBrickNumber(true);
            outPutArray[this.botRight.index] = this.getOutputBrickNumber(false);

        } else {    

            outPutArray[this.topLeft.index] = this.getOutputBrickNumber(true);
            outPutArray[this.botLeft.index] = this.getOutputBrickNumber(false);
            outPutArray[this.topRight.index] = this.getOutputBrickNumber(true);
            outPutArray[this.botRight.index] = this.getOutputBrickNumber(false);
        }
    },

    
    // Function that returnes true if the Square has a full Horizontal Brick
    isfullHorizontal: function(){
        
        if((this.topLeft.brick.rotation === "horizontal"  && this.topRight.brick.rotation === "hortizontal") || 
        (this.botLeft.brick.rotation === "horizontal" && this.botRight.brick.rotation === "horizontal")){
            
            return true;
        }

        return false;
    },

    // Function that returnes true if the Square has a full Vertical Brick
    isfullVertical: function(){
        if((this.topLeft.brick.rotation === "vertical"  && this.botLeft.brick.rotation === "vertical") || 
        (this.topRight.brick.rotation === "vertical" && this.botRight.brick.rotation === "vertical")){
            
            return true;
        }

        return false;
    },

    //Function that returns the stored static brick number in order to fill up the new brick Layer
    getOutputBrickNumber: function(increment , clear){

        if (typeof this.getOutputBrickNumber.value === 'undefined'){
            
            this.getOutputBrickNumber.value = 0;
        }
         
        if(increment){
            
            this.getOutputBrickNumber.value++;
        }
        if(clear){

            this.getOutputBrickNumber.value = 0;
        }

        return this.getOutputBrickNumber.value;
    }
}

/*Function that handles the iteration of Tiles from which all the logic is applied

    Index - position of the tile in the tiles array;
    Number - brick number of that particular tile;
*/
function organize() 
{
    for (let y = 0; y < dimensions.height; y += 2) {
        for (let x = 0; x < dimensions.width; x += 2) {
        
            let square = new Square();
            
            let topLeftIndex = x + (dimensions.width * y);
            let topLeftNumber = inputTiles[topLeftIndex];
            square.addTopLeft(topLeftNumber , topLeftIndex);

            let topRightIndex = x + (dimensions.width * y) + 1;
            let topRightNumber = inputTiles[topRightIndex];
            square.addTopRigth(topRightNumber , topRightIndex);
            
            let botLeftIndex = x + (dimensions.width * (y +1));
            let botLeftNumber = inputTiles[botLeftIndex];
            square.addBotLeft(botLeftNumber , botLeftIndex);

            let botRightIndex = x + (dimensions.width * (y + 1) + 1);
            let botRightNumber = inputTiles[botRightIndex];
            square.addBotRigth(botRightNumber , botRightIndex);

            square.generateTiles(outputTiles);
            square.getOutputBrickNumber(false, true);
        }
    }
}

//Function that prints a Brick layer
function printBrickLayer(title , tiles){
    // String of whole output
    let output = ` ${title} <br>`;
   
    for (let y = 0; y < dimensions.height ; y++) {

        // String of output row
        let line = "";

        for (let x = 0; x < dimensions.width ; x++) {
        
            let brick = tiles[ x + (dimensions.width * y)];
            let outputTile = (brick > 9) ? brick.toString() : "0" + brick.toString();
            line += ` ${outputTile}`;
        }
        output += line + "<br>";
    } 
    // DOM element
    let element = document.getElementById("output");
    element.innerHTML += output + "<br><br>";
}

// Function which logs the error message
function errorLog(){

    // DOM element
    let element = document.getElementById("output");
    element.innerHTML = errorMessage;
}
// Function that clear the outPut Div
function clear()
{
    // DOM element
    let element = document.getElementById("output");
    element.innerHTML = "";
}

// Function which accepts the user input and runs the program
function solve(input){

    input = input || '0';
    let inputArray = inputToArray(input);
    dimensions.width = inputArray[0];
    dimensions.height = inputArray[1];
    inputTiles = inputArray.slice(2);
    outputTiles = new Array(inputTiles.length).fill("");

    if(!isValidInput()){

        errorLog();
    
    }else{

        organize();
        
        if(!isValidOutput()){
            
            errorLog();

        }else{

            clear();
            printBrickLayer('Input Layer' , inputTiles);
            printBrickLayer('Output layer' , outputTiles);
        }
    }
}

//Function that return an array from a string taking the values between spaces
function inputToArray(input){

    return input.match(/\S+/g);
}

//Function that evaluates the input and returns true if it follows all conditions
function isValidInput(){

    if(dimensions.width >100 || dimensions.height > 100){
        
        errorMessage = "Invalid input (N or M larger than 100)";
        return false;
    }
    
    if(dimensions.width % 2 !== 0  || dimensions.height % 2 !== 0){
        
        errorMessage = "Invalid input (N or M is not an even number)";
        return false;
    }
    
    console.log(dimensions.width * dimensions.height !== inputTiles.length);
    if(dimensions.width * dimensions.height !== inputTiles.length){
        
        errorMessage = "Invalid input (bricks are not formated correctly)";
        return false;
    }

    let tilesCount = [];

    for (const iterator of inputTiles) {

        let brickId = iterator;

        if(tilesCount[brickId] === undefined){
            
            tilesCount[brickId] = 1;

        } else {

            tilesCount[brickId]++;
        }
        
        if(tilesCount[brickId] > 2){

            errorMessage = "Invalid input (bricks are not formated correctly)";
            return false;
        }
    }

    if(tilesCount.length != (inputTiles.length / 2) + 1 ){
        
        errorMessage = "Invalid input (bricks are not formated correctly)";
        return false;
    }

    return true;
}

//Function that evaluates if the output is valid
function isValidOutput(){
    
    for (const iterator of outputTiles) {

        if(iterator === "")
        {
            errorMessage = " -1 (No solution exist)";
            return false;
        }
    }
    return true;
}

$(document).ready(function(){
    $("form.input").on("submit" , function(e){
        e.preventDefault();
        let input = $(this).find("textarea").val();
        solve(input);
    })
});




