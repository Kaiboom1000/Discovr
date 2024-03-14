// loading the profile page dynamically

// var URLForProfiledata = "https://api.airtable.com/v0/appMXTX7OMCm75fGG/userprofiledata";
// var URLForPostdata = "https://api.airtable.com/v0/appMXTX7OMCm75fGG/post";
// var key = "Bearer keyVvxVRuGzP8OeqG";
var URLForProfiledata ="https://api.airtable.com/v0/appgI2se0yKA6c7Kx/userprofiledata";
var URLForPostdata="https://api.airtable.com/v0/appgI2se0yKA6c7Kx/post";
var key="Bearer patJyyZkOHdKRulrr.de0b902a697928f4eb1eb14901c664c4f40a619e6618d3fd8f7e9dec880086a1"

var username = localStorage.getItem("userid");
var error=0;
var count=0;

addInfo();
addPosts();
function opentable(){
  
window.open("admintabledelete.html", "_self")
}

function signOut(){
  localStorage.setItem('userid', '0');
  window.open("index.html", "_self");
}

// get all users profile info
function addInfo() {
  fetch(URLForProfiledata, {
    method: "GET",
    headers: {
      Authorization: key,
      "Content-Type": "application/json"
    }
  }).then(response =>
    response.json().then(data => {
      if (data.records.length > 0) {
        var temp = "";

        // start For loop to get user details

        data.records.forEach(u => {
          if (u.fields.id == username) {
            // fetching user details
          
            // add HTML code in temp varibale
           temp +=`
            <div class="margin25">
              <div class="bio__img-block">
                  <a href="#"><img class="bio__img" src="${u.fields.avatar}" alt="profile picture" /></a>
              </div>
               <div>
                  <h1>
                      <span class="bio__verified">${u.fields.UserName}<i class="fa fa-check"></i></span>
                  </h1>
                  <div>
                    Edit Profile <i class='far fa-edit edit-btn btn'onclick="edit('${username}')" 
                    data-toggle='modal' data-target='#editPersonalInfo'></i>
                  </div>
                  
              </div>
              <div class="bio_blurb">
              <h2>About me</h2>
              <p class="bio__description">${u.fields.Aboutme}</p>
              <img src="https://s3-whjr-v2-prod-bucket.whjr.online/whjr-v2-prod-bucket/edd6faf2-76dc-48ff-ac5a-097cf99a7f3e.png" 
              class="cake-icon" />
              <p>${u.fields.dob}</p>
              <img src="https://s3-whjr-v2-prod-bucket.whjr.online/whjr-v2-prod-bucket/3aaa0fcb-be53-4ede-ac34-770d32a8f658.png" 
              class="post-icon" />
              <p>${u.fields.postCount}</p>
              </div>
          </div><hr />`
          }
        });

        // adding HTML to profile.html page
        document.getElementById("profilepage").innerHTML = temp;
      }
    })
  );
  }

// fetching all post of user

function addPosts() {
  fetch(URLForPostdata, {
    method: "GET",
    headers: {
      Authorization: key,
      "Content-Type": "application/json"
    }
  }).then(response =>
    response.json().then(data => {
      if (data.records.length > 0) {
        
        // start For loop

        var temp1 =  `
        <h2 class="headings">
    Posts <a href="" class="btn upload-btn" data-toggle="modal" data-target="#uploadModal"> <i class="fa fa-upload"></i> </a>
</h2>
                 `;
        
        data.records.forEach(u => {
          // fetching all posts of the user

          if (u.fields.userID == username) {
            var post_id = u.fields.id;
            temp1 +=  `<div class="col-md-4 text-center posts-box">
    <div class="thumbnail">
        <img src="${u.fields.url}" class="posts" />
        <h2 class="thumbnail-caption">${u.fields.caption}</h2>
        <i onclick="likes('${u.fields.id}',${u.fields.Likes})" class="fas fa-heart">${u.fields.Likes}</i>
    </div>
</div>
                  `
              }
        });


        // adding all posts to profile.html page

        document.getElementById("postpage").innerHTML = temp1;
      }
    })
  );
}

// function to search user on best buds

