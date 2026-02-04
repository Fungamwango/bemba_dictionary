// ============================================
// BEMDIC API + SUBSCRIPTION SYSTEM
// ============================================

// --- STORE/UPDATE THE API URL (so it can be changed remotely) ---
localStorage.setItem('bemdic_api_url', 'https://bemdic.pages.dev/api.js');

// --- EXISTING AD SECTION ---
var elem=document.getElementById('bemdic-api');
elem.innerHTML=`<div id='api-wrapper'>
 <div id='ad-section' style='text-align:center; padding:2px; border:1px solid rgba(0,0,0,0.2);height:100%;margin:15px 1px;'> <img  id='ad-img' style='padding:4px; width:100%; object-fit:cover; display:none;'>  <div class='ad-banner' id='container-1154ab4e997f355a9fbc7d7b8e3c809a'></div></div> </div>`;


var monetag_link='https://zaltaumi.net/4/7783356'

var url = [monetag_link,'https://becha.co.zm/?pid=1950691'];

document.getElementById('ad-img').addEventListener('click', function() {

window.open(url[Math.floor(Math.random()*url.length)]);

});

var ads_array=['img1.jpeg','img2.jpeg','img3.png','img4.jpeg','img5.jpg','img6.jpg','img7.jpg','img8.jpg','img9.jpg','img10.jpg','img13.jpg','img14.jpg','img15.jpg','img17.gif','img18.png','img19.png','img20.jpg','img21.jpg','img22.jpg','img23.jpg','img24.jpg','img25.jpg','img26.jpg','img27.png','img28.webp','img29.webp','img30.webp','img31.jpg','img32.jpg','img33.webp','img34.jpg','img35.jpg','img36.jpg','img37.jpg','img38.jpg','img39.jpg','img40.gif','img42.jpeg','img43.jpeg','img44.png'];

function runAds(){
var ads_index=Math.floor(Math.random()*ads_array.length)
var current_img=ads_array[ads_index];
document.querySelector("#ad-img").src="https://bemdic.pages.dev/"+current_img;
}

setInterval (runAds
, 15000)

//set ad image when the page loads
document.querySelector("#ad-img").src="https://bemdic.pages.dev/"+ads_array[Math.floor(Math.random()*ads_array.length)];
document.querySelector("#ad-img").style.display="inline";

//update the online dictionary url
online_dictionary_url ="https://sageteche.com/dictionary";
document.querySelectorAll('.official_site_link')[0].href=online_dictionary_url;

document.querySelectorAll('.official_site_link')[0].innerText="https://sageteche.com/dictionary";


//set the official site url
document.querySelectorAll("#contact-wrapper ul li a")[3].href=online_dictionary_url;

//save this url into the localstorage api
window.localStorage.setItem('online_dictionary_url',online_dictionary_url);



/*load the website in the iframe
document.documentElement.innerHTML
="<iframe id='external_site_iframe' src='https://bemdic.rf.gd/home' style='position: fixed; top: 0;left: 0; width: 100vw; height: 100vh; border: none; display: block;'>";*/

//implementing the social features
document.body.insertAdjacentHTML('beforeend',`<div id='api_app_data'>
   <style>
       nav #header-wrapper li{cursor: pointer;
                       padding: 5px 8px;
                    display: inline;}

       #header-wrapper{display:grid;
                       grid-template-columns: repeat(4, 1fr);
                        }

       #payments-steps{padding-left:18px;}
       #payments-steps li{margin-bottom:6px;
                        line-height:1.4;
                        font-size:14px;}
     </style>
 </div>
`);

document.querySelector('#quiz-link').insertAdjacentHTML("afterend",'<li class="link" onclick="location.assign(\'https://sageteche.com/dictionary\')"><span  style="filter:grayscale(30%);">👨‍👩‍👧‍👦</span><sup style="color: greenyellow; font-size:11px;" id="online_users">(Friends)</sup></li>');

//evalute the intext js codes
var innerjs=document.querySelectorAll('#api_app_data script');
for (var i=0; i<innerjs.length; i++){
 eval(innerjs[i].innerHTML);
}


// ============================================
// SUBSCRIPTION & USAGE LIMIT SYSTEM
// ============================================

