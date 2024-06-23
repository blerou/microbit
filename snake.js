input.onPinPressed(TouchPin.P0, function () {
    gameOn = !(gameOn)
})
input.onPinPressed(TouchPin.P1, function () {
    speed = (speed + 1) % speedSteps
})
input.onButtonPressed(Button.A, function () {
    if (dx != 0) {
        dy = dx * -1
        dx = 0
    } else if (dy != 0) {
        dx = dy
        dy = 0
    }
})
input.onButtonPressed(Button.B, function () {
    if (dx != 0) {
        dy = dx
        dx = 0
    } else if (dy != 0) {
        dx = dy * -1
        dy = 0
    }
})
function showSnake() {
    for (let p of snake) {
        led.plot(p[0], p[1])
    }
}
let tick = 0
let dy = 0
let speed = 0
let speedSteps = 0
let dx = 0
let snake: number[][] = []
let gameOn = false
let head, x, y, nextHead, tail, sleep
// init
gameOn = true
snake = [[2, 3], [2, 4]]
dx = 1
speedSteps = 3
speed = speedSteps
// game loop
basic.forever(function () {
    sleep = speed * 200 + 100
    showSnake()
    basic.pause(sleep)
    tick += 1
    if (gameOn && tick % 2 == 0) {
        // move head
        head = snake[0]
        x = ((head[0] + dx) % 5 + 5) % 5
        y = ((head[1] + dy) % 5 + 5) % 5
        nextHead = [x, y]
        snake.unshift(nextHead)
        tail = snake.pop()
        led.unplot(tail[0], tail[1])
    }
})
