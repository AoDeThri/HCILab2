#!flask/bin/python
################################################################################################################################
# ------------------------------------------------------------------------------------------------------------------------------
# This file implements the REST layer. It uses flask micro framework for server implementation. Calls from front end reaches 
# here as json and being branched out to each projects. Basic level of validation is also being done in this file. #                                                                                                                                  	       
# -------------------------------------------------------------------------------------------------------------------------------
################################################################################################################################
from flask import Flask, jsonify, abort, request, make_response, url_for, redirect, render_template
from flask_httpauth import HTTPBasicAuth
from werkzeug.utils import secure_filename
import os
import shutil
import numpy as np
from search import *
import tarfile
from datetime import datetime
from scipy import ndimage

# from scipy.misc import imsave

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
from tensorflow.python.platform import gfile

app = Flask(__name__, static_url_path="")
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
auth = HTTPBasicAuth()

# ==============================================================================================================================
#                                                                                                                              
#    Loading the extracted feature vectors for image retrieval                                                                 
#                                                                          						        
#                                                                                                                              
# ==============================================================================================================================
extracted_features = np.zeros((10000, 2048), dtype=np.float32)
with open('saved_features_recom.txt') as f:
    for i, line in enumerate(f):
        extracted_features[i, :] = line.split()
print("loaded extracted_features")

# load tags in database/tags
tagPath = "database/tags"
files = os.listdir(tagPath)
tagResult = {}
for file in files:
    if file == "README.txt":
        continue
    with open(os.path.join(tagPath, file)) as openFile:
        tagName = file.split(".")[0].split("_")[0]
        for line in openFile:
            key = int(line)
            try:
                tagResult[key].append(tagName)
            except:
                tagResult.setdefault(key, [tagName, ])
for i in tagResult:
    tagResult[i] = list(set(tagResult[i]))
print("tag loaded")


# ==============================================================================================================================
#                                                                                                                              
#  This function is used to do the image search/image retrieval
#                                                                                                                              
# ==============================================================================================================================
@app.route('/imgUpload', methods=['GET', 'POST'])
# def allowed_file(filename):
#    return '.' in filename and \
#           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
def upload_img():
    print("image upload")
    result = 'static/result'
    if not gfile.Exists(result):
        os.mkdir(result)
    shutil.rmtree(result)

    if request.method == 'POST' or request.method == 'GET':
        print(request.method)
        # check if the post request has the file part
        if 'file' not in request.files:
            print('No file part')
            return redirect(request.url)

        file = request.files['file']
        print(file.filename)
        # if user does not select file, browser also
        # submit a empty part without filename
        if file.filename == '':
            print('No selected file')
            return redirect(request.url)
        if file:  # and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            inputloc = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            tags = recommend(inputloc, extracted_features, tagResult)
            os.remove(inputloc)
            getImgStatus(tags)
            return jsonify(tags)


# =====================================================================================================================
#                                                                                                                              
#                                           Main function                                                        	  #
#  				                                                                                                
# =====================================================================================================================
@app.route("/")
def main():
    return render_template("main.html")


@app.route("/wishlist", methods=['POST'])
def addToWishlist():
    name = request.form["file"]
    saveImageWishlist(name)
    return jsonify({})


@app.route("/wishlist", methods=['GET'])
def getWishlist():
    result = getImagesWishlist()
    return jsonify(result)


@app.route("/wishlist", methods=['DELETE'])
def delWishList():
    name = request.args["file"]
    result = delImageWishlist(name)
    return jsonify(result)


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
