from microbit import *

i, j = 1, 1
di, dj = 1, 0
while True:
    sleep(100)
    display.clear()
    for x in range(5):
        for y in range(5):
            dy, dx = abs(i - y), abs(j - x)
            if dx == 0 and dy == 0:
                display.set_pixel(x, y, 9)
            elif dx == 1 and dy == 0 or dy == 1 and dx == 0:
                display.set_pixel(x, y, 6)
            elif dx == 2 and dy == 0 or dy == 2 and dx == 0:
                display.set_pixel(x, y, 3)
            else:
                display.set_pixel(x, y, 0)
    if i == 3 and di > 0:
        di, dj = 0, 1
    elif i == 1 and di < 0:
        di, dj = 0, -1
    elif j == 3 and dj > 0:
        di, dj = -1, 0
    elif j == 1 and dj < 0:
        di, dj = 1, 0
    i += di
    j += dj
        
    
    