function searchResults() {
  
  var searchVal = document.getElementById("searchVal").value;

  fetch(URLForProfiledata, {
    method: "GET",
    headers: {
      Authorization: key,
      "Content-Type": "application/json"
    }
  }).then(response =>
    response.json().then(data => {
      if (data.records.length > 0) {
        var temp3 = "";

        // start For loop
        

        data.records.forEach(u => {
          if (u.fields.UserName == searchVal) {
            temp3 += 
              `<div class="wells">
                  <img src="${u.fields.avatar}" class="sresult-icon" 
                  onclick="openProfile('${u.fields.id}')" />
                  ${u.fields.UserName}
               </div>`
          }
        });

        $("#searchresult").modal("show");

        // adding HTML to profile.html
        document.getElementById("sResults").innerHTML = temp3;
        
      }
    })
  );
}

// this function will open the serach profile on best buds
function openProfile(id) {
  localStorage.setItem("adminrandomProfile", id);
  window.open("adminrandomProfile.html", "_self");
}

// this function will edit the profile details
function edit(id) {

   fetch(`${URLForProfiledata}/${id}`,{
    method: "GET", // or 'PUT'
    headers: {
      Authorization: key,
      "Content-Type": "application/json"
    }
  }).then(response=>response.json().then(data => {
      document.getElementById("edit-about").value = data.fields.Aboutme;
      var update_id = data.fields.id;
  }));
}

//Updating the edited details on best buds
function updateData() {
  var about = document.getElementById("edit-about");
  var updatedTask = {
        records:[{
          "id":username,
          "fields": {
            Aboutme: about.value
        }
      }]
  } 
  fetch(URLForProfiledata, {
    method: 'PATCH', // or 'PUT'
    headers: {
      Authorization: key,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(updatedTask)
  })
  .then(response => response.json())
  .then(data => {
    window.open("profile.html", "_self");
    });
}

// this function to upload new post on best buds
function uploadPost() {
  var postCaption = document.getElementById("pst-caption").value;
  var image = document.getElementById("newPost");
  var files = image.files[0];
  var newPost;
  if (files) {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(files);
    fileReader.addEventListener("load", function() {
    var imageLink = this.result;
      
      newPost = {
        records: [
          {
            fields: {
              userID: username,
              caption: postCaption,
              url: imageLink,
              Likes: parseInt(0)
            }
          }
        ]
      };
     
      fetch(URLForPostdata, {
        method: "POST",
        headers: {
          Authorization: key,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newPost)
      })
        .then(response => {
          response.json();
          if (response.status == 200){
            error = 0;
          }
        else{
          error = 1;
        } }) 

        .then(data => {
          if(error == 0){
            incrementPostCount(username);
            document.getElementById("post-upload-success").innerHTML = "Uploaded successfully";
            error=1;
            window.open("profile.html", "_self");
          }
        else{
          document.getElementById("post-upload-success").innerHTML = "Error in processing image. Try with diffrent image.";
        }
        });
        
    });
  }
}

// this function will increment post count when a post is added
function incrementPostCount(username) {
  // getting the current postcount
  var count = 0;

  fetch(URLForProfiledata, {
    method: "GET", // or 'PUT'
    headers: {
      Authorization: key,
      "Content-Type": "application/json"
    },
  }).then(response =>
    response.json().then(data => {
      if (data.records.length > 0) {
        // start For loop

        data.records.forEach(u => {
          if (username == u.fields.id) {
            count = u.fields.postCount;
            count++;
            var UpdatePostCount = {
              records: [
                {
                  id: username,
                  fields: {
                    postCount: count
                  }
                }
              ]
            };
            // updating the count value

            fetch(URLForProfiledata, {
              method: "PATCH", // or 'PUT'
              headers: {
                Authorization: key,
                "Content-Type": "application/json"
              },
              body: JSON.stringify(UpdatePostCount)
            })
          }
        });

        // Close For Loop
      }
    })
  );
}

// this function is used to add likes to post
function likes(id, val) {
  
  var val = val + 1;
  var UpdateLikes = {
    records: [
      {
        id: id,
        fields: {
          Likes: parseInt(val)
        }
      }
    ]
  };
  fetch(URLForPostdata, {
    method: "PATCH", // or 'PUT'
    headers: {
      Authorization: key,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(UpdateLikes)
  })
    .then(response => response.json())
    .then(data => {
      console.log("Success:", data);
    });
  
  addPosts();
  
}