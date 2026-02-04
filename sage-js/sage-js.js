/* sage.js version 1.9 
Created by: Chanda Fungamwango Mark
Call/whatsapp: 0962464552
Email: chandamark386@gmail.com
*/
//hide function
function hide(hide){
try{
 var elem=document.querySelectorAll(hide);
 for(var i = 0; i < elem.length; i++) {
    elem[i].style.display='none';
}}
catch(err){
//console.log(err.message)
hide.style.display='none';}
}

//show function
function show(show, mode=null){
  try{
 var elem=document.querySelectorAll(show);
 for(var i = 0; i < elem.length; i++) {
if(mode==null || mode=='none'){
  elem[i].style.display='block';
  }else{
    elem[i].style.display=mode;
  }

}
  }
catch(err){
if(mode==null){
show.style.display='block';
  }else{
show.style.display=mode;
  }
}
}

//toggle show function   
function toggle(toggle, mode=null){
 try{
 var elem=document.querySelectorAll(toggle);
 for (var i = 0; i < elem.length; i++) {
var get_display_property=getComputedStyle(elem[i])

if(get_display_property.display=='none'){
 if(mode==null){
  elem[i].style.display='block';}
 else{elem[i].style.display=mode;}
}
else{elem[i].style.display='none';}
}
}
catch(err){
var get_display_property=getComputedStyle(toggle);
if(get_display_property.display=='none'){
if(mode==null){
toggle.style.display='block';}
else{toggle.style.display=mode;}
}
else{toggle.style.display='none'}
}}

//getting input values
function getValue(val){
try{
var elem=document.querySelectorAll(val);
 for(var i=0; i<elem.length; i++) {
  return elem[i].value;
 }}
catch(err){
return val.value;
}
}


//setting the values into the inputs/textarea elements

function setValue(selector,val){
try{
var elem=document.querySelectorAll(selector);
 for(var i=0; i<elem.length; i++) {
  elem[i].value=val;
 }}
catch(err){
selector.value=val;
}}




//set styles (multiple elements)
function setValues(obj) {
try{
for (selector in obj) {
     var elem=document.querySelectorAll(selector);
  for(var i=0; i<elem.length; i++){
       elem[i].value=obj[selector];
     }
}
}
catch(e){
  return console.log('error')
}
}






//getting innerHTML content
function getHTML(html){
  try{
var elem=document.querySelectorAll(html);
 for(var i=0; i<elem.length; i++) {
  return elem[i].innerHTML;
 }}
 catch(err){
  return html.innerHTML;
}
}


//setting innerHTML content
function setHTML(selector, html){
  try{
var elem=document.querySelectorAll(selector);
 for(var i=0; i<elem.length; i++) {
  elem[i].innerHTML=html;
 }}
catch(err){
selector.innerHTML=html;
}
}



//set styles (multiple elements)
function setHTMLs(obj) {
try{
for (selector in obj) {
     var elem=document.querySelectorAll(selector);
  for(var i=0; i<elem.length; i++){
       elem[i].innerHTML=obj[selector];
     }
}
}
catch(e){
  return console.log('error')
}
}



//toggle  html   
function toggleHTML(selector,old,new_text){
 try{
 var elem=document.querySelectorAll(selector);
 for (var i = 0; i < elem.length; i++) {

if(elem[i].innerHTML==old){
 elem[i].innerHTML=new_text;}
else{elem[i].innerHTML=old;}
}
}
catch(err){
if(selector.innerHTML==old){
 selector.innerHTML=new_text;}
else{selector.innerHTML=old;}
}}


//getting text content
function getText(txt){
  try{
var elem=document.querySelectorAll(txt);
 for(var i=0; i<elem.length; i++) {
  return elem[i].textContent;
 }}
 catch(err){
return txt.textContent;
}

}

