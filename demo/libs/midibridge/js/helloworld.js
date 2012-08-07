/**
 * Note for IE8 users: if you include MidiBridge.js in your html, the method addEventListener will be added to the window object.
 * In fact this method is just a wrapper around the attachEvent method.
 */

//a very basic example that shows how to embed an use the midibridge
window.addEventListener('load', function() {
    
    var contentDiv = document.getElementById("content");
console.log("sdf");
    
    midiBridge.init({
        ready: function(){
console.log("sdf");
            contentDiv.innerHTML += "midi bridge loaded<br/>";
        },data: function(midiEvent){
            contentDiv.innerHTML += midiEvent + "<br/>";
        }
    });
    
}, false);
