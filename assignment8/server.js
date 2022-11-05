'use strict';

const yelp = require('yelp-fusion');
const url = require('url');
let cors = require('cors');

const express = require('express')
const axios = require("axios");
const app = express()
const port = process.env.PORT || 8080;


// from https://www.yelp.com/developers/v3/manage_app
const apiKey = 'ACNM7cxU2Zh7VgsHxr5i6_E6AgUB_z_mHBkq2X8MH9TboGX_uj4_MVRaemfeW7f-Hkp5kzi1ZdosaBsHljhVn7_w3o2y18YysvLbRfa4Yjt9YnruhL9df0TMfKMsY3Yx';

app.use(express.static(process.cwd()+"/yelp/dist/yelp/"));


const instance = axios.create({
    headers: {
        Authorization: 'Bearer ' + apiKey
    }
})


async function yelpAutoComplete(text) {
    let res;

    let url = 'https://api.yelp.com/v3/autocomplete';

    url = url + '?text=' + text;

    await instance.get(url).then(response => {
        res = response.data;
    }).catch(e => {
        console.log(e);
    });

    return res;
}

// yelp business
async function yelpBusiness(searchRequest) {
    let res;

    let url = 'https://api.yelp.com/v3/businesses/search?';

    url = url + 'term=' + searchRequest.term + '&';
    url = url + 'latitude=' + searchRequest.latitude + '&';
    url = url + 'longitude=' + searchRequest.longitude + '&';
    url = url + 'categories=' + searchRequest.categories + '&';
    url = url + 'radius=' + searchRequest.radius;

    await instance.get(url).then(response => {
        res = response.data.businesses.slice(0, 10);
    }).catch(e => {
        console.log(e);
    });

    return res;
}


// yelp business detail
async function yelpBusinessDetail(businessId) {
    let res;

    let url = 'https://api.yelp.com/v3/businesses/';

    url = url + businessId;

    await instance.get(url).then(response => {
        res = response.data;
    }).catch(e => {
        console.log(e);
    });

    return res;
}


// yelp business reviews
async function yelpBusinessReviews(businessId) {
    let res;

    let url = 'https://api.yelp.com/v3/businesses/';

    url = url + businessId + '/reviews';

    await instance.get(url).then(response => {
        res = response.data.reviews;
    }).catch(e => {
        console.log(e);
    });

    return res;
}

// --------------------------------
// yelp fusion

// const client = yelp.client(apiKey);
// // yelp auto complete
// async function yelpAutoComplete(text) {
//
//     let res;
//
//     await client.autocomplete({
//         text: text
//     }).then(response => {
//         res = response.jsonBody;
//     }).catch(e => {
//         console.log(e);
//     });
//
//     return res;
// }

// yelp business
// async function yelpBusiness(searchRequest) {
//     let res;
//
//     await client.search(searchRequest).then(response => {
//         res = response.jsonBody.businesses.slice(0, 10);
//     }).catch(e => {
//         console.log(e);
//     });
//     return res;
// }

// yelp business detail
// async function yelpBusinessDetail(businessId) {
//     let res;
//
//     await client.business(businessId).then(response => {
//         res = response.jsonBody;
//     }).catch(e => {
//         console.log(e);
//     })
//
//     return res;
// }

// yelp business reviews
// async function yelpBusinessReviews(businessId) {
//     let res;
//
//     await client.reviews(businessId).then(response => {
//         res = response.jsonBody.reviews;
//     }).catch(e => {
//         console.log(e);
//     });
//
//     return res;
// }

// cross domain
app.use(cors());

app.get('/', (req,res) => {
    res.sendFile(process.cwd()+"/yelp/dist/yelp/")
});

// route for business
app.get('/autoComplete', async (req, res) => {
    // define the params
    let params = url.parse(req.url, true).query;
    const text = params.text;

    // should set the async and await to solve the async question
    // get the response from yelp
    const result = await yelpAutoComplete(text);
    // console.log(result);
    // send json to the client
    res.send(JSON.stringify(result));
})

// route for business
app.get('/business', async (req, res) => {
    // define the params
    let params = url.parse(req.url, true).query;
    const searchRequest = {
        term: params.term,
        latitude: params.latitude,
        longitude: params.longitude,
        categories: params.categories,
        radius: params.radius,
    };

    // should set the async and await to solve the async question
    // get the response from yelp
    const result = await yelpBusiness(searchRequest);
    // console.log(result);
    // send json to the client
    res.send(JSON.stringify(result));
})

// route for business detail
app.get('/businessDetail', async (req, res) => {
    // define the params
    let params = url.parse(req.url, true).query;
    const businessId = params.businessId;
    // should set the async and await to solve the async question
    // get the response from yelp
    const result = await yelpBusinessDetail(businessId);
    // send json to the client
    res.send(JSON.stringify(result));
})

// route for business reviews
app.get('/businessReviews', async (req, res) => {
    // define the params
    let params = url.parse(req.url, true).query;
    const businessId = params.businessId;
    // should set the async and await to solve the async question
    // get the response from yelp
    const result = await yelpBusinessReviews(businessId);
    // send json to the client
    res.send(JSON.stringify(result));
})


// listen
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