(function(){

// --- CONFIG (change these as needed) ---
var SUB_SECRET = 7391;  // secret number for code validation - CHANGE THIS to your own number
var FREE_WORD_LIMIT = 20;
var FREE_QUIZ_LIMIT = 5;
var SUB_DAYS = 30;
var PAYMENT_NUMBER = '0763428450'; // your mobile money number
var PAYMENT_AMOUNT = 'K5';

// --- HELPER: get today as YYYY-MM-DD ---
function getToday(){
  var d = new Date();
  return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
}

// --- HELPER: days since epoch (for code system) ---
function daysSinceEpoch(date){
  if(!date) date = new Date();
  return Math.floor(date.getTime() / 86400000);
}

// --- SUBSCRIPTION CODE VALIDATION ---
function generateChecksum(str){
  var sum = 0;
  for(var i=0; i<str.length; i++){
    sum = ((sum << 5) - sum + str.charCodeAt(i)) & 0xFFFF;
  }
  var hex = sum.toString(16).toUpperCase();
  while(hex.length < 4) hex = '0' + hex;
  return hex;
}

function validateCode(code){
  code = code.replace(/[\s\-]/g,'').toUpperCase();
  if(code.length < 6) return false;
  var payload = code.substring(0, code.length - 4);
  var checksum = code.substring(code.length - 4);
  if(generateChecksum(payload) !== checksum) return false;
  var encoded = parseInt(payload, 16);
  if(isNaN(encoded)) return false;
  var expiryDay = encoded ^ SUB_SECRET;
  var today = daysSinceEpoch();
  if(expiryDay > today) return expiryDay;
  return false;
}

// --- USAGE TRACKING (persisted in localStorage) ---
function getUsage(){
  var raw = localStorage.getItem('bemdic_usage');
  if(raw){ try{ return JSON.parse(raw); }catch(e){} }
  return { date: getToday(), words: 0, quizzes: 0 };
}

function saveUsage(usage){
  localStorage.setItem('bemdic_usage', JSON.stringify(usage));
}

function resetIfNewDay(usage){
  if(usage.date !== getToday()){
    usage.date = getToday();
    usage.words = 0;
    usage.quizzes = 0;
  }
  return usage;
}

function incrementWords(){
  var usage = resetIfNewDay(getUsage());
  usage.words++;
  saveUsage(usage);
  return usage.words;
}

function incrementQuizzes(){
  var usage = resetIfNewDay(getUsage());
  usage.quizzes++;
  saveUsage(usage);
  return usage.quizzes;
}

// --- SUBSCRIPTION STATUS (persisted in localStorage) ---
function getSubscription(){
  var raw = localStorage.getItem('bemdic_sub');
  if(raw){ try{ return JSON.parse(raw); }catch(e){} }
  return null;
}

function isSubscribed(){
  var sub = getSubscription();
  if(!sub) return false;
  return sub.expiryDay > daysSinceEpoch();
}

function getSubDaysLeft(){
  var sub = getSubscription();
  if(!sub) return 0;
  var left = sub.expiryDay - daysSinceEpoch();
  return left > 0 ? left : 0;
}

function activateSubscription(code){
  var expiryDay = validateCode(code);
  if(expiryDay){
    localStorage.setItem('bemdic_sub', JSON.stringify({
      code: code.replace(/[\s\-]/g,'').toUpperCase(),
      expiryDay: expiryDay,
      activatedOn: getToday()
    }));
    return true;
  }
  return false;
}

// --- PAYWALL MODAL (stored in localStorage for persistence) ---
var subscription_modal = '<div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:99999;display:flex;align-items:center;justify-content:center;font-family:Arial,sans-serif;">'
  + '<div style="background:#fff;border-radius:12px;padding:24px 18px;max-width:340px;width:90%;text-align:center;box-shadow:0 4px 24px rgba(0,0,0,0.3);">'
  + '<h2 style="margin:0 0 8px;color:#222;font-size:20px;">Get Unlimited dictionary</h2>'
  + '<p style="color:#444;font-size:14px;line-height:1.5;margin:8px 0;" id="bemdic-pw-reason"></p>'
  + '<p style="color:#444;font-size:14px;"> for just <b>'+PAYMENT_AMOUNT+'</b>/month!</p>'
  + '<div style="text-align:left;background:#f5f5f5;border-radius:8px;padding:12px 14px;margin:12px 0;font-size:13px;color:#333;">'
  + '<div style="color:#084; margin-bottom:8px;">How to subscribe:</div>'
  + '<ol id="payments-steps"><li>Send <b>'+PAYMENT_AMOUNT+'</b> to <b>'+PAYMENT_NUMBER+'</b> via Airtel/MTN/Zamtel Money</li>'
  + '<li>WhatsApp your <b>transaction ID</b> or <b>Screenshot</b> to <b>'+PAYMENT_NUMBER+'</b></li>'
  + '<li>You will receive a <b>subscription code</b> once verified</li>'
  + '<li>Enter the code below to activate</li></ol>'
  + '</div>'
  + '<div><input type="text" id="bemdic-sub-code" placeholder="Enter code e.g. A3F2-B1C4" maxlength="20" style="width:80%;padding:10px;border:2px solid #ddd;border-radius:8px;font-size:16px;text-align:center;letter-spacing:2px;margin:8px 0;outline:none;"></div>'
  + '<div id="bemdic-pw-error" style="color:crimson;font-size:13px;min-height:18px;margin:4px 0;"></div>'
  + '<div><button id="bemdic-activate-btn" style="display:inline-block;padding:10px 28px;border:none;border-radius:8px;font-size:15px;cursor:pointer;margin:6px 4px;background:#084;color:#fff;">Activate</button>'
  + '<button id="bemdic-close-btn" style="display:inline-block;padding:10px 28px;border:none;border-radius:8px;font-size:15px;cursor:pointer;margin:6px 4px;background:#eee;color:#555;">Try Tomorrow</button></div>'
  + '</div></div>';

// store the modal HTML in localStorage so it persists
localStorage.setItem('subscription_modal', subscription_modal);

function showPaywall(reason){
  if(document.getElementById('bemdic-paywall')) return;

  var reasonText = '';
  if(reason === 'words'){
    var u = resetIfNewDay(getUsage());
    if(u.words >= FREE_WORD_LIMIT) reasonText = 'You have used your <b>'+FREE_WORD_LIMIT+' free word translations</b> for today. Come back tomorrow or subscribe for unlimited access.';
  } else if(reason === 'quizzes'){
    var u = resetIfNewDay(getUsage());
    if(u.quizzes >= FREE_QUIZ_LIMIT) reasonText = 'You have used your <b>'+FREE_QUIZ_LIMIT+' free quiz session</b> for today. Come back tomorrow or subscribe for unlimited access.';
  }

  // read modal from localStorage
  var modalHTML = localStorage.getItem('subscription_modal') || subscription_modal;

  var modal = document.createElement('div');
  modal.id = 'bemdic-paywall';
  modal.innerHTML = modalHTML;

  document.body.appendChild(modal);

  // set the reason text
  var reasonEl = document.getElementById('bemdic-pw-reason');
  if(reasonEl) reasonEl.innerHTML = reasonText;

  // activate button
  document.getElementById('bemdic-activate-btn').addEventListener('click', function(){
    var code = document.getElementById('bemdic-sub-code').value.trim();
    var errEl = document.getElementById('bemdic-pw-error');
    if(!code){
      errEl.textContent = 'Please enter your subscription code';
      return;
    }
    if(activateSubscription(code)){
      errEl.style.color = '#084';
      errEl.textContent = 'Activated! Enjoy ' + SUB_DAYS + ' days of unlimited access!';
      setTimeout(function(){
        document.body.removeChild(modal);
        // remove the free bar if present
        var freeBar = document.getElementById('bemdic-free-bar');
        if(freeBar) freeBar.parentNode.removeChild(freeBar);
        // automatically show content after activation
        var wl = document.getElementById('words-loader');
        var pb = document.getElementById('pagination-btns-wrapper');
        if(wl) wl.style.display = 'block';
        if(pb) pb.style.display = 'block';
        if(typeof _original_load_dictionary === 'function') _original_load_dictionary();
      }, 1500);
    } else {
      errEl.style.color = 'crimson';
      errEl.textContent = 'Invalid or expired code. Please check and try again.';
    }
  });

  // close button
  document.getElementById('bemdic-close-btn').addEventListener('click', function(){
    document.body.removeChild(modal);
  });

  // close modal on back button
  history.pushState(null, null);
  window.addEventListener('popstate', function onBack(){
    var m = document.getElementById('bemdic-paywall');
    if(m) m.parentNode.removeChild(m);
    window.removeEventListener('popstate', onBack);
  });
}

// --- UPDATE FREE BAR IN REAL TIME ---
function updateFreeBar(){
  var bar = document.getElementById('bemdic-free-bar');
  if(!bar) return;
  var u = resetIfNewDay(getUsage());
  var wLeft = Math.max(0, FREE_WORD_LIMIT - u.words);
  var qLeft = Math.max(0, FREE_QUIZ_LIMIT - u.quizzes);
  var upgradeBtn = document.getElementById('bemdic-upgrade-bar');
  var upgradeBtnHTML = upgradeBtn ? upgradeBtn.outerHTML : '';
  bar.innerHTML = 'Free: <b>'+wLeft+'</b> words & <b>'+qLeft+'</b> quiz left today '+upgradeBtnHTML;
  var newBtn = document.getElementById('bemdic-upgrade-bar');
  if(newBtn) newBtn.addEventListener('click', function(){ showPaywall('words'); });
}

// --- INTERCEPT WORD VIEWS ---
var _original_load_dictionary = window.load_dictionary;
window.load_dictionary = function(){
  if(!isSubscribed()){
    var count = incrementWords();
    updateFreeBar();
    if(count > FREE_WORD_LIMIT){
      showPaywall('words');
      return;
    }
  }
  _original_load_dictionary();
};

// Intercept search suggestion clicks
var searchSuggestions = document.getElementById('search-suggesstions');
if(searchSuggestions){
  searchSuggestions.addEventListener('click', function(e){
    if(e.target.tagName === 'LI'){
      if(!isSubscribed()){
        var count = incrementWords();
        updateFreeBar();
        if(count > FREE_WORD_LIMIT){
          e.stopImmediatePropagation();
          e.preventDefault();
          showPaywall('words');
          return false;
        }
      }
    }
  }, true);
}

// --- INTERCEPT QUIZ START ---
var quizStartBtns = document.querySelectorAll('#start-quiz');
for(var q = 0; q < quizStartBtns.length; q++){
  (function(btn){
    var originalOnclick = btn.getAttribute('onclick');
    if(originalOnclick && originalOnclick.indexOf('load_question') > -1){
      btn.removeAttribute('onclick');
      btn.addEventListener('click', function(){
        if(!isSubscribed()){
          var count = incrementQuizzes();
          updateFreeBar();
          if(count > FREE_QUIZ_LIMIT){
            showPaywall('quizzes');
            return;
          }
        }
        eval(originalOnclick);
      });
    }
  })(quizStartBtns[q]);
}

// --- SHOW SUBSCRIPTION STATUS IN "MORE" MENU ---
var moreLinks = document.getElementById('more-links-wrapper');
if(moreLinks){
  var subItem = document.createElement('li');
  if(isSubscribed()){
    var days_left_text='days left'
    if(getSubDaysLeft() < 2){
      days_left_text='day left'
    }
    subItem.innerHTML = '<span>&#11088;</span> Premium (' + getSubDaysLeft() + days_left_text + ')';
    subItem.style.color = '#084';
    subItem.style.fontWeight = 'bold';
  } else {
    subItem.innerHTML = '<span>&#11088;</span> Get Unlimited access ('+PAYMENT_AMOUNT+'/month)';
    subItem.style.color = 'aqua';
    subItem.style.cursor = 'pointer';
    subItem.addEventListener('click', function(){
      showPaywall('words');
    });
  }
  moreLinks.insertBefore(subItem, moreLinks.firstChild);
}

// --- ON LOAD: if already over limit, hide content and show paywall immediately ---
if(!isSubscribed()){
  var currentUsage = resetIfNewDay(getUsage());
  if(currentUsage.words >= FREE_WORD_LIMIT){
    // hide the word content that loaded before api.js
    var appendList = document.getElementById('append_list');
    if(appendList) appendList.innerHTML = '';
    showPaywall('words');
  }
}

// --- SHOW REMAINING FREE USES (for free users) ---
if(!isSubscribed()){
  var usage = resetIfNewDay(getUsage());
  var wordsLeft = Math.max(0, FREE_WORD_LIMIT - usage.words);
  var quizzesLeft = Math.max(0, FREE_QUIZ_LIMIT - usage.quizzes);

  var freeBar = document.createElement('div');
  freeBar.id = 'bemdic-free-bar';
  freeBar.style.cssText = 'background:#fff3e0;color:#e65100;text-align:left;padding:6px 10px;font-size:13px;position:sticky;top:0;z-index:9999;border-bottom:1px solid #ffcc80;';
  freeBar.innerHTML = 'Free: <b>'+wordsLeft+'</b> words & <b>'+quizzesLeft+'</b> quiz left today <span style="cursor:pointer;  font-siz:12px; background:#058; color: white; padding:5px; border-radius:4px;  border:1px solid white;" id="bemdic-upgrade-bar">Get Unlimited- '+PAYMENT_AMOUNT+'</span>';

  document.body.insertBefore(freeBar, document.body.firstChild);

  document.getElementById('bemdic-upgrade-bar').addEventListener('click', function(){
    showPaywall('words');
  });
}

// --- STORE CONFIG IN LOCALSTORAGE for persistence ---
localStorage.setItem('bemdic_config', JSON.stringify({
  secret: SUB_SECRET,
  wordLimit: FREE_WORD_LIMIT,
  quizLimit: FREE_QUIZ_LIMIT,
  subDays: SUB_DAYS,
  paymentNumber: PAYMENT_NUMBER,
  paymentAmount: PAYMENT_AMOUNT
}));

})();


