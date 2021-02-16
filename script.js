
var editor;
var compileButton;
var BASE_URL = "https://codequotient.com/api/"
var languageSelector;
var languageId;
var writtenCode;
var outputpanel;

function initProcess(){
    languageSelector = document.getElementById("languageSelector");
    editor = ace.edit("editor");
    compileButton = document.getElementById("compileBtn");
    outputpanel = document.getElementById("outputpanel");
    setLanguageId();
    setCode();
    sendCode();
}
// language ID ( Python : 0 , JavaScript : 4 , C : 7 , C++ : 77 , Java : 8) 
function setLanguageId(){
    var selectedLanguage = languageSelector.value;
    switch(selectedLanguage){

        case "Python": languageId = "0"; break;
        case "Java" : languageId = "8"; break;
        case "C": languageId = "7"; break;
        case "C++": languageId = "77"; break;
        default: languageId = "4"; break;


    }
    console.log("Selected Language Id : "  +languageId);

    
}
function setCode(){
    writtenCode = editor.getValue();
}

function sendCode(){
    var executionUrl = BASE_URL + "executeCode";
    var request = new XMLHttpRequest();
    request.open("POST", executionUrl);
    request.setRequestHeader("Content-Type","application/json");
    var dataToSend = {code:writtenCode,langId:languageId}; 
    request.send(JSON.stringify(dataToSend));

    request.addEventListener("load",function() {
        var response = JSON.parse(request.responseText);
        console.log(response);
        if("codeId" in response){
            var codeId = response.codeId;
                checkCode(codeId);
        }else {
            alert("Something went wrong !");
        }
    })
}

function checkCode(codeId){
    var urlToCheck = BASE_URL + "codeResult/" + codeId;
    var request = new XMLHttpRequest();
    request.open("GET", urlToCheck);
    request.send();
    request.addEventListener("load", function(){

        var response = JSON.parse(request.responseText);
        var data = JSON.parse(response.data);
        if(data.status==="Pending"){
            checkCode(codeId);
        }else{
            if(data.errors!==""){
                outputpanel.innerHTML = data.errors;
            }else{
                outputpanel.innerHTML = data.output;
            }
        }

    })


}