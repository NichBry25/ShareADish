from ..core import config
import cloudinary.uploader
from cloudinary.utils import cloudinary_url
import uuid, time, secrets
from io import BytesIO
import os


def upload(file: BytesIO) -> str: 
    '''
    Input has to be an image byte, will return url to the image
    '''
    id = f"{int(time.time())}_{uuid.uuid4().hex}_{secrets.token_hex(4)}" # uuid + time + random hex to make sure its unique
    upload_result = cloudinary.uploader.upload(file,public_id=id)
    return upload_result["secure_url"]

if __name__ == '__main__':
    file_path = input("Enter the path of the image to upload: ").strip()

    if not os.path.isfile(file_path):
        print("File does not exist!")
    else:
        with open(file_path, "rb") as f:
            file_bytes = BytesIO(f.read())

        url = upload(file_bytes)
        print("Secure URL:", url)
        print(type(url))
