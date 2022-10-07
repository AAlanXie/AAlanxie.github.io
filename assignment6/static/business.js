$(document).ready(function () {

    document.addEventListener("mousemove", event => {
        document.getElementsByClassName("cursor")[0].style.transform = "translate(" + event.pageX + "px, " + event.pageY + "px)";
      })


    // submitForm
    let submitForm = document.getElementById("submitForm");

    // clearForm
    let clearForm = document.getElementById("clearForm");

    // error
    let error = document.getElementById("error");

    // restaurants part
    let restaurants = document.getElementById("restaurant");

    // get the element of restaurant detail
    let restaurant_detail = document.getElementById("restaurant_details");

    // check box
    // get the element of checkbox
    let checkbox = document.getElementById("detection");

    //  get the element of location
    let loc = document.getElementById("loc");

    // define the restaurant information
    let restaurant_info;

    clearForm.onclick = function () {

        document.getElementById("content").reset();
        // set the attribute to disabled
        if(checkbox.checked) {
            loc.value = ''
            loc.setAttribute("disabled", "disabled");
        } else {
            loc.removeAttribute("disabled");
            loc.required = true;
        }

        // set the display to none
        error.style.display = "none";
        restaurants.style.display = "none";
        restaurant_detail.style.display = "none";
    }

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

    // define a sleep function
    let sleep = function(fun,time){
        setTimeout(()=>{
            fun();
        },time);
    }


    function circleAround() {
        document.getElementsByClassName("cursor")[0].classList.add("click")
            setTimeout(() => {
                document.getElementsByClassName("cursor")[0].classList.remove("click")
            }, 250);
    }

    // define the ajax service
    function submitToBackend(data) {
        $.ajax({
            url: "/business",
            method: 'get',
            async: false,
            data: data,
            success: function (args) {
                if(args.code == '1000') {
                    error.style.display = "none";
                    restaurant_info = args.businesses;
                    restaurants.style.display = "block";
                    displayTable(restaurant_info);
                    window.location.href = "#restaurant";
                    sortTable();
                } else {
                    restaurants.style.display = "none";
                    restaurant_detail.style.display = "none";
                    error.innerHTML = "<div style='background-color: white; width: 80%; margin: auto;'><p style='text-align: center;'>No record has been found</p></div>"
                    error.style.display = "block";
                    return false;
                }
            }
        })
    }

    // receive the restaurant info from flask
    submitForm.onclick = function (event) {

        // check the valid status for each input form
        const valid1 = document.getElementById("word").checkValidity();
        const valid2 = document.getElementById("categories").checkValidity();
        const valid3 = document.getElementById("loc").checkValidity();
        const valid4 = document.getElementById("dis").checkValidity();

        if(valid1 && valid2 && valid3 && valid4) {
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
                        try {
                            lat = featureCollection.results[0].geometry.location.lat;
                            lng = featureCollection.results[0].geometry.location.lng;
                        } catch (e) {
                            error.innerHTML = "<div style='background-color: white; width: 80%; margin: auto;'><p style='text-align: center;'>No record has been found</p></div>"
                            error.style.display = "block";
                            return false;
                        }

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
            error.innerHTML = "<div style='background-color: white; width: 80%; margin: auto;'><p style='text-align: center;'>No record has been found</p></div>"
            error.style.display = "none";
            // console.log(e);
            return false;
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
            innerHtml += "<td>" + "<span id=" + restaurant_info[i].id + ">" + restaurant_info[i].name + "</span>" + "</td>"
            // rating
            innerHtml += "<td>" + restaurant_info[i].rating + "</td>"
            // radius
            innerHtml += "<td>" + (restaurant_info[i].distance / 1600).toFixed(2) + "</td>"

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
                //
                circleAround();

                restaurant_detail.style.display = "block";
                restaurant_detail.innerHTML = showDetails(restaurant_info[i].id);
                window.location.href = "#restaurant_details";
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
            if(i == 0 || i == 1){
                continue;
            }
            th[i].onclick = function () {

                circleAround();

                sortedArray = [];

                for(let j = 0; j < contentTr.length; j++) {
                    sortedArray[j] = [];
                    sortedArray[j][0] = contentTr[j].getElementsByTagName('td')[i].innerText;
                    sortedArray[j][1] = j;
                }

                // sort the array
                if(th[i].getAttribute("class") == "reverse"){
                    sortedArray.sort();
                    th[i].setAttribute("class", "reversed");
                } else {
                    sortedArray.sort();
                    sortedArray.reverse();
                    th[i].setAttribute("class", "reverse");
                }

                newNode = "";

                // update the innerHtml
                for(let j = 0; j < contentTr.length; j++ ) {
                    contentTr[sortedArray[j][1]].getElementsByTagName("td")[0].innerText = j + 1;
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
                let phoneNumber = "";
                let price = "";


                details = "<h1>" + businessDetails.name + "</h1>"

                // status
                // console.log(businessDetails);
                try {
                    if(businessDetails.hours[0].is_open_now) {
                        status = "Open Now";
                        background = "green";
                    } else {
                        status = "Closed";
                        background = "red";
                    }
                    details += "<div class='firstItem row' id='d_status'><span>Status</span><br/><span id='status' class='subtitle' style='background-color:" + background + "'>" + status + "</span></div>"
                } catch (e) {
                    status = "&nbsp";
                    background = "&nbsp";
                }

                // categories
                if(businessDetails.categories) {
                    for(let i = 0; i < businessDetails.categories.length; i++) {
                        if(i != 0) {
                            rest_categories += "&nbsp|&nbsp";
                        }
                        rest_categories += businessDetails.categories[i].alias;
                    }
                    details += "<div class='secondItem row' id='d_category'><span>Category</span><br/><span class='subtitle'>" + rest_categories + "</span></div>";
                }

                // address
                if(businessDetails.location.display_address) {
                    for(let i = 0; i < businessDetails.location.display_address.length; i++) {
                        if(i != 0) {
                            address += " ";
                        }
                        address += businessDetails.location.display_address[i];
                    }
                    details += "<div class='firstItem row' id='d_address'><span>Address</span><br/><span class='subtitle'>" + address + "</span></div>";
                }


                if(businessDetails.display_phone) {
                    phoneNumber = businessDetails.display_phone;
                    details += "<div class='secondItem row' id='d_phone'><span>Phone Number</span><br/><span class='subtitle'>" + phoneNumber + "</span></div>";
                }

                // transactions
                if(businessDetails.transactions.length > 0) {
                    for(let i = 0; i < businessDetails.transactions.length; i++) {
                        if(i != 0) {
                            transactions += "&nbsp|&nbsp";
                        }
                        transactions += businessDetails.transactions[i];
                    }
                    details += "<div class='firstItem row' id='d_transaction'><span>Transactions Supported</span><br/><span class='subtitle'>" + transactions + "</span></div>"
                }

                // price
                if(businessDetails.price) {
                    price = businessDetails.price;
                    details += "<div class='secondItem row' id='d_price'><span>Price</span><br/><span class='subtitle'>" + price + "<span/></div>"
                }

                let moreInfo = "";
                if(businessDetails.url) {
                    moreInfo = businessDetails.url;
                    details += "<div class='firstItem' style='margin-top: 35px' id='d_info'><span>More info</span><br/><span class='subtitle'><a href=" + moreInfo + " target=\"_blank\">Yelp</a></span></div>"
                }

                details +=
                "<div class='row' id='d_picture'>" +
                "<div class='picture'><div class='image'><img src=" + businessDetails.photos[0] + "></div><p>Photo 1</p></div>" +
                "<div class='picture'><div class='image'><img src=" + businessDetails.photos[1] + "></div><p>Photo 2</p></div>" +
                "<div class='picture'><div class='image'><img src=" + businessDetails.photos[2] + "></div><p>Photo 3</p></div>" +
                "</div>"
            }
        })

        return details;
    }

})