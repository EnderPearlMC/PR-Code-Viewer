import sys
import cv2
import numpy as np
img = cv2.imread('color.png')
file = open("code_machine.pr", "w")
image = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
# you need to pass a lower range and an upper range for your color as an HSV value(https://blog.blakearchive.org/wp-content/uploads/2019/10/python_hsv.png)
# (if some range are not passed than those range will be left blank ) ex for red => py color.py 1 0,150,20 10,255,255
typeOfDetection = int(sys.argv[1])
argument = sys.argv

def intify(foo):
    foo = foo.split(',')
    for i in range(0, len(foo)):
        foo[i] = int(foo[i])
    return foo


#ajoute une ligne MOVE au fichier .Pr
def AddToPrFile(typeOfCommand, arg1, arg2):
    if(typeOfCommand == "TOOL"):
        # faut ecrire sur un fichier (typeOfCommand, arg1, arg2)
        file.write(typeOfCommand + " " + arg1 + " " +arg2)
        file.write('\n')
    elif(typeOfCommand =="MOVE"):
        # faut ecrire sur un fichier (typeOfCommand, "X:"+str(arg1), "Y:"+str(arg2))
        file.write(typeOfCommand+" X:"+str(arg1) + " Y:"+str(arg2))
        file.write('\n')


if (typeOfDetection == 1):
    cl = intify(argument[2])
    cu = intify(argument[3])
    color_lower = np.array([cl[0], cl[1], cl[2]])
    color_upper = np.array([cu[0], cu[1], cu[2]])
    mask = cv2.inRange(image, color_lower, color_upper)

    #sort out the color et le reste
    isLookingFor255 = True
    start = 0
    for j in range (len(mask)):
        for i in range(len(mask[j])):
            if(isLookingFor255 == True):
                if(mask[j][i] == 255):
                    AddToPrFile("MOVE", j, i)
                    AddToPrFile("TOOL", "T:felt", "P:down")
                    isLookingFor255 = False
            if(isLookingFor255 == False):
                if(mask[j][i] == 0):
                    AddToPrFile("MOVE", j, i)
                    AddToPrFile("TOOL", "T:felt", "P:up") 
                    isLookingFor255 = True
    file.close()

    # cv2.imshow('only color', mask)
    # # cv2.imshow('original', img)

    # cv2.waitKey(0)