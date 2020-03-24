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

  //place the bishops
  BOARD.board[0][2] = new Piece(0, 2, "BISHOP", false, BLACK_BISHOP);
  BOARD.board[0][5] = new Piece(0, 5, "BISHOP", false, BLACK_BISHOP);
  BOARD.board[7][2] = new Piece(7, 2, "BISHOP", true, WHITE_BISHOP);
  BOARD.board[7][5] = new Piece(7, 5, "BISHOP", true, WHITE_BISHOP);

  //place the rooks
  BOARD.board[0][0] = new Piece(0, 0, "ROOK", false, BLACK_ROOK);
  BOARD.board[0][7] = new Piece(0, 7, "ROOK", false, BLACK_ROOK);
  BOARD.board[7][0] = new Piece(7, 0, "ROOK", true, WHITE_ROOK);
  BOARD.board[7][7] = new Piece(7, 7, "ROOK", true, WHITE_ROOK);

  //place the knights
  BOARD.board[0][1] = new Piece(0, 1, "KNIGHT", false, BLACK_KNIGHT);
  BOARD.board[0][6] = new Piece(0, 6, "KNIGHT", false, BLACK_KNIGHT);
  BOARD.board[7][1] = new Piece(7, 1, "KNIGHT", true, WHITE_KNIGHT);
  BOARD.board[7][6] = new Piece(7, 6, "KNIGHT", true, WHITE_KNIGHT);

  //place the kings
  BOARD.board[0][4] = new Piece(0, 4, "KING", false, BLACK_KING);
  BOARD.board[7][4] = new Piece(7, 4, "KING", true, WHITE_KING);

  //place the queens
  BOARD.board[0][3] = new Piece(0, 3, "QUEEN", false, BLACK_QUEEN);
  BOARD.board[7][3] = new Piece(7, 3, "QUEEN", true, WHITE_QUEEN);

  //place the pawns
  for (let column = 0; column < 8; column++){
  	BOARD.board[6][column] = new Piece(6, column, "PAWN", true, WHITE_PAWN);
  	BOARD.board[1][column] = new Piece(1, column, "PAWN", false, BLACK_PAWN);
	}

  BOARD.draw_board()

}

function draw() {

}



function mousePressed(){
  if (mouseX < SCREEN_WIDTH & mouseX > 0 & mouseY < SCREEN_HEIGHT & mouseY > 0){

  	let row = int(mouseY / SCREEN_HEIGHT * 8);
  	let col = int(mouseX / SCREEN_WIDTH * 8);

    if (BOARD.board[row][col] != 'EMPTY')
      if(BOARD.board[row][col].white ==BOARD.turn)
        BOARD.piece_selected = BOARD.board[row][col];
    }

}

function mouseDragged(){
  if (BOARD.piece_selected != "EMPTY"){
    BOARD.board[BOARD.piece_selected.row][BOARD.piece_selected.column] = 'EMPTY'
    BOARD.draw_board();
    if (mouseX < SCREEN_WIDTH - 10 & mouseX > 0 & mouseY < SCREEN_HEIGHT & mouseY > 0){
      BOARD.piece_selected.display_at(mouseX, mouseY);

    }
  }
}

