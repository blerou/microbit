input.onPinPressed(TouchPin.P0, function () {
    gameOn = !(gameOn)
})
function showSnake () {
    for (let p of snake) {
        led.plot(p[0], p[1])
    }
}
input.onButtonPressed(Button.A, function () {
    if (!(changeDirection)) {
        if (dx != 0) {
            dy = dx * -1
            dx = 0
        } else if (dy != 0) {
            dx = dy
            dy = 0
        }
        changeDirection = true
    }
})
function nextHead () {
    head = snake[0]
    x = ((head[0] + dx) % 5 + 5) % 5
    y = ((head[1] + dy) % 5 + 5) % 5
    return [x, y]
}
input.onButtonPressed(Button.B, function () {
    if (dx != 0) {
        dy = dx
        dx = 0
    } else if (dy != 0) {
        dx = dy * -1
        dy = 0
    }
})
input.onPinPressed(TouchPin.P1, function () {
    speed = (speed + 1) % speedSteps
})
let dy = 0
let changeDirection = false
let speed = 0
let speedSteps = 0
let dx = 0
let snake: number[][] = []
let gameOn = false
let head, x, y, tail, sleep, nh
// init
gameOn = true
snake = [[2, 3], [2, 4]]
dx = 1
speedSteps = 3
speed = speedSteps-1
// game loop
basic.forever(function () {
    sleep = speed * 200 + 100
    showSnake()
    basic.pause(sleep)
    if (gameOn) {
        // move head
        nh = nextHead()
        snake.unshift(nh)
        tail = snake.pop()
        led.unplot(tail[0], tail[1])
        // reinit state
        changeDirection = false
    }
})
