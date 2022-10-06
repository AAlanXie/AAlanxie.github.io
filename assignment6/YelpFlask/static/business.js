$(document).ready(function () {

    // submitForm
    let submitForm = document.getElementById("submitForm");

    // clearForm
    let clearForm = document.getElementById("clearForm");

    // restaurants part
    let restaurants = document.getElementById("restaurant");

    // get the element of restaurant detail
    let restaurant_detail = document.getElementById("restaurant_details");

    clearForm.onclick = function () {

        // set the display to none
        restaurants.style.display = "none";
        restaurant_detail.style.display = "none";
    }

    // check box
    // get the element of checkbox
    let checkbox = document.getElementById("detection");

    //  get the element of location
    let loc = document.getElementById("loc");

    // define the restaurant information
    let restaurant_info;

    // add click listener
    checkbox.addEventListener('click', function () {
        // set the attribute to disabled
        if(checkbox.checked) {
            loc.value = ''
            loc.setAttribute("disabled", "disabled");
        } else {
            loc.removeAttribute("disabled");
            loc.required = true;
        }
    })

    // define the ajax service
    function submitToBackend(data) {
        $.ajax({
            url: "/business",
            method: 'get',
            async: false,
            data: data,
            success: function (args) {
                restaurant_info = args.businesses;
                restaurants.style.display = "block";
                displayTable(restaurant_info);
                sortTable();
            }
        })
    }

    // receive the restaurant info from flask
    submitForm.onclick = function (event) {

        // check the valid status for each input form
        const valid1 = document.getElementById("word").checkValidity();
        const valid2 = document.getElementById("categories").checkValidity();
        const valid3 = document.getElementById("loc").checkValidity();

        if(valid1 && valid2 && valid3) {
            event.preventDefault();
        } else {
            // console.log(1);
            return;
        }

        try {
            // get the form data from the user
            let keyword = document.getElementById("word").value;
            let distance = document.getElementById("dis").value;
            let category = document.getElementById("categories").value;

            // define the lat and lng
            let lat;
            let lng;

            let data;

            // if the check box is checked
            if(checkbox.checked) {
                // ipinfo api to catch the current location
                $.get('https://ipinfo.io/json?token=3fb7195d86fc03', function(response) {
                    let loc = response.loc.split(',');
                    lat = loc[0];
                    lng = loc[1];

                    data = {
                        keyword: keyword,
                        distance: distance,
                        category: category,
                        lat: lat,
                        lng: lng,
                    }
                    //
                    submitToBackend(data);
                });


            }
            else {
                // google geocode api to ge the input address's geocode
                // define the api key and address
                let address = document.getElementById("loc").value;
                const myAPIKey = 'AIzaSyAWn7aX2QRsPcuPzsrzC4IvTcpe61uqtRw';

                // return the location
                const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${myAPIKey}`;
                fetch(geocodingUrl).then(result => result.json())
                    .then(featureCollection => {
                        lat = featureCollection.results[0].geometry.location.lat;
                        lng = featureCollection.results[0].geometry.location.lng;

                        data = {
                            keyword: keyword,
                            distance: distance,
                            category: category,
                            lat: lat,
                            lng: lng,
                        }

                        submitToBackend(data);
                    });
            }
        } catch (e) {
            restaurants.innerHTML = "<div style='background-color: white; width: 80%; margin: auto;'><p style='text-align: center;'>No record has been found</p></div>"
            console.log(e);
        }

        //
        return false;
    }

    // display the restaurant information in table
    function displayTable(restaurant_info) {
        // get the element of tbody
        let tb = document.getElementsByTagName("tbody");
        tb[0].innerHTML = "";

        let innerHtml;

        for(let i = 0; i < restaurant_info.length; i++) {

            // create a new tr
            let tr = document.createElement("tr");
            tr.style.height = "135px";
            // innerHtml
            innerHtml = "<tr>"
            // number
            innerHtml += "<td>" + (i + 1) + "</td>"
            // image
            innerHtml += "<td>" + "<img src=" + restaurant_info[i].image_url + ">" + "</td>"
            // restaurant name
            innerHtml += "<td>" + "<p id=" + restaurant_info[i].id + ">" + restaurant_info[i].name + "</p>" + "</td>"
            // rating
            innerHtml += "<td>" + restaurant_info[i].rating + "</td>"
            // radius
            innerHtml += "<td>" + restaurant_info[i].distance / 1600 + "</td>"

            innerHtml += "</tr>"

            tr.innerHTML = innerHtml;

            // append a child
            tb[0].append(tr);
        }

        getDetails(restaurant_info);
    }

    function getDetails(restaurant_info) {
        for(let i = 0; i < restaurant_info.length; i++) {
            // name
            let nameEle = document.getElementById(restaurant_info[i].id);
            nameEle.onclick = function () {
                restaurant_detail.style.display = "block";
                restaurant_detail.innerHTML = showDetails(restaurant_info[i].id);
            }
        }
    }

    function sortTable() {
        // find the tbody and th and contentTR
        let tbody = document.getElementsByTagName("tbody")[0];
        let th = document.getElementsByTagName("th");
        let contentTr = tbody.getElementsByTagName('tr');

        // use an Array to store the information of each row
        let sortedArray = [];

        // innerHtml
        let newNode;

        // set the onclick function
        for(let i = 0; i < th.length; i++) {
            th[i].onclick = function () {
                for(let j = 0; j < contentTr.length; j++) {
                    sortedArray[j] = [];
                    sortedArray[j][0] = contentTr[j].getElementsByTagName('td')[i].innerText;
                    sortedArray[j][1] = j;
                }

                // sort the array based on the first innerText
                sortedArray.sort();

                newNode = "";
                // update the innerHtml
                for(let j = 0; j < contentTr.length; j++ ) {
                    newNode += "<tr>" + contentTr[sortedArray[j][1]].innerHTML + "</tr>";
                }

                // console.log(newNode);

                tbody.innerHTML = newNode;

                getDetails(restaurant_info);
            }
        }
    }

    function showDetails(business_id) {
        let businessDetails;
        let details = "";

        $.ajax({
            url: "/details",
            method: 'get',
            async: false,
            data: {
                business_id: business_id
            },
            success: function (args) {
                businessDetails = args;
                // console.log(businessDetails);

                let status;
                let background;
                let address = "";
                let rest_categories = "";
                let transactions = "";
                let price = "";

                // status
                if(businessDetails.is_closed) {
                    status = "Closed";
                    background = "red";
                } else {
                    status = "Open Now"
                    background = "green";
                }

                // categories
                for(let i = 0; i < businessDetails.categories.length; i++) {
                    if(i != 0) {
                        rest_categories += "&nbsp|&nbsp";
                    }
                    rest_categories += businessDetails.categories[i].alias;
                }
                // console.log(rest_categories);

                // address
                for(let i = 0; i < businessDetails.location.display_address.length; i++) {
                    if(i != 0) {
                        address += " ";
                    }
                    address += businessDetails.location.display_address[i];
                }
                // console.log(address);

                // transactions
                for(let i = 0; i < businessDetails.transactions.length; i++) {
                    if(i != 0) {
                        transactions += "&nbsp|&nbsp";
                    }
                    transactions += businessDetails.transactions[i];
                }

                // price
                price = businessDetails.price;

                details = "<h1>" + businessDetails.name + "</h1>" +
                "<div class='firstItem row'><span>Status</span><br/><span id='status' class='subtitle' style='background-color:" + background + "'>" + status + "</span></div>" +
                "<div class='secondItem row'><span>Category</span><br/><span class='subtitle'>" + rest_categories + "</span></div>" +
                "<div class='firstItem row'><span>Address</span><br/><span class='subtitle'>" + address + "</span></div>" +
                "<div class='secondItem row'><span>Phone Number</span><br/><span class='subtitle'>" + businessDetails.display_phone + "</span></div>" +
                "<div class='firstItem row'><span>Transactions Supported</span><br/><span class='subtitle'>" + transactions + "</span></div>" +
                "<div class='secondItem row'><span>Price</span><br/><span class='subtitle'>" + price + "<span/></div>" +
                "<div class='firstItem' style='margin-top: 35px'><span>More info</span><br/><span class='subtitle'><a href=" + businessDetails.url + " target=\"_blank\">Yelp</a></span></div>" +
                "<div class='row'>" +
                "<div class='picture'><div class='image'><img src=" + businessDetails.photos[0] + "></div><p>Photo 1</p></div>" +
                "<div class='picture'><div class='image'><img src=" + businessDetails.photos[1] + "></div><p>Photo 2</p></div>" +
                "<div class='picture'><div class='image'><img src=" + businessDetails.photos[2] + "></div><p>Photo 3</p></div>" +
                "</div>"
            }
        })

        return details;
    }

})