const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
  constructor(field) {
    this.field = field;
    this.current = [0,0];
    this.status = 'p';
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

  gameLoop() {
    while(this.status === 'p') {
        this.print();
        let moveChoice = prompt('Choose a direction to move: ');
        this.move(moveChoice);
    }
  }

  print() {
    console.log(`Status: ${this.status}`);
    this.field.forEach(row => {
        console.log(`${row.join('')}`);
    })
  }
}

const myField = new Field([
    ['*', '░', '░'],
    ['░', 'O', '░'],
    ['░', '░', '^']
]);

myField.gameLoop();
