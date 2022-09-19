
var error = document.getElementsByClassName("error").item(0);

if(error.textContent.includes("City")){
    alert(error.textContent);
    error.textContent = " ";
}