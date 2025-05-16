const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
  constructor(fieldSize, holePercentage = 10) {
    this.field = [];
    // Populate field
    for(let i = 0; i < fieldSize; i++) {
        const newRow = [];
        for(let j = 0; j < fieldSize; j++) {
            newRow.push(this.randomizeTerrain(holePercentage));
        }
        this.field.push(newRow);
    }
    // Set hat location
    this.field[fieldSize - 1][fieldSize - 1] = '^';
    // Set player location
    this.current = [0,0];
    this.togglePath();
    // Initialize game status to pending
    this.status = 'p';
  }

  randomizeTerrain(holePercentage) {
    const random = Math.floor((Math.random() * 99) + 1);
    return random < holePercentage ? 'O' : '░';
  }

  getCurrentLand() {
    return this.field[this.current[0]][this.current[1]];
  }

  setCurrentLand(newLand) {
    this.field[this.current[0]][this.current[1]] = newLand;
  }

  togglePath() {
    this.setCurrentLand(this.getCurrentLand() === '*' ? '░' : '*');
  }

  move(direction) {
    //Set current land to ░
    this.togglePath();
    //update current coordinates
    switch (direction) {
        case 'up':
            this.current[0] -= 1;
            break;
        case 'down':
            this.current[0] += 1;
            break;
        case 'left':
            this.current[1] -= 1;
            break;
        case 'right':
            this.current[1] += 1;
            break;
    }
    //Check new coordinates content
    switch(this.getCurrentLand()) {
        case '^':
            //Found had means win
            this.status = 'w';
            break;

        case '░':
            //Mark land with player
            this.togglePath();
            break;
        case '*':
            //Visiting player space should not be possible?
            break;        
        case 'O':
            //Fallen into hole, game over
            this.status = 'l';
            break;
        default:
            //Fallen off map, game over
            this.status = 'l'
            break;        
    }
  }

  print() {
    console.log(`Status: ${this.status}`);
    this.field.forEach(row => {
        console.log(`${row.join('')}`);
    })
  }
}

class Game {
    constructor() {
        this.playing = true;
    }

    gameLoop() {
        // Run app while user has not quit
        while(this.playing) {
            // Game round
            const fieldSize = prompt('Enter size of field: ');
            const holePercentage = prompt('Enter percentage of holes: ');
            const field = new Field(fieldSize, holePercentage);
            while(field.status === 'p') {
                field.print();
                let moveChoice = prompt('Choose a direction to move: ');
                field.move(moveChoice);
            }
            field.print();
            if (field.status === 'w') {
                console.log('Congratulations on finding your hat! You win!');
            } else {
                console.log('You fell... Game over!');
            }
            const newGame = prompt('Would you like to play again? (yes/no): ');
            if(newGame.toLowerCase() === 'no') {
                this.playing = false;
            }
        }
    }
}

const game = new Game();
game.gameLoop();
