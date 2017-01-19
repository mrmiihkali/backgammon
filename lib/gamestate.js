
var GameState = function() {
  this.reset()
}

GameState.prototype.reset = function() {
  // 0-5 = white home, 18-23 = black home
  // pip[25] = black bar, pip[24] = white bar, pip[26] = white off, pip[27] = black off
  // white checkers = positive, black checkers = negative
  // player0 = white, player1 = black
  this.checkers = new Array(28).fill(0)

  // Init state
  this.checkers[0] = -2
  this.checkers[5] = 5
  this.checkers[7] = 3
  this.checkers[11] = -5
  this.checkers[12] = 5
  this.checkers[16] = -3
  this.checkers[18] = -5
  this.checkers[23] = 2

  // Bear off testing
//  this.checkers[0] = 2
//  this.checkers[1] = 2
//  this.checkers[2] = 2
//  this.checkers[3] = 2
//  this.checkers[4] = 0
//  this.checkers[5] = 0
//  this.checkers[18] = -2
//  this.checkers[19] = -2
//  this.checkers[20] = -2
//  this.checkers[21] = -2
//  this.checkers[22] = -2
//  this.checkers[23] = -2

  this.dice = []
  this.roll()

  this.player = 0
  this.dice_moved = 0
}

GameState.prototype.allowed_moves = function(from) {
  var player = this.on_turn()

  var moves = []
  for (d in this.dice) {
    var to = this.to_pip(from, this.dice[d], player)
    var allowed = this.allowed_move(from, this.dice[d], player)
    moves.push({to: to, allowed: allowed})
  }

  return moves
}

GameState.prototype.can_move = function() {
  var player = this.on_turn()
  
  if (this.to_move() == -1)
    return false

  for (var d = this.dice_moved; d < this.dice.length; d++) {
    for (var i = 0; i < 26; i++) {
      var to_move = this.dice[d]
      if (this.allowed_move(i, to_move, player))
        return true
  }
  }

  return false
}

GameState.prototype.allowed_move = function(from, to_move, player) {
  if (to_move == -1)
    return false

  if (from > 25) // Already bore off
    return false

  var to = this.to_pip(from, to_move, player);

  // Make more strict; check also player...
  if (from < 0 || from > 27 || to < 0 || to > 27) 
    return false

  var checkers_from = this.checkers[from]
  if (checkers_from == 0)
    return false

  // Is there checkers to move?
  if ((checkers_from < 0 && player == 0) ||
      (checkers_from > 0 && player == 1))
    return false

  var checkers_to = this.checkers[to]
  // Is there block?
  if ((checkers_to < -1 && player == 0) ||
      (checkers_to > 1 && player == 1))
    return false

  // Sanity; player0 should never be on player1 bar
  if ((from == 24 && player == 1 ||
      (from == 25 && player == 0))) {
    throw "Invalid gamestate!"
    return false
  }

  var last_checker_pip = 1000
  if (player == 0) {
    for (var i = 23; i >= 0; i--) {
      if (this.checkers[i] > 0) {
        last_checker_pip = i
        break
      }
    }
  }
  else {
    for (var i = 0; i < 24; i++) {
      if (this.checkers[i] < 0) {
        last_checker_pip = i
        break
      }
    }
  }

  // Should bar be moved first?
  bar_checkers = player == 0 ? this.checkers[24] : this.checkers[25]
  if ((bar_checkers > 0 && from != 24) ||
      (bar_checkers < 0 && from != 25)) {
    return false
  }

  // Is bear of allowed?
  if (to == 26 || to == 27) {
    if ((last_checker_pip > 6 && player == 0) ||
        (last_checker_pip < 18 && player == 1))
      return false

    if (player == 0 && last_checker_pip > from && (from + 1) != to_move)
      return false

    if (player == 1 && last_checker_pip < from && (24 - from) != to_move)
      return false
  }

  return true
}

GameState.prototype.to_pip = function(from, to_move, player) {
  var to;
  if (player == 0) {
    to = from - to_move
    if (to < 0)
      to = 26 // Bear off
  }
  else {
    if (from > 23) // From bar
      to = to_move - 1
    else
      to = from + to_move

    if (to > 23)
      to = 27 // Bear off
  }

  return to    
}

GameState.prototype.move_from = function(from) {
  var to_move = this.to_move()
  var player = this.on_turn()
  var checker = this.checkers[from] < 0 ? 1 : 0

  if (checker != player)
    return null;

  var to = this.to_pip(from, to_move, player);

  if (this.allowed_move(from, to_move, player) == false)
    return null

  move = gameState.move(from, to, player)
  if (move == null)
    return null

  gameState.moved()

  move.push({from: from, to: to, player: player})
  return move
}

GameState.prototype.moved = function() {
  if (this.dice_moved == this.dice.length)
    return
  this.dice_moved += 1
}

GameState.prototype.on_turn = function() {
  return this.player
}

GameState.prototype.end_turn = function() {
  this.roll()
  this.change_player()
}

GameState.prototype.change_player = function() {
  this.player = this.player == 0 ? 1 : 0
  return this.player
}

GameState.prototype.to_move = function() {
  if (this.dice_moved >= this.dice.length)
    return -1;
  return this.dice[this.dice_moved]
}

GameState.prototype.roll = function() {
  die1 = Math.floor(Math.random() * 6) + 1
  die2 = Math.floor(Math.random() * 6) + 1

  this.dice = []
  this.dice.push(Math.max(die1, die2))
  this.dice.push(Math.min(die1, die2))
  
  if (this.dice[0] < this.dice[1])
    this.swap_dice()

  if (this.dice[0] == this.dice[1]) {
    this.dice.push(this.dice[0])
    this.dice.push(this.dice[0])
  }

  this.dice_moved = 0
}

GameState.prototype.swap_dice = function() {
  if (this.dice_moved != 0 || this.dice[0] == this.dice[1])
    return

  tmp = this.dice[0]
  this.dice[0] = this.dice[1]
  this.dice[1] = tmp
}

GameState.prototype.move = function(from, to, player) {
  ret = []
  if (player == 0) {
    dir = 1
    if (this.checkers[from] < 1 || this.checkers[to] < 0) {
      if (this.checkers[to] == -1) {
        this.checkers[to] = 0
        this.checkers[25]--

        ret.push({from: to, to: 25, player: 1})
      }
      else {
        return null
      }
    }
  }
  else {
    dir = -1
    if (this.checkers[from] > 0 || this.checkers[to] > 0) {
      if (this.checkers[to] == 1) {
        this.checkers[to] = 0
        this.checkers[24]++

        ret.push({from: to, to: 24, player: 0})
      }
      else {
        return null
      }
    }
  }

  this.checkers[from] -= dir
  this.checkers[to] += dir

  return ret
}

module.exports = GameState

