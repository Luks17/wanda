
import sys
import os
from zipfile import ZipFile


file_location = sys.argv[1]

with ZipFile(file_location, "r") as zippedFile:
    zippedFile.extractall()

os.remove(file_location)