//setting  Text content
function setText(selector, txt){
   try{
var elem=document.querySelectorAll(selector);
 for(var i=0; i<elem.length; i++) {
  elem[i].textContent=txt;
 }}
catch(err){
selector.textContent=txt;
}
}


//set styles (multiple elements)
function setTexts(obj) {
try{
for (selector in obj) {
     var elem=document.querySelectorAll(selector);
  for(var i=0; i<elem.length; i++){
       elem[i].textContent=obj[selector];
     }
}
}
catch(e){
  return console.log('error')
}}


//appending innerHTML content
function appendHTML(selector, html){
  try{
var elem=document.querySelectorAll(selector);
 for(var i=0; i<elem.length; i++) {
  elem[i].innerHTML+=html;
 }}
 catch(err){
  selector.innerHTML+=html;
 }}



//appending input value content
function appendValue(selector, val){
  try{
var elem=document.querySelectorAll(selector);
 for(var i=0; i<elem.length; i++) {
  elem[i].value+=val;
 }}
 catch(err){
  selector.value+=val;
 }}

//prepending innerHTML content
function prependHTML(selector, html){
  try{
var elem=document.querySelectorAll(selector);
 for(var i=0; i<elem.length; i++) {
  var old_data=elem[i].innerHTML;
  elem[i].innerHTML=html+old_data;
 }}
catch(err){
  var old_data=selector.innerHTML;
  selector.innerHTML=html+old_data;
}
}


//prepending innerHTML content
function prependValue(selector, val){
  try{
var elem=document.querySelectorAll(selector);
 for(var i=0; i<elem.length; i++) {
  var old_data=elem[i].value;
  elem[i].value=val+old_data;
 }}
catch(err){
  var old_data=selector.value;
  selector.innerHTML=val+old_data;
}
}


//removing element
function remove(selector){
  try{
var elem=document.querySelectorAll(selector);
 for(var i=0; i<elem.length; i++) {
  elem[i].parentNode.removeChild(elem[i]);
 }}
catch(err){
selector.parentNode.removeChild(selector);
}
}


//getting  parent element
function parent(selector){
  try{
return document.querySelector(selector).parentNode.nodeName;
 }
catch(err){
 return selector.parentNode.nodeName;
}
}


//getting the attribute name 
function getAttr(selector,name){
 try{
var elem=document.querySelectorAll(selector);
 for(var i=0; i<elem.length; i++) {
  return elem[i].getAttribute(name);
 }}
catch(err){
return selector.getAttribute(name);
}}

//setting  the attribute value
function setAttr(selector, obj){
  try{
var elem=document.querySelectorAll(selector);
for(var i=0; i<elem.length; i++) {

//looping through object
for(var key in obj){
if(obj.hasOwnProperty(key)){
elem[i].setAttribute(key, obj[key]);
}}}
}
catch(err){
for(var key in obj){
if(obj.hasOwnProperty(key)){
selector.setAttribute(key, obj[key]);
}}
}}

//when selector
function when(selector, obj){
//this=this.selector;
if(selector==window){
for(var key in obj){
if(obj.hasOwnProperty(key)){
window.addEventListener(key, obj[key]);
}}}

else if(selector==document){
for(var key in obj){
if(obj.hasOwnProperty(key)){
document.addEventListener(key, obj[key]);
}}}

else{
var elem=document.querySelectorAll(selector);
for(var i=0; i<elem.length; i++) {

//looping through object
for(var key in obj){
if(obj.hasOwnProperty(key)){
elem[i].addEventListener(key, obj[key]);
}}
}
}}


//element selector
function E(e){
if(e==window){
  return window;}
else if(e==document){
  return document;}
else{
return document.querySelectorAll(e);
}}


//css
//getting style property value 
function getStyle(selector, property){
 try{
var get_css_property=getComputedStyle(document.querySelector(selector))
return get_css_property[property];
}
catch(err){
var get_css_property=getComputedStyle(selector)
return get_css_property[property];
 }

}


