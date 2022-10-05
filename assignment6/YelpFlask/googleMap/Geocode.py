"""
coding: utf-8
author: tianqi
email: tianqixie98@gmail.com
"""

import requests
import googlemaps
import pprint

# define the api key
API_key = 'AIzaSyAA-NGuJdyVnewL8KSPrDENdauTBIrBozk'


class Geocode:

    # use google map api to define a new client
    def __init__(self):
        self.gmaps_key = googlemaps.Client(key=API_key)

    def searchOnAddress(self, address):
        # get the address information
        g = self.gmaps_key.geocode(address)
        # return the latitude and the longitude
        return g[0]['geometry']['location']['lat'], g[0]['geometry']['location']['lng']
