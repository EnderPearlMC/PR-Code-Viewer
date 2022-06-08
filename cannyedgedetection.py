import cv2
import numpy as np
from matplotlib import pyplot as plt

img = cv2.imread("test.png", cv2.IMREAD_GRAYSCALE)
lap = cv2. Laplacian(img, cv2.CV_64f, ksize=3)
lap = np.uint
canny = cv2.Canny(img, 100, 200)

titles = ['img', 'canny']
images = [img, canny]
for i in range(2):
    plt.subplot(1, 2, i+1), plt.imshow(images[i], 'gray')
    plt.title(titles[i])
    plt.xticks([]), plt.yticks([])

plt.show()