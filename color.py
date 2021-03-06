import sys
import cv2
import numpy as np
import potrace
img = cv2.imread('color.png')
bmp = potrace.Bitmap(img)
path = bmp.trace()
# you need to pass a lower range and an upper range for your color as an HSV value(https://blog.blakearchive.org/wp-content/uploads/2019/10/python_hsv.png)
# (if some range are not passed than those range will be left blank ) ex for red => py color.py 1 0,150,20 10,255,255
typeOfDetection = int(sys.argv[1])
argument = sys.argv

def intify(foo):
    foo = foo.split(',')
    for i in range(0, len(foo)):
        foo[i] = int(foo[i])
    return foo


if (typeOfDetection == 1):
    cl = intify(argument[2])
    cu = intify(argument[3])
    color_lower = np.array([cl[0], cl[1], cl[2]])
    color_upper = np.array([cu[0], cu[1], cu[2]])
    image = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

    mask = cv2.inRange(image, color_lower, color_upper)
    canny = cv2.Canny(mask, 400, 500)
    print(path)
    cv2.imshow('only color', path)
    # cv2.imshow('original', img)

    cv2.waitKey(0)
