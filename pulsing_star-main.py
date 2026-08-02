from microbit import *

# center coord (i, j) & pulse intensity (p)
i, j, p = 2, 2, 9
# ranges for values
ri, rj, rp = (0, 4), (0, 4), (6, 9)
# deltas for values
di, dj, dp = -1, 0, 1

# longest distant pixel
lij = abs(ri[0] - ri[1]) + abs(rj[0] - rj[1])

while True:
    sleep(100)
    for x in range(5):
        for y in range(5):
            dy, dx = abs(i - y), abs(j - x)
            dist = (lij-(dx+dy))/lij
            display.set_pixel(x, y, max(1, int(p*dist)))
    
    if i == ri[1] and di > 0:
        di, dj = 0, 1
    elif i == ri[0] and di < 0:
        di, dj = 0, -1
    elif j == rj[1] and dj > 0:
        di, dj = -1, 0
    elif j == rj[0] and dj < 0:
        di, dj = 1, 0
    i += di
    j += dj

    if p <= rp[0] and dp < 0 or p >= rp[1] and dp > 0:
        dp *= -1
    p += dp
        
    
    
