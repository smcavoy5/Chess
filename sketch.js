let BOARD;
let TABLE;

let BLACK_BISHOP;
let WHITE_BISHOP;
let BLACK_ROOK;
let WHITE_ROOK;
let BLACK_PAWN;
let WHITE_PAWN;
let BLACK_KING;
let WHITE_KING;
let WHITE_KNIGHT;
let BLACK_KNIGHT;
let WHITE_QUEEN;
let BLACK_QUEEN;

let SCREEN_WIDTH = 600;
let SCREEN_HEIGHT = 600;
let TABLE_LENGTH = 200;

function preload() {
  BLACK_BISHOP = loadImage('pieces/Chess_bishop_black.png');
  WHITE_BISHOP = loadImage('pieces/Chess_bishop_white.png');
  BLACK_ROOK = loadImage('pieces/Chess_rook_black.png');
  WHITE_ROOK = loadImage('pieces/Chess_rook_white.png');
  BLACK_PAWN = loadImage('pieces/Chess_pawn_black.png');
  WHITE_PAWN = loadImage('pieces/Chess_pawn_white.png');
  WHITE_KING = loadImage('pieces/Chess_king_white.png');
  BLACK_KING = loadImage('pieces/Chess_king_black.png');
  WHITE_KNIGHT = loadImage('pieces/Chess_knight_white.png');
  BLACK_KNIGHT = loadImage('pieces/Chess_knight_black.png');
  WHITE_QUEEN = loadImage('pieces/Chess_queen_white.png');
  BLACK_QUEEN = loadImage('pieces/Chess_queen_black.png');
}

function setup() {

  createCanvas(SCREEN_WIDTH + TABLE_LENGTH, SCREEN_HEIGHT);

  background(150);

  TABLE = new Table();
  BOARD = new Board();

  BOARD.board[0][2] = new Piece(0, 2, "BISHOP", false, BLACK_BISHOP);
  BOARD.board[0][5] = new Piece(0, 5, "BISHOP", false, BLACK_BISHOP);
  BOARD.board[7][2] = new Piece(7, 2, "BISHOP", true, WHITE_BISHOP);
  BOARD.board[7][5] = new Piece(7, 5, "BISHOP", true, WHITE_BISHOP);

  BOARD.board[0][0] = new Piece(0, 0, "ROOK", false, BLACK_ROOK);
  BOARD.board[0][7] = new Piece(0, 7, "ROOK", false, BLACK_ROOK);
  BOARD.board[7][0] = new Piece(7, 0, "ROOK", true, WHITE_ROOK);
  BOARD.board[7][7] = new Piece(7, 7, "ROOK", true, WHITE_ROOK);

  BOARD.board[0][1] = new Piece(0, 1, "KNIGHT", false, BLACK_KNIGHT);
  BOARD.board[0][6] = new Piece(0, 6, "KNIGHT", false, BLACK_KNIGHT);
  BOARD.board[7][1] = new Piece(7, 1, "KNIGHT", true, WHITE_KNIGHT);
  BOARD.board[7][6] = new Piece(7, 6, "KNIGHT", true, WHITE_KNIGHT);

  BOARD.board[0][4] = new Piece(0, 4, "KING", false, BLACK_KING);
  BOARD.board[7][4] = new Piece(7, 4, "KING", true, WHITE_KING);

  BOARD.board[0][3] = new Piece(0, 3, "QUEEN", false, BLACK_QUEEN);
  BOARD.board[7][3] = new Piece(7, 3, "QUEEN", true, WHITE_QUEEN);

  for (let column = 0; column < 8; column++){
  	BOARD.board[6][column] = new Piece(6, column, "PAWN", true, WHITE_PAWN);
  	BOARD.board[1][column] = new Piece(1, column, "PAWN", false, BLACK_PAWN);
	}

  print(BOARD.board)
  BOARD.draw_board()

}

function draw() {

}






let PIECE_CLICKED = 'EMPTY';

function mousePressed(){

	let row = int(mouseY / SCREEN_HEIGHT * 8);
	let col = int(mouseX / SCREEN_WIDTH * 8);
  PIECE_CLICKED = BOARD.board[row][col];
}

