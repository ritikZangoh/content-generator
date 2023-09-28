from flask import Flask
from flask import request, jsonify
import us_lamma
from fetch_file import getFile
import database_utils
from dotenv import load_dotenv
import os
from flask_cors import CORS, cross_origin
from create_index_vdb import createUserIndex
import chromadb


app = Flask(__name__)
CORS(app,resources={r"/api/*": {"origins": "https://content-generator-69wbfq3n9-ritikzangoh.vercel.app"}})

AUTH_KEY = "ajsjjsjjsjakflalsaldksdan"

@app.route("/api",methods=["POST","GET"])
def show():
    return "hii"

# params
# modealId:
# title:"content Generation"
# description: "crafting text for blogs"
# content_type: "BLog post in pirate language"
# sample:"filepath"
# guidleines:[]
# responseSize:
# paid:true



@app.route("/api/create_chat", methods=["POST","GET"])
@cross_origin()
def uploadParams():
    """
    Calls getFile from fetch_file to fetch and store file using s3path. 
    Calls createUserIndex from create_index_vdb to create vector index

    Paramter
    - json object
    
    Returns
    - html code (string)
    """

    load_dotenv(".env") #Loading .env file for environmental variables

    if request.headers.get('AuthKey') != AUTH_KEY:
        return jsonify({"status": "failure", "error": "Invaild Auth key"}), 401

    try:
        data = request.get_json()

        if "s3Path" not in list(data.keys()):
            data["s3Path"] = ""
        
        progress = getFile(modalId=data["modalId"],s3Path=data["s3Path"])

        if progress == "success":
            res = createUserIndex(modalId=data["modalId"],openkey=data["openkey"])

        else:
            res = {"error" : progress,"status":"success"}
            return jsonify(res)


        if res == "success":
            res = database_utils.createUser(modalId=data["modalId"], title=data["title"],contentType=data["contentType"],s3Path=data["s3Path"], guidelines=data["guidelines"],responseSize=data["responseSize"],description=data["description"],openkey=data["openkey"],paid=1)

        else:
            res = {"error" : res,"status":"failure"}
            return jsonify(res)
        

    except Exception as e:
        res = {
            "error":str(e),
            "status":"failure"
        }
        return jsonify(res)
    
    res = {"status": "success", "response": rf"<iframe src='http://{data['ip']}?key={data['modalId']}' frameborder='0' width='300' height='400'></iframe>"}
    return jsonify(res), 200



@app.route("/api/handle_request",methods=["POST","GET"])
@cross_origin()
def handleRequest():
    """
    Returns answer as response to queries made to the model

    Parameter
    - json object

    Returns
    - json object
    """

    if request.headers.get('AuthKey') != AUTH_KEY:
        return jsonify({"status": "failure", "error": "Invaild Auth key"})

    try:
        data = request.get_json() 
        ans = us_lamma.queryAns(modalId=data["modalId"],query=data["msg"])
        print(ans)
        
        res = {
            "msg":str(ans),
            "status":"success"
        }


    except Exception as e:
        res = {
            "error" : str(e),
            "status":"failure"
        }
           
    return jsonify(res)



@app.route("/api/initialize_chatbot",methods=["POST","GET"])
@cross_origin()
def checkStatus():
    """
    Checks contentType and paid status for particular modalId

    Parameter
    - json object

    Returns 
    - json object
    """

    if request.headers.get('AuthKey') != AUTH_KEY:
        return jsonify({"status": "failure", "error": "Invaild Auth key"})

    try:
        data = request.get_json()
        res = database_utils.getContentType(modal_id=data["modalId"])
        # print(res)
        # if res == "tuple index out of range":
        #     return jsonify({"msg":"Invalid Key!"})
        res = {
            "paid" : str(res[0]),
            "contentType": str(res[1]),
            "status":"success"
        }

    except Exception as e:
        res = {
            "response" : str(res),
            "status":"failure"
        }

    return jsonify(res)

@app.route("/api/remove_index",methods=["GET","POST"])
@cross_origin()
def remove_index():

    if request.headers.get('AuthKey') != AUTH_KEY:
        return jsonify({"status": "failure", "error": "Invaild Auth key"})

    try:
        client = chromadb.PersistentClient(path="/home/ubuntu/content-generator/backend/chroma")
        data = request.get_json()
        client.delete_collection(data["modalId"])
        res = {"response":"done","status":"success"}

    except Exception as e:
        res = {"response":str(e),"status":"failure"}
        return jsonify(res)
    return jsonify(res)


@app.route("/api/paid_status", methods=["POST","GET"])
@cross_origin()
def updateBilling():

    load_dotenv(".env") #Loading .env file for environmental variables

    if request.headers.get('AuthKey') != AUTH_KEY:
        return jsonify({"status": "failure", "error": "Invaild Auth key"}), 401

    try:
        data = request.get_json()

        if data['paid'] == 'false':
            paid = 0
        else:
            paid = 1

        progress = database_utils.updatePaidState(modalId=data["modalId"], paidState=paid)    

        if progress == "success":
            return jsonify({"status": "success", "response": f"Update paid status to {data['paid']}"})
        
        else:
            res = {"error":"Some error", "status":"failure"}

    except Exception as e:
        res = {
            "error":str(e),
            "status":"failure"
        }
        return jsonify(res)


@app.route("/api/update_openaikey", methods=["POST","GET"])
@cross_origin()
def updateOpenAiKey():

    load_dotenv(".env") #Loading .env file for environmental variables

    if request.headers.get('AuthKey') != AUTH_KEY:
        return jsonify({"status": "failure", "error": "Invaild Auth key"}), 401

    try:
        data = request.get_json()

        progress = database_utils.updateOpenKey(modalId=data["modalId"], openkey=data["openkey"])    

        if progress == "success":
            return jsonify({"status": "success", "response": f"Updated openai key to {data['openkey']}"})
        
        else:
            res = {"error":"Some error", "status":"failure"}

    except Exception as e:
        res = {
            "error":str(e),
            "status":"failure"
        }
        return jsonify(res)


if __name__ == "__main__":
    app.run(port=4000,debug=True)
