var URLForProfiledata ="https://api.airtable.com/v0/appgI2se0yKA6c7Kx/userprofiledata";
var URLForPostdata="https://api.airtable.com/v0/appgI2se0yKA6c7Kx/post";
var key="Bearer patJyyZkOHdKRulrr.de0b902a697928f4eb1eb14901c664c4f40a619e6618d3fd8f7e9dec880086a1"



function allData() {
  fetch(URLForProfiledata, {
    method: "GET", // or 'PUT'
    headers: {
      Authorization: key,
      "Content-Type": "application/json"
    }
  }).then(response =>
    response.json().then(data => {
      if (data.records.length > 0) {
        var temp = "";

        data.records.forEach(u => {
          temp += `<tr><td>${u.fields.UserName}</td>
                       <td> <img src="${u.fields.avatar}"/></td>                    
 <td> <a onclick="removeProduct('${u.fields.id}')" class="btn">- </a> </td>
          </tr>`;
          
          
        });

        document.getElementById("stationeryData").innerHTML = temp;

        // Close For Loop
      }
    })
  );
}
allData();
                




function signOut(){
  window.open("index.html","_self");
   
}

function removeProduct(id){
  URLForProfiledata=URLForProfiledata+"/"+ id;
  fetch(URLForProfiledata,{
    method: "DELETE", 
    headers: {
      Authorization: key,
      "Content-Type": "application/json"
    }
    
  }).then(response=>
          response.json().then(data=>{
    window.open("admintabledelete.html", "_self");
    
  }));
  
  
}
function adduser(id){
  URLForProfiledata=URLForProfiledata+"/"+ id;
  fetch(URLForProfiledata,{
    method: "POST", 
    headers: {
      Authorization: key,
      "Content-Type": "application/json"
    }
    
  }).then(response=>
          response.json().then(data=>{
    window.open("admintabledelete.html", "_self");
    
  }));
  
  
}