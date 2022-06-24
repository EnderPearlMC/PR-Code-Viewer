import cv2
from cv2 import Laplacian

img = cv2.imread("test.png")
img = cv2.resize(img, (300, 300))


#convert to gray

img_gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
# blur img
blur_img = cv2.GaussianBlur(img_gray, (3,3), 0)

# edge detection
edges = cv2.Canny(blur_img, 100, 200)

# laplacian

laplacian = cv2.Laplacian(blur_img, cv2.CV_64F)

#show img

cv2.imshow('image', edges)
cv2.waitKey(0)
cv2.destroyAllWindows()