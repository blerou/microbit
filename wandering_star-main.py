import microbit
import random

# center coord (i, j) & pulse intensity (p)
i, j, p = 2, 2, 9
# ranges for values
ri, rj, rp = (0, 4), (0, 4), (6, 9)

# longest distant pixel
lij = abs(ri[0] - ri[1]) + abs(rj[0] - rj[1])

ds = [-1, 0, 1]

while True:
    microbit.sleep(100)
    for x in range(5):
        for y in range(5):
            dy, dx = abs(i - y), abs(j - x)
            dist = (lij-(dx+dy))/lij
            microbit.display.set_pixel(x, y, max(1, int(p*dist)))
    
    # deltas for values
    regen = True
    while regen:
        di, dj = random.choice(ds), random.choice(ds)
        if i == ri[1] and di > 0 or i == ri[0] and di < 0 or j == rj[1] and dj > 0 or j == rj[0] and dj < 0:
            continue
        regen = False
    i += di
    j += dj

    regen = True
    while regen:
        dp = random.choice(ds)
        if p <= rp[0] and dp < 0 or p >= rp[1] and dp > 0:
            continue
        regen = False
    p += dp
