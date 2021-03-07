///////////////start function//////////////////
let scoreCard = 0;
let canvasArray = [];
let initialShapes = [
    /////////////L shape//////////
    [[0, 0], [1, 0], [2, 0], [2, 1]],
    /////////// ulta L shape/////////
    [[0, 1], [1, 1], [2, 1], [2, 0]]
    ,
    /////////stick/////////////
    [[0, 0], [1, 0], [2, 0], [3, 0]],
    /////////////T shape///////////
    [[0, 1], [1, 0], [1, 1], [1, 2]],
    ////////////square///////////
    [[0, 0], [0, 1], [1, 0], [1, 1]],
    ///////////s shape//////////
    [[0, 1], [0, 2], [1, 0], [1, 1]],
    //////////ulta s shape///////
    [[0, 0], [0, 1], [1, 1], [1, 2]]
]
////start or not///
alert("PRESS ENTER TO START/RESTART AND FOR ROTATION PRESS r KEY AND FOR LEFT AND RIGHT MOVE USE DIRECTION KEYS..!!!!!!");
let start = false;

let currentShape = ["L_SHAPE", "RL_SHAPE", "STICK", "T_SHAPE", "SQUARE", "S_SHAPE", "RS_SHAPE"];
////////currently at normal shape///

let colors = ["red", "green", "yellow", "cyan", "blue", "orange", "pink"];

let currentRotation = 0;
///////variable for randomly selected an integer///
let random;
////////////no of elements in array/////////
let countElementsArray = [];
//////////array for shape////////
let newArr = [];
/////////////initial function/////////////
const initial = () => {
    const canvas = document.getElementById('gameboard');
    const ctx = canvas.getContext('2d');
    let sq = 30;
    for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 15; j++) {
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(j * sq, i * sq, sq, sq);
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 1;
            ctx.strokeRect(j * sq, i * sq, sq, sq);
        }
    }
    ////////////////create array//////////////
    for (let i = 0; i < 20; ++i) {
        canvasArray[i] = [];
        for (let j = 0; j < 15; ++j)
            canvasArray[i].push(0);
    }

    ////initialise the count with zero when no elements are there/////
    for (let i = 0; i < 20; ++i) countElementsArray.push(0);
}

/////////////logic for game over or not////////////////
const checkGameOver = () => {
    for (let i = 0; i < newArr.length; ++i) {
        let ith = newArr[i][0];
        let jth = newArr[i][1];
        if (canvasArray[ith][jth] === 1)
            return true;
    }
    return false;
}

/////////////////////normal function for downword direction/////////////
const incrementRow = () => {
    for (let i = 0; i < newArr.length; ++i)
        newArr[i][0]++;
}

////////////////////valid position or not//////////////////
const checkValidPositionOrNot = (direction) => {
    for (let i = 0; i < newArr.length; ++i) {
        let ith = newArr[i][0];
        let jth = newArr[i][1];

        /////////////if the direction is not sent it means it just checks for the next row is valid or not////////////
        if (direction == undefined) {
            ////////////if the row exceeds 20 which is max row it means next row is not valid////
            if (ith + 1 >= 20) return false;
            /////////or if the next row is filled with some other shape then at that position you can't move//////
            else if (canvasArray[ith + 1][jth] === 1)
                return false;
        } else if (direction === "right") {
            //////////////if the direction is right check for the column//
            ////here the max column is 15 so we just check it do not go beyond 15////
            if (jth + 1 >= 15) return false;
            /////////or if the next row is filled with some other shape then at that position you can't move//////
            else if (canvasArray[ith][jth + 1] === 1)
                return false;
        } else if (direction === "left") {
            ////////////do not go beyond column 0/////////
            if (jth - 1 < 0) return false;
            ///////////checks for the already filled shape/////
            else if (canvasArray[ith][jth - 1] === 1)
                ///////////if that is the case simply return false or you can't move tp the next step////
                return false;
        }
    }
    ///////////if all the above conditions satisfy return true//////
    return true;
}

const incrementColumn = () => {
    //////////function for incrementing the column////////
    for (let i = 0; i < newArr.length; ++i) newArr[i][1]++;
}

const decrementRow = () => {
    /////////////function for decrementing the column/////////
    for (let i = 0; i < newArr.length; ++i) newArr[i][1]--;
}