function mouseReleased(){
  if (mouseX < SCREEN_WIDTH & mouseX > 0 & mouseY < SCREEN_HEIGHT & mouseY > 0){
    if (BOARD.piece_selected != "EMPTY"){

      let row = int(mouseY / SCREEN_HEIGHT * 8);
    	let col = int(mouseX / SCREEN_WIDTH * 8);

      if (BOARD.piece_selected.valid_move(row, col)){

        //store previous location in case the move was illegal
        let prev_row = BOARD.piece_selected.row
        let prev_col = BOARD.piece_selected.column
        let prev_piece = BOARD.board[row][col]
        let taken = false;
        let in_check = false;

        //if a piece has been taken then note it
        if(BOARD.board[row][col] != 'EMPTY')
          taken = true;


        //move the piece to the location
        BOARD.piece_selected.row = row;
        BOARD.piece_selected.column = col;
        BOARD.board[row][col] = BOARD.piece_selected;

        //track the moves of the kings
        if(BOARD.piece_selected.piece_type == "KING"){
          if(BOARD.piece_selected.white)
            BOARD.white_king = [row, col]
          else
            BOARD.black_king = [row, col]
        }

        //if the king moves into check reset the move
        if(checked(!BOARD.turn)){
          BOARD.piece_selected.row = prev_row;
          BOARD.piece_selected.column = prev_col;
          BOARD.board[prev_row][prev_col] = BOARD.piece_selected;
          BOARD.board[row][col] = prev_piece;
          BOARD.draw_board()
          return;
        }

        //track the number of moves a piece makes
        BOARD.piece_selected.timesMoved += 1;

        if (checked(BOARD.turn))
          in_check = true;

        //if a piece is taken then note it in the table
        if (taken){
          TABLE.moves.push(TABLE.decipher_move(BOARD.piece_selected, taken, prev_col, in_check))
          TABLE.draw_table(TABLE.decipher_move(BOARD.piece_selected, taken, prev_col, in_check));
        }
        else{
          TABLE.moves.push(TABLE.decipher_move(BOARD.piece_selected, taken, '', in_check))
          TABLE.draw_table(TABLE.decipher_move(BOARD.piece_selected, taken, '', in_check));
        }

        //alternate turns
       BOARD.turn = !BOARD.turn
       BOARD.piece_selected = 'EMPTY'
      }

      else
        BOARD.board[BOARD.piece_selected.row][BOARD.piece_selected.column] = BOARD.piece_selected;
      }
    }
    else {
      if(BOARD.piece_selected != 'EMPTY')
        BOARD.board[BOARD.piece_selected.row][BOARD.piece_selected.column] = BOARD.piece_selected;
      }
    BOARD.draw_board();

}


function checked(white) {
  //identify if the king is in check

  let king;

  if(!white)
    king = BOARD.white_king
  else
    king = BOARD.black_king

  for(let row = 0; row < BOARD.board.length; row++){
    for(let col = 0; col < BOARD.board.length; col++){
      if (BOARD.board[row][col] != 'EMPTY'){
        if (BOARD.board[row][col].white == white){
          if (BOARD.board[row][col].valid_move(king[0],king[1])){
            return true;
          }
        }
      }
    }
  }

  return false;

}

class Table{

  constructor(){

    this.moves = [];

  }

  decipher_move(piece, taken, from, in_check) {
    let took = ''
    let check = ''
    let columns = ['a','b','c','d','e','f','g','h']

    if(taken)
      if (piece.piece_type == "PAWN")
        took =  str(columns[from]) + 'x'
      else
        took = 'x'
    if(in_check)
      check = '+'

    let row_at = abs(piece.row - 8)

    if (piece.piece_type == "PAWN")
      return took + str(columns[piece.column]) + str(row_at) + check
    if (piece.piece_type == "KNIGHT")
      return "N" + took + str(columns[piece.column]) + str(row_at) + check
    return piece.piece_type[0] + took + str(columns[piece.column]) + str(row_at) + check

  }

  draw_table(entry){
    let row = abs(this.moves.length % 2 - 1);
    let col = int((this.moves.length - 1) / 2);
    fill(255);
    rect(SCREEN_WIDTH + (TABLE_LENGTH / 2) * row, col * 20, (TABLE_LENGTH / 2), 20)
    textSize(18);
    fill(0);
    text(entry, SCREEN_WIDTH + (TABLE_LENGTH / 2) * row + (TABLE_LENGTH / 4) - 10, (col + 1) * 20 - 5);
  }

}

class Board {

  constructor(){
    this.turn = true;
    this.piece_selected = 'EMPTY';
    this.white_king = [7, 4];
    this.black_king = [0, 4];

    let board = [];
    for (let row = 0; row < 8; row++){
      let row = [];

      for (let col = 0; col < 8; col++)
        row.push('EMPTY')

      board.push(row)
    }

    this.board = board;

  }

  remove(row, col){
    this.board[row][col] = "EMPTY"
  }

