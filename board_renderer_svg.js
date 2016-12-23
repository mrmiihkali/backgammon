

//********************************************************
// Board

function Board() {}

Board.prototype.init = function(container, gameSate) {
  while (container.firstChild) {
      container.removeChild(container.firstChild);
  }  

  this.gameState = gameState
  this.container = container
  this.pips = []

  var w = container.clientWidth / 14
  var h = (container.clientHeight / 12) * 5

  this.max_stack = 5

  this.checker_size = Math.min(h / this.max_stack, w)
  this.checker_offset = (w - this.checker_size) / 2
  this.die_size = container.clientHeight - 2 * h - 10
  
  this.create_pips()
  this.create_dice()
}

Board.prototype.create_pips = function() {

  function create_pip(board, x, y, w, h, pipnum, black, type) {
    var pip = new Pip(board, x, y, w, h, pipnum, black, type)
    var e = document.createElement("div")
    pip.bind(e)
    board.container.appendChild(e)
    board.pips[pipnum] = pip
  }

  black = true
  pipnum = 0  

  var w = this.container.clientWidth / 14
  var h = (this.container.clientHeight / 12) * 5
  var y = (this.container.clientHeight / 12) * 7
  var x_r = this.container.clientWidth - w
  var x = -w

  // Pips
  for (var i = 0; i < 13; i ++, pipnum++) {
    x_r -= w
    x += w
    if (i == 6) {
      pipnum--
      continue
    }
    // Down
    create_pip(this, x_r, y, w, h, pipnum, black, 'normal')
    // Up
    create_pip(this, x, 0, w, h, pipnum + 12, black, 'normal')
    black = !black
  }
  
  // White bar
  create_pip(this, w * 6, this.container.clientHeight / 2, w, h, 25, false, 'bar')

  // Black bar
  create_pip(this, w * 6, 0, w, h, 24, true, 'bar')

  // White home
  create_pip(this, w * 13, y, w, h, 26, false, 'off')

  // Black home
  create_pip(this, w * 13, 0, w, h, 27, true, 'off')
}

Board.prototype.create_dice = function() {
  y = this.container.clientHeight / 2
  y -= this.die_size / 2

  this.dice = []
  this.dice[0] = new Die(30, y, this.die_size, true)
  this.dice[1] = new Die(30 + 5 + this.die_size, y, this.die_size, true)
  this.dice[2] = new Die(this.container.clientWidth - 35 - 2 * this.die_size, y, this.die_size, false)
  this.dice[3] = new Die(this.container.clientWidth - 30 - this.die_size, y, this.die_size, false)

  this.dice.forEach((function(die) {
    e = document.createElement("div")
    die.bind(e)
    this.container.appendChild(e)
  }).bind(this))
}

Board.prototype.update_dice = function() {
  if (this.gameState.on_turn() == 0) {

    this.dice[0].hide()
    this.dice[1].hide()
    
    this.dice[2].show_with_value(this.gameState.dice[0])
    this.dice[3].show_with_value(this.gameState.dice[1])
  }
  else {
    this.dice[2].hide()
    this.dice[3].hide()
    
    this.dice[0].show_with_value(this.gameState.dice[0])
    this.dice[1].show_with_value(this.gameState.dice[1])
  }
}

Board.prototype.update_game_state = function() {
  for (var i = 0; i < 26; i++) {
    this.pips[i].set_checkers(Math.abs(gameState.checkers[i]), gameState.checkers[i] < 0)
  }

  this.update_dice()
}

Board.prototype.set_pip_click_handler = function(handler) {
  this.pip_click_handler = handler

  this.pips.forEach(function(pip) {
    pip.element.onclick = handler
  })
}

Board.prototype.set_dice_click_handler = function(handler) {
  this.dice_click_handler = handler

  this.dice.forEach(function(die) {
    die.element.onclick = handler
  })
}