/////////////recreate the canvas/////////////
const recreateCanvas = (fromRecreate) => {
    ////////////getting the game board/////////
    let canvas = document.getElementById('gameboard');
    let ctx = canvas.getContext('2d');
    ///////////tile size////////
    let sq = 30;
    /////////////dont't run this function for the zero'th row becuase it's pixels can't be further copied fro  its above row//////
    if (fromRecreate != 0) {
        for (let ith = fromRecreate; ith > 0; ith--) {
            for (let j = 0; j < 15; ++j) {
                ////////////getting the pixel data of the above row
                var imgData = ctx.getImageData(j * sq, (ith - 1) * sq, sq, sq);
                ///////////and putting it into its next row/////
                ctx.putImageData(imgData, j * sq, ith * sq);
            }
        }
    }
    ///////////and then make the topmost or we can say that zeroth row as empty//////////    
    for (let k = 0; k < 15; ++k) {
        //////////////for 15 columns///////////
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(k * sq, 0 * sq, sq, sq);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1;
        ctx.strokeRect(k * sq, 0 * sq, sq, sq);
    }
}

//////////////freeze the shape///////////////
const freeze = () => {
    for (let i = 0; i < newArr.length; ++i) {
        let ith = newArr[i][0];
        let jth = newArr[i][1];
        canvasArray[ith][jth] = 1;
        ///////////if its all the columns are filled//////
        //1.make the row zero and recreate the canvas again///////
        countElementsArray[ith]++;
        ///////make the shoftings in the countArray////
        if (countElementsArray[ith] === 15) { ////15 ===>max elements in row///
            ////////////shifting of counting elements in countArray//////////
            countElementsArray.splice(ith, 1);
            countElementsArray.unshift(0);

            /////////shift in the original array too///////////
            canvasArray.splice(ith, 1);

            let unshiftedArray = [];
            for (let i = 0; i < 15; ++i) {
                unshiftedArray.push(0);
            }
            canvasArray.unshift(unshiftedArray);
            scoreCard += 50;
            document.getElementById("scoreCard").innerHTML = scoreCard;
            ////TODO Recreate the canvas//////
            /////////from  ith row shifting the pixels from the previous rows////
            recreateCanvas(ith);
        }
    }
}

//////////////function for filling the shape/////////////
const fillShape = (fillOrRemove) => {
    const canvas = document.getElementById('gameboard');
    const ctx = canvas.getContext('2d');
    /////tile size///////
    let sq = 30;
    for (let i = 0; i < newArr.length; i++) {
        let ith = newArr[i][0];
        let jth = newArr[i][1];
        ////////////////fill the white color for removing or if it is true else fill the specified color/////
        ctx.fillStyle = fillOrRemove ? "#ffffff" : colors[random];
        ctx.fillRect(jth * sq, ith * sq, sq, sq);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1;
        ctx.strokeRect(jth * sq, ith * sq, sq, sq);
    }

}
const function_for_initialShape = () => {
    const canvas = document.getElementById('gameboard');
    const ctx = canvas.getContext('2d');
    let sq = 30;
    //////////random logic Math.floor(Math.random() * 4)////////////
    random = Math.floor(Math.random() * 7);
   
    let selectedArray = initialShapes[random];

    /////make the current rotation as zero/////
    currentRotation = 0;

    newArr = [];
    for (let i = 0; i < 4; ++i) {
        let x = selectedArray[i][0];
        let y = selectedArray[i][1];
        newArr.push([x, y]);
    }
    if (checkGameOver(newArr)) {
        alert(`GAME OVER!!!!!! YOUR SCORE IS : ${scoreCard}`);
        start = false;
        scoreCard = 0;
        document.getElementById("scoreCard").innerHTML = scoreCard;
        initial();
        return;
    }
    const clearId = setInterval(() => {
        ////fill the initial shape///
        fillShape(true);
        /////////if valid move to the next position/////////
        if (checkValidPositionOrNot()) {
            incrementRow();
            fillShape(false);

        } else {
            ////////freeze the image///////
            fillShape(false);
            freeze();
            console.table(canvasArray);
            console.table(countElementsArray);
            clearInterval(clearId);
            function_for_initialShape();
        }
    }, 250);
}
const check = (nextArr) => {
    for (let i = 0; i < nextArr.length; ++i) {
        let x = nextArr[i][0];
        let y = nextArr[i][1];

        if (x >= 20 || y >= 15) return false;
        else if(x<0 || y<0) return false;
        else if (canvasArray[x][y] == 1) return false;
    }
    return true;
}
//////////////function for new Shape////////
const NewRotatedShape = (nextArr) => {
    currentRotation++;
    /////remove the previous shape/////
    fillShape(true);
    newArr = nextArr;
    //////rebuild the next shape//////
    fillShape(false);
}