  draw_board() {

    //set the board's square color
    let green_square = color(0, 100, 0);
    let white_square = color(255, 255, 255);

    let alternator = false;
    let width = SCREEN_WIDTH / 8
    let height = SCREEN_HEIGHT / 8

    for (let j = 0; j < 8; j++){
      for (let i = 0; i < 8; i++) {

        if (alternator)
          fill(green_square);
        else
          fill(white_square);

        rect(width * i, height * j, width, height);

        alternator = !alternator

        if (this.board[j][i] != 'EMPTY')
          this.board[j][i].display(j, i)
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
    this.timesMoved = 0;

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

    if(BOARD.board[next_row][next_col] != 'EMPTY'){
      if (BOARD.board[next_row][next_col].white == this.white)
        return false;
    }
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
    else if (this.piece_type == "KING"){
      return this.valid_move_for_king(next_row, next_col);
    }
    return false;
  }

  valid_move_for_pawn(next_row, next_col) {

    let direction = -1;

    if(this.white)
      direction = 1

      if(this.row - next_row == 2 * direction & (this.row == 6 || this.row == 1) && next_col == this.column)
          return true

      if(this.row - next_row == direction){

      //standard move for PAWN; Must be a unit move forward to an empty square
      if(next_col == this.column & BOARD.board[next_row][next_col] == "EMPTY")
        return true;

      //if Pawn tries to move one unit diagnol; Next location must have
      //piece of opposite color or be an instance of en passant
      else if (abs(next_col - this.column) == 1) {

        let piece = BOARD.board[next_row][next_col];

        //if opposite color then take the piece
        if (piece != "EMPTY")
          return piece.white != this.white;

        //if en passant
        if (BOARD.board[this.row][next_col] != 'EMPTY')
           if (BOARD.board[this.row][next_col].piece_type == 'PAWN')
             if (BOARD.board[this.row][next_col].timesMoved == 1){
                BOARD.remove(this.row, next_col)
                return true;
              }
        }
      }
  }

  valid_move_for_rook(next_row, next_col) {
      if (next_col != this.column & next_row != this.row)
        return false;
      if (next_col == this.column & next_row == this.row)
        return false;

      let col_direction = 0
      let row_direction = 0
      let distance = abs((this.row - next_row) + (this.column - next_col))

      if(this.row == next_row)
        col_direction = (next_col - this.column) / abs(this.column - next_col)
      else
        row_direction = (next_row - this.row) / abs(this.row - next_row)


      for (let check = 1; check < distance; check++){

        let row_at = row_direction * check + this.row
        let col_at = col_direction * check + this.column

        if (BOARD.board[row_at][col_at] != "EMPTY")
          return false;
      }

      return true;

  }

  valid_move_for_knight(next_row, next_col) {

    //standard move
    if (abs(next_row - this.row) == 2 & abs(next_col - this.column) == 1)
      return true;

    if (abs(next_col - this.column) == 2 & abs(next_row - this.row) == 1)
      return true;

    return false;
  }

  valid_move_for_bishop(next_row, next_col){

    //if the bishop does not move, then return an invalid move
    if (this.row == next_row && this.column == next_col)
      return false

    //if the move is not along a diagonal, then return an invalid move
    if (abs(this.row - next_row) != abs(this.column - next_col))
      return false;

    //get the direction the bishop is moving in
    let row_direction = (next_row - this.row) / abs(this.row - next_row);
    let col_direction = (next_col - this.column) / abs(this.column - next_col);
    let row_at = this.row + row_direction;
    let col_at = this.column + col_direction;

    while (row_at != next_row & col_at != next_col){

      if(BOARD.board[row_at][col_at] != "EMPTY")
        return false

      row_at += row_direction;
      col_at += col_direction;
    }

    return true;
  }

  valid_move_for_king(next_row, next_col){

    if (abs(next_row - this.row) < 2 && abs(next_col - this.column) < 2)
      return true;

    if (abs(next_col - this.column) == 2 && this.row == next_row && this.timesMoved == 0){

      //calculate the direction the king is castling in
      let side = (next_col - this.column) / abs(next_col - this.column)
      let rook_pos = [this.row]
      if (next_col < this.column)
        rook_pos.push(0)
      else
        rook_pos.push(7)

      //the king cannot castle into check
      for(let row = 0; row < BOARD.board.length; row++){
        for(let col = 0; col < BOARD.board.length; col++){
          if (BOARD.board[row][col] != 'EMPTY'){
            if (BOARD.board[row][col].white != this.white){

              //if a piece is attacking one to the castling side then no castle
              if (BOARD.board[row][col].valid_move(this.row,this.column + side))
                return false;

              //if a piece is attacking two to the castling side then no castle
              if (BOARD.board[row][col].valid_move(this.row,this.column + 2 * side))
                return false;
            }
          }
        }
      }

      let rook = BOARD.board[rook_pos[0]][rook_pos[1]]
      if (rook != 'EMPTY')
        if (rook.timesMoved == 0)
          if (rook.valid_move_for_rook(this.row, this.column + side)){
            rook.column = this.column + side;
            rook.timesMoved += 1;
            BOARD.board[next_row][this.column + side] = rook;
            return true
          }
    }

    return false;
  }

}
