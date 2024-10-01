import sys
import pytesseract
from PIL import Image
import json

# Path to the Tesseract executable
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'  # Update if necessary

# Get the image path from the command-line arguments
image_path = sys.argv[1]

# Function to extract text from an image
def extract_text_from_image(image_path):
    img = Image.open(image_path)  # Open the image
    text = pytesseract.image_to_string(img)  # Extract text using pytesseract
    return text

# Main block to execute when the script is called
if __name__ == "__main__":
    extracted_text = extract_text_from_image(image_path)
    print(json.dumps({"text": extracted_text}))  # Output the extracted text as JSON