//styling html (one element)
function setStyle(selector, obj){
try{
var elem=document.querySelectorAll(selector);
for(var i=0; i<elem.length; i++){

//looping through object
for(var key in obj){
if(obj.hasOwnProperty(key)){
elem[i].style[key]=obj[key];
}}
}}
catch(err){
for(var key in obj){
if(obj.hasOwnProperty(key)){
selector.style[key]=obj[key];
}}
}
}



//set styles (multiple elements)
function setStyles(obj) {
try{
for (selector in obj) {
     var elem=document.querySelectorAll(selector);
  for(var i=0; i<elem.length; i++){

  for(property in obj[selector]){
    elem[i].style[property]=obj[selector][property];
     }
   }
}
}
catch(e){
  return console.log('style error')
}
}


//adding the class to the html
function addClass(selector, class_name){
  try{
var elem=document.querySelectorAll(selector);
 for(var i=0; i<elem.length; i++) {
var split_class=class_name.split(',');
//looping through thw class names
  for(var x=0; x<split_class.length; x++){
   elem[i].classList.add(split_class[x].trim());
 }}
}
catch(err){
var split_class=class_name.split(',');
//looping through thw class names
  for(var x=0; x<split_class.length; x++){
   selector.classList.add(split_class[x].trim());
 }}
}


//removing the class from the html
function removeClass(selector, class_name){
  try{
var elem=document.querySelectorAll(selector);
 for(var i=0; i<elem.length; i++) {
var split_class=class_name.split(',');
//looping through thw class names
  for(var x=0; x<split_class.length; x++){
   elem[i].classList.remove(split_class[x].trim());
 }
}}
catch(err){
  var split_class=class_name.split(',');
//looping through thw class names
  for(var x=0; x<split_class.length; x++){
   selector.classList.remove(split_class[x].trim());
 }
}
}


//toggling class name   
function toggleClass(selector, class_name){
   try{
var elem=document.querySelectorAll(selector);
 for(var i=0; i<elem.length; i++) {
var split_class=class_name.split(',');
//looping through thw class names
  for(var x=0; x<split_class.length; x++){
   elem[i].classList.toggle(split_class[x].trim());
}}
}
catch(err){
var split_class=class_name.split(',');
//looping through thw class names
  for(var x=0; x<split_class.length; x++){
   selector.classList.toggle(split_class[x].trim());
}

}}



//slideshow
function slideShow(selector, duration=1000, random=false){
//hiding all the class list
var elem=document.querySelectorAll(selector);
for(var i=0; i<elem.length; i++) {
  elem[i].style.display='none'; }

//showing elements after specified time
if(random==true){
setInterval(function(){
//hiding all the elements per call
for(var i=0; i<elem.length; i++) {
  elem[i].style.display='none'; }

var rand=Math.floor(Math.random()*elem.length)
  elem[rand].style.display='block';
},duration)
}else{
x=0
setInterval(function(){
//hiding all the elements per call
for(var i=0; i<elem.length; i++) {
  elem[i].style.display='none'; }

elem[x].style.display='block';
x++;
if(x==elem.length){
    x=0;}
},duration)
}}