document.onkeyup = (e) => {
    console.log(e.keyCode);
    if (e.keyCode === 13 && !start) {
        scoreCard = 0;
        document.getElementById("scoreCard").innerHTML = scoreCard;
        initial();
        start = true;
        function_for_initialShape();
    }
    /////move right////////
    else if (e.keyCode == 39) {
        if (checkValidPositionOrNot("right")) {
            fillShape(true);
            incrementColumn();
            fillShape(false);
        }
    }
    //////////move left///////////
    else if (e.keyCode === 37) {
        if (checkValidPositionOrNot("left")) {
            fillShape(true);
            decrementRow();
            fillShape(false);
        }
    }
    ///////////rotation//////////
    else if (e.keyCode == 82) {
        if (currentShape[random] === "STICK") {
            //////NEXT MOVE POSITION ARRAY////
            let nextArr = [];
            if ((currentRotation + 1) % 2 == 1) {
                for (let i = 0; i < 4; ++i) nextArr.push([newArr[0][0], i + newArr[0][1]]);
                if (check(nextArr)) {
                    NewRotatedShape(nextArr);
                }
            }
            ///////////////2ND MOVE//////////////
            else if ((currentRotation + 1) % 2 == 0) {
                for (let i = 0; i < 4; ++i) nextArr.push([i + newArr[0][0], newArr[0][1]]);
                if (check(nextArr)) {
                    NewRotatedShape(nextArr);
                }
            }
        }
        if (currentShape[random] === "T_SHAPE") {
            //////NEXT MOVE POSITION ARRAY////
            let nextArr = [];
            let nextPos = (currentRotation + 1) % 4;
            if (nextPos == 1) {
                nextArr = JSON.parse(JSON.stringify(newArr));
                nextArr[3][0] = nextArr[2][0] + 1;
                nextArr[3][1] = nextArr[2][1];
                if (check(nextArr)) {
                    NewRotatedShape(nextArr);
                }

            } else if (nextPos == 2) {
                nextArr = JSON.parse(JSON.stringify(newArr));
                nextArr[0][0] = nextArr[2][0];
                nextArr[0][1] = nextArr[2][1] + 1;
                if (check(nextArr)) {
                    NewRotatedShape(nextArr);
                }
            } else if (nextPos == 3) {
                nextArr = JSON.parse(JSON.stringify(newArr));
                nextArr[1][0] = nextArr[2][0] - 1;
                nextArr[1][1] = nextArr[2][1];
                if (check(nextArr)) {
                    NewRotatedShape(nextArr);
                }
            } else if (nextPos == 0) {
                nextArr = JSON.parse(JSON.stringify(newArr));
                nextArr[3][0] = nextArr[2][0];
                nextArr[3][1] = nextArr[2][1] - 1;
                if (check(nextArr)) {
                    NewRotatedShape(nextArr);
                }
            }
        }

        if (currentShape[random] === "S_SHAPE") {
            if ((currentRotation + 1) % 2 == 1) {
                nextArr = JSON.parse(JSON.stringify(newArr));
                nextArr[0][1] = nextArr[0][1] - 1;
                nextArr[1][0] = nextArr[3][0] + 1;
                nextArr[1][1] = nextArr[3][1];
                if (check(nextArr)) {
                    NewRotatedShape(nextArr);
                }
            } else if ((currentRotation + 1) % 2 == 0) {
                nextArr = JSON.parse(JSON.stringify(newArr));
                nextArr[0][1] = nextArr[0][1] + 1;
                nextArr[1][0] = nextArr[0][0];
                nextArr[1][1] = nextArr[0][1] + 1;
                if (check(nextArr)) {
                    NewRotatedShape(nextArr);
                }
            }
        }

        if (currentShape[random] === "RS_SHAPE") {
            if ((currentRotation + 1) % 2 == 1) {
                nextArr = JSON.parse(JSON.stringify(newArr));
                nextArr[1][1] = nextArr[1][1] + 1;
                nextArr[0][0] = nextArr[2][0] + 1;
                nextArr[0][1] = nextArr[2][1];
                if (check(nextArr)) {
                    NewRotatedShape(nextArr);
                }
            } else if ((currentRotation + 1) % 2 == 0) {
                nextArr = JSON.parse(JSON.stringify(newArr));
                nextArr[1][1] = nextArr[1][1] - 1;
                nextArr[0][0] = nextArr[1][0];
                nextArr[0][1] = nextArr[1][1] - 1;
                if (check(nextArr)) {
                    NewRotatedShape(nextArr);
                }
            }
        }

        if (currentShape[random] === "L_SHAPE") {
            if ((currentRotation + 1) % 4 == 1) {
                nextArr = JSON.parse(JSON.stringify(newArr));
                nextArr[1][0] = nextArr[0][0];
                nextArr[1][1] = nextArr[0][1] + 1;
                nextArr[2][0] = nextArr[0][0];
                nextArr[2][1] = nextArr[1][1] + 1;
                nextArr[3][0] = nextArr[2][0] - 1;
                nextArr[3][1] = nextArr[2][1];
                if (check(nextArr)) {
                    NewRotatedShape(nextArr);
                }
            } else if ((currentRotation + 1) % 4 == 2) {
                nextArr = JSON.parse(JSON.stringify(newArr));
                nextArr[2][0] = nextArr[1][0] + 1;
                nextArr[2][1] = nextArr[1][1];
                nextArr[3][0] = nextArr[2][0] + 1;
                nextArr[3][1] = nextArr[2][1];
                //                  alert("hii");
                if (check(nextArr)) {
                    NewRotatedShape(nextArr);
                }
            } else if ((currentRotation + 1) % 4 == 3) {
                nextArr = JSON.parse(JSON.stringify(newArr));

                nextArr[2][0] = nextArr[1][0];
                nextArr[2][1] = nextArr[1][1] + 1;
                nextArr[3][0] = nextArr[0][0] + 1;
                nextArr[3][1] = newArr[0][1];
                if (check(nextArr)) {
                    NewRotatedShape(nextArr);
                }
            } else if ((currentRotation + 1) % 4 == 0) {
                nextArr = JSON.parse(JSON.stringify(newArr));

                nextArr[2][0] = nextArr[0][0] - 1;
                nextArr[2][1] = newArr[0][1];
                nextArr[3][0] = newArr[0][0] - 2;
                nextArr[3][1] = newArr[0][1];
                if (check(nextArr)) {
                    NewRotatedShape(nextArr);
                }
            }
        }
        
        if(currentShape[random]==="RL_SHAPE")
        {
          if ((currentRotation + 1) % 4 == 1) {
                nextArr = JSON.parse(JSON.stringify(newArr));
                 nextArr[1][0]=nextArr[2][0];
                 nextArr[1][1]=newArr[2][1]-1;
              
                 nextArr[0][0]=nextArr[1][0];
                 nextArr[0][1]=nextArr[1][1]-1;
                 
                 nextArr[3][0]=nextArr[2][0]+1;
                 nextArr[3][1]=nextArr[2][1];
                 console.log(nextArr);
               
                if (check(nextArr)) {
                    NewRotatedShape(nextArr);
                }
            } else if ((currentRotation + 1) % 4 == 2) {
                nextArr = JSON.parse(JSON.stringify(newArr));
                
                nextArr[1][0]=nextArr[2][0]+1;
                nextArr[1][1]=nextArr[2][1];
                
                nextArr[0][0]=nextArr[1][0]+1;
                nextArr[0][1]=nextArr[1][1];
                
                nextArr[3][0]=nextArr[2][0];
                nextArr[3][1]=nextArr[2][1]+1;
                
                if (check(nextArr)) {
                    NewRotatedShape(nextArr);
                }
            } else if ((currentRotation + 1) % 4 == 3) {
                nextArr = JSON.parse(JSON.stringify(newArr));
                 
                nextArr[1][0]=nextArr[2][0];
                nextArr[1][1]=nextArr[2][1]+1;
                
                nextArr[0][0]=nextArr[1][0];
                nextArr[0][1]=nextArr[1][1]+1;
            
                
                nextArr[3][0]=nextArr[2][0]-1;
                nextArr[3][1]=nextArr[2][1];

                if (check(nextArr)) {
                    NewRotatedShape(nextArr);
                }
            } else if ((currentRotation + 1) % 4 == 0) {
                nextArr = JSON.parse(JSON.stringify(newArr));
                
                nextArr[2][0]=nextArr[0][0]-1;
                nextArr[2][1]=nextArr[0][1];
                
                nextArr[3][0]=nextArr[2][0]-1;
                nextArr[3][1]=nextArr[2][1];

                if (check(nextArr)) {
                    NewRotatedShape(nextArr);
                }
            }     
        }
    }
}
