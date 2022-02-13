<template>
  <div id="app" class="grid grid-cols-1 items-center justify-center px-2 md:px-32 py-4">

    <div class="text-center text-green-500 text-2xl md:text-4xl mb-1">
      WILLDLE
    </div>

    <!-- MESSAGE SECTION --->
    <div class="m-1 text-xs md:text-md text-center">
      <div
      v-if="message"
      >
          {{message}}
      </div>
      <div
      v-else
      >
        Guess the 5 letter in 6 attempts!
      </div>
    </div>

    <!-- WORD GRID -->
    <div class="flex flex-col justify-center items-center m-2">
      <div
      v-for="(guess, i) in grid"
      :key="i"
      class="grid grid-cols-5 w-1/2"
      >
        <input
        type="text"
        v-for="(letter, j) in guess"
        :key="j"
        v-model="grid[i][j].letter"
        :class="tileClass(i, j)"
        readonly
        />
      </div>
    </div>

    <!-- KEYBOARD - SPLIT INTO 3 ROWS -->
    <div class="keyboard-wrap text-xs">
      <div class="grid grid-cols-10">
        <div
          v-for="index in 10"
          :key="index"
          @click="letterClick(keyboard[index-1].char)"
          :class="keyboardClass(keyboard[index-1].status)"
          >
            {{keyboard[index-1].char}}
        </div>
      </div>

      <div class="grid grid-cols-9">
        <div
          v-for="index in 9"
          :key="index"
          @click="letterClick(keyboard[index+9].char)"
          :class="keyboardClass(keyboard[index+9].status)"
        >
          {{keyboard[index+9].char}}
        </div>
      </div>

      <div class="grid grid-cols-9">
        <div
          @click="enterClick()"
          class="keyboard-empty"
          >
          ENT
          </div>
        <div
          v-for="index in 7"
          :key="index"
          @click="letterClick(keyboard[index+18].char)"
          :class="keyboardClass(keyboard[index+18].status)"
        >
          {{keyboard[index+18].char}}
        </div>
        <div
        @click="deleteLetter()"
        class="keyboard-empty"
        >
          DEL
        </div>
      </div>
    </div>

    <!-- GAME RESET BUTTON - SHOWS IF GAME IS COMPLETE -->
    <div class="flex justify-center">
      <div
      v-if="gameStatus != 'OPEN'"
      class="text-center bg-gray-300 hover:bg-gray-500 cursor-pointer my-2 w-1/3 p-1"
      @click="resetGame()"
      >
        PLAY AGAIN
      </div>
    </div>

  </div>
</template>

<script>
//Get valid answer array from lib folder.
import {validAnswers} from "./lib/validAnswers.js";