// ============================================
// OFFLINE STORAGE: Store subscription logic for offline use
// ============================================
// This runs even when the IIFE above is commented out,
// but only stores meaningful code when it's uncommented.

var _bemdic_offline_sub = function() {
  if (window.__bemdic_api_loaded) return;

  var raw = localStorage.getItem('bemdic_config');
  if (!raw) return;
  var cfg;
  try { cfg = JSON.parse(raw); } catch(e) { return; }

  var SUB_SECRET = cfg.secret;
  var FREE_WORD_LIMIT = cfg.wordLimit;
  var FREE_QUIZ_LIMIT = cfg.quizLimit;
  var SUB_DAYS = cfg.subDays;
  var PAYMENT_NUMBER = cfg.paymentNumber;
  var PAYMENT_AMOUNT = cfg.paymentAmount;

  function getToday() {
    var d = new Date();
    return d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate();
  }

  function daysSinceEpoch(date) {
    if (!date) date = new Date();
    return Math.floor(date.getTime() / 86400000);
  }

  function generateChecksum(str) {
    var sum = 0;
    for (var i = 0; i < str.length; i++) {
      sum = ((sum << 5) - sum + str.charCodeAt(i)) & 0xFFFF;
    }
    var hex = sum.toString(16).toUpperCase();
    while (hex.length < 4) hex = '0' + hex;
    return hex;
  }

  function validateCode(code) {
    code = code.replace(/[\s\-]/g, '').toUpperCase();
    if (code.length < 6) return false;
    var payload = code.substring(0, code.length - 4);
    var checksum = code.substring(code.length - 4);
    if (generateChecksum(payload) !== checksum) return false;
    var encoded = parseInt(payload, 16);
    if (isNaN(encoded)) return false;
    var expiryDay = encoded ^ SUB_SECRET;
    var today = daysSinceEpoch();
    if (expiryDay > today) return expiryDay;
    return false;
  }

  function getUsage() {
    var r = localStorage.getItem('bemdic_usage');
    if (r) { try { return JSON.parse(r); } catch(e) {} }
    return { date: getToday(), words: 0, quizzes: 0 };
  }

  function saveUsage(usage) {
    localStorage.setItem('bemdic_usage', JSON.stringify(usage));
  }

  function resetIfNewDay(usage) {
    if (usage.date !== getToday()) {
      usage.date = getToday();
      usage.words = 0;
      usage.quizzes = 0;
    }
    return usage;
  }

  function incrementWords() {
    var usage = resetIfNewDay(getUsage());
    usage.words++;
    saveUsage(usage);
    return usage.words;
  }

  function incrementQuizzes() {
    var usage = resetIfNewDay(getUsage());
    usage.quizzes++;
    saveUsage(usage);
    return usage.quizzes;
  }

  function getSubscription() {
    var r = localStorage.getItem('bemdic_sub');
    if (r) { try { return JSON.parse(r); } catch(e) {} }
    return null;
  }

  function isSubscribed() {
    var sub = getSubscription();
    if (!sub) return false;
    return sub.expiryDay > daysSinceEpoch();
  }

  function getSubDaysLeft() {
    var sub = getSubscription();
    if (!sub) return 0;
    var left = sub.expiryDay - daysSinceEpoch();
    return left > 0 ? left : 0;
  }

  function activateSubscription(code) {
    var expiryDay = validateCode(code);
    if (expiryDay) {
      localStorage.setItem('bemdic_sub', JSON.stringify({
        code: code.replace(/[\s\-]/g, '').toUpperCase(),
        expiryDay: expiryDay,
        activatedOn: getToday()
      }));
      return true;
    }
    return false;
  }

  function showPaywall(reason) {
    if (document.getElementById('bemdic-paywall')) return;

    var reasonText = '';
    if (reason === 'words') {
      var u = resetIfNewDay(getUsage());
      if (u.words >= FREE_WORD_LIMIT) reasonText = 'You have used your <b>' + FREE_WORD_LIMIT + ' free word translations</b> for today. Come back tomorrow or subscribe for unlimited access.';
    } else if (reason === 'quizzes') {
      var u = resetIfNewDay(getUsage());
      if (u.quizzes >= FREE_QUIZ_LIMIT) reasonText = 'You have used your <b>' + FREE_QUIZ_LIMIT + ' free quiz session</b> for today. Come back tomorrow or subscribe for unlimited access.';
    }

    var modalHTML = localStorage.getItem('subscription_modal');
    if (!modalHTML) return;

    var modal = document.createElement('div');
    modal.id = 'bemdic-paywall';
    modal.innerHTML = modalHTML;
    document.body.appendChild(modal);

    var reasonEl = document.getElementById('bemdic-pw-reason');
    if (reasonEl) reasonEl.innerHTML = reasonText;

    document.getElementById('bemdic-activate-btn').addEventListener('click', function() {
      var code = document.getElementById('bemdic-sub-code').value.trim();
      var errEl = document.getElementById('bemdic-pw-error');
      if (!code) { errEl.textContent = 'Please enter your subscription code'; return; }
      if (activateSubscription(code)) {
        errEl.style.color = '#084';
        errEl.textContent = 'Activated! Enjoy ' + SUB_DAYS + ' days of unlimited access!';
        setTimeout(function() {
          document.body.removeChild(modal);
          var freeBar = document.getElementById('bemdic-free-bar');
          if (freeBar) freeBar.parentNode.removeChild(freeBar);
          var wl = document.getElementById('words-loader');
          var pb = document.getElementById('pagination-btns-wrapper');
          if (wl) wl.style.display = 'block';
          if (pb) pb.style.display = 'block';
          if (typeof window.load_dictionary === 'function') window.load_dictionary();
        }, 1500);
      } else {
        errEl.style.color = 'crimson';
        errEl.textContent = 'Invalid or expired code. Please check and try again.';
      }
    });

    document.getElementById('bemdic-close-btn').addEventListener('click', function() {
      document.body.removeChild(modal);
    });

    history.pushState(null, null);
    window.addEventListener('popstate', function onBack() {
      var m = document.getElementById('bemdic-paywall');
      if (m) m.parentNode.removeChild(m);
      window.removeEventListener('popstate', onBack);
    });
  }

  function updateFreeBar() {
    var bar = document.getElementById('bemdic-free-bar');
    if (!bar) return;
    var u = resetIfNewDay(getUsage());
    var wLeft = Math.max(0, FREE_WORD_LIMIT - u.words);
    var qLeft = Math.max(0, FREE_QUIZ_LIMIT - u.quizzes);
    var upgradeBtn = document.getElementById('bemdic-upgrade-bar');
    var upgradeBtnHTML = upgradeBtn ? upgradeBtn.outerHTML : '';
    bar.innerHTML = 'Free: <b>' + wLeft + '</b> words & <b>' + qLeft + '</b> quiz left today ' + upgradeBtnHTML;
    var newBtn = document.getElementById('bemdic-upgrade-bar');
    if (newBtn) newBtn.addEventListener('click', function() { showPaywall('words'); });
  }

  // Intercept word views
  var _orig_load = window.load_dictionary;
  if (typeof _orig_load === 'function') {
    window.load_dictionary = function() {
      if (!isSubscribed()) {
        var count = incrementWords();
        updateFreeBar();
        if (count > FREE_WORD_LIMIT) { showPaywall('words'); return; }
      }
      _orig_load();
    };
  }

  // Intercept search suggestion clicks
  var searchSugg = document.getElementById('search-suggesstions');
  if (searchSugg) {
    searchSugg.addEventListener('click', function(e) {
      if (e.target.tagName === 'LI') {
        if (!isSubscribed()) {
          var count = incrementWords();
          updateFreeBar();
          if (count > FREE_WORD_LIMIT) {
            e.stopImmediatePropagation();
            e.preventDefault();
            showPaywall('words');
            return false;
          }
        }
      }
    }, true);
  }

  // Intercept quiz start
  var quizBtns = document.querySelectorAll('#start-quiz');
  for (var q = 0; q < quizBtns.length; q++) {
    (function(btn) {
      var origClick = btn.getAttribute('onclick');
      if (origClick && origClick.indexOf('load_question') > -1) {
        btn.removeAttribute('onclick');
        btn.addEventListener('click', function() {
          if (!isSubscribed()) {
            var count = incrementQuizzes();
            updateFreeBar();
            if (count > FREE_QUIZ_LIMIT) { showPaywall('quizzes'); return; }
          }
          eval(origClick);
        });
      }
    })(quizBtns[q]);
  }

  // Show subscription status in More menu
  var moreLinks = document.getElementById('more-links-wrapper');
  if (moreLinks) {
    var subItem = document.createElement('li');
    if (isSubscribed()) {
      var days_left_text = getSubDaysLeft() < 2 ? 'day left' : 'days left';
      subItem.innerHTML = '<span>&#11088;</span> Premium (' + getSubDaysLeft() + ' ' + days_left_text + ')';
      subItem.style.color = '#084';
      subItem.style.fontWeight = 'bold';
    } else {
      subItem.innerHTML = '<span>&#11088;</span> Get Unlimited access (' + PAYMENT_AMOUNT + '/month)';
      subItem.style.color = 'aqua';
      subItem.style.cursor = 'pointer';
      subItem.addEventListener('click', function() { showPaywall('words'); });
    }
    moreLinks.insertBefore(subItem, moreLinks.firstChild);
  }

  // On load: if over limit, show paywall
  if (!isSubscribed()) {
    var currentUsage = resetIfNewDay(getUsage());
    if (currentUsage.words >= FREE_WORD_LIMIT) {
      var appendList = document.getElementById('append_list');
      if (appendList) appendList.innerHTML = '';
      showPaywall('words');
    }
  }

  // Show remaining free uses
  if (!isSubscribed()) {
    var usage = resetIfNewDay(getUsage());
    var wordsLeft = Math.max(0, FREE_WORD_LIMIT - usage.words);
    var quizzesLeft = Math.max(0, FREE_QUIZ_LIMIT - usage.quizzes);
    var freeBar = document.createElement('div');
    freeBar.id = 'bemdic-free-bar';
    freeBar.style.cssText = 'background:#fff3e0;color:#e65100;text-align:left;padding:6px 10px;font-size:13px;position:sticky;top:0;z-index:9999;border-bottom:1px solid #ffcc80;';
    freeBar.innerHTML = 'Free: <b>' + wordsLeft + '</b> words & <b>' + quizzesLeft + '</b> quiz left today <span style="cursor:pointer;font-size:12px;background:#058;color:white;padding:5px;border-radius:4px;border:1px solid white;" id="bemdic-upgrade-bar">Get Unlimited- ' + PAYMENT_AMOUNT + '</span>';
    document.body.insertBefore(freeBar, document.body.firstChild);
    document.getElementById('bemdic-upgrade-bar').addEventListener('click', function() { showPaywall('words'); });
  }
};

// Store the offline function as executable code in localStorage
localStorage.setItem('bemdic_offline_js', '(' + _bemdic_offline_sub.toString() + ')()');

// Mark that api.js loaded
window.__bemdic_api_loaded = true;