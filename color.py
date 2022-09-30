import sys
import cv2
import numpy as np
img = cv2.imread('color.png')
# you need to pass a lower range and an upper range for your color as an HSV value(https://blog.blakearchive.org/wp-content/uploads/2019/10/python_hsv.png)
# (if some range are not passed than those range will be left blank ) ex for red => python color.py 1 0,150,20 10,255,255
typeOfDetection = int(sys.argv[1])
argument = sys.argv

# Create a bitmap from the array

# Trace the bitmap to a path
def intify(foo):
    foo = foo.split(',')
    for i in range(0, len(foo)):
        foo[i] = int(foo[i])
    return foo


def ToPr1(mask):
    for i in range (mask.shape[0]):
        print(len(mask[i]))
        for j in range (len(mask[i])):
            ToPr2()
            
def ToPr2(mask):
    print(j)
    previous = mask[i, j]
    if j == len(mask[i]):
        pass
    elif previous == mask[i, j+1]:
        print("suce")

if (typeOfDetection == 1):
    cl = intify(argument[2])
    cu = intify(argument[3])
    color_lower = np.array([cl[0], cl[1], cl[2]])
    color_upper = np.array([cu[0], cu[1], cu[2]])
    image = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

    mask = cv2.inRange(image, color_lower, color_upper)
    ToPr1(mask)
# cv2.waitKey(0)

