

//********************************************************
// Board

function Board() {
  this.init = function(container, gameSate) {
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }  

    this.gameState = gameState
    this.container = container
    this.pips = []
    this.board_rect = container.getBoundingClientRect();

    w = this.board_rect.width / 13
    h = (this.board_rect.height / 12) * 5

    this.max_stack = 5

    this.checker_size = h / this.max_stack
    this.checker_offset = (w - this.checker_size) / 2
    this.die_size = this.board_rect.height - 2 * h - 10
    
    this.create_pips()
    this.create_dice()
  }

  this.create_pips = function() {
    w = this.board_rect.width / 13
    h = (this.board_rect.height / 12) * 5
    y = (this.board_rect.height / 12) * 7
    x = this.board_rect.width

    black = true

    pipnum = 0  
    for (var i = 0; i < 13; i ++, pipnum++) {
      x -= w
      if (i == 6) {
        pipnum--
        continue
      }
      var pip = new Pip(board, x, y, w, h, pipnum, black)
      e = document.createElement("svg")
      pip.bind(e)
      this.container.appendChild(e)
      this.pips.push(pip)
      black = !black
    }
    
    black = true
    y = 0
    x = -w
    pipnum = 12
    for (var i = 0; i < 13; i++, pipnum++) {
      x += w
      if (i == 6) {
        pipnum--
        continue
      }
      var pip = new Pip(board, x, y, w, h, pipnum, black)
      e = document.createElement("svg")
      pip.bind(e)
      this.container.appendChild(e)
      this.pips.push(pip)
      black = !black
    }
  }

  this.create_dice = function() {
    y = this.board_rect.height / 2
    y -= this.die_size / 2

    this.dice = []
    this.dice[0] = new Die(30, y, this.die_size, true)
    this.dice[1] = new Die(30 + 5 + this.die_size, y, this.die_size, true)
    this.dice[2] = new Die(this.board_rect.width - 35 - 2 * this.die_size, y, this.die_size, false)
    this.dice[3] = new Die(this.board_rect.width - 30 - this.die_size, y, this.die_size, false)

    this.dice.forEach((function(die) {
      e = document.createElement("svg")
      die.bind(e)
      this.container.appendChild(e)
    }).bind(this))
  }

  this.update_game_state = function() {
    for (var i = 0; i < 24; i++) {
      this.pips[i].set_checkers(Math.abs(gameState.checkers[i]), gameState.checkers[i] < 0)
    }

    if (this.gameState.on_turn() == 0) {
      this.dice[0].element.style.visibility = 'hidden'
      this.dice[1].element.style.visibility = 'hidden'
      this.dice[2].element.style.visibility = 'visible'
      this.dice[3].element.style.visibility = 'visible'

      this.dice[2].value = this.gameState.dice[0]
      this.dice[3].value = this.gameState.dice[1]

      this.dice[2].render()
      this.dice[3].render()
    }
    else {
      this.dice[2].element.style.visibility = 'hidden'
      this.dice[3].element.style.visibility = 'hidden'
      this.dice[0].element.style.visibility = 'visible'
      this.dice[1].element.style.visibility = 'visible'

      this.dice[0].value = this.gameState.dice[0]
      this.dice[1].value = this.gameState.dice[1]

      this.dice[0].render()
      this.dice[1].render()
    }
  }

  this.set_pip_click_handler = function(handler) {
    this.pip_click_handler = handler

    this.pips.forEach(function(pip) {
      pip.element.onclick = handler
    })
  }

  this.set_dice_click_handler = function(handler) {
    this.dice_click_handler = handler

    this.dice.forEach(function(die) {
      die.element.onclick = handler
    })
  }

  this.move_checker = function(from, to, game, transitionCb) {
    from_pip = this.pips[from]
    to_pip = this.pips[to]

    if (from_pip.checkers[from] == 0)
      return

    from_checker = from_pip.checkers.pop()

    from_pip.set_checkers(from_pip.checkers.length, from_checker.style == 'black')

    start_pos = this.checker_pos_on_board(from_pip.pip, from_pip.checkers.length)
    element = document.createElement('svg')
    from_checker.x = start_pos.x + this.checker_offset
    from_checker.y = start_pos.y
    from_checker.bind(element)
    
    this.container.appendChild(element)

    to_pos = this.checker_pos_on_board(to_pip.pip, Math.abs(game.checkers[to]) - 1)
    
    var context = {board: this, 
      to_pip: to_pip, 
      to_pos: to_pos, 
      element: element,
      from_checker: from_checker,
      callback: transitionCb
    }
    setTimeout(this.start_checker_transition.bind(context), 1)
  }  

  this.start_checker_transition = function() {
    this.element.style.transition = '1s'
    this.element.style.left = to_pos.x + this.board.checker_offset + 'px'
    this.element.style.top = to_pos.y + 'px'
    this.element.event_context = this
    
    this.element.addEventListener("transitionend", this.board.finalize_checker_transition)
  }

  this.finalize_checker_transition = function(event) {
    if (event.propertyName != 'left')
      return
    context = event.currentTarget.event_context
    context.to_pip.set_checkers(context.to_pip.checkers.length + 1, context.from_checker.style == 'black')
    context.board.container.removeChild(context.element)
    context.callback.call()
  }

  this.checker_pos_on_board = function(pip, numCheckers) {
    h = this.board_rect.height / 12

    x = this.pips[pip].x
    if (pip < 12) {
      y = this.board_rect.height - (numCheckers + 1) * h
    }
    else {
      y = numCheckers * h
    }

    return {x: x, y: y}
  }
}