Board.prototype.move_checker = function(from, to, transitionCb) {
  from_pip = this.pips[from]
  to_pip = this.pips[to]

  if (from_pip.checkers.length == 0) {
    return
  }  
  from_checker = from_pip.checkers.pop()

  from_pip.set_checkers(from_pip.checkers.length, from_checker.style == 'black')

  start_pos = this.checker_pos_on_board(from_pip.pip, from_pip.checkers.length)
  element = document.createElement('div')
  from_checker.x = start_pos.x + this.checker_offset
  from_checker.y = start_pos.y
  from_checker.bind(element)
  
  this.container.appendChild(element)

  var to_pos = this.checker_pos_on_board(to_pip.pip, Math.abs(this.gameState.checkers[to]) - 1)
  
  var context = {board: this, 
    to_pip: to_pip, 
    to_pos: to_pos, 
    element: element,
    from_checker: from_checker,
    callback: transitionCb
  }
  
  setTimeout(this.start_checker_transition.bind(context), 100)
}  

Board.prototype.start_checker_transition = function() {
  
  this.element.addEventListener("transitionend", this.board.finalize_checker_transition)
  this.element.style.transition = 'left 0.5s, top 0.5s, width 0.5s, height 0.5s'
  this.element.event_context = this
  
  var oldleft = this.element.style.left
  var oldtop = this.element.style.top
  var oldheight = this.element.style.height
  var oldwidth = this.element.style.width

  this.element.style.left = this.to_pos.x + this.board.checker_offset + 'px'
  this.element.style.top = this.to_pos.y + 'px'
  this.element.style.width = this.to_pos.w + 'px'
  this.element.style.height = this.to_pos.h + 'px'
  

  this.element.transition_count = 0
  if (oldleft != this.element.style.left)
    this.element.transition_count++
  if (oldtop != this.element.style.top)
    this.element.transition_count++
  if (oldwidth != this.element.style.width)
    this.element.transition_count++
  if (oldheight != this.element.style.height)
    this.element.transition_count++
}

Board.prototype.finalize_checker_transition = function(event) {
  event.currentTarget.transition_count--;
  if (event.currentTarget.transition_count != 0)
    return
  context = event.currentTarget.event_context
  context.to_pip.set_checkers(context.to_pip.checkers.length + 1, context.from_checker.style == 'black')
  context.board.container.removeChild(context.element)
  setTimeout(context.callback.bind(context), 100)
}

Board.prototype.checker_pos_on_board = function(pip, numCheckers) {
  var h = this.checker_size
  var w = this.checker_size
  var pip = this.pips[pip]
  var x = pip.x
  var space = 0
  if (numCheckers > 4)
    space++
  if (numCheckers > 9)
    space++

  if (pip.pip < 12) {
    y = pip.y + pip.h - (numCheckers + 1) * h
  }
  else if (pip.pip < 24) {
    y = numCheckers * h
  }
  else if (pip.pip == 25) {
    y = pip.y + (numCheckers) * h 
  }
  else if (pip.pip == 24) {
    y = pip.y + pip.h - (numCheckers + 1) * h
  }
  else if (pip.pip == 26) {
    h = this.checker_size / 4
    y = pip.y + pip.h - (numCheckers + space + 1) * h
  }
  else if (pip.pip == 27) {
    h = this.checker_size / 4
    y = pip.y + (numCheckers + space) * h 
  }

  return {x: x, y: y, w: w, h: h}
}

//********************************************************
// Pip

Pip.prototype = Object.create(BoardElement.prototype)

function Pip(board, x, y, w, h, pip, black, type) {
  BoardElement.call(this, x, y, w, h)

  this.type = type
  this.board = board
  this.pip = pip
  this.style = black ? 'black' : 'white'
  this.checkers = []
}

Pip.prototype.bind = function(element) {
  Object.getPrototypeOf(Pip.prototype).bind.call(this, element)
  element.classList.add('pip')
}

Pip.prototype.render = function() {
  svg = ''
  if (this.type == 'normal') {
    var points = ""
    if (this.pip > 11) {
      points = "0,0 100,0 50,100"

    }
    else {
      points = "0,100 50,0 100,100"

    }

    var svg = '<svg class="pip board-element" data-style="' + this.style + '" style="width:100%;height:100%"' +
                    ' viewbox="0 0 100 100" preserveAspectRatio="none"> \
                 <polygon points="' + points + '"/> \
               </svg>'
  }
  else if (this.type == 'bar') {

  }
  else { // bore-off

  }

  this.element.innerHTML = svg
}

