import cv2

# Threshold for detecting objects
thres = 0.45

# Open the webcam (0 is typically the default camera)
cap = cv2.VideoCapture(0)
cap.set(3, 1280)  # Width
cap.set(4, 720)   # Height
cap.set(10, 70)   # Brightness

# Read class names from coco.names file
classNames = []
classFile = 'coco.names'
with open(classFile, 'rt') as f:
    classNames = f.read().rstrip('\n').split('\n')

# Paths for the model configuration and weights
configPath = 'ssd_mobilenet_v3_large_coco_2020_01_14.pbtxt'
weightsPath = 'frozen_inference_graph.pb'

# Set up the neural network with the pre-trained model
net = cv2.dnn_DetectionModel(weightsPath, configPath)
net.setInputSize(320, 320)
net.setInputScale(1.0 / 127.5)
net.setInputMean((127.5, 127.5, 127.5))
net.setInputSwapRB(True)

# Continuously read frames from the webcam
while True:
    success, img = cap.read()
    if not success:
        print("Failed to capture video")
        break

    # Perform object detection
    classIds, confs, bbox = net.detect(img, confThreshold=thres)
    print(classIds, bbox)

    # Draw bounding boxes and labels if objects are detected
    if len(classIds) != 0:
        for classId, confidence, box in zip(classIds.flatten(), confs.flatten(), bbox):
            if 0 < classId <= len(classNames):
                # Draw a rectangle around detected objects
                cv2.rectangle(img, box, color=(0, 255, 0), thickness=2)
                # Add the label of the detected object
                cv2.putText(img, classNames[classId - 1].upper(), (box[0] + 10, box[1] + 30),
                            cv2.FONT_HERSHEY_COMPLEX, 1, (0, 255, 0), 2)
                # Add the confidence score of detection
                cv2.putText(img, str(round(confidence * 100, 2)), (box[0] + 200, box[1] + 30),
                            cv2.FONT_HERSHEY_COMPLEX, 1, (0, 255, 0), 2)

    # Display the resulting frame with detections
    cv2.imshow("Output", img)

    # Press 'q' to break the loop and close the video window
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release the camera and close all OpenCV windows
cap.release()
cv2.destroyAllWindows()