//********************************************************
// Pip

Pip.prototype = Object.create(BoardElement.prototype)

function Pip(board, x, y, w, h, pip, black) {
  BoardElement.call(this, x, y, w, h)

  this.board = board
  this.pip = pip
  this.style = black ? 'black' : 'white'
  this.checkers = []

  this.render = function() {
    var points = ""
    if (this.pip > 11) {
      points += 0 + ',' + 0 + ' ' + 
                this.w + ',' + 0 + ' ' + 
                (this.w / 2) + ',' + this.h
    }
    else {
      points += 0 + ',' + this.h + ' ' + 
                (this.w / 2) + ',' + 0 + ' ' + 
                this.w + ',' + this.h
    }

    svg = '<svg class="pip" data-style="' + this.style + '" width="' + this.w + '" height="' + this.h + '"> \
            <polygon points="' + points + '"/> \
          </svg>'
    
    this.element.innerHTML = svg
  }

  this.set_checkers = function(num, black) {
    while (this.element.firstChild) {
        this.element.removeChild(this.element.firstChild);
    }

    this.render()

    this.checkers = []

    y = this.h - this.board.checker_size
    dir = -this.board.checker_size
    if (this.pip > 11) {
      dir = this.board.checker_size
      y = 0
    }

    for (var i = 0; i < num; i++) {
      checker = new Checker(this.board.checker_offset, y, this.board.checker_size, this.pip, black)
      element = document.createElement("svg")
      checker.bind(element)
      this.element.appendChild(element)
      checker.render()
      this.checkers.push(checker)
      y += dir
    }
  }

}

Checker.prototype = Object.create(BoardElement.prototype)

function Checker(x, y, w, pip, black) {
  BoardElement.call(this, x, y, w, w)

  this.pip = pip
  this.style = black ? 'black' : 'white'

  this.render = function() {

    svg = '<svg class="checker" data-style="' + this.style + '" width="' + this.w + '" height="' + this.h + '"> \
            <circle cx="' + (this.w / 2) + '" cy="' + (this.w / 2) + '" r="' + (this.w / 2) + '"/> \
           </svg>'

    this.element.innerHTML = svg   
  }
}

//********************************************************
// Die

Die.prototype = Object.create(BoardElement.prototype)

function Die(x, y, w, black) {
  BoardElement.call(this, x, y, w, w)

  this.value = 1
  this.style = black ? 'black' : 'white'

  this.render = function() {
            
     svg = '<svg class="die" data-style="' + this.style + '" width="' + this.w + '" height="' + this.h + '"> \
              <rect x="0" y="0" width="' + this.w + '" height="' + this.h + '" rx="5" ry="5"/> \
              <text x="' + (this.w / 2) + '" y="' + (this.h / 2) + '" dy="' + (this.h / 4) + '" \
               style="text-anchor:middle;font-size:' + (this.h - 6) + 'px;fill:black;stroke:black">' + this.value + '</text> \
           </svg>'

    this.element.innerHTML = svg   
   
  }
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
