input.onPinPressed(TouchPin.P0, function on_pin_pressed_p0() {
    if (gameOn == 1) {
        gameOn = 0
    } else {
        gameOn = 1
    }

})
input.onButtonPressed(Button.A, function on_button_pressed_a() {
    if (dx != 0) {
        dy = dx * -1
        dx = 0
    } else if (dy != 0) {
        dx = dy
        dy = 0
    }
})
input.onButtonPressed(Button.B, function on_button_pressed_b() {
    if (dx != 0) {
        dy = dx
        dx = 0
    } else if (dy != 0) {
        dx = dy * -1
        dy = 0
    }
})
function showPoints() {
    for (let p of points) {
        led.plot(p[0], p[1])
    }
}

let tick = 0
let dy = 0
let dx = 1
let gameOn = 1
let points = [[2, 3], [2, 4], [3,4]]
let head, x, y, tail
basic.forever(function on_forever() {
    showPoints()
    basic.pause(500)
    tick += 1
    if (gameOn == 1 && tick % 2 == 0) {
        tail = points.pop()
        led.unplot(tail[0], tail[1])
        //  move head
        head = points[0]
        x = (((head[0] + dx) % 5) + 5) % 5
        y = (((head[1] + dy) % 5) + 5) % 5
        points.unshift([x, y])
    }
})
