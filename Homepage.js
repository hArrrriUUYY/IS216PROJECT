// google map retrieval variables and functions 
var inputEle = document.getElementById("addr")
var lat = "1.2973784"
var lng = "103.8495219"
const mapid = '48a0da24f4d514ef'

axios.get("https://dcsibh9m73.execute-api.ap-southeast-1.amazonaws.com/prod/retrieveApiKey.php")
.then( response => {
    eachObject = JSON.parse(response.data[0])
    key = eachObject['key']
    }
)
.catch(error => {console.log(error.message)})

var map
var nearbyGymInfo = []

function initMap() {

    lat = parseFloat(lat)
    lng = parseFloat(lng)

    // The location of loc
    const loc = { lat: lat, lng: lng };
    // The map, centered at loc
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 16,
        center: loc,
        mapId: mapid
    });
    // The marker, positioned at location
    marker = new google.maps.Marker({
        position: loc,
        map: map,
        animation: google.maps.Animation.BOUNCE
    });
    getNearbyGyms()
}

function getGymsNearLoc() {
    let addr = document.getElementById('addr').value
    var url = "https://maps.googleapis.com/maps/api/geocode/json?"
    axios.get(url, {
        params: {
            address: addr,
            key: key,
            countrycode: 'sg'
        }
    })
        .then(
            response => {
                lat = response.data.results[0].geometry.location.lat
                lng = response.data.results[0].geometry.location.lng
                initMap()
            })
        .catch(
            err => {
                console.log(err.message)
            })
}

function getNearbyGyms() {
    var addr = new google.maps.LatLng(lat, lng)
    var radius = document.getElementById('radiusDistance').value // if got error means need convert this to string
    var request = {
        location: addr,
        radius: radius,
        type: ['gym']
    };

    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);
}

function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            if (results[i].business_status == "OPERATIONAL") {
                if ('opening_hours' in results[i] && (results[i].name.includes('Academy') == false) && (results[i].name.includes('Dancing') == false)) {
                    if (results[i].opening_hours.isOpen) {
                        createMarker(results[i]);
                    }
                }
                else if ((results[i].name.includes('Academy') == false) && (results[i].name.includes('Dancing') == false)) {
                    createMarker(results[i]);
                }
            }
        }
    }
}

function createMarker(place) {
    var advancedMarkerView = new google.maps.marker.AdvancedMarkerView({
        map: map,
        content: buildContent(place),
        position: new google.maps.LatLng(place.geometry.location),
        title: place.name,
    });

    const element = advancedMarkerView.element;

    ["focus", "pointerenter"].forEach((event) => {
        element.addEventListener(event, () => {
            highlight(advancedMarkerView, place);
        });
    });
    ["blur", "pointerleave"].forEach((event) => {
        element.addEventListener(event, () => {
            unhighlight(advancedMarkerView, place);
        });
    });
    advancedMarkerView.addListener("click", function () {
        getGymDetails(place.place_id);
    });
}

function highlight(markerView) {
    markerView.content.classList.add("highlight");
    markerView.element.style.zIndex = 1;
}

function unhighlight(markerView) {
    markerView.content.classList.remove("highlight");
    markerView.element.style.zIndex = "";
}

function buildContent(place) {
    const content = document.createElement("div");
    if (place.rating == undefined) {
        rating = 'N.A'
    }
    else
        rating = parseInt(place.rating)
    place_rating = getStarString(rating)

    if (place.user_ratings_total == undefined) {
        total_user_rating = 'N.A'
    }
    else
        total_user_rating = place.user_ratings_total


    content.classList.add("place");
    content.innerHTML = `
      <div class="icon">
        <i aria-hidden="true" class="fa fa-icon fa-dumbbell" title="${place.name}"></i>
      </div>
      <div class="details">
          <div><strong><u>${place.name}</u></strong></div>
          <div><strong>Place Rating:</strong> ${place_rating}</div>
          <div><strong>Total User Rating:</strong> ${total_user_rating}</div>
          <div><strong>Address:</strong> ${place.vicinity}</div>
          <br>
          <div>Click me to get reviews of this outlet!</div>
      </div>
      `;
    return content;
}

function getGymDetails(placeID) {

    let selected_gym_details = ''
    var request = {
        placeId: placeID,
        fields: ['name', 'rating', 'reviews', 'photos', 'website']
    };

    service = new google.maps.places.PlacesService(map);
    service.getDetails(request, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            gym_name = place.name
            rating = parseInt(place.rating)
            gym_reviews_array = place.reviews
            gym_link = place.website
            gym_rating = getStarString(rating)

            selected_gym_details =
                `
            <div class="row">
                <div class="col text-center pb-3">
                    <h3>${gym_name}</h3>
                    <h3>${gym_rating}</h3>
                    <button type="button" class="btn btn-primary" onclick="window.open('${gym_link}', '_blank')">Place Website</button>
                </div>
                
            </div>
            <div class="row"> 
            `

            for (review of gym_reviews_array) {
                if (review.text == '') {
                    text_review = 'N.A.'
                }
                else {
                    text_review = review.text
                }

                rating = parseInt(review.rating)
                review_rating = getStarString(rating)

                selected_gym_details +=
                    `
                <div class="col border text-center pt-3">
                    <i class="fas fa-user"></i>
                    <h5>${review.author_name}</h5>
                    <p>${review_rating}</p>   
                    <p>"${text_review}"</p>
                    <p><strong>Review made:<strong> ${review.relative_time_description}</p>                  
                </div>
                `
            }
            selected_gym_details += `</div>`

            document.getElementById('selected_gym_details').innerHTML = selected_gym_details
        }
    })
}

function getStarString(rating) {
    let gym_rating = ''
    while (rating > 1) {
        if (rating > 1) {
            gym_rating += '<i class="fas fa-star" style="color:#FF9529;"></i>'
        }
        else {
            gym_rating += '<i class="fas fa-star-half-alt" style="color:#FF9529"></i>'
        }
        rating -= 1
    }
    return gym_rating
}

function getEvents() {
    Vue.createApp({
        data() {
            return {
                events_list: []
            }
        }, async created() {
            const response = await axios.get("https://dcsibh9m73.execute-api.ap-southeast-1.amazonaws.com/prod/retrieveAllEvents.php")
            for (each of response.data) {
                eachObj = JSON.parse(each) //convert strings to JSON objs
                details = eachObj.info
                img_link = eachObj.posterLink
                reg_link = eachObj.regUrl
                let details_list = details.split('--')
                let event_date_time = details_list[0].split(' ')
                // [day, month, time, description]
                this.events_list.push([eachObj.name, event_date_time[0], event_date_time[1], event_date_time[2], details_list[1], img_link, reg_link])
            }
        }
    }).mount("#app")
}

function enlargePoster(img) {
    document.getElementById('poster-modal').innerHTML = `<img src="${img.src}" style="width: 100%"/>`
}