//LoadData()
function loadData(selector, url, mode=null, interval=false){
var request=new XMLHttpRequest();
var elem=document.querySelectorAll(selector);
var last_modified=null;
if(interval==false || interval==null || interval=='' || interval==undefined){
request.onreadystatechange=function(){
if(request.status==200 && request.readyState==4){
//last_modified=request.getResponseHeader('last-modified');
for(var i=0; i<elem.length; i++){
  if(mode=='a'){
  elem[i].innerHTML+=request.responseText;
var elem_with_script=document.querySelectorAll(selector+' script');
for(var i=0; i<elem_with_script.length; i++) {
  eval(elem_with_script[i].innerHTML);
 }
}
  else if(mode=='p'){
  var old_data=elem[i].innerHTML;
  elem[i].innerHTML=request.responseText+old_data;
var elem_with_script=document.querySelectorAll(selector+' script');
for(var i=0; i<elem_with_script.length; i++) {
  eval(elem_with_script[i].innerHTML);
 }
}
  else{
elem[i].innerHTML=request.responseText;
var elem_with_script=document.querySelectorAll(selector+' script');
for(var i=0; i<elem_with_script.length; i++) {
  eval(elem_with_script[i].innerHTML);
 }

  }
//console.log(request.getAllResponseHeaders())
}}
if(request.status==404 && request.readyState==4){
for(var i=0; i<elem.length; i++){
    elem[0].innerHTML="<h1>Page not found!</h1>";
}}
}
//alert(array[0]);
request.open('GET',url, true);
//this is for post method
request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
request.send();
}else{

setInterval(function(){
request.onreadystatechange=function(){
if(request.status==200 && request.readyState==4){

for(var i=0; i<elem.length; i++){
  if(mode=='a'){
  elem[i].innerHTML+=request.responseText;
var elem_with_script=document.querySelectorAll(selector+' script');
for(var i=0; i<elem_with_script.length; i++) {
  eval(elem_with_script[i].innerHTML);
 }
}
  else if(mode=='p'){
  var old_data=elem[i].innerHTML;
  elem[i].innerHTML=request.responseText+old_data;
var elem_with_script=document.querySelectorAll(selector+' script');
for(var i=0; i<elem_with_script.length; i++) {
  eval(elem_with_script[i].innerHTML);
 }
}
  else{
  elem[i].innerHTML=request.responseText;
 var elem_with_script=document.querySelectorAll(selector+' script');
for(var i=0; i<elem_with_script.length; i++) {
  eval(elem_with_script[i].innerHTML);
 }
  }
}
}

if(request.status==404 && request.readyState==4){
for(var i=0; i<elem.length; i++){
    elem[0].innerHTML="<h1>Page not found!</h1>";
}}
}
request.open('post',url, true);
//this is for post method
request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
request.send();
},interval)

}
}

//sendData()
function sendData(selector, url, data, mode=null, timeOut=false){
var request=new XMLHttpRequest();
var elem=document.querySelectorAll(selector);
var last_modified=null;
if(timeOut==false){
request.onreadystatechange=function(){
if(request.status==200 && request.readyState==4){
//last_modified=request.getResponseHeader('last-modified');
for(var i=0; i<elem.length; i++){
  if(mode=='a'){
  elem[i].innerHTML+=request.responseText;
var elem_with_script=document.querySelectorAll(selector+' script');
for(var i=0; i<elem_with_script.length; i++) {
  eval(elem_with_script[i].innerHTML);
 }
}
  else if(mode=='p'){
  var old_data=elem[i].innerHTML;
  elem[i].innerHTML=request.responseText+old_data;
var elem_with_script=document.querySelectorAll(selector+' script');
for(var i=0; i<elem_with_script.length; i++) {
  eval(elem_with_script[i].innerHTML);
 }
}
  else{
  elem[i].innerHTML=request.responseText;
var elem_with_script=document.querySelectorAll(selector+' script');
for(var i=0; i<elem_with_script.length; i++) {
  eval(elem_with_script[i].innerHTML);
 }
  }
//console.log(request.getAllResponseHeaders())
}
}
if(request.status==404 && request.readyState==4){
for(var i=0; i<elem.length; i++){
 elem[0].innerHTML="<h1>Page not found!</h1>";
}}
}

//looping through data object
var array=[];
for(var key in data){

if(data.hasOwnProperty(key)){
array.push(key.trim()+'='+data[key].toString().trim());
}}

request.open('POST',url, true);
//this is for post method
request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
request.send(array.join('&'));

}else{

setTimeout(function(){
request.onreadystatechange=function(){
if(request.status==200 && request.readyState==4){

for(var i=0; i<elem.length; i++){
  if(mode=='a'){
  elem[i].innerHTML+=request.responseText;
var elem_with_script=document.querySelectorAll(selector+' script');
for(var i=0; i<elem_with_script.length; i++) {
  eval(elem_with_script[i].innerHTML);
 }
}
  else if(mode=='p'){
  var old_data=elem[i].innerHTML;
  elem[i].innerHTML=request.responseText+old_data;
var elem_with_script=document.querySelectorAll(selector+' script');
for(var i=0; i<elem_with_script.length; i++) {
  eval(elem_with_script[i].innerHTML);
 }
}
  else{
  elem[i].innerHTML=request.responseText;
var elem_with_script=document.querySelectorAll(selector+' script');
for(var i=0; i<elem_with_script.length; i++) {
  eval(elem_with_script[i].innerHTML);
 }
  }
}
}

if(request.status==404 && request.readyState==4){
for(var i=0; i<elem.length; i++){
return  elem[i].innerHTML="<h2>Page not found!</h2>";
}}
}
//looping through data object
var array=[];
for(var key in data){

if(data.hasOwnProperty(key)){
array.push(key.trim()+'='+data[key].toString().trim());
}}

request.open('POST',url, true);
//this is for post method
request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
request.send(array.join('&'));

},timeOut)

}}