Pip.prototype.set_checkers = function(num, black) {
  while (this.element.firstChild) {
      this.element.removeChild(this.element.firstChild);
  }

  this.render()

  this.checkers = []

  if (this.type == 'normal' || this.type == 'bar') {
    var y = this.h - this.board.checker_size
    var dir = -this.board.checker_size
    if ((this.pip > 11 && this.pip < 24) || this.pip == 25) {
      dir = this.board.checker_size
      y = 0
    }

    for (var i = 0; i < num; i++) {
      var checker = new Checker(this.board.checker_offset, y, this.board.checker_size, this.board.checker_size, this.pip, black)
      var element = document.createElement("div")
      checker.bind(element)
      this.element.appendChild(element)
      checker.render()
      this.checkers.push(checker)
      y += dir
    }
  }
  else { // Born off
    var h = this.board.checker_size / 4 
    var y = this.element.clientHeight - h

    var dir = -h
    if (this.pip == 27) {
      dir = h
      y = 0
    }

    for (var i = 0; i < num; i++) {
      if ((i + 1) % 6 == 0) {
        y += dir
        num++
        continue
      }
      var checker = new Checker(this.board.checker_offset, y, this.board.checker_size, h, this.pip, black)
      var element = document.createElement("div")
      checker.bind(element)
      this.element.appendChild(element)
      checker.render()
      this.checkers.push(checker)
      y += dir
    }
  }
}

//********************************************************
// Checker

Checker.prototype = Object.create(BoardElement.prototype)

function Checker(x, y, w, h, pip, black) {
  BoardElement.call(this, x, y, w, h)

  this.pip = pip
  this.style = black ? 'black' : 'white'
}

Checker.prototype.bind = function(element) {
  Object.getPrototypeOf(Checker.prototype).bind.call(this, element)
  element.classList.add('checker')
}

Checker.prototype.render = function() {
  var svg = '<svg class="checker board-element" data-style="' + this.style + '" style="width:100%;height:100%"' +
                 ' viewbox="0 0 100 100" preserveAspectRatio="none" > \
              <circle cx="50" cy="50" r="50"/> \
           </svg>'
  this.element.innerHTML = svg   
}

//********************************************************
// Die

Die.prototype = Object.create(BoardElement.prototype)

function Die(x, y, w, black) {
  BoardElement.call(this, x, y, w, w)

  this.value = 1
  this.style = black ? 'black' : 'white'

}

Die.prototype.bind = function(element) {
  Object.getPrototypeOf(Die.prototype).bind.call(this, element)
  element.classList.add('checker')
}

Die.prototype.render = function() {
   var svg = '<svg class="die board-element" data-style="' + this.style + '" style="width:100%;height:100%"' +
                    ' viewbox="0 0 100 100" preserveAspectRatio="none"> \
                <rect x="0" y="0" width="100" height="100" rx="25" ry="25"/> \
                <text x="50" y="50" dy="25" \
                    style="text-anchor:middle;font-size:80;fill:black;stroke:black">' + this.value + '</text> \
            </svg>'

  this.element.innerHTML = svg   
 
}

//********************************************************
// BoardElement

function BoardElement(x, y, w, h) {
  this.x = x
  this.y = y
  this.w = w
  this.h = h
}

BoardElement.prototype.bind = function(element) {
  element.classList.add("board-element")
  this.element = element
  this.element.owner = this
  this.element.style.left = this.x + 'px'
  this.element.style.top = this.y + 'px'
  this.element.style.width = this.w  + 'px'
  this.element.style.height = this.h + 'px'

  this.render()
}  

BoardElement.prototype.hide = function() {
  this.element.style.visibility = 'hidden'
}

BoardElement.prototype.show = function() {
  this.element.style.visibility = 'visible'
}

BoardElement.prototype.show_with_value = function(value) {
  this.value = value
  this.element.style.visibility = 'visible'

  this.render()
}

