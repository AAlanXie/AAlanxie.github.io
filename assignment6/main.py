from flask import Flask, jsonify, request
from yelp import yelpAPI
from flask_cors import CORS
import os

app = Flask(__name__, static_url_path='')
CORS(app)


@app.route('/', methods=['GET'])
def index():
    return app.send_static_file("business.html")


@app.route('/business', methods=['GET'])
def business():
    # get the data from the front end form
    keyword = request.args.get('keyword', '')
    lat = request.args.get('lat', '')
    lng = request.args.get('lng', '')
    category = request.args.get('category', '')
    distance = request.args.get('distance', '')

    if not distance:
        distance = 10

    if category == 'default':
        category = 'all'

    distance = str(int(distance) * 1600)

    # call the yelp api to get the answer of specific features
    data = yelpAPI.search(term=keyword, latitude=lat, longitude=lng, categories=category, radius=distance)

    # change the response to the json format and return it
    response = jsonify(data)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/details', methods=['GET'])
def details():
    business_id = request.args.get('business_id', '')
    data = yelpAPI.get_business(business_id)
    response = jsonify(data)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
