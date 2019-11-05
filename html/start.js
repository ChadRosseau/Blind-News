   // var emailNotifications = () => {
   //     console.log("working");
   // }


   var emailSubmit = document.getElementById("emailSubmit");
   setInterval(function() {

       let getTheTime = new Date();
       let getMin = getTheTime.getMinutes()
       let getHour = getTheTime.getHours()
       if (getMin == 17 && getHour == 18) {
           $("#emailSubmit").trigger("submit");
       }


   }, 10000);

let x = 11;
emailSubmit.addEventListener("submit", function() {
	alert("SDFADS");
})


$("#emailSubmit").submit(function(){
	console.log("This works")
	return true;
})

