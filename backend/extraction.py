import pytesseract
from PIL import Image
import sys

# Path to the Tesseract executable
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# Get the image path from the command-line arguments
image_path = sys.argv[1]

def extract_text_from_image(image_path):
    # Open the image file
    img = Image.open(image_path)
    
    # Extract text from image
    text = pytesseract.image_to_string(img)
    
    return text

# Call the function and print the extracted text (which will be captured by Node.js)
extracted_text = extract_text_from_image(image_path)
print(extracted_text)
