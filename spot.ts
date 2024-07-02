// for micro:bit v1.5
let b = [
    0, 1, 2, 2, 2, 2, 2, 1, 0,
    1, 1, 2, 3, 3, 3, 2, 1, 1,
    2, 2, 3, 4, 4, 4, 3, 2, 2,
    2, 3, 4, 5, 5, 5, 4, 3, 2,
    2, 3, 4, 5, 6, 5, 4, 3, 2,
    2, 3, 4, 5, 5, 5, 4, 3, 2,
    2, 2, 3, 4, 4, 4, 3, 2, 2,
    1, 1, 2, 3, 3, 3, 2, 1, 1,
    0, 1, 2, 2, 2, 2, 2, 1, 0
]
let bi

let m = Math.PI / 2 / 7
let c = 16

let frames = [
    [0, 0], [0, 1], [0, 2], [0, 3], [0, 4],
            [1, 4], [2, 4], [3, 4], [4, 4],
            [4, 3], [4, 2], [4, 1], [4, 0],
                    [3, 0], [2, 0], [1, 0]

]
let frame, frame_shift
let fi = 0

let speeds = [5, 6, 7, 8, 6]
let speed
let si = 0

let x, y, shift

basic.forever(function () {
    frame = frames[fi % frames.length]
    let frame_shift = frame[1] * 9 + frame[0]
    for (let i = 0; i < 25; i++) {
        x = i % 5
        y = ~~(i / 5)
        shift = y * 9 + x
        bi = frame_shift + shift
        led.plotBrightness(x, y, ~~(b[bi] * m * c))
    }
    fi += 1
    speed = ~~(speeds[si % speeds.length] * 70)
    speed = 200
    basic.pause(speed)
    si += 1
})
