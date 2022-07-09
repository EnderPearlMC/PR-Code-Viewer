import cv2
from cv2 import Laplacian
import numpy as np
from matplotlib import pyplot as plt

img = cv2.imread("test.png", cv2.IMREAD_GRAYSCALE)
lap = cv2.Laplacian(img, cv2.CV_16S, ksize=3)
lap = np.uint
canny = cv2.Canny(img, 100, 200)
# hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

titles = ['img', 'canny', 'gray']
images = [img, canny, lap]
for i in range(1):
    plt.subplot(1, 2, i+1), plt.imshow(images[i])
    plt.title(titles[i])
    plt.xticks([]), plt.yticks([])



plt.show()