//file upload preview
function filePreview(input_id,target_id,index=0){
var file_path=URL.createObjectURL(document.getElementById(input_id).files[index]);
document.getElementById(target_id).src=file_path;}

//My location
function myLocation(selector=false){

const success=function(position){
//console.log(position);
const latitude=position.coords.latitude;
const longitude=position.coords.longitude;
//console.log(latitude +" , "+ longitude);

const geoApiUrl='https://api.bigdatacloud.net/data/reverse-geocode-client?latitude='+latitude+'&longitude='+longitude+'&localityLanguage=en';

fetch(geoApiUrl).then(res=> res.json()).then(data=>{
    //console.log(data)
  var continent=data.continent;
  var  country=data.countryName;
  var  district=data.locality;
  var  province=data.principalSubdivision;
var user_location=district+ ', ' +province+ ', '+country+ ', '+continent;
if(selector!=false){
  var elem=document.querySelectorAll(selector);
for(var i = 0; i < elem.length; i++) {
    elem[i].innerHTML=user_location;}
}else{
 return user_location;
}

    })}

const error=function(){
if(selector!==false){
  var elem=document.querySelectorAll(selector);
elem[0].innerHTML="Error: Unable to retrieve your location";}
else{return "Error: Unable to retrieve your location"; }}


navigator.geolocation.getCurrentPosition(success, error); }


//getting location by id
function locationByIp(ip_address,selector=false){
 var latitude,longitude,user_location;
//getting the current location
async function getIpInfo (){
  
const accessKey ='ebf57116-ef2e-4709-b7c8-e58c2bd16e7a';
  const url = 'http://apiip.net/api/check?ip='+ip_address+'&accessKey='+ accessKey; 

  const response = await fetch(url);

  const result = await response.json();
  //console.log(result);

latitude=result.latitude;
longitude=result.longitude; 

const geoApiUrl='https://api.bigdatacloud.net/data/reverse-geocode-client?latitude='+latitude+'&longitude='+longitude+'&localityLanguage=en';
fetch(geoApiUrl).then(res=> res.json()).then(data=>{
  //console.log(data)
  //alert(data.principalSubdivision);
  var  continent=data.continent;
  var  country=data.countryName;
  var  district=data.locality;
  var  province=data.principalSubdivision;
user_location=district+ ', ' +province+ ', '+country+ ', '+continent;
if(selector!=false){
var elem=document.querySelectorAll(selector);
for(var i = 0; i < elem.length; i++) {
    elem[i].innerHTML=user_location;}

}else{
  return user_location;
}

})
};

getIpInfo();
}


