//Two axios call to get the workout and youtube api key from backend
var workoutKey = ""
axios.get("https://dcsibh9m73.execute-api.ap-southeast-1.amazonaws.com/prod/retrieveApiKey.php")
.then( response => {
    eachObject = JSON.parse(response.data[1])
    workoutKey = eachObject['key']
    })
.catch(error => {console.log(error.message)})

var videoKeyGroup = []
for (let i=2; i<7; i++) {
    axios.get("https://dcsibh9m73.execute-api.ap-southeast-1.amazonaws.com/prod/retrieveApiKey.php")
    .then( response => {
        eachObject = JSON.parse(response.data[i])
        videoKeyGroup.push(eachObject['key'])
    })
    .catch(error => {console.log(error.message)})
}

//1st Vue for recom workout page
const app1 = Vue.createApp({ 
    data() { 
        return { 
            i: 0
        };
    },
    methods: {
        methodName() {
            
        }
    }
});
app1.component('ourvideo', { 
    props: [ 'link','cate','topic','desc'],  
    methods: {
        methodName() {
            
        }
    },
    template: `
      <div class="column" v-bind:class="[cate]">
        <div class="content">
          <iframe width="100%" height="400rem" v-bind:src="link" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          <h4>{{topic}}</h4>
          <p>{{desc}}</p>
        </div>
      </div>`
});
const vm1 = app1.mount('#app1'); 


  //FILTER SECOND PAGE
  filterSelection("all") // Execute the function and show all columns
  function filterSelection(c) {
    var x, i;
    x = document.getElementsByClassName("column");
    if (c == "all") c = "";
    // Add the "show" class (display:block) to the filtered elements, and remove the "show" class from the elements that are not selected
    for (i = 0; i < x.length; i++) {
        w3RemoveClass(x[i], "show");
        if (x[i].className.indexOf(c) > -1) w3AddClass(x[i], "show");
    }
  }

  // Show filtered elements
  function w3AddClass(element, name) {
    var i, arr1, arr2;
    arr1 = element.className.split(" ");
    arr2 = name.split(" ");
    for (i = 0; i < arr2.length; i++) {
        if (arr1.indexOf(arr2[i]) == -1) {
        element.className += " " + arr2[i];
        }
    }
  }

  // Hide elements that are not selected
  function w3RemoveClass(element, name) {
    var i, arr1, arr2;
    arr1 = element.className.split(" ");
    arr2 = name.split(" ");
    for (i = 0; i < arr2.length; i++) {
        while (arr1.indexOf(arr2[i]) > -1) {
        arr1.splice(arr1.indexOf(arr2[i]), 1);
        }
    }
    element.className = arr1.join(" ");
  }

  // Add active class to the current button (highlight it)
  var btnContainer = document.getElementById("myBtnContainer");
  var btnss = btnContainer.getElementsByClassName("btns");
  for (var i = 0; i < btnss.length; i++) {
    btnss[i].addEventListener("click", function(){
        var current = document.getElementsByClassName("actives");
        current[0].className = current[0].className.replace(" actives", "");
        this.className += " actives";
    });
  }