export default {
  name: 'App',
  components: {
  },
  data () {
    return{
    //currentLetter and currentRow to correspond to current grid tile that user is inputting.
    currentLetter: 0,
    currentRow: 0,

    //Variables for allowed number of guesses and word length, this would allow game to be played with a different sized grid, 
    //although the words list does not support this at this time.
    guesses: 6,
    wordLength: 5,

    message: null,

    //Tracks whether the user has won/lost/is still playing
    gameStatus: "OPEN",

    grid : [
      [{letter: "", status: "ACTIVE"},{letter: "", status: "EMPTY"},{letter: "", status: "EMPTY"},{letter: "", status: "EMPTY"},{letter: "", status: "EMPTY"}],
      [{letter: "", status: "EMPTY"},{letter: "", status: "EMPTY"},{letter: "", status: "EMPTY"},{letter: "", status: "EMPTY"},{letter: "", status: "EMPTY"}],
      [{letter: "", status: "EMPTY"},{letter: "", status: "EMPTY"},{letter: "", status: "EMPTY"},{letter: "", status: "EMPTY"},{letter: "", status: "EMPTY"}],
      [{letter: "", status: "EMPTY"},{letter: "", status: "EMPTY"},{letter: "", status: "EMPTY"},{letter: "", status: "EMPTY"},{letter: "", status: "EMPTY"}],
      [{letter: "", status: "EMPTY"},{letter: "", status: "EMPTY"},{letter: "", status: "EMPTY"},{letter: "", status: "EMPTY"},{letter: "", status: "EMPTY"}],
      [{letter: "", status: "EMPTY"},{letter: "", status: "EMPTY"},{letter: "", status: "EMPTY"},{letter: "", status: "EMPTY"},{letter: "", status: "EMPTY"}],
    ],
  }},

  computed: {
  },

  //When template is created, generate a random answer from the word list, and create keyboard and grid objects.
  created(){
    this.answer = validAnswers[Math.floor(Math.random()*validAnswers.length)].toUpperCase();
    window.addEventListener("keydown", this.keyPress); //Allows pc users to use their keyboard rather than the on-screen keyboard.
    this.createKeyboard()
  },

  destroyed(){
    window.removeEventListener("keydown", this.keyPress);
  },

  methods: {

    //Bind css class from ./index.css to grid tile status.
    tileClass(i, j){
      switch(this.grid[i][j].status){
        case "ACTIVE":
          return 'tile-active';
        case "CORRECT":
          return 'tile-correct';
        case "IN WORD":
          return 'tile-in-word'
        case "NOT IN WORD":
          return 'tile-not-in-word';
        default:
          return 'tile-inactive';
      }
    },

    //Bind css style from ./index.css to keyboard letter status.
    keyboardClass(status){
      switch(status){
        case 'CORRECT':
          return 'keyboard-correct';
        case 'IN WORD':
          return 'keyboard-in-word';
        case 'NOT IN WORD':
          return 'keyboard-not-in-word';
        default:
          return 'keyboard-empty';
      }
    },

    //Generate/Reset qwerty keyboard array with all status' set to empty.
    createKeyboard(){
      const keys = ['Q','W','E','R','T','Y','U','I','O','P','A','S','D','F','G','H','J','K','L','Z','X','C','V','B','N','M']
      let keyboard = [];
      for (let i = 0; i < keys.length; i++){
        keyboard.push({char : keys[i], status: "EMPTY"})
      }
      this.keyboard = keyboard
    },

    //Generate a new game by resetting all game values and choosing a new word.
    resetGame(){
      this.answer = validAnswers[Math.floor(Math.random()*validAnswers.length)].toUpperCase();
      
      this.currentLetter = 0;
      this.currentRow = 0;
      this.message = null;
      this.gameStatus = "OPEN";

      this.grid = [
        [{letter: "", status: "ACTIVE"},{letter: "", status: "EMPTY"},{letter: "", status: "EMPTY"},{letter: "", status: "EMPTY"},{letter: "", status: "EMPTY"}],
        [{letter: "", status: "EMPTY"},{letter: "", status: "EMPTY"},{letter: "", status: "EMPTY"},{letter: "", status: "EMPTY"},{letter: "", status: "EMPTY"}],
        [{letter: "", status: "EMPTY"},{letter: "", status: "EMPTY"},{letter: "", status: "EMPTY"},{letter: "", status: "EMPTY"},{letter: "", status: "EMPTY"}],
        [{letter: "", status: "EMPTY"},{letter: "", status: "EMPTY"},{letter: "", status: "EMPTY"},{letter: "", status: "EMPTY"},{letter: "", status: "EMPTY"}],
        [{letter: "", status: "EMPTY"},{letter: "", status: "EMPTY"},{letter: "", status: "EMPTY"},{letter: "", status: "EMPTY"},{letter: "", status: "EMPTY"}],
        [{letter: "", status: "EMPTY"},{letter: "", status: "EMPTY"},{letter: "", status: "EMPTY"},{letter: "", status: "EMPTY"},{letter: "", status: "EMPTY"}],
      ];

      window.addEventListener("keydown", this.keyPress); //This is removed when game is over so needs to be added again.
      this.createKeyboard();
    },

    //If user has won the game then close the game and set message to win message.
    gameWon(){
      this.gameStatus = "WON";
      window.removeEventListener("keydown", this.keyPress);
      this.message = "YOU WON! WELL DONE";
    },

    //If user has lost the game then close the game and inform them of the answer.
    gameLost(){
      this.gameStatus = "LOST"
      window.removeEventListener("keydown", this.keyPress);
      this.message = "YOU LOST! THE WORD WAS " + this.answer;
    },

    //Check that the current guess is a valid word.
    checkValidWord(){
      let guessArray = this.grid[this.currentRow]
      let guessString = guessArray.map(x => x.letter).join("");

      //validAnswers array includes all lower case words whilst game uses all upper case.
      if(validAnswers.includes(guessString.toLowerCase())){
        this.message = null;
        return true;
      }
      else{
        this.message = "WORD NOT IN LIST!";
        return false;
      }
    },

    //Check the current guess against the actual answer, determine which letters are in the word and which are in correct position.
    checkGuess(){
      console.log(this.answer);
      //Get current guess. 
      let guessArray = this.grid[this.currentRow]
      let guessString = guessArray.map(x => x.letter).join("");

      //Generate array from answer string to check index of letters and remove letters that have been matched.
      let remainingLetters = this.answer.split("");


      //Check for correct letters, if letter is in same position in guess array as 
      //answer string then letter is correct and status should be updated accordingly.
      for (let i = 0; i < this.wordLength; i++){
        const guessLetter = guessArray[i].letter
        if(this.answer.charAt(i) === guessLetter){
          //Letter is in correct position, update array and tile status.
          remainingLetters[i] = null;
          this.grid[this.currentRow][i].status = "CORRECT";

          //Find character in qwerty and update status of keyboard
          let x = this.keyboard.find(x => x.char == guessLetter)
          this.keyboard[this.keyboard.indexOf(x)].status = "CORRECT";
        }
      }

      //Check for letters in word but not correct position.
      for (let i = 0; i < this.wordLength; i++){
        //Avoid letters that are already known to be correct.
        if (this.grid[this.currentRow][i].status !== "CORRECT"){

          const guessLetter = guessArray[i].letter
          const index = remainingLetters.indexOf(guessLetter);
          let status;

          //If index is -1 then the letter is not in the answer.
          if(index !== -1){
            status = "IN WORD";
            remainingLetters[index] = null;
          }
          else{
            status = "NOT IN WORD"
          }

          //Update status of grid tile.
          this.grid[this.currentRow][i].status = status;

          //Update status of keyboard tile, if the letter has not been found as 'correct' or 'in word' before.
          let x= this.keyboard.find(x => x.char == guessLetter)
          if (this.keyboard[this.keyboard.indexOf(x)].status == "EMPTY"){ 
            this.keyboard[this.keyboard.indexOf(x)].status = status;
          }
        }
      }

      //Check if answer is completely correct, ending the game.
      if (guessString == this.answer){
        this.gameWon();
      }

      //If user has used up all their guesses then they have lost and the game is over.
      else if(this.currentRow+1 == this.guesses){
        this.gameLost();
      }
    },


    //Handle letter input, either from pc keybaord or on screen keyboard.
    letterClick(letter){
      try{
        //Letters are only added if user is not at the end of the word.
        if(this.currentLetter != this.wordLength){
          //Update grid with input
          this.grid[this.currentRow][this.currentLetter].letter = letter;
          this.grid[this.currentRow][this.currentLetter].status = "FILLED";

          //Move to next letter tile.
          this.currentLetter+=1;
          this.grid[this.currentRow][this.currentLetter].status = "ACTIVE";        
        }
      }
      catch(e){
        console.log(e);
      }
    },

    //Delete the current letter.
    deleteLetter(){
      this.message = null; //Resets error message as it may say invalid word.

      //Check if at start of word as currentLetter should not become negative.
      if (this.currentLetter != 0){
        if (this.currentLetter != this.wordLength){
          this.grid[this.currentRow][this.currentLetter].status = "EMPTY"
        }

        this.currentLetter -= 1;
        this.grid[this.currentRow][this.currentLetter].letter = ""
        this.grid[this.currentRow][this.currentLetter].status = "ACTIVE" 
      }
    },

    //Enter button signals user is making a guess.
    enterClick(){
      //Check if user has entered 5 letters and word is in list.
      if ((this.currentLetter == this.wordLength) && (this.checkValidWord())){

        this.checkGuess(); //Check the guess against the answer, updating tiles and game status where required.

        //If the game has not ended then move to the next row of the grid. Waiting for 500 seconds to allow for css transitions.
        if (this.gameStatus == "OPEN"){
          setTimeout( () => {
            this.currentRow +=1;
            this.currentLetter = 0;
            this.grid[this.currentRow][this.currentLetter].status = "ACTIVE"
          }, 500)
        }
      }
    },

    //Handle keypress from keyboard.
    keyPress(event){
      const key = event.key;
      var charCode = event.keyCode;

      //Enter to make guess
      if (key == "Enter"){
        console.log("ENTER");
        this.enterClick();
      }
      //Delete to remove a letter
      else if (key == "Backspace"){
        this.deleteLetter();
      }

      //Check if letter character and call letterClick if so. All other characters such as numbers are ignored.
      if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123)){
        this.letterClick(key.toUpperCase());
      } 
    }

  },
}
</script>

<style>

</style>