//copying text
function copyText(selector){
try{
var elem=document.querySelectorAll(selector);
for(var i = 0; i < elem.length; i++) {
   elem[i].select();
   document.execCommand('copy');
  navigator.clipboard.writeText(elem[i].value)
}}
catch(err){
  selector.select();
  document.execCommand('copy');
  navigator.clipboard.writeText(selector.value)
}
}


//creating simple clock
function clock(selector, hrs=false, mins=false){
var elem=document.querySelectorAll(selector);
var time,hours,minutes,seconds;

setInterval(function(){
 time=new Date();
//load the current time
for(var i = 0; i < elem.length; i++) {
if(hrs!=false || mins!=false){
    time.setHours(23);
    time.setMinutes(40);
    time.setSeconds(0);
    hours=time.getHours();
      minutes=time.getMinutes();
      seconds=time.getSeconds();
   mins=false;
   hrs=false;}

hours=time.getHours();
minutes=time.getMinutes();
seconds=time.getSeconds();
millisec=time.getMilliseconds();


     if(hours<10){
       hours='0'+hours;}
     if(minutes<10){
       minutes='0'+minutes;}
     if(seconds<10){
       seconds='0'+seconds;}
    elem[i].innerHTML=hours+':'+minutes+':'+seconds;
  }

},1000)
}

//a count down
function countDown(selector, start=0, stop=0,callback=false){
var elem=document.querySelectorAll(selector);
if(stop<10){
  modified_stop='0'+stop;}
var interval=setInterval(function(){
start--;

//load the current time
for(var i=0; i < elem.length; i++) {
    if(start==0){
        start=0;
        clearInterval(interval);}
    if(stop==0){
        stop=0;}
       //stoping the counter
    if(start<10){
       start='0'+start;}

elem[i].innerHTML=start;
if(start==stop){
clearInterval(interval);
if(callback!==false){
return callback();
}
}
  }

},1000)
}

//after 
function after(duration,callback){
   var timeout=setTimeout(callback,duration)}

//every 
function every(duration,callback){
  interval=setInterval(callback,duration)}

function stop(){
clearInterval(interval);
}


//drag and drop
function dragDrop(from, to, from_parent=false) {

var elem_from=document.getElementById(from);
var elem_to=document.getElementById(to);

setAttr('#'+from,{draggable:true});
//setAttr('#'+to,{draggable:true});
//on drag over
elem_to.addEventListener('dragover', function(event){
    event.preventDefault();
  })  
 

//on drag
elem_from.addEventListener('dragstart', function(event){
event.dataTransfer.setData("text", event.target.id);})


//on drop
elem_to.addEventListener('drop', function(event){
  event.preventDefault();
  var data = event.dataTransfer.getData("text");
  event.target.appendChild(document.getElementById(data));})

//if the drop back is set
if(from_parent!=false){
var elem_from_parent=document.getElementById(from_parent);
elem_from_parent.addEventListener('drop', function(event){
  event.preventDefault();
  var data = event.dataTransfer.getData("text");
  event.target.appendChild(document.getElementById(data));})

elem_from_parent.addEventListener('dragover', function(event){
    event.preventDefault();
  })  }

}



//creating files
function createFile(link_id,filename,data,file_type='txt'){
  file_type=file_type.toLowerCase();
  f_type='text/plain'
if(file_type=='json'){
   f_type='application/json'
  }
if(file_type=='css'){
   f_type='text/css'
  }
  if(file_type=='html'){
   f_type='text/html'
  }
if(file_type=='js'){
   f_type='text/javascript'}
  
var blob=new Blob([data],{type:f_type});
var path=URL.createObjectURL(blob);

document.getElementById(link_id).href=path;
filename+='.'+file_type;
document.getElementById(link_id).download=filename;}


//readFile

