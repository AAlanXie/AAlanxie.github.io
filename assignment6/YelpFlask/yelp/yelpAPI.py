"""
coding: utf-8
author: tianqi
email: tianqixie98@gmail.com
"""

# -*- coding: utf-8 -*-
"""
Yelp Fusion API code sample.
This program demonstrates the capability of the Yelp Fusion API
by using the Search API to query for businesses by a search term and location,
and the Business API to query additional information about the top result
from the search query.
Please refer to http://www.yelp.com/developers/v3/documentation for the API
documentation.
This program requires the Python requests library, which you can install via:
`pip install -r requirements.txt`.
Sample usage of the program:
`python sample.py --term="bars" --location="San Francisco, CA"`
"""
import argparse
import json
import pprint
import requests
import sys
import urllib


# This client code can run on Python 2.x or 3.x.  Your imports can be
# simpler if you only need one of those.
try:
    # For Python 3.0 and later
    from urllib.error import HTTPError
    from urllib.parse import quote
    from urllib.parse import urlencode
except ImportError:
    # Fall back to Python 2's urllib2 and urllib
    from urllib2 import HTTPError
    from urllib import quote
    from urllib import urlencode


# Yelp Fusion no longer uses OAuth as of December 7, 2017.
# You no longer need to provide Client ID to fetch Data
# It now uses private keys to authenticate requests (API Key)
# You can find it on
# https://www.yelp.com/developers/v3/manage_app
API_KEY= 'ACNM7cxU2Zh7VgsHxr5i6_E6AgUB_z_mHBkq2X8MH9TboGX_uj4_MVRaemfeW7f-Hkp5kzi1ZdosaBsHljhVn7_w3o2y18YysvLbRfa4Yjt9YnruhL9df0TMfKMsY3Yx'


# API constants, you shouldn't have to change these.
API_HOST = 'https://api.yelp.com'
SEARCH_PATH = '/v3/businesses/search'
BUSINESS_PATH = '/v3/businesses/'  # Business ID will come after slash.


# Defaults for our simple example.
DEFAULT_TERM = 'dinner'
DEFAULT_LOCATION = 'San Francisco, CA'
SEARCH_LIMIT = 20


def request(host, path, url_params=None):
    """Given your API_KEY, send a GET request to the API.
    Args:
        host (str): The domain host of the API.
        path (str): The path of the API after the domain.
        API_KEY (str): Your API Key.
        url_params (dict): An optional set of query parameters in the request.
    Returns:
        dict: The JSON response from the request.
    Raises:
        HTTPError: An error occurs from the HTTP request.
    """
    url_params = url_params or {}
    url = '{0}{1}'.format(host, quote(path.encode('utf8')))

    headers = {
        'Authorization': 'Bearer %s' % API_KEY,
    }

    # print(u'Querying {0} ...'.format(url))
    response = requests.request('GET', url, headers=headers, params=url_params)

    return response.json()


def search(term, latitude, longitude, categories, radius):
    """Query the Search API by a search term and location.
    Args:
        term (str): The search term passed to the API.
        latitude (str): The search latitude passed to the API.
        longitude (str): The search longitude passed to the API.
        categories (str): The search categories passed to the API.
        radius (str): The search radius passed to the API.
    Returns:
        dict: The JSON response from the request.
    """

    url_params = {
        'term': term.replace(' ', '+'),
        'latitude': latitude,
        'longitude': longitude,
        'categories': categories,
        'radius': str(radius),
        'limit': SEARCH_LIMIT
    }
    return request(API_HOST, SEARCH_PATH, url_params=url_params)


def get_business(business_id):
    """Query the Business API by a business ID.
    Args:
        business_id (str): The ID of the business to query.
    Returns:
        dict: The JSON response from the request.
    """
    business_path = BUSINESS_PATH + business_id

    return request(API_HOST, business_path)


def query_api(term, latitude, longitude, categories, radius):
    """Queries the API by the input values from the user.
    Args:
        term (str): The search term to query.
        latitude (str): The latitude of the business to query.
        longitude (str): The longitude of the business to query.
        categories (str): The categories of the business to query.
        radius (str): The radius of the business to query.
    """
    response = search(term, latitude, longitude, categories, radius)

    businesses = response.get('businesses')

    if not businesses:
        # print(u'No businesses for {0} in {1} found.'.format(term, location))
        return None

    business_id = businesses[0]['id']

    # print(u'{0} businesses found, querying business info ' \
    #     'for the top result "{1}" ...'.format(
    #         len(businesses), business_id))
    response = get_business(business_id)

    # print(u'Result for business "{0}" found:'.format(business_id))
    # pprint.pprint(response, indent=2)

    return response


# def main():
#     parser = argparse.ArgumentParser()
#
#     parser.add_argument('-q', '--term', dest='term', default=DEFAULT_TERM,
#                         type=str, help='Search term (default: %(default)s)')
#     parser.add_argument('-l', '--location', dest='location',
#                         default=DEFAULT_LOCATION, type=str,
#                         help='Search location (default: %(default)s)')
#
#     input_values = parser.parse_args()
#
#     try:
#         return query_api(input_values.term, input_values.location)
#     except HTTPError as error:
#         sys.exit(
#             'Encountered HTTP error {0} on {1}:\n {2}\nAbort program.'.format(
#                 error.code,
#                 error.url,
#                 error.read(),
#             )
#         )


if __name__ == '__main__':
    print(search('dinner', latitude="34.0030", longitude="-118.2863", categories="Health & Medical", radius="800"))