function mouseDragged(){
  if (PIECE_CLICKED != "EMPTY"){
    BOARD.board[PIECE_CLICKED.row][PIECE_CLICKED.column] = 'EMPTY'
    BOARD.draw_board();
    PIECE_CLICKED.display_at(mouseX, mouseY);
  }
}

function mouseReleased(){
  if (PIECE_CLICKED != "EMPTY"){

    let row = int(mouseY / SCREEN_HEIGHT * 8);
  	let col = int(mouseX / SCREEN_WIDTH * 8);

    if (PIECE_CLICKED.valid_move(row, col)){

      //move the piece to the location
      PIECE_CLICKED.row = row;
      PIECE_CLICKED.column = col;
      BOARD.board[row][col] = PIECE_CLICKED;
      TABLE.moves.push(TABLE.decipher_move(PIECE_CLICKED));
      TABLE.draw_table()

    } else {

      //put the piece back
      BOARD.board[PIECE_CLICKED.row][PIECE_CLICKED.column] = PIECE_CLICKED;
    }

    BOARD.draw_board();

  }
}

class Table{

  constructor(){

    this.moves = [];
    this.draw_table();

  }
 
  decipher_move(piece) {
    let columns = ['a','b','c','d','e','f','g','h']

    let row_at = abs(piece.row - 8)

    if (piece.piece_type == "PAWN")
      return str(columns[piece.column]) + str(row_at)
    if (piece.piece_type == "KNIGHT")
      return "N" + str(columns[piece.column]) + str(row_at)
    return piece.piece_type[0] + str(columns[piece.column]) + str(row_at)

  }

  draw_table(){
    for (let entry = 0; entry < this.moves.length / 2; entry += 2){
      strokeWeight(2);

      fill(255);

      rect(SCREEN_WIDTH, 20 * entry, TABLE_LENGTH / 2, 20);
      rect(SCREEN_WIDTH + TABLE_LENGTH / 2, 20 * entry, TABLE_LENGTH / 2, 20);

      fill(52);
      text(this.moves[entry], SCREEN_WIDTH + 10, 20 * entry + 10);
      if (this.moves.length > entry + 1)
        text(this.moves[entry+1], SCREEN_WIDTH + TABLE_LENGTH / 2 + 10, 20 * entry + 10);

    }
  }

}
class Board {

  constructor(){

    let board = [];
    for (let row = 0; row < 8; row++){
      let row = [];
      for (let col = 0; col < 8; col++) {
        row.push('EMPTY')
      }
      board.push(row)
    }
    this.board = board

  }


  draw_board() {

  //set the board's square color
  let green_square = color(0, 100, 0);
  let white_square = color(255, 255, 255);

  let alternator = false;

  for (let j = 0; j < 8; j++){
    for (let i = 0; i < 8; i++) {

      if (alternator)
        fill(green_square);
      else
        fill(white_square);

      alternator = !alternator

      width = SCREEN_WIDTH / 8
      height = SCREEN_HEIGHT / 8

      rect(width * i, height * j, width, height);

      if (this.board[j][i] != 'EMPTY'){
        this.board[j][i].display(j, i)
        }
      }

      alternator = !alternator

    }
  }
}

class Piece {

  constructor(row, column, piece_type, white, image) {

    this.row = row;
    this.column = column;
    this.piece_type = piece_type;
    this.white = white;
    this.image = image;

  }

  display() {

  	let display_row = SCREEN_HEIGHT / 8 * this.row;
  	let display_column = SCREEN_HEIGHT / 8 * this.column;
    image(this.image, display_column, display_row, SCREEN_WIDTH / 8, SCREEN_HEIGHT / 8);

  }

  display_at(x, y){

    let display_x = x - (SCREEN_WIDTH / 8) / 2;
    let display_y = y - (SCREEN_HEIGHT / 8) / 2
    image(this.image, display_x, display_y, SCREEN_WIDTH / 8, SCREEN_HEIGHT / 8);

  }

