from flask import Flask, send_from_directory
from flask_restful import Api, Resource, reqparse
from flask_cors import CORS #comment this on deployment
from api.MolecularParser import MolecularParser
import os

app = Flask(__name__, static_url_path='', static_folder=os.path.abspath('molecular-parser/build'))
CORS(app) #comment this on deployment
api = Api(app)

@app.route("/", methods=["GET"], defaults={'path':''})
def serve(path):
    return send_from_directory(app.static_folder,'index.html')

api.add_resource(MolecularParser, '/parser')
