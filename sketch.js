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

let ROWS = 8;
let COLUMNS = 8;

let box_width = SCREEN_WIDTH / COLUMNS;
let box_height = SCREEN_HEIGHT / ROWS;

function preload() {
  BLACK_BISHOP = loadImage('pieces/Chess_bishop_black.png');
  WHITE_BISHOP = loadImage('pieces/Chess_bishop_white.png');
  BLACK_ROOK   = loadImage('pieces/Chess_rook_black.png');
  WHITE_ROOK   = loadImage('pieces/Chess_rook_white.png');
  BLACK_PAWN   = loadImage('pieces/Chess_pawn_black.png');
  WHITE_PAWN   = loadImage('pieces/Chess_pawn_white.png');
  WHITE_KING   = loadImage('pieces/Chess_king_white.png');
  BLACK_KING   = loadImage('pieces/Chess_king_black.png');
  WHITE_KNIGHT = loadImage('pieces/Chess_knight_white.png');
  BLACK_KNIGHT = loadImage('pieces/Chess_knight_black.png');
  WHITE_QUEEN  = loadImage('pieces/Chess_queen_white.png');
  BLACK_QUEEN  = loadImage('pieces/Chess_queen_black.png');
}

function setup() {

  createCanvas(SCREEN_WIDTH, SCREEN_HEIGHT);
  background(150);


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



function mousePressed(){

  //if the mouse click is outside of the board then ignore it
  if (BOARD.off_the_board(mouseX, mouseY))
    return;

    //get the row and column selected
  	let row = int(mouseY / SCREEN_HEIGHT * ROWS);
  	let col = int(mouseX / SCREEN_WIDTH * COLUMNS);

    //if the entry is not empty and it is the players turn then set the piece that is selected
    if (!BOARD.is_empty(row, col))

      if(BOARD.on_turn(row, col))
        BOARD.piece_selected = BOARD.board[row][col];
    

}

function mouseDragged(){
  //if a piece is selected draw it as it is dragged
  if (BOARD.piece_selected != "EMPTY"){
    BOARD.board[BOARD.piece_selected.row][BOARD.piece_selected.column] = 'EMPTY';
    BOARD.draw_board();

    //display the piece at wherever the piece is dragged
    if (mouseX < SCREEN_WIDTH - 10 & mouseX > 0 & mouseY < SCREEN_HEIGHT & mouseY > 0)
      BOARD.piece_selected.display_at(mouseX, mouseY);

    
  }
}

function mouseReleased(){
  if (BOARD.off_the_board(mouseX, mouseY))
    return
    
  //if a piece has been selected we have conditions to deal with
  if (BOARD.is_holding_piece()){

    let piece = BOARD.get_piece();

    let row = int(mouseY / SCREEN_HEIGHT * ROWS);
  	let col = int(mouseX / SCREEN_WIDTH * COLUMNS);


    //if the row and column are valid then try and place it
    if (piece.valid_move(row, col))
      BOARD.move_piece(row, col);
    else {
      BOARD.board[piece.row][piece.column] = piece;
      BOARD.piece_selected = "EMPTY";
    }
  }
    
  BOARD.draw_board();
}


class Board {

  constructor(){
    this.turn = true;
    this.piece_selected = 'EMPTY';

    let board = [];
    for (let row = 0; row < ROWS; row++){
      let row = [];

      for (let col = 0; col < COLUMNS; col++)
        row.push('EMPTY')

      board.push(row)
    }

    this.board = board;

  }

  move_piece(r, c) {
    this.board[r][c] = this.piece_selected;
    this.piece_selected.move(r, c);
    this.turn = !this.turn;
    this.piece_selected = "EMPTY";
  }

  get_piece() {
    return this.piece_selected;
  }

  is_holding_piece() {
    return this.piece_selected != "EMPTY";
  }

  off_the_board(x, y) {
    return x > SCREEN_WIDTH || x < 0 || y > SCREEN_HEIGHT || y < 0;
  }

  remove(row, col){
    this.board[row][col] = "EMPTY";
  }

  is_empty(r, c) {
    return this.board[r][c] == "EMPTY";
  }

  on_turn(r, c) {
    return this.turn == this.board[r][c].white;
  }

  draw_board() {

    //set the board's square color
    let green_square = color(0, 100, 0);
    let white_square = color(255, 255, 255);

    let alternator = false;
    let width = box_width;
    let height = box_height;

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

    this.prev_row = row;
    this.prev_col = column;

  }

  move(r, c) {
    this.prev_row = this.row; 
    this.prev_col = this.column;
    this.row = r;
    this.column = c;
    this.timesMoved++;
  }

  display() {
  	let display_row = SCREEN_HEIGHT / ROWS * this.row;
  	let display_column = SCREEN_HEIGHT / COLUMNS * this.column;
    image(this.image, display_column, display_row, SCREEN_WIDTH / ROWS, SCREEN_HEIGHT / COLUMNS);

  }

  display_at(x, y){
    let display_x = x - (SCREEN_WIDTH / ROWS) / 2;
    let display_y = y - (SCREEN_HEIGHT / COLUMNS) / 2
    image(this.image, display_x, display_y, SCREEN_WIDTH / ROWS, SCREEN_HEIGHT / COLUMNS);

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
      direction = 1;

    if(this.row - next_row == 2 * direction 
                    && this.timesMoved == 0 
                    && next_col == this.column
                    && BOARD.board[next_row][next_col] == "EMPTY")
        return true;

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
        let adj_piece = BOARD.board[this.row][next_col];
        if (adj_piece != 'EMPTY')
           if (adj_piece.piece_type == 'PAWN' && adj_piece.white != this.white)
             if (adj_piece.timesMoved == 1){
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
