document.querySelector("#title-input").addEventListener("focusout",(data)=>{
  document.querySelector("#label2").style.opacity = 0
})
document.querySelector("#title-input").addEventListener("focusin",(data)=>{
  document.querySelector("#label2").style.opacity = 1
})
document.querySelector("#title-input").addEventListener("input",(data)=>{
  document.querySelector("#label2").innerHTML = 100-(document.querySelector("#title-input").value.length)
  if(document.querySelector("#title-input").value.length>100){
      document.querySelector("#label2").style.color = "red"
      document.querySelector("#tittle").style.borderColor = "red";
  }
  else{       
      document.querySelector("#label2").style.color = "white"
      document.querySelector("#tittle").style.borderColor = "rgba(255, 255, 255, 0.244)";
  }
})

document.querySelector("#desc-input").addEventListener("focusout",(data)=>{
  document.querySelector(".desc-count").style.opacity = 0
})
document.querySelector("#desc-input").addEventListener("focusin",(data)=>{
  document.querySelector(".desc-count").style.opacity = 1
})
document.querySelector("#desc-input").addEventListener("input",(data)=>{
  document.querySelector(".desc-count").innerHTML = 200-(document.querySelector("#desc-input").value.length)
  if(document.querySelector("#desc-input").value.length>200){
      document.querySelector(".desc-count").style.color = "red"
      document.querySelector("#description").style.borderColor = "red";
  }
  else{       
      document.querySelector(".desc-count").style.color = "white"
      document.querySelector("#description").style.borderColor = "rgba(255, 255, 255, 0.244)";
  }
})






document.querySelector("#video-upload-btn").addEventListener("click",function(){
  document.querySelector("#video-input").click();
})
document.querySelector("#video-input").addEventListener("change",function(){
 document.querySelector("#exampleModal").style.display = "none"
 document.querySelector("#modal2").click()
 // document.querySelector("#video-form").submit();

})
document.querySelector(".video-input").addEventListener("click",function(){
 document.querySelector("#video-input").click();
})
// document.querySelector("#video-input").addEventListener("change",function(){
//   document.querySelector("#video-form").submit();
// })
var flag = 1
document.querySelector("#menu-icon").addEventListener("click",function(){
if(flag==1){
  document.querySelector("#left-content").style.width="0%"
  document.querySelector("#right-content").style.width="100vw"
  document.querySelector("#youtube-content").style.width="100vw"
  flag=0
}
else{
  document.querySelector("#left-content").style.width="15vw"
  document.querySelector("#right-content").style.width="85vw"
  document.querySelector("#youtube-content").style.width="85vw"

  flag=1
}
})



var flaggg = 1
document.querySelector(".folder-btn").addEventListener("click",function(){
if(flaggg==1){
  document.querySelector("#playlist-form").style.display="inline-block"
  flaggg=0
  console.log("hey")
}
else{
  document.querySelector("#playlist-form").style.display="none"
  flaggg=1
}
})




var playlistFolder = document.querySelectorAll(".video-content")
playlistFolder.forEach(function(dets){
  dets.addEventListener("mousemove",function(){
    dets.childNodes[5].style.display="block"
    console.log(dets.childNodes[5]);
  })
  dets.addEventListener("mouseleave",function(){
    dets.childNodes[5].style.display="none"
  })
})