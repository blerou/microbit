namespace snake {

    const enum GameState {
        Paused,
        On,
    }

    interface point {
        readonly x: number;
        readonly y: number;
    }
    type egg = {
        readonly x: number;
        readonly y: number;
        show: boolean;
        collected: boolean;
    }

    let dir: point, newDir: point
    let speed = 0
    let speedLevels: number[] = []
    let gameOn = GameState.Paused
    let snake: point[] = []
    let egg: egg

    export function pauseResumeGame() {
        gameOn = gameOn == GameState.On ? GameState.Paused : GameState.On
    }

    export function nextLevel() {
        speed = (speed + 1) % speedLevels.length
    }

    export function turnLeft() {
        if (dir.x != 0) {
            newDir = { x: 0, y: dir.x * -1 }
        } else if (dir.y != 0) {
            newDir = { x: dir.y, y: 0 }
        }
    }

    export function turnRight() {
        if (dir.x != 0) {
            newDir = { x: 0, y: dir.x }
        } else if (dir.y != 0) {
            newDir = { x: dir.y * -1, y: 0 }
        }
    }

    function show() {
        // snake
        for (let p of snake) {
            led.plot(p.x, p.y)
        }
        if (tail) {
            led.unplot(tail.x, tail.y)
            tail = null
        }
        // egg
        if (egg.collected || egg.show) {
            led.plot(egg.x, egg.y)
        } else {
            led.unplot(egg.x, egg.y)
        }
    }

    function nextHead() {
        let head = snake[0]
        let x = ((head.x + dir.x) % 5 + 5) % 5
        let y = ((head.y + dir.y) % 5 + 5) % 5
        return { x: x, y: y }
    }

    function genEgg(): egg {
        let x: number, y: number
        do {
            x = Math.floor(Math.random() * 5)
            y = Math.floor(Math.random() * 5)
        } while (snake.filter(el => el.x == x && el.y == y).length > 0)
        return { x: x, y: y, show: true, collected: false }
    }

    let tick: number
    let showEgg: boolean
    let tail: point = null

    export function init() {
        gameOn = GameState.On
        snake = [{ x: 2, y: 3 }, { x: 2, y: 4 }]
        dir = { x: 1, y: 0 }
        newDir = dir
        speedLevels = [5, 3, 1]
        speed = 0
        egg = genEgg()
        tick = 0
    }

    // TODO win condition -> N long snake after egg "internalized"
    // TODO lose condition -> snake bite itself
    // TODO after win at a level (speed) move to the next
    // TODO win animation
    // TODO lose animation
    // TODO final animation after defeating the game at ultra speed
    // TODO(IDEA) replay back (A) and forth (B) ?

    export function gameStep() {
        show()
        basic.pause(100)
        if (tick % 2 == 0) {
            egg.show = !egg.show
        }
        if (gameOn == GameState.On && (tick % speedLevels[speed]) == 0) {
            dir = newDir
            // move head
            let newHead = nextHead()
            tail = snake.pop()
            snake.unshift(newHead)
            if (newHead.x == egg.x && newHead.y == egg.y) {
                // TODO egg collected animation
                // IDEA brighter snake with each egg collected
                egg.collected = true
            } else if (tail.x == egg.x && tail.y == egg.y) {
                snake.push(tail)
                egg = genEgg()
            }
        }
        tick += 1
    }
}
input.onPinPressed(TouchPin.P0, snake.pauseResumeGame)
input.onButtonPressed(Button.A, snake.turnLeft)
input.onButtonPressed(Button.B, snake.turnRight)
input.onPinPressed(TouchPin.P1, snake.nextLevel)
basic.forever(snake.gameStep)
snake.init()