function readFile(input_file, output){
try{
file=input_file.files[0];
}
catch(e){
file=document.querySelector('#'+input_file).files[0];
}
reader=new FileReader()
reader.onload=(event)=>{
text=event.target.result
var output_elem=document.querySelectorAll(output)
for(let i=0; i<output_elem.length; i++){
    output_elem[i].value=text;}
}
reader.readAsText(file);
}


//random number
function guese(num, target,callback){
    
var rand=Math.floor(Math.random()*num+1);
if(rand==target){
  callback();
  return rand; 
}else{
 return rand; 
}}


//random number
function random(from=0, to){
 var rand_num=Math.floor(Math.random()*to+1);
 if(from!=0){
 if(rand_num>=from){
   return rand_num;}else{
   return rand_num='click again..';
   }
 }else{
    return rand_num;}
}


function createSPA(links_selector,result,active_class=null, loader='Loading..'){
var elem=document.getElementsByClassName(links_selector);
function selectLink(id, url){
for(var i=0; i<elem.length; i++){
elem[i].classList.toggle(active_class,elem[i].id===id);
setHTML(result,loader)
loadData(result,url)
}}

for(var i=0; i<elem.length; i++){
    elem[i].setAttribute('id','data_'+i)
    let id=elem[i].id;
    let link_name=elem[i].innerText;
    let url=elem[i].getAttribute('data-url');
    elem[i].addEventListener('click',function(){
  history.pushState({id,url},'data:'+id,'#'+link_name)
    setHTML(result,loader)
    loadData(result,url)
    selectLink(id,url)
    });
}

window.addEventListener('popstate',function(event){
    selectLink(event.state.id,event.state.url)
})

//initialising the state
history.replaceState({id:null,url:elem[0].getAttribute('data-url')},'home state');
}





//browser localStorage api

//set data (multiple data)
function setData(name, value) {
try{
  window.localStorage.setItem(name, value);     
}
catch(e){
  return console.log('error')
}
}



//set data (multiple data)
function setDatas(obj) {
try{
for (name in obj) {
  window.localStorage.setItem(name, obj[name])     
}
}
catch(e){
  return console.log('error')
}
}



function getData(name) {
  return window.localStorage.getItem(name)
}

function deleteData(name) {
  var data_array=name.split(',');
  for(var i=0; i<data_array.length; i++){
  window.localStorage.removeItem(data_array[i]);
}
}

function deleteAllData() {
  window.localStorage.clear()
}

function getDataById(id){
var data_name=window.localStorage.key(id);
return window.localStorage.getItem(data_name)
}

function dataLength(){
  return window.localStorage.length;
}



//TEXT TO SPEEECH

function speak(text, object=false){
 text=text.toString()
//check if the speech api exists
if('speechSynthesis' in window){

var synth=window.speechSynthesis;

var reserved_text=['#stop','#pause','#resume']
if(reserved_text.includes(text)){
if(text='#stop'){
synth.cancel();
}
if('#pause'){
synth.pause();
}
if('#resume'){
synth.resume();}
return;
}

if(text.trim().length>0){
utterance=new SpeechSynthesisUtterance(text);
//check for utterance modifies
if(object!==false){

if('pitch' in object){
utterance.pitch=parseFloat(object['pitch']);
}
if('rate' in object){
utterance.rate=parseFloat(object['rate']);
}
if('speed' in object){
utterance.rate=parseFloat(object['speed']);
}
if('volume' in object){
utterance.volume=parseFloat(object['volume']);
}
if('loop' in object){
utterance.loop=object['loop'];
}
if('onend' in object){
utterance.onend=object['onend'];
}
if('onstart' in object){
utterance.onstart=object['onstart'];
}
if('voice' in object){
var voices=synth.getVoices()

utterance.voice=voices[Number(object['voice'])];
}
}

synth.speak(utterance);


}else{
console.log('Error: Provide the text to speak');
return;
}


}else{
console.log('Error: Browser does not support speech')
}
}


