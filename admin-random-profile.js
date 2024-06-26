// loading the profile page dynamically

// var URLForProfiledata =
//   "https://api.airtable.com/v0/appMXTX7OMCm75fGG/userprofiledata";
// var URLForPostdata = "https://api.airtable.com/v0/appMXTX7OMCm75fGG/post";
// var key = "Bearer keyVvxVRuGzP8OeqG";
var URLForProfiledata ="https://api.airtable.com/v0/appgI2se0yKA6c7Kx/userprofiledata";
var URLForPostdata="https://api.airtable.com/v0/appgI2se0yKA6c7Kx/post";
var key="Bearer patLYazkg4CuHxTJ7.1e7b13e84fde74c4bb382c7bf148a168da2a2a9b134a65d85a7b59c820a094e5"

var username = localStorage.getItem("adminrandomProfile");
var showposts = 1;

// get all users profile info

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
          if(u.fields.postCount == "0"){
           showposts = 0; 
          }
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
if(showposts == 1){
  addPosts();
}

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
                      Posts
                  </h2>`;
        
        data.records.forEach(u => {
          // fetching all posts of the user

          if (u.fields.userID == username) {
            var post_id = u.fields.id;
            temp1 +=  `
                  <div class="col-md-4 text-center posts-box">
                      <div class="thumbnail">
                          <img src="${u.fields.url}" class="posts" />
                          <h2 class="thumbnail-caption">${u.fields.caption}</h2>
                          <i onclick="likes('${u.fields.id}',${u.fields.Likes})" 
                          class="fas fa-heart">${u.fields.Likes}</i>
                          <br/>
                          
                      </div>
                      <a class="btn" onclick="postdelete('${u.fields.id}')"> <img class="img" height:"100px" src = "https://cdn.glitch.global/6865bd0a-97c8-4224-b545-b259b733a25e/free-delete-736-470378__1_-removebg-preview.png?v=1702901993057"/> </a>
                  </div>`
              }
        });


        // adding all posts to profile.html page

        document.getElementById("postpage").innerHTML = temp1;
      }
    })
  );
}
function postdelete(id){
  URLForPostdata=URLForPostdata+"/"+ id;
  fetch(URLForPostdata,{
    method: "DELETE", 
    headers: {
      Authorization: key,
      "Content-Type": "application/json"
    }
    
  }).then(response=>
          response.json().then(data=>{
    window.open("adminrandomProfile.html", "_self");
    
  }));
  
  
}
