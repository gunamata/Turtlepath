# -*- coding: utf-8 -*-
"""
Created on Mon May 18 19:32:09 2020

@author: Admin
"""
from flask import Flask, request
from flask_cors import CORS, cross_origin

turtlePathPoints = []

def addPointToTurtlePath(x,y):
    global turtlePathPoints
    if(isPointPresent(x,y)):
        point = {"point": {"x": x, "y": y}, "isFirstPass": False}
    else:
        point = {"point": {"x": x, "y": y}, "isFirstPass": True}
    turtlePathPoints.append(point)
    
def isPointPresent(x,y):
    global turtlePathPoints
    for q in turtlePathPoints:
        if((q["point"]["x"] == x) & (q["point"]["y"] == y)):
            return(True)
    return(False)

def getTurtlePathPoints(path):
    global turtlePathPoints
    angle = 90
    step=1
    x=0
    y=0
    turtlePathPoints = []
    
    addPointToTurtlePath(x, y)
    for move in path:
        if(move=="L"):
            angle=(angle+90)%360
        elif(move=="R"):
            angle=(angle-90)%360
        elif(move=="F"):
            if(angle==0):
                x=x+step
            elif(angle==90):
                y=y+step                     
            elif(angle==180):
                x=x-step                     
            elif(angle==270):
                y=y-step
            addPointToTurtlePath(x, y)    
    
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/getTurtlePath', methods=['GET','POST'])
@cross_origin()
def getTurtlePath():
    global turtlePathPoints
    inpPath = request.get_json()['path']
    getTurtlePathPoints(inpPath)
    response = {"statusCode": 200, "pathPoints":turtlePathPoints}
    return (response)    

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)                      
                              
                 
                 
             
