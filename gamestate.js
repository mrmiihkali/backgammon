
GameState = function() {

  this.reset = function() {
    this.checkers = new Array(27).fill(0)

    this.checkers[0] = -2
    this.checkers[5] = 5
    this.checkers[7] = 3
    this.checkers[11] = -5
    this.checkers[12] = 5
    this.checkers[16] = -3
    this.checkers[18] = -5
    this.checkers[23] = 2

    this.dice = []
    this.roll()

    this.player = 0
    this.dice_moved = 0
  }

  this.moved = function() {
    if (this.dice_moved == 2)
      return
    this.dice_moved += 1
  }

  this.on_turn = function() {
    return this.player
  }

  this.change_player = function() {
    this.player = this.player == 0 ? 1 : 0
    return this.player
  }

  this.to_move = function() {
    if (this.dice_moved > 1)
      return -1;
    return this.dice[this.dice_moved]
  }

  this.roll = function() {
    die1 = Math.floor(Math.random() * 6) + 1
    die2 = Math.floor(Math.random() * 6) + 1

    this.dice[0] = Math.max(die1, die2)
    this.dice[1] = Math.min(die1, die2)
    this.dice_moved = 0
  }

  this.move = function(from, to, player) {
    if (player == 0) {
      dir = 1
      if (this.checkers[from] < 1 || this.checkers[to] < 0) {
        return false
      }
    }
    else {
      dir = -1
      if (this.checkers[from] > 0 || this.checkers[to] > 0) {
        return false
      }
    }

    this.checkers[from] -= dir
    this.checkers[to] += dir

    return true
  }

  this.reset()

}