//2nd Vue for generate workout plan and video VERY IMPORTANT
  const app = Vue.createApp({ 
      data() { 
          return { 
              Cardio: 'Cardio',
              Olympic_weightlifting: 'Olympic_weightlifting',
              Plyometrics: 'Plyometrics',
              Powerlifting: 'Powerlifting',
              Strength: 'Strength',
              Strongman: 'Strongman',
              Beginner: 'Beginner',
              Intermediate: 'Intermediate',

              type: '',
              difficulty: '',
              resp: '',
              resp1: ''
          };
      },
      methods: {
          add() {
              document.getElementById("workouts").innerHTML = ''
              axios.get('https://api.api-ninjas.com/v1/exercises', {
              params: {
                  type: this.type,
                  difficulty: this.difficulty
              },
              headers: {
                  'X-Api-Key': workoutKey
              }
              
              })
              .then(response => {
                  this.resp = response.data

                  let Heading= document.createElement("div")
                  Heading.innerHTML = `<h2 class="fw-bolder">Your Personalized Workouts: </h2>`
                  document.getElementById("workouts").appendChild(Heading)
                  var count = "t"
                  var key1 = videoKeyGroup[0]
                  var key2 = videoKeyGroup[1]
                  var key3 = videoKeyGroup[2]
                  var key4 = videoKeyGroup[3]
                  var key5 = videoKeyGroup[4]
                  var countTerm = 0
                  for (excer of this.resp) {
                      let name_ = excer.name
                      let muscle_ = excer.muscle
                      let equipment_ = excer.equipment
                      let instruction_ = excer.instructions
                      let instru = instruction_
                      
                      if (instru.length > 300) {
                        let index = instruction_.indexOf(".", 300)
                        instru = instruction_.slice(0,index+1)
                      }

                      var finalkey = key1

                      if(countTerm%5 === 0) {
                        finalkey = key1
                      }
                      else if(countTerm%5 === 1) {
                        finalkey = key2
                      }
                      else if(countTerm%5 === 2) {
                        finalkey = key3
                      }
                      else if(countTerm%5 === 3) {
                        finalkey = key4
                      }
                      else if(countTerm%5 === 4) {
                        finalkey = key5
                      }

                      axios.get('https://www.googleapis.com/youtube/v3/search', {
                        params: {
                            maxResults: 1,
                            part: 'snippet',
                            q: name_,
                            key: finalkey,
                        }
                      })
                      .then(response1 => {
                        count += "t"
                        let k = response1.data.items[0].id.videoId
                        let para= document.createElement("div")
                        para.setAttribute("class","col-lg-4 col-md-6 mb-4")
                        para.innerHTML = `      
                              <div class="card">
                                  <h5 class="card-header">${name_}</h5>
                                  <iframe src="https://www.youtube.com/embed/${k}" width=auto height=300 allowfullscreen></iframe>
                                  <div class="card-body">
                                      <h5 class="card-title">Muscle Group: ${muscle_}</h5>
                                      <h5 class="card-title">Equipment: ${equipment_}</h5>
                                      <h5 class="card-title">Type: ${this.type}</h5>

                                      <button class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#${count}" aria-controls="offcanvasWithBothOptions">Quick Tips</button>

                                      <div class="offcanvas offcanvas-top" data-bs-scroll="true" tabindex="-1" id="${count}" aria-labelledby="offcanvasWithBothOptionsLabel">
                                        <div class="offcanvas-header">
                                            <h5 class="offcanvas-title" id="offcanvasWithBothOptionsLabel">${name_} Instruction</h5>
                                            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                                        </div>

                                        <div class="offcanvas-body">
                                            <p>${instru}</p>
                                        </div>
                                      </div>
                                  </div>
                              </div>
                              <div class="row"></div>
                          `

                      document.getElementById("workouts").appendChild(para)
                      });
                    countTerm += 1
                  }

              })
          }
      } // methods
  });
  const vm = app.mount('#app'); 


//making tab works
  function openCity(evt, cityName) {
      document.getElementById("loading-page").style = "display:none;"
      // Declare all variables
      var i, tabcontent, tablinks;

      // Get all elements with class="tabcontent" and hide them
      tabcontent = document.getElementsByClassName("tabcontent");
      for (i = 0; i < tabcontent.length; i++) {
          tabcontent[i].style.display = "none";
      }

      // Get all elements with class="tablinks" and remove the class "active"
      tablinks = document.getElementsByClassName("tablinks");
      for (i = 0; i < tablinks.length; i++) {
          tablinks[i].className = tablinks[i].className.replace(" active", "");
      }

      // Show the current tab, and add an "active" class to the button that opened the tab
      document.getElementById(cityName).style.display = "block";
      evt.currentTarget.className += " active";
  }