  valid_move(next_row, next_col) {

      if (this.piece_type == "PAWN"){
        return this.valid_move_for_pawn(next_row, next_col);
      }
      else if (this.piece_type == "ROOK"){
        return this.valid_move_for_rook(next_row, next_col);
      }
      else if (this.piece_type == "KNIGHT"){
        return this.valid_move_for_knight(next_row, next_col);
      }
      else if (this.piece_type == "BISHOP"){
        return this.valid_move_for_bishop(next_row, next_col);
      }
      else if (this.piece_type == "QUEEN"){
        return this.valid_move_for_rook(next_row, next_col) || this.valid_move_for_bishop(next_row, next_col);
      }

    return false;

  }

  valid_move_for_pawn(next_row, next_col) {
    if(this.white){

      if(this.row - next_row == 2 & this.row == 6)
          return true
        
      if(this.row - next_row == 1){

      //standard move for PAWN; Must be a unit move forward to an empty square
        if(next_col == this.column & BOARD.board[next_row][next_col] == "EMPTY")
          return true;

      //if Pawn tries to move one unit diagnol; Next location must have
      //piece of opposite color (this code is same for white and black maybe combine?)
        else if (abs(next_col - this.column) == 1) {
          let piece = BOARD.board[next_row][next_col];
          if (piece != "EMPTY")
            return !piece.white;
        }

      }
    }
    else{

      if(this.row - next_row == -2){
        if(this.row == 1)
          return true
        }

      if(this.row - next_row == -1){

      //standard move for PAWN; Must be a unit move forward to an empty square
        if(next_col == this.column & BOARD.board[next_row][next_col] == "EMPTY")
          return true;

      //if Pawn tries to move one unit diagnol; Next location must have
      //piece of opposite color (this code is same for white and black maybe combine?)
        else if (abs(next_col - this.column) == 1) {
          let piece = BOARD.board[next_row][next_col];

            if (piece != "EMPTY")
              return piece.white;
            }
        }

        return false;
      }
  }

  valid_move_for_rook(next_row, next_col) {
      if (next_col != this.column & next_row != this.row){
            return false;
      } else {
          if (next_col < this.column){
            for (let space = next_col + 1; space < this.column; space++){
              if (BOARD.board[this.row][space] != "EMPTY")
                return false;
            }
          } else if (next_col > this.column) {
              for (let space = this.column; space < next_col; space++){
                if (BOARD.board[this.row][space] != "EMPTY")
                  return false
            }
          } else if (next_row < this.row) {
              for (let space = next_row + 1; space < this.row; space++){
                if (BOARD.board[space][this.column] != "EMPTY")
                  return false
            }
          } else if (next_row > this.row) {
              for (let space = this.row; space < next_row; space++){
                if (BOARD.board[space][this.column] != "EMPTY")
                  return false
            }
          }

        if (BOARD.board[next_row][next_col] != "EMPTY"){
          if (BOARD.board[next_row][next_col].white == this.white){
            return false;
         }
         return true;
      }

          return true;

      }
  }

  valid_move_for_knight(next_row, next_col) {

    if (BOARD.board[next_row][next_col] != "EMPTY"){

      //if the next location is a piece of the same color
      if (BOARD.board[next_row][next_col].white == this.white)
        return false;
      
    }

    //standard move
    if (abs(next_row - this.row) == 2 & abs(next_col - this.column) == 1)
      return true;
    
    if (abs(next_col - this.column) == 2 & abs(next_row - this.row) == 1)
      return true;
  }

  valid_move_for_bishop(next_row, next_col){

    if (this.row == next_row && this.column == next_col)
      return false

    if (abs(this.row - next_row) != abs(this.column - next_col))
      return false;
    

    let row_direction = (next_row - this.row) / abs(this.row - next_row);
    let col_direction = (next_col - this.column) / abs(this.column - next_col);
    let row_at = this.row + row_direction;
    let col_at = this.column + col_direction;

    while (row_at != next_row & col_at != next_col){

      if(BOARD.board[row_at][col_at] != "EMPTY"){
        return false
      }

      row_at += row_direction;
      col_at += col_direction;
    }
   
   if (BOARD.board[next_row][next_col] != "EMPTY"){

      //if the next location is a piece of the same color
      if (BOARD.board[next_row][next_col].white == this.white)
        return false;
      
    }

    return true;
  }
}
