// ============================================
// BEMDIC API + SUBSCRIPTION SYSTEM
// ============================================

// --- STORE/UPDATE THE API URL (so it can be changed remotely) ---
localStorage.setItem('bemdic_api_url', 'https://bemba-dictionary.pages.dev/api/api.js');
localStorage.setItem('bemdic_dict_url', 'https://bemba-dictionary.pages.dev/dictionary/dictionary.js');

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
document.querySelector("#ad-img").src="https://bemba-dictionary.pages.dev/api/"+current_img;
}

setInterval (runAds
, 15000)

//set ad image when the page loads
document.querySelector("#ad-img").src="https://bemba-dictionary.pages.dev/api/"+ads_array[Math.floor(Math.random()*ads_array.length)];
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
                       grid-template-columns: repeat(5, 1fr);
                        }

       #payments-steps{padding-left:18px;}
       #payments-steps li{margin-bottom:6px;
                        line-height:1.4;
                        font-size:14px;}
     </style>
 </div>
`);

document.querySelector('#quiz-link').insertAdjacentHTML("afterend",'<li class="link" id="notif-link"><span style="filter:grayscale(100%);">🔔</span><sup style="font-size:10px;" id="notif-badge"></sup></li><li class="link" id="friends-link"><span style="filter:grayscale(30%);">👨‍👩‍👧‍👦</span><sup style="color:greenyellow;font-size:10px;" id="online-count-badge"></sup></li>');

//evalute the intext js codes
var innerjs=document.querySelectorAll('#api_app_data script');
for (var i=0; i<innerjs.length; i++){
 eval(innerjs[i].innerHTML);
}


// ============================================
// SOCIAL FEATURES SYSTEM
// ============================================
(function(){

var API_BASE = 'https://bemba-dictionary.pages.dev/api';
var _pollInterval = null;
var _pollDelay = 30000;
var _activePollDelay = 10000;
var _currentSection = null;

// ---- UTILITIES ----
function apiCall(endpoint, data, callback) {
  if (!navigator.onLine) { if (callback) callback({ ok: false, error: 'offline' }); return; }
  fetch(API_BASE + endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(function(r) { return r.json(); })
    .then(function(j) { if (callback) callback(j); })
    .catch(function(e) { if (callback) callback({ ok: false, error: e.message }); });
}
window._bemdic_apiCall = apiCall;
window._bemdic_getDeviceId = getDeviceId;
function apiGet(endpoint, callback) {
  if (!navigator.onLine) { if (callback) callback({ ok: false, error: 'offline' }); return; }
  fetch(API_BASE + endpoint).then(function(r) { return r.json(); })
    .then(function(j) { if (callback) callback(j); })
    .catch(function(e) { if (callback) callback({ ok: false, error: e.message }); });
}
function generateUUID() {
  if (crypto && crypto.randomUUID) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}
function getDeviceId() {
  var id = localStorage.getItem('bemdic_device_id');
  if (!id) { id = generateUUID(); localStorage.setItem('bemdic_device_id', id); }
  return id;
}
function getUserData() {
  var raw = localStorage.getItem('bemdic_user_data');
  if (raw) try { return JSON.parse(raw); } catch(e) {}
  return null;
}
function escapeHtml(s) {
  var d = document.createElement('div'); d.appendChild(document.createTextNode(s)); return d.innerHTML;
}
function timeAgo(ds) {
  var now = new Date(), d = new Date(ds + (ds.indexOf('Z') === -1 ? 'Z' : ''));
  var diff = Math.floor((now - d) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
  if (diff < 604800) return Math.floor(diff / 86400) + 'd ago';
  return d.toLocaleDateString();
}
function getLevelName(pts) {
  if (pts >= 1000) return 'Professor';
  if (pts >= 500) return 'Master';
  if (pts >= 100) return 'Intermediate';
  if (pts >= 20) return 'Amateur';
  return 'Beginner';
}
function profilePicHtml(pic, size, clickable) {
  size = size || 36;
  var cls = clickable ? ' class="clickable-pic"' : '';
  if (pic) return '<img src="' + pic + '"' + cls + ' style="width:' + size + 'px;height:' + size + 'px;border-radius:50%;object-fit:cover;cursor:' + (clickable ? 'pointer' : 'default') + ';">';
  return '<span' + cls + ' style="display:inline-flex;align-items:center;justify-content:center;width:' + size + 'px;height:' + size + 'px;border-radius:50%;background:#e0e0e0;font-size:' + Math.round(size * 0.5) + 'px;">👤</span>';
}
function showPicOverlay(src) {
  if (!src) return;
  var overlay = document.createElement('div');
  overlay.className = 'pic-overlay';
  overlay.innerHTML = '<img src="' + src + '" style="max-width:80vw;max-height:80vh;border-radius:12px;object-fit:contain;border:3px solid #fff;">';
  overlay.addEventListener('click', function() { document.body.removeChild(overlay); });
  document.body.appendChild(overlay);
}
function showUserProfile(userId) {
  var overlay = document.createElement('div');
  overlay.className = 'user-profile-overlay';
  overlay.innerHTML = '<div class="user-profile-modal"><button class="upm-close">&times;</button>'
    + '<div class="s-loading" style="padding:30px;">Loading profile...</div></div>';
  overlay.addEventListener('click', function(e) { if (e.target === overlay) document.body.removeChild(overlay); });
  overlay.querySelector('.upm-close').addEventListener('click', function() { document.body.removeChild(overlay); });
  document.body.appendChild(overlay);

  apiCall('/user/view', { device_id: getDeviceId(), user_id: userId }, function(resp) {
    var modal = overlay.querySelector('.user-profile-modal');
    if (!resp.ok || !resp.user) {
      modal.innerHTML = '<button class="upm-close">&times;</button><div class="s-empty">Could not load profile</div>';
      modal.querySelector('.upm-close').addEventListener('click', function() { document.body.removeChild(overlay); });
      return;
    }
    var u = resp.user;
    var picSrc = u.picture || '';
    modal.innerHTML = '<button class="upm-close">&times;</button>'
      + '<div class="upm-pic">' + (picSrc ? '<img src="' + picSrc + '">' : '<span style="display:inline-flex;align-items:center;justify-content:center;width:80px;height:80px;border-radius:50%;background:#e0e0e0;font-size:40px;">👤</span>') + '</div>'
      + '<div class="upm-name">' + escapeHtml(u.name) + '</div>'
      + '<div class="upm-code">' + escapeHtml(u.friend_code) + '</div>'
      + '<div class="upm-level">' + getLevelName(u.points || 0) + '</div>'
      + '<div class="upm-stats">'
      + '<div class="upm-stat"><div class="upm-stat-val">' + (u.points || 0) + '</div><div class="upm-stat-lbl">Points</div></div>'
      + '<div class="upm-stat"><div class="upm-stat-val">' + (u.total_quizzes || 0) + '</div><div class="upm-stat-lbl">Quizzes</div></div>'
      + '<div class="upm-stat"><div class="upm-stat-val">' + (u.challenges_won || 0) + '</div><div class="upm-stat-lbl">Wins</div></div>'
      + '<div class="upm-stat"><div class="upm-stat-val">' + (u.challenges_lost || 0) + '</div><div class="upm-stat-lbl">Losses</div></div>'
      + '<div class="upm-stat"><div class="upm-stat-val">' + (u.challenges_drawn || 0) + '</div><div class="upm-stat-lbl">Draws</div></div>'
      + '<div class="upm-stat"><div class="upm-stat-val">' + timeAgo(u.created_at) + '</div><div class="upm-stat-lbl">Joined</div></div>'
      + '</div>'
      + '<div class="upm-actions"><button class="s-btn s-btn-g upm-challenge" data-uid="' + u.id + '" data-uname="' + escapeHtml(u.name) + '">Challenge</button></div>';

    modal.querySelector('.upm-close').addEventListener('click', function() { document.body.removeChild(overlay); });
    // Enlarge pic on click
    var picImg = modal.querySelector('.upm-pic img');
    if (picImg) picImg.addEventListener('click', function() { showPicOverlay(this.src); });
    // Challenge button
    var chBtn = modal.querySelector('.upm-challenge');
    if (chBtn) {
      chBtn.addEventListener('click', function() {
        document.body.removeChild(overlay);
        showChallengeMessagePrompt(parseInt(this.getAttribute('data-uid')), this.getAttribute('data-uname'));
      });
    }
  });
}

function resizeAndUploadPicture(file, callback) {
  var reader = new FileReader();
  reader.onload = function(e) {
    var img = new Image();
    img.onload = function() {
      var canvas = document.createElement('canvas');
      var maxDim = 256;
      var w = img.width, h = img.height;
      if (w > h) { if (w > maxDim) { h = Math.round(h * maxDim / w); w = maxDim; } }
      else { if (h > maxDim) { w = Math.round(w * maxDim / h); h = maxDim; } }
      canvas.width = w; canvas.height = h;
      var ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      var quality = 0.8;
      var dataUrl;
      for (var q = quality; q >= 0.1; q -= 0.1) {
        dataUrl = canvas.toDataURL('image/webp', q);
        var base64Part = dataUrl.split(',')[1];
        var byteSize = Math.round(base64Part.length * 3 / 4);
        if (byteSize <= 65536) break;
      }
      if (dataUrl.split(',')[1].length * 3 / 4 > 65536) {
        canvas.width = Math.round(w * 0.5); canvas.height = Math.round(h * 0.5);
        ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        dataUrl = canvas.toDataURL('image/webp', 0.5);
      }
      apiCall('/user/picture', { device_id: getDeviceId(), picture: dataUrl }, function(resp) {
        if (resp.ok) {
          var ud = getUserData() || {};
          ud.picture = dataUrl;
          localStorage.setItem('bemdic_user_data', JSON.stringify(ud));
        }
        if (callback) callback(resp.ok ? dataUrl : null);
      });
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// ---- CSS INJECTION ----
var ss = document.createElement('style');
ss.textContent = ''
  + '#profile-section,#friends-section,#leaderboard-section,#notifications-section,#challenge-section{display:none;padding:4px 10px;}'
  + '.social-card{background:#fff;border:1px solid #e8e8e8;border-radius:12px;padding:14px;margin:8px 0;box-shadow:0 1px 4px rgba(0,0,0,0.06);}'
  + '.social-tabs{display:flex;gap:0;margin-bottom:10px;border-bottom:2px solid #e0e0e0;}'
  + '.social-tab{flex:1;text-align:center;padding:10px 4px;cursor:pointer;font-size:13px;color:#666;border-bottom:2px solid transparent;margin-bottom:-2px;transition:color .2s,border-color .2s;}'
  + '.social-tab.active-tab{color:#1a73e8;border-bottom-color:#1a73e8;font-weight:600;}'
  + '.s-btn{padding:8px 16px;border:none;border-radius:20px;font-size:12px;font-weight:600;cursor:pointer;transition:transform .15s,box-shadow .15s;letter-spacing:0.3px;}'
  + '.s-btn:active{transform:scale(0.96);}'
  + '.s-btn-p{background:linear-gradient(135deg,#1a73e8,#1557b0);color:#fff;box-shadow:0 2px 6px rgba(26,115,232,0.3);}'
  + '.s-btn-g{background:linear-gradient(135deg,#34a853,#2d8f47);color:#fff;box-shadow:0 2px 6px rgba(52,168,83,0.3);}'
  + '.s-btn-d{background:linear-gradient(135deg,#ea4335,#c5221f);color:#fff;box-shadow:0 2px 6px rgba(234,67,53,0.3);}'
  + '.s-btn-s{background:#f1f3f4;color:#444;}'
  + '.s-empty{text-align:center;color:#999;padding:24px 10px;font-size:13px;}'
  + '.s-loading{text-align:center;color:#888;padding:16px;font-size:13px;}'
  // Profile
  + '#profile-wrapper{text-align:center;}'
  + '#profile-avatar{font-size:48px;margin:10px 0;cursor:pointer;position:relative;display:inline-block;}'
  + '#profile-avatar img{width:88px;height:88px;border-radius:50%;object-fit:cover;border:3px solid #1a73e8;box-shadow:0 2px 10px rgba(26,115,232,0.25);}'
  + '#profile-avatar .pic-edit-hint{position:absolute;bottom:2px;right:2px;background:#1a73e8;color:#fff;border-radius:50%;width:26px;height:26px;font-size:12px;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 4px rgba(0,0,0,0.2);}'
  + '#pic-file-input{display:none;}'
  + '#profile-name-display{font-size:18px;font-weight:700;color:#202124;margin:8px 0 2px;}'
  + '#profile-friend-code{color:#5f6368;font-size:13px;margin:2px 0 14px;}'
  + '.stats-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:12px 0;}'
  + '.stat-box{background:linear-gradient(135deg,#f8f9fa,#fff);border-radius:12px;padding:14px 6px;text-align:center;border:1px solid #e8e8e8;}'
  + '.stat-val{font-size:20px;font-weight:700;color:#1a73e8;}'
  + '.stat-lbl{font-size:11px;color:#80868b;margin-top:3px;font-weight:500;}'
  // Online users table
  + '#online-search-input{width:92%;padding:10px 14px;border:1.5px solid #dadce0;border-radius:24px;font-size:14px;margin:6px 0;outline:none;transition:border-color .2s,box-shadow .2s;background:#f8f9fa;}'
  + '#online-search-input:focus{border-color:#1a73e8;box-shadow:0 0 0 2px rgba(26,115,232,0.15);background:#fff;}'
  + '.online-table{width:100%;border-collapse:collapse;}'
  + '.online-table th{text-align:left;padding:8px 6px;font-size:11px;color:#80868b;border-bottom:2px solid #e8e8e8;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;}'
  + '.online-table td{padding:10px 6px;border-bottom:1px solid #e0e0e0;vertical-align:middle;}'
  + '.online-table tr:last-child td{border-bottom:none;}'
  + '.online-table .pic-cell{width:46px;}'
  + '.online-table .name-cell{font-weight:600;font-size:14px;color:#202124;}'
  + '.online-table .name-meta{font-size:11px;color:#80868b;font-weight:normal;}'
  + '.online-table .action-cell{text-align:right;width:90px;}'
  + '.friend-dot{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:4px;}'
  + '.dot-on{background:#34a853;box-shadow:0 0 4px rgba(52,168,83,0.5);}'
  + '.dot-off{background:#bbb;}'
  // Leaderboard
  + '.lb-row{display:flex;align-items:center;padding:8px 10px;border-bottom:1px solid #f1f3f4;gap:10px;transition:background .15s;}'
  + '.lb-row:last-child{border-bottom:none;}'
  + '.lb-rank{width:28px;font-weight:700;color:#5f6368;font-size:14px;flex-shrink:0;text-align:center;}'
  + '.lb-pic{flex-shrink:0;}'
  + '.lb-info{flex:1;min-width:0;}'
  + '.lb-name{font-size:14px;color:#202124;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}'
  + '.lb-level{font-size:11px;color:#80868b;font-weight:500;}'
  + '.lb-pts{font-weight:700;color:#1a73e8;font-size:13px;flex-shrink:0;}'
  + '.lb-me{background:linear-gradient(135deg,#e8f0fe,#d2e3fc);border-radius:8px;}'
  // Notifications
  + '.notif-row{display:flex;align-items:flex-start;padding:12px 10px;border-bottom:1px solid #e0e0e0;cursor:pointer;gap:10px;transition:opacity .3s,max-height .3s,background .15s;margin:0;}'
  + '.notif-row:hover{background:#f8f9fa;}'
  + '.notif-row:last-child{border-bottom:none;}'
  + '.notif-row.unread{background:linear-gradient(135deg,#fff8e1,#fff3cd);}'
  + '.notif-pic{flex-shrink:0;}'
  + '.notif-body{flex:1;min-width:0;}'
  + '.notif-text{font-size:13px;color:#202124;line-height:1.4;}'
  + '.notif-time{font-size:11px;color:#80868b;margin-top:3px;}'
  + '.notif-type-badge{display:inline-block;font-size:10px;padding:2px 6px;border-radius:10px;font-weight:600;margin-bottom:3px;}'
  + '.notif-type-challenge{background:#e8f0fe;color:#1a73e8;}'
  + '.notif-type-result{background:#fef7e0;color:#e37400;}'
  + '.notif-type-reward{background:#e6f4ea;color:#137333;}'
  // Challenge
  + '#challenge-info{text-align:center;padding:16px 12px;}'
  + '#challenge-info h2{color:#202124;margin:0 0 6px;font-size:18px;}'
  + '.ch-msg{background:linear-gradient(135deg,#fff8e1,#fff3cd);border-radius:12px;padding:12px 14px;margin:12px 0;font-style:italic;color:#555;font-size:14px;border-left:3px solid #fbbc04;}'
  + '.ch-accept-card{background:linear-gradient(135deg,#f8f9fa,#fff);border:1.5px solid #e8e8e8;border-radius:16px;padding:20px;margin:12px 0;}'
  + '.ch-opponent-pic{margin:10px 0;}'
  + '.ch-score-preview{font-size:32px;font-weight:700;color:#ea4335;margin:6px 0;}'
  + '.ch-score-label{font-size:13px;color:#5f6368;}'
  + '.ch-comparison{display:flex;justify-content:center;align-items:center;gap:20px;margin:20px 0;}'
  + '.ch-player{text-align:center;min-width:80px;}'
  + '.ch-player-name{font-size:13px;color:#5f6368;margin-bottom:4px;font-weight:500;}'
  + '.ch-player-score{font-size:38px;font-weight:800;}'
  + '.ch-vs{font-size:16px;color:#bbb;font-weight:700;background:#f1f3f4;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;}'
  + '.ch-verdict{text-align:center;font-size:20px;font-weight:700;margin:12px 0;}'
  + '.ch-bonus{text-align:center;color:#34a853;font-size:14px;margin:6px 0;font-weight:600;}'
  + '#ch-quiz-wrapper{padding:8px;}'
  + '#ch-timer-bar{text-align:center;color:#ea4335;font-size:14px;font-weight:600;margin:8px 0;padding:6px;background:#fce8e6;border-radius:8px;}'
  + '#ch-question-title{font-size:13px;color:#5f6368;margin-bottom:8px;font-weight:500;}'
  + '#ch-question-wrapper{background:linear-gradient(135deg,#f8f9fa,#fff);border:1.5px solid #e8e8e8;border-radius:12px;padding:16px;margin:10px 0;text-align:center;font-size:16px;font-weight:500;}'
  + '#ch-progress-bar{height:4px;background:#e8e8e8;border-radius:2px;margin:0 0 10px;overflow:hidden;}'
  + '#ch-progress-fill{height:100%;background:linear-gradient(90deg,#1a73e8,#34a853);border-radius:2px;transition:width .3s;}'
  + '.ch-option{background:#fff;border:1.5px solid #dadce0;border-radius:12px;padding:14px;margin:8px 0;cursor:pointer;font-size:14px;transition:transform .1s,border-color .15s,box-shadow .15s;font-weight:500;}'
  + '.ch-option:hover{border-color:#1a73e8;box-shadow:0 1px 6px rgba(26,115,232,0.15);}'
  + '.ch-option:active{transform:scale(0.98);}'
  + '.ch-option.ch-correct{background:#e6f4ea;border-color:#34a853;color:#137333;}'
  + '.ch-option.ch-wrong{background:#fce8e6;border-color:#ea4335;color:#c5221f;}'
  // Modals
  + '.name-modal-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:100000;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);}'
  + '.name-modal{background:#fff;border-radius:16px;padding:28px 24px;max-width:320px;width:90%;text-align:center;box-shadow:0 8px 30px rgba(0,0,0,0.15);}'
  + '.name-modal h3{margin:0 0 6px;color:#202124;font-size:18px;}'
  + '.name-modal p{color:#5f6368;font-size:13px;margin:0 0 14px;}'
  + '.name-modal input{width:80%;padding:10px 14px;border:1.5px solid #dadce0;border-radius:24px;font-size:15px;text-align:center;outline:none;margin-bottom:10px;transition:border-color .2s;}'
  + '.name-modal input:focus{border-color:#1a73e8;}'
  + '.name-modal textarea{width:80%;padding:10px 14px;border:1.5px solid #dadce0;border-radius:12px;font-size:13px;outline:none;resize:none;margin-bottom:10px;transition:border-color .2s;}'
  + '.name-modal textarea:focus{border-color:#1a73e8;}'
  // Picture overlay
  + '.pic-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:100001;display:flex;align-items:center;justify-content:center;cursor:pointer;backdrop-filter:blur(8px);}'
  // Notification badge
  + '#notif-badge{font-size:10px;background:#ea4335;color:#fff;border-radius:10px;padding:1px 5px;position:relative;top:-6px;display:none;font-weight:700;min-width:8px;text-align:center;}'
  + '#online-count-badge{font-size:13px;color:aqua;position:relative;top:-6px;display:none;font-weight:700;}'
  // Section headings
  + '.section-heading{margin:2px 0 8px;font-size:17px;font-weight:700;color:#202124;display:flex;align-items:center;gap:8px;}'
  + '.section-heading-icon{font-size:20px;}'
  // Load more
  + '.load-more-wrap{text-align:center;padding:10px 0;}'
  + '.load-more-btn{background:#f1f3f4;color:#1a73e8;border:1.5px solid #dadce0;border-radius:20px;padding:8px 24px;font-size:13px;font-weight:600;cursor:pointer;transition:background .15s;}'
  + '.load-more-btn:hover{background:#e8f0fe;}'
  // User profile modal
  + '.user-profile-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:100000;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);}'
  + '.user-profile-modal{background:#fff;border-radius:16px;padding:24px 20px;max-width:340px;width:92%;text-align:center;box-shadow:0 8px 30px rgba(0,0,0,0.18);position:relative;max-height:85vh;overflow-y:auto;}'
  + '.upm-close{position:absolute;top:10px;right:14px;font-size:20px;cursor:pointer;color:#80868b;background:none;border:none;padding:4px;}'
  + '.upm-pic{margin:8px 0;}'
  + '.upm-pic img{width:80px;height:80px;border-radius:50%;object-fit:cover;border:3px solid #1a73e8;box-shadow:0 2px 10px rgba(26,115,232,0.25);cursor:pointer;}'
  + '.upm-name{font-size:18px;font-weight:700;color:#202124;margin:6px 0 2px;}'
  + '.upm-code{font-size:12px;color:#80868b;margin:0 0 4px;}'
  + '.upm-level{display:inline-block;background:#e8f0fe;color:#1a73e8;padding:3px 12px;border-radius:12px;font-size:12px;font-weight:600;margin:6px 0 10px;}'
  + '.upm-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin:8px 0;}'
  + '.upm-stat{background:#f8f9fa;border-radius:10px;padding:10px 4px;border:1px solid #e8e8e8;}'
  + '.upm-stat-val{font-size:18px;font-weight:700;color:#1a73e8;}'
  + '.upm-stat-lbl{font-size:10px;color:#80868b;margin-top:2px;font-weight:500;}'
  + '.upm-actions{margin-top:12px;}'
  ;
document.head.appendChild(ss);

// ---- SECTION INJECTION ----
var dicWrapper = document.getElementById('dictionary-wrapper');
if (dicWrapper) {
  dicWrapper.insertAdjacentHTML('afterend', ''
    // PROFILE
    + '<section id="profile-section"><div id="profile-wrapper">'
    + '<div class="section-heading"><span class="section-heading-icon">👤</span> My Profile</div><div id="profile-avatar"><span id="profile-pic-display">👤</span><span class="pic-edit-hint">📷</span></div>'
    + '<input type="file" id="pic-file-input" accept="image/*">'
    + '<div id="profile-name-display"><span id="profile-name-text"></span> <span id="profile-edit-btn" style="cursor:pointer;font-size:14px;">✏️</span></div>'
    + '<div id="profile-friend-code">Friend Code: <b id="profile-code-value"></b> <span id="profile-copy-code" style="cursor:pointer;">📋</span></div>'
    + '<div class="stats-grid">'
    + '<div class="stat-box"><div class="stat-val" id="prof-points">0</div><div class="stat-lbl">Points</div></div>'
    + '<div class="stat-box"><div class="stat-val" id="prof-level">-</div><div class="stat-lbl">Level</div></div>'
    + '<div class="stat-box"><div class="stat-val" id="prof-quizzes">0</div><div class="stat-lbl">Quizzes</div></div>'
    + '<div class="stat-box"><div class="stat-val" id="prof-wins">0</div><div class="stat-lbl">Wins</div></div>'
    + '<div class="stat-box"><div class="stat-val" id="prof-losses">0</div><div class="stat-lbl">Losses</div></div>'
    + '<div class="stat-box"><div class="stat-val" id="prof-draws">0</div><div class="stat-lbl">Draws</div></div>'
    + '</div></div></section>'
    // ONLINE USERS (replaces old Friends section)
    + '<section id="friends-section"><div id="friends-wrapper">'
    + '<div class="section-heading"><span class="section-heading-icon">🌐</span> Online Users</div>'
    + '<input id="online-search-input" placeholder="Search by name...">'
    + '<div id="online-users-content" class="s-loading">Loading...</div>'
    + '</div></section>'
    // LEADERBOARD
    + '<section id="leaderboard-section"><div id="leaderboard-wrapper">'
    + '<div class="section-heading"><span class="section-heading-icon">🏅</span> Leaderboard</div>'
    + '<p style="color:#5f6368;font-size:13px;margin:4px 0 12px;line-height:1.4;">Top 30 users. The leader of the week gets a free 1 week subscription. Keep playing quiz to earn points!</p>'
    + '<div id="lb-global-list" class="s-loading">Loading...</div>'
    + '</div></section>'
    // NOTIFICATIONS
    + '<section id="notifications-section"><div id="notifications-wrapper">'
    + '<div class="section-heading"><span class="section-heading-icon">🔔</span> Notifications</div>'
    + '<div id="notifications-list" class="s-empty">No notifications</div>'
    + '</div></section>'
    // CHALLENGE
    + '<section id="challenge-section">'
    + '<div id="challenge-info">'
    + '<div class="ch-accept-card">'
    + '<div class="section-heading" style="justify-content:center;"><span class="section-heading-icon">🎯</span> Challenge!</div>'
    + '<div class="ch-opponent-pic" id="ch-opponent-pic"></div>'
    + '<div style="font-size:15px;font-weight:600;color:#202124;" id="ch-opponent-name"></div>'
    + '<div id="ch-challenge-msg"></div>'
    + '<div class="ch-score-label">Their score</div>'
    + '<div class="ch-score-preview"><span id="ch-opponent-score"></span>/10</div>'
    + '<div style="color:#5f6368;font-size:13px;margin:8px 0 16px;">Can you beat them?</div>'
    + '<button class="s-btn s-btn-g" id="start-challenge-btn" style="padding:14px 36px;font-size:15px;">Accept Challenge</button>'
    + '</div></div>'
    + '<div id="ch-quiz-wrapper" style="display:none;">'
    + '<div id="ch-progress-bar"><div id="ch-progress-fill" style="width:0%"></div></div>'
    + '<div id="ch-timer-bar">00:00</div>'
    + '<div id="ch-question-title">Question <span id="ch-q-num">1</span> / 10</div>'
    + '<div id="ch-question-wrapper"><span id="ch-query-text">What is the translation of </span><b id="ch-question-word"></b>?</div>'
    + '<div id="ch-options"></div></div>'
    + '<div id="challenge-results" style="display:none;">'
    + '<div class="ch-accept-card">'
    + '<div class="section-heading" style="justify-content:center;"><span class="section-heading-icon">🏆</span> Results</div>'
    + '<div class="ch-comparison"><div class="ch-player"><div class="ch-player-name" id="ch-you-label">You</div><div class="ch-player-score" id="ch-you-score">0</div></div>'
    + '<div class="ch-vs">VS</div>'
    + '<div class="ch-player"><div class="ch-player-name" id="ch-opp-label">-</div><div class="ch-player-score" id="ch-opp-score-final">0</div></div></div>'
    + '<div class="ch-verdict" id="ch-verdict"></div>'
    + '<div class="ch-bonus" id="ch-bonus"></div>'
    + '<div id="ch-reply-section" style="display:none;margin:16px 0 0;">'
    + '<div id="ch-original-msg" style="margin-bottom:8px;"></div>'
    + '<textarea id="ch-reply-input" placeholder="Write a reply..." maxlength="200" rows="2" style="width:90%;padding:10px 14px;border:1.5px solid #dadce0;border-radius:12px;font-size:13px;outline:none;resize:none;transition:border-color .2s;"></textarea>'
    + '<div style="margin-top:8px;"><button class="s-btn s-btn-p" id="ch-reply-send" style="padding:10px 22px;">Send Reply</button></div>'
    + '</div>'
    + '<button class="s-btn s-btn-s" id="ch-back-btn" style="margin-top:14px;padding:10px 28px;">Back</button>'
    + '</div></div></section>'
  );
}

// ---- NAV WIRING ----
function navTo(sectionId) {
  hide('section, #pagination-btns-wrapper, #more-links-wrapper');
  show('#' + sectionId);
  removeClass('.link', 'active_link');
  addClass('#friends-link', 'active_link');
  _currentSection = sectionId;
  history.pushState({ social: sectionId }, null);
}

// Notification icon → Notifications section
var notifLink = document.getElementById('notif-link');
if (notifLink) {
  notifLink.addEventListener('click', function() {
    navTo('notifications-section');
    showNotifications();
    adjustPolling();
  });
}

// Friends/Online Users link
var friendsLink = document.getElementById('friends-link');
if (friendsLink) {
  friendsLink.addEventListener('click', function() {
    navTo('friends-section');
    loadOnlineUsers();
    adjustPolling();
  });
}

// Add Profile + Leaderboard + Notifications to More menu
var moreLinks = document.getElementById('more-links-wrapper');
if (moreLinks) {
  var profileItem = document.createElement('li');
  profileItem.innerHTML = '<span>👤</span> My Profile';
  profileItem.style.cursor = 'pointer';
  profileItem.addEventListener('click', function() { navTo('profile-section'); showProfile(); });

  var lbItem = document.createElement('li');
  lbItem.innerHTML = '<span>🏆</span> Leaderboard';
  lbItem.style.cursor = 'pointer';
  lbItem.addEventListener('click', function() { navTo('leaderboard-section'); showLeaderboard(); });

  var notifItem = document.createElement('li');
  notifItem.innerHTML = '<span>🔔</span> Notifications';
  notifItem.style.cursor = 'pointer';
  notifItem.addEventListener('click', function() { navTo('notifications-section'); showNotifications(); adjustPolling(); });

  var firstMore = moreLinks.children[0];
  moreLinks.insertBefore(notifItem, firstMore);
  moreLinks.insertBefore(lbItem, notifItem);
  moreLinks.insertBefore(profileItem, lbItem);
}

// Back button
window.addEventListener('popstate', function(e) {
  if (e.state && e.state.social) {
    navTo(e.state.social);
  } else {
    _currentSection = null;
    adjustPolling();
  }
});

// ---- NAME PROMPT ----
function showNamePrompt(callback) {
  var overlay = document.createElement('div');
  overlay.className = 'name-modal-overlay';
  overlay.innerHTML = '<div class="name-modal">'
    + '<h3>Welcome!</h3><p>Choose a display name for your profile</p>'
    + '<input id="name-prompt-input" type="text" placeholder="Your name" minlength="3" maxlength="50">'
    + '<div id="name-prompt-error" style="color:#ea4335;font-size:13px;margin-top:6px;display:none;">Name must be at least 3 characters</div>'
    + '<div style="margin-top:12px;"><button class="s-btn s-btn-p" id="name-prompt-save" style="padding:10px 24px;">Continue</button></div>'
    + '</div>';
  document.body.appendChild(overlay);
  document.getElementById('name-prompt-save').addEventListener('click', function() {
    var val = document.getElementById('name-prompt-input').value.trim();
    var errEl = document.getElementById('name-prompt-error');
    if (val.length < 3) { errEl.style.display = 'block'; setTimeout(function(){ errEl.style.display = 'none'; }, 3000); return; }
    errEl.style.display = 'none';
    document.body.removeChild(overlay);
    callback(val);
  });
}

// ---- USER REGISTRATION ----
function checkAndRegisterUser() {
  var deviceId = getDeviceId();
  var userData = getUserData();
  if (userData && userData.name) {
    startPolling();
    syncPoints();
    return;
  }
  if (!navigator.onLine) return;
  var name = localStorage.getItem('bemdic_user_name');
  if (name) {
    registerUser(deviceId, name);
  } else {
    showNamePrompt(function(n) {
      localStorage.setItem('bemdic_user_name', n);
      registerUser(deviceId, n);
    });
  }
}
function registerUser(deviceId, name) {
  apiCall('/register', { device_id: deviceId, name: name }, function(resp) {
    if (resp.ok && resp.user) {
      localStorage.setItem('bemdic_user_data', JSON.stringify(resp.user));
      startPolling();
      syncPoints();
    }
  });
}

// ---- PROFILE ----
function showProfile() {
  var ud = getUserData();
  if (ud) renderProfile(ud);
  apiCall('/user/profile', { device_id: getDeviceId() }, function(resp) {
    if (resp.ok && resp.user) {
      localStorage.setItem('bemdic_user_data', JSON.stringify(resp.user));
      renderProfile(resp.user);
    }
  });
}
function renderProfile(u) {
  var el = function(id) { return document.getElementById(id); };
  var picEl = el('profile-pic-display');
  if (picEl) {
    if (u.picture) picEl.innerHTML = '<img src="' + u.picture + '">';
    else picEl.innerHTML = '👤';
  }
  if (el('profile-name-text')) el('profile-name-text').textContent = u.name || '';
  if (el('profile-code-value')) el('profile-code-value').textContent = u.friend_code || '';
  if (el('prof-points')) el('prof-points').textContent = u.points || 0;
  if (el('prof-level')) el('prof-level').textContent = getLevelName(u.points || 0);
  if (el('prof-quizzes')) el('prof-quizzes').textContent = u.total_quizzes || 0;
  if (el('prof-wins')) el('prof-wins').textContent = u.challenges_won || 0;
  if (el('prof-losses')) el('prof-losses').textContent = u.challenges_lost || 0;
  if (el('prof-draws')) el('prof-draws').textContent = u.challenges_drawn || 0;
}

// Profile edit name
var editBtn = document.getElementById('profile-edit-btn');
if (editBtn) {
  editBtn.addEventListener('click', function() {
    var current = (getUserData() || {}).name || '';
    var newName = prompt('Enter new display name:', current);
    if (newName && newName.trim().length >= 3 && newName.trim() !== current) {
      apiCall('/user/update', { device_id: getDeviceId(), name: newName.trim() }, function(resp) {
        if (resp.ok) {
          var ud = getUserData() || {};
          ud.name = newName.trim();
          localStorage.setItem('bemdic_user_data', JSON.stringify(ud));
          localStorage.setItem('bemdic_user_name', newName.trim());
          showProfile();
        }
      });
    }
  });
}

// Profile picture upload
var profAvatar = document.getElementById('profile-avatar');
var picInput = document.getElementById('pic-file-input');
if (profAvatar && picInput) {
  // Click on the pic-edit-hint (camera icon) opens file picker
  var picEditHint = profAvatar.querySelector('.pic-edit-hint');
  if (picEditHint) picEditHint.addEventListener('click', function(e) { e.stopPropagation(); picInput.click(); });
  // Click on the avatar image itself enlarges it
  profAvatar.addEventListener('click', function() {
    var img = this.querySelector('img');
    if (img && img.src) showPicOverlay(img.src);
  });
  picInput.addEventListener('change', function() {
    if (!this.files || !this.files[0]) return;
    var picDisplay = document.getElementById('profile-pic-display');
    if (picDisplay) picDisplay.innerHTML = '<div class="s-loading" style="padding:4px;">Uploading...</div>';
    resizeAndUploadPicture(this.files[0], function(dataUrl) {
      if (dataUrl) showProfile();
      else if (picDisplay) picDisplay.innerHTML = '👤';
    });
    picInput.value = '';
  });
}

// Copy friend code
var copyBtn = document.getElementById('profile-copy-code');
if (copyBtn) {
  copyBtn.addEventListener('click', function() {
    var code = (getUserData() || {}).friend_code || '';
    if (code && navigator.clipboard) {
      navigator.clipboard.writeText(code).then(function() { alert('Friend code copied!'); });
    }
  });
}

// ---- ONLINE USERS ----
var _onlineOffset = 0;
var _onlineQuery = '';

function loadOnlineUsers(query, append) {
  if (!append) { _onlineOffset = 0; _onlineQuery = query || ''; }
  var listEl = document.getElementById('online-users-content');
  if (!append && listEl) listEl.innerHTML = '<div class="s-loading">Loading...</div>';
  var data = { device_id: getDeviceId(), offset: _onlineOffset };
  if (_onlineQuery) data.query = _onlineQuery;
  apiCall('/users/online', data, function(resp) {
    if (!resp.ok) { if (listEl && !append) listEl.innerHTML = '<div class="s-empty">Could not load users</div>'; return; }
    renderOnlineUsers(resp.users || [], resp.has_more, append);
  });
}

function renderOnlineUsers(users, hasMore, append) {
  var el = document.getElementById('online-users-content');
  if (!el) return;
  if (!append && !users.length) {
    el.innerHTML = '<div class="s-empty">No users online right now. Try again later!</div>';
    return;
  }

  var tbody;
  if (append) {
    tbody = el.querySelector('tbody');
    var oldBtn = el.querySelector('.load-more-wrap');
    if (oldBtn) oldBtn.remove();
  } else {
    var html = '<table class="online-table"><thead><tr><th class="pic-cell"></th><th>Name</th><th class="action-cell">Action</th></tr></thead><tbody></tbody></table>';
    el.innerHTML = html;
    tbody = el.querySelector('tbody');
  }

  for (var i = 0; i < users.length; i++) {
    var u = users[i];
    var tr = document.createElement('tr');
    var picEl = profilePicHtml(u.picture, 40, true);
    // Add data-uid to the clickable pic
    picEl = picEl.replace('class="clickable-pic"', 'class="clickable-pic" data-uid="' + u.id + '"');
    tr.innerHTML = '<td class="pic-cell">' + picEl + '</td>'
      + '<td class="name-cell">' + escapeHtml(u.name) + '<br><span class="name-meta"><span class="friend-dot dot-on"></span>' + getLevelName(u.points) + ' · ' + u.points + 'pts</span></td>'
      + '<td class="action-cell"><button class="s-btn s-btn-g" data-uid="' + u.id + '" data-uname="' + escapeHtml(u.name) + '">Challenge</button></td>';
    tbody.appendChild(tr);
  }

  if (hasMore) {
    var wrap = document.createElement('div');
    wrap.className = 'load-more-wrap';
    wrap.innerHTML = '<button class="load-more-btn">Load More</button>';
    el.appendChild(wrap);
    wrap.querySelector('.load-more-btn').addEventListener('click', function() {
      _onlineOffset += 20;
      loadOnlineUsers(null, true);
    });
  }

  wireOnlineUserHandlers(el);
}

function wireOnlineUserHandlers(el) {
  var btns = el.querySelectorAll('.s-btn-g:not([data-wired])');
  for (var b = 0; b < btns.length; b++) {
    btns[b].setAttribute('data-wired', '1');
    btns[b].addEventListener('click', function() {
      var uid = parseInt(this.getAttribute('data-uid'));
      var uname = this.getAttribute('data-uname');
      showChallengeMessagePrompt(uid, uname);
    });
  }
  var pics = el.querySelectorAll('.clickable-pic[data-uid]:not([data-wired])');
  for (var p = 0; p < pics.length; p++) {
    pics[p].setAttribute('data-wired', '1');
    pics[p].addEventListener('click', function(e) {
      e.stopPropagation();
      var uid = parseInt(this.getAttribute('data-uid'));
      if (uid) showUserProfile(uid);
    });
  }
}

// Search filter for online users
var onlineSearchInput = document.getElementById('online-search-input');
var _searchTimeout = null;
if (onlineSearchInput) {
  onlineSearchInput.addEventListener('input', function() {
    clearTimeout(_searchTimeout);
    var q = this.value.trim();
    _searchTimeout = setTimeout(function() {
      loadOnlineUsers(q || undefined);
    }, 400);
  });
}

// ---- CHALLENGE SYSTEM ----

// Challenge message prompt before starting
function showChallengeMessagePrompt(userId, userName) {
  var overlay = document.createElement('div');
  overlay.className = 'name-modal-overlay';
  overlay.innerHTML = '<div class="name-modal">'
    + '<h3>Challenge ' + escapeHtml(userName) + '</h3>'
    + '<p>Add an optional message to your challenge</p>'
    + '<textarea id="challenge-msg-input" placeholder="e.g. Let\'s see who knows more Bemba!" maxlength="200" rows="3"></textarea>'
    + '<div style="margin-top:4px;">'
    + '<button class="s-btn s-btn-g" id="challenge-msg-start" style="padding:10px 24px;margin-right:8px;">Start Quiz</button>'
    + '<button class="s-btn s-btn-s" id="challenge-msg-cancel" style="padding:10px 24px;">Cancel</button>'
    + '</div></div>';
  document.body.appendChild(overlay);

  document.getElementById('challenge-msg-start').addEventListener('click', function() {
    var msg = document.getElementById('challenge-msg-input').value.trim();
    document.body.removeChild(overlay);
    startChallenge(userId, userName, msg);
  });
  document.getElementById('challenge-msg-cancel').addEventListener('click', function() {
    document.body.removeChild(overlay);
  });
}

// -- Sender flow --
function startChallenge(userId, userName, message) {
  window.__bemdic_challenge_mode = true;
  window.__bemdic_challenge_target = { id: userId, name: userName, message: message || '' };
  // Navigate to quiz section (normal quiz flow)
  hide('section, #pagination-btns-wrapper, #more-links-wrapper');
  show('#quiz-section');
  removeClass('.link', 'active_link');
  addClass('#quiz-link', 'active_link');
  // Reset quiz state
  question_number = 0;
  scored_marks = 0;
  gen_random_question = [];
  var instrHeader = document.getElementById('instructions-header');
  if (instrHeader) instrHeader.innerHTML = 'Challenge <b>' + escapeHtml(userName) + '</b>!<br><small style="color:#666;">Play the quiz. Your score will be sent as a challenge.</small>';
}

// MutationObserver on quiz results to detect challenge quiz completion
var qrw = document.getElementById('quiz-results-wrapper');
if (qrw) {
  var qrwObs = new MutationObserver(function() {
    if (!window.__bemdic_challenge_mode) return;
    if (qrw.style.display === 'none' || qrw.offsetParent === null) return;
    // Quiz finished in challenge mode
    var questions = [];
    for (var i = 0; i < gen_random_question.length; i++) {
      var idx = gen_random_question[i];
      var parts = english_bemba_array[idx].split('#');
      questions.push({ index: idx, eng: parts[0], bem: parts[1] });
    }
    var target = window.__bemdic_challenge_target;
    var score = scored_marks;

    var epw = document.getElementById('earned-points-wrapper');
    if (epw) epw.insertAdjacentHTML('afterend', '<div id="ch-sending-msg" style="text-align:center;color:#058;margin:10px 0;font-size:14px;">Sending challenge to <b>' + escapeHtml(target.name) + '</b>...</div>');

    apiCall('/challenge/send', {
      device_id: getDeviceId(),
      receiver_id: target.id,
      sender_score: score,
      questions: questions,
      message: target.message || ''
    }, function(resp) {
      var msg = document.getElementById('ch-sending-msg');
      if (resp.ok) {
        if (msg) { msg.style.color = '#084'; msg.innerHTML = 'Challenge sent! <b>' + escapeHtml(target.name) + '</b> will be notified.'; }
      } else {
        if (msg) { msg.style.color = 'crimson'; msg.textContent = 'Failed to send challenge.'; }
      }
      window.__bemdic_challenge_mode = false;
      window.__bemdic_challenge_target = null;
      syncPoints();
    });
    qrwObs.disconnect();
    setTimeout(function() { qrwObs.observe(qrw, { attributes: true, attributeFilter: ['style'] }); }, 2000);
  });
  qrwObs.observe(qrw, { attributes: true, attributeFilter: ['style'] });
}

// -- Receiver flow --
var _challengeData = null;
var _chQuestionNum = 0;
var _chScore = 0;
var _chTimerInterval = null;

function openReceivedChallenge(challengeId) {
  navTo('challenge-section');
  var info = document.getElementById('challenge-info');
  var quizW = document.getElementById('ch-quiz-wrapper');
  var results = document.getElementById('challenge-results');
  if (info) info.style.display = 'block';
  if (quizW) quizW.style.display = 'none';
  if (results) results.style.display = 'none';

  apiCall('/challenge/detail', { device_id: getDeviceId(), challenge_id: challengeId }, function(resp) {
    if (!resp.ok || !resp.challenge) { if (info) info.innerHTML = '<div class="s-empty">Could not load challenge</div>'; return; }
    _challengeData = resp.challenge;
    _challengeData.parsedQuestions = typeof resp.challenge.questions === 'string' ? JSON.parse(resp.challenge.questions) : resp.challenge.questions;

    if (resp.challenge.status === 'completed') {
      showChallengeResult({
        sender_name: resp.challenge.is_sender ? 'You' : resp.challenge.opponent_name,
        receiver_name: resp.challenge.is_sender ? resp.challenge.opponent_name : 'You',
        sender_score: resp.challenge.sender_score,
        receiver_score: resp.challenge.receiver_score,
        is_sender: resp.challenge.is_sender,
        sender_bonus: resp.challenge.sender_points_awarded,
        receiver_bonus: resp.challenge.receiver_points_awarded
      });
      return;
    }

    var oppName = document.getElementById('ch-opponent-name');
    var oppScore = document.getElementById('ch-opponent-score');
    var chMsg = document.getElementById('ch-challenge-msg');
    var oppPic = document.getElementById('ch-opponent-pic');
    if (oppPic) oppPic.innerHTML = profilePicHtml(resp.challenge.opponent_picture, 56, true);
    if (oppName) oppName.textContent = resp.challenge.opponent_name;
    if (oppScore) oppScore.textContent = resp.challenge.sender_score;
    if (chMsg) {
      if (resp.challenge.message) {
        chMsg.innerHTML = '<div class="ch-msg">"' + escapeHtml(resp.challenge.message) + '"</div>';
      } else {
        chMsg.innerHTML = '';
      }
    }
    // Clickable opponent pic
    var cpic = oppPic ? oppPic.querySelector('.clickable-pic') : null;
    if (cpic) cpic.addEventListener('click', function(e) { e.stopPropagation(); showPicOverlay(this.src); });
  });
}

// Start challenge button
var startChBtn = document.getElementById('start-challenge-btn');
if (startChBtn) {
  startChBtn.addEventListener('click', function() {
    if (!_challengeData) return;
    _chQuestionNum = 0;
    _chScore = 0;
    document.getElementById('challenge-info').style.display = 'none';
    document.getElementById('ch-quiz-wrapper').style.display = 'block';
    loadChallengeQuestion();
  });
}

function loadChallengeQuestion() {
  _chQuestionNum++;
  if (_chQuestionNum > 10) {
    clearInterval(_chTimerInterval);
    document.getElementById('ch-quiz-wrapper').style.display = 'none';
    apiCall('/challenge/respond', {
      device_id: getDeviceId(),
      challenge_id: _challengeData.id,
      receiver_score: _chScore
    }, function(resp) {
      if (resp.ok) {
        showChallengeResult({
          sender_name: resp.result.sender_name,
          receiver_name: 'You',
          sender_score: resp.result.sender_score,
          receiver_score: resp.result.receiver_score,
          is_sender: false,
          sender_bonus: resp.result.sender_bonus,
          receiver_bonus: resp.result.receiver_bonus,
          winner: resp.result.winner,
          challenge_message: _challengeData.message || '',
          challenge_id: _challengeData.id
        });
        syncPoints();
      }
    });
    return;
  }

  var q = _challengeData.parsedQuestions[_chQuestionNum - 1];
  var qNumEl = document.getElementById('ch-q-num');
  if (qNumEl) qNumEl.textContent = _chQuestionNum;
  var progFill = document.getElementById('ch-progress-fill');
  if (progFill) progFill.style.width = ((_chQuestionNum - 1) * 10) + '%';

  var askEng = _chQuestionNum <= 5;
  var questionWord = askEng ? q.eng : q.bem;
  var correctAnswer = askEng ? q.bem : q.eng;
  var queryText = document.getElementById('ch-query-text');
  if (queryText) queryText.textContent = 'What is the translation of ';
  var qWordEl = document.getElementById('ch-question-word');
  if (qWordEl) qWordEl.textContent = questionWord;

  var wrongAnswers = [];
  while (wrongAnswers.length < 3) {
    var ri = Math.floor(Math.random() * english_bemba_array.length);
    var parts = english_bemba_array[ri].split('#');
    var wrong = askEng ? parts[1] : parts[0];
    if (wrong !== correctAnswer && wrongAnswers.indexOf(wrong) === -1) {
      wrongAnswers.push(wrong);
    }
  }

  var options = wrongAnswers.slice();
  var correctPos = Math.floor(Math.random() * 4);
  options.splice(correctPos, 0, correctAnswer);

  var optEl = document.getElementById('ch-options');
  if (!optEl) return;
  var html = '';
  for (var i = 0; i < 4; i++) {
    html += '<div class="ch-option" data-ans="' + escapeHtml(options[i]) + '">' + String.fromCharCode(65 + i) + '. ' + escapeHtml(options[i]) + '</div>';
  }
  optEl.innerHTML = html;

  var opts = optEl.querySelectorAll('.ch-option');
  var answered = false;
  for (var o = 0; o < opts.length; o++) {
    opts[o].addEventListener('click', function() {
      if (answered) return;
      answered = true;
      clearInterval(_chTimerInterval);
      var selected = this.getAttribute('data-ans');
      if (selected === correctAnswer) {
        this.classList.add('ch-correct');
        _chScore++;
      } else {
        this.classList.add('ch-wrong');
        for (var x = 0; x < opts.length; x++) {
          if (opts[x].getAttribute('data-ans') === correctAnswer) opts[x].classList.add('ch-correct');
        }
      }
      for (var x = 0; x < opts.length; x++) opts[x].style.pointerEvents = 'none';
      setTimeout(loadChallengeQuestion, 1500);
    });
  }

  var timeLeft = 15;
  var timerBar = document.getElementById('ch-timer-bar');
  if (timerBar) timerBar.textContent = '00:' + (timeLeft < 10 ? '0' : '') + timeLeft;
  clearInterval(_chTimerInterval);
  _chTimerInterval = setInterval(function() {
    timeLeft--;
    if (timerBar) timerBar.textContent = '00:' + (timeLeft < 10 ? '0' : '') + timeLeft;
    if (timeLeft <= 0) {
      clearInterval(_chTimerInterval);
      if (!answered) {
        answered = true;
        for (var x = 0; x < opts.length; x++) {
          if (opts[x].getAttribute('data-ans') === correctAnswer) opts[x].classList.add('ch-correct');
          opts[x].style.pointerEvents = 'none';
        }
        setTimeout(loadChallengeQuestion, 1500);
      }
    }
  }, 1000);
}

function showChallengeResult(data) {
  var info = document.getElementById('challenge-info');
  var quizW = document.getElementById('ch-quiz-wrapper');
  var results = document.getElementById('challenge-results');
  if (info) info.style.display = 'none';
  if (quizW) quizW.style.display = 'none';
  if (results) results.style.display = 'block';

  var youScore, oppScore, youName, oppName, youBonus;
  if (data.is_sender) {
    youScore = data.sender_score; oppScore = data.receiver_score;
    youName = 'You'; oppName = data.receiver_name;
    youBonus = data.sender_bonus;
  } else {
    youScore = data.receiver_score; oppScore = data.sender_score;
    youName = 'You'; oppName = data.sender_name;
    youBonus = data.receiver_bonus;
  }

  var youLabel = document.getElementById('ch-you-label');
  var youScoreEl = document.getElementById('ch-you-score');
  var oppLabel = document.getElementById('ch-opp-label');
  var oppScoreEl = document.getElementById('ch-opp-score-final');
  var verdict = document.getElementById('ch-verdict');
  var bonus = document.getElementById('ch-bonus');

  if (youLabel) youLabel.textContent = youName;
  if (youScoreEl) { youScoreEl.textContent = youScore + '/10'; youScoreEl.style.color = youScore > oppScore ? '#084' : (youScore < oppScore ? 'crimson' : '#058'); }
  if (oppLabel) oppLabel.textContent = oppName;
  if (oppScoreEl) { oppScoreEl.textContent = oppScore + '/10'; oppScoreEl.style.color = oppScore > youScore ? '#084' : (oppScore < youScore ? 'crimson' : '#058'); }

  var winner = data.winner || (youScore > oppScore ? (data.is_sender ? 'sender' : 'receiver') : (youScore < oppScore ? (data.is_sender ? 'receiver' : 'sender') : 'draw'));
  var iWon = (data.is_sender && winner === 'sender') || (!data.is_sender && winner === 'receiver');
  var isDraw = winner === 'draw';

  if (verdict) {
    if (isDraw) { verdict.textContent = "It's a Draw!"; verdict.style.color = '#058'; }
    else if (iWon) { verdict.textContent = 'You Win! +10pts'; verdict.style.color = '#084'; }
    else { verdict.textContent = 'You Lost!'; verdict.style.color = 'crimson'; }
  }
  if (bonus) {
    if (youBonus > 0) bonus.textContent = '+' + youBonus + ' points earned';
    else bonus.textContent = isDraw && youScore === 0 ? 'No points for 0:0 draw' : '';
  }

  // Show reply section for receiver who just finished (has challenge message)
  var replySection = document.getElementById('ch-reply-section');
  var originalMsg = document.getElementById('ch-original-msg');
  var replyInput = document.getElementById('ch-reply-input');
  if (replySection) {
    if (!data.is_sender && data.challenge_message) {
      replySection.style.display = 'block';
      if (originalMsg) originalMsg.innerHTML = '<div class="ch-msg">"' + escapeHtml(data.challenge_message) + '"</div>';
      if (replyInput) replyInput.value = '';
    } else {
      replySection.style.display = 'none';
    }
  }
}

// Reply send button
var chReplyBtn = document.getElementById('ch-reply-send');
if (chReplyBtn) {
  chReplyBtn.addEventListener('click', function() {
    var input = document.getElementById('ch-reply-input');
    var msg = input ? input.value.trim() : '';
    if (!msg) return;
    if (!_challengeData || !_challengeData.id) return;
    chReplyBtn.disabled = true;
    chReplyBtn.textContent = 'Sending...';
    apiCall('/challenge/reply', {
      device_id: getDeviceId(),
      challenge_id: _challengeData.id,
      reply_message: msg
    }, function(resp) {
      if (resp.ok) {
        chReplyBtn.textContent = 'Sent!';
        if (input) input.disabled = true;
      } else {
        chReplyBtn.disabled = false;
        chReplyBtn.textContent = 'Send Reply';
        alert(resp.error || 'Failed to send reply');
      }
    });
  });
}

// Back from challenge results
var chBackBtn = document.getElementById('ch-back-btn');
if (chBackBtn) {
  chBackBtn.addEventListener('click', function() {
    navTo('friends-section');
    loadOnlineUsers();
  });
}

// ---- LEADERBOARD ----
function showLeaderboard() {
  loadGlobalLB();
}
function loadGlobalLB() {
  var el = document.getElementById('lb-global-list');
  if (el) el.innerHTML = '<div class="s-loading">Loading...</div>';
  apiGet('/leaderboard/global', function(resp) {
    if (!resp.ok) { if (el) el.innerHTML = '<div class="s-empty">Could not load</div>'; return; }
    renderLB(el, resp.leaders, null);
  });
}
function renderLB(el, leaders, myCode) {
  if (!el || !leaders.length) { if (el) el.innerHTML = '<div class="s-empty">No data yet</div>'; return; }
  var html = '';
  var medals = ['🏆', '🥈', '🥉'];
  for (var i = 0; i < leaders.length; i++) {
    var l = leaders[i];
    var isMe = myCode && l.friend_code === myCode;
    html += '<div class="lb-row' + (isMe ? ' lb-me' : '') + '" data-uid="' + (l.id || '') + '" style="border-bottom:1px solid #e0e0e0;cursor:pointer;">'
      + '<span class="lb-rank">' + (i < 3 ? medals[i] : '#' + (i + 1)) + '</span>'
      + '<span class="lb-pic">' + profilePicHtml(l.picture, 34, true) + '</span>'
      + '<div class="lb-info"><div class="lb-name">' + escapeHtml(l.name) + '</div>'
      + '<div class="lb-level">' + getLevelName(l.points) + '</div></div>'
      + '<span class="lb-pts">' + l.points + 'pts</span></div>';
  }
  el.innerHTML = html;

  // Click row to view profile
  var rows = el.querySelectorAll('.lb-row');
  for (var r = 0; r < rows.length; r++) {
    rows[r].addEventListener('click', function() {
      var uid = this.getAttribute('data-uid');
      if (uid) showUserProfile(parseInt(uid));
    });
  }
}


// ---- NOTIFICATIONS ----
function startPolling() {
  if (_pollInterval) return;
  pollNow();
  _pollInterval = setInterval(pollNow, _pollDelay);
}
function adjustPolling() {
  clearInterval(_pollInterval);
  _pollInterval = null;
  var delay = (_currentSection === 'friends-section' || _currentSection === 'notifications-section') ? _activePollDelay : _pollDelay;
  pollNow();
  _pollInterval = setInterval(pollNow, delay);
}
function pollNow() {
  if (!navigator.onLine) return;
  var ud = getUserData();
  if (!ud) return;
  apiCall('/notifications/poll', { device_id: getDeviceId() }, function(resp) {
    if (resp.ok) {
      updateBadge(resp.unread_count);
    }
  });
  // Update online users count badge
  apiCall('/users/online', { device_id: getDeviceId() }, function(resp) {
    if (resp.ok) updateOnlineCount((resp.users || []).length);
  });
}
function updateBadge(count) {
  var badge = document.getElementById('notif-badge');
  if (!badge) return;
  if (count > 0) {
    badge.textContent = count;
    badge.style.display = 'inline';
  } else {
    badge.style.display = 'none';
  }
}
function updateOnlineCount(count) {
  var badge = document.getElementById('online-count-badge');
  if (!badge) return;
  if (count > 0) {
    badge.textContent = '(' + count + ')';
    badge.style.display = 'inline';
  } else {
    badge.style.display = 'none';
  }
}
var _notifOffset = 0;

function showNotifications(append) {
  var el = document.getElementById('notifications-list');
  if (!append) { _notifOffset = 0; if (el) el.innerHTML = '<div class="s-loading">Loading...</div>'; }
  apiCall('/notifications/poll', { device_id: getDeviceId(), offset: _notifOffset }, function(resp) {
    if (!resp.ok) { if (el && !append) el.innerHTML = '<div class="s-empty">Could not load notifications</div>'; return; }
    var notifs = resp.notifications || [];
    if (!append) updateBadge(resp.unread_count);
    renderNotifications(el, notifs, resp.has_more, append);
    // Mark all as read
    apiCall('/notifications/mark-read', { device_id: getDeviceId(), notification_ids: 'all' }, function() {
      updateBadge(0);
    });
  });
}

function renderNotifications(el, notifs, hasMore, append) {
  if (!el) return;
  if (!append && !notifs.length) { el.innerHTML = '<div class="s-empty">No notifications</div>'; return; }
  if (!append) el.innerHTML = '';

  var oldBtn = el.querySelector('.load-more-wrap');
  if (oldBtn) oldBtn.remove();

  var typeBadges = { challenge_received: ['Challenge', 'notif-type-challenge'], challenge_result: ['Result', 'notif-type-result'], weekly_reward: ['🏆 Weekly Leader', 'notif-type-reward'] };
  for (var i = 0; i < notifs.length; i++) {
    var n = notifs[i];
    var data = typeof n.data === 'string' ? JSON.parse(n.data) : n.data;
    var text = '';
    var badge = typeBadges[n.type];
    if (badge) text += '<span class="notif-type-badge ' + badge[1] + '">' + badge[0] + '</span><br>';
    if (n.type === 'challenge_received') {
      text += '<b>' + escapeHtml(data.from_name) + '</b> challenged you! (scored ' + data.sender_score + '/10)';
      if (data.message) text += '<br><i style="color:#80868b;">"' + escapeHtml(data.message) + '"</i>';
    }
    else if (n.type === 'challenge_result') {
      var w = data.winner;
      if (w === 'draw') text += 'Draw with <b>' + escapeHtml(data.from_name) + '</b>! (' + data.sender_score + '-' + data.receiver_score + ')';
      else text += '<b>' + escapeHtml(data.from_name) + '</b> completed your challenge (' + data.sender_score + '-' + data.receiver_score + '). +' + data.bonus + 'pts';
      if (data.reply_message) text += '<br><i style="color:#80868b;">Reply: "' + escapeHtml(data.reply_message) + '"</i>';
    }
    else if (n.type === 'friend_request') text += '<b>' + escapeHtml(data.from_name) + '</b> wants to be your friend';
    else if (n.type === 'friend_accepted') text += '<b>' + escapeHtml(data.from_name) + '</b> accepted your friend request';
    else if (n.type === 'weekly_reward') {
      text += 'Congratulations! You are the <b>#1 leader</b> this week with <b>' + (data.points || 0) + '</b> points! Tap to claim your <b>free 1-week subscription</b>.';
    }

    var picHtml = n.type === 'weekly_reward' ? '<span style="font-size:30px;">🏆</span>' : profilePicHtml(data.from_picture || '', 38, false);
    var row = document.createElement('div');
    row.className = 'notif-row' + (n.read ? '' : ' unread');
    row.setAttribute('data-ntype', n.type);
    row.setAttribute('data-ndata', JSON.stringify(data));
    row.setAttribute('data-nid', n.id);
    row.innerHTML = '<span class="notif-pic">' + picHtml + '</span>'
      + '<div class="notif-body"><div class="notif-text">' + text + '</div>'
      + '<div class="notif-time">' + timeAgo(n.created_at) + '</div></div>';

    row.addEventListener('click', (function(ntype, ndata, nid, rowEl) {
      return function() {
        // Navigate to challenge
        if (ntype === 'weekly_reward' && ndata.sub_code) {
          // Auto-activate the free subscription
          if (window._bemdic_activateCode) window._bemdic_activateCode(ndata.sub_code);
        }
        else if (ntype === 'challenge_received' && ndata.challenge_id) openReceivedChallenge(ndata.challenge_id);
        else if (ntype === 'challenge_result' && ndata.challenge_id) openReceivedChallenge(ndata.challenge_id);
        // Delete notification
        rowEl.style.transition = 'opacity .3s, max-height .3s';
        rowEl.style.opacity = '0';
        rowEl.style.maxHeight = '0';
        rowEl.style.overflow = 'hidden';
        setTimeout(function() { rowEl.remove(); }, 300);
        apiCall('/notifications/delete', { device_id: getDeviceId(), notification_id: nid }, function() {});
      };
    })(n.type, data, n.id, row));

    el.appendChild(row);
  }

  if (hasMore) {
    var wrap = document.createElement('div');
    wrap.className = 'load-more-wrap';
    wrap.innerHTML = '<button class="load-more-btn">Load More</button>';
    el.appendChild(wrap);
    wrap.querySelector('.load-more-btn').addEventListener('click', function() {
      _notifOffset += 20;
      showNotifications(true);
    });
  }
}

// ---- POINTS SYNC ----
function syncPoints() {
  var localPts = parseInt(localStorage.getItem('quiz-points')) || 0;
  apiCall('/user/sync-points', { device_id: getDeviceId(), local_points: localPts }, function(resp) {
    if (resp.ok && resp.server_points !== undefined) {
      localStorage.setItem('quiz-points', resp.server_points);
      var pn = document.getElementById('points-number');
      if (pn) pn.textContent = resp.server_points;
    }
  });
}

// ---- INIT ----
checkAndRegisterUser();

})();


// ============================================
// SUBSCRIPTION & USAGE LIMIT SYSTEM
// ============================================

(function(){

// --- CONFIG (change these as needed) ---
var SUB_SECRET = 7391;  // secret number for code validation - CHANGE THIS to your own number
var FREE_WORD_LIMIT = 5;
var FREE_QUIZ_LIMIT = 1;
var SUB_DAYS = 4;
var PAYMENT_NUMBER = '0962464552'; // your mobile money number
var PAYMENT_AMOUNT = 'K3';

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
window._bemdic_activateCode = activateSubscription;

// --- PAYWALL MODAL (stored in localStorage for persistence) ---
var subscription_modal = '<div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:99999;display:flex;align-items:center;justify-content:center;font-family:Arial,sans-serif;overflow-y:auto;">'
  + '<div style="background:#fff;border-radius:12px;padding:24px 18px;max-width:360px;width:92%;text-align:center;box-shadow:0 4px 24px rgba(0,0,0,0.3);margin:16px auto;">'
  + '<h2 style="margin:0 0 8px;color:#222;font-size:20px;">Get Unlimited Dictionary</h2>'
  + '<p style="color:#444;font-size:14px;line-height:1.5;margin:8px 0;" id="bemdic-pw-reason"></p>'
  + '<p style="color:#444;font-size:14px;"> for just <b>'+PAYMENT_AMOUNT+'</b>/week!</p>'

  // --- Mobile Money Pay Section ---
  + '<div id="bemdic-momo-section" style="background:linear-gradient(135deg,#e8f5e9,#f1f8e9);border-radius:8px;padding:14px;margin:12px 0;border:1px solid #c8e6c9;">'
  + '<div style="color:#2e7d32;font-weight:bold;font-size:14px;margin-bottom:8px;">Pay with Mobile Money</div>'
  + '<input type="tel" id="bemdic-momo-phone" placeholder="e.g. 0962464552" maxlength="13" style="width:80%;padding:10px;border:2px solid #a5d6a7;border-radius:8px;font-size:16px;text-align:center;margin:6px 0;outline:none;">'
  + '<div id="bemdic-momo-status" style="font-size:13px;min-height:18px;margin:4px 0;color:#555;"></div>'
  + '<button id="bemdic-momo-btn" style="padding:10px 24px;border:none;border-radius:8px;font-size:15px;cursor:pointer;background:#2e7d32;color:#fff;margin-top:4px;">Pay '+PAYMENT_AMOUNT+' Now</button>'
  + '</div>'

  // --- Divider ---
  + '<div style="display:flex;align-items:center;margin:12px 0;"><div style="flex:1;height:1px;background:#ddd;"></div><span style="padding:0 10px;color:#999;font-size:12px;">OR enter code manually</span><div style="flex:1;height:1px;background:#ddd;"></div></div>'

  // --- Manual Code Section ---
  + '<div style="text-align:left;background:#f5f5f5;border-radius:8px;padding:12px 14px;margin:0 0 12px;font-size:13px;color:#333;">'
  + '<div style="color:#084;margin-bottom:8px;">Manual payment:</div>'
  + '<ol id="payments-steps"><li>Send <b>'+PAYMENT_AMOUNT+'</b> to <b>'+PAYMENT_NUMBER+'</b> via Airtel/MTN/Zamtel Money</li>'
  + '<li>WhatsApp your <b>transaction ID</b> to <b>'+PAYMENT_NUMBER+'</b></li>'
  + '<li>Enter the code you receive below</li></ol>'
  + '</div>'
  + '<div><input type="text" id="bemdic-sub-code" placeholder="Enter code e.g. A3F2-B1C4" maxlength="20" style="width:80%;padding:10px;border:2px solid #ddd;border-radius:8px;font-size:16px;text-align:center;letter-spacing:2px;margin:8px 0;outline:none;"></div>'
  + '<div id="bemdic-pw-error" style="color:crimson;font-size:13px;min-height:18px;margin:4px 0;"></div>'
  + '<div><button id="bemdic-activate-btn" style="display:inline-block;padding:10px 28px;border:none;border-radius:8px;font-size:15px;cursor:pointer;margin:6px 4px;background:#084;color:#fff;">Activate Code</button>'
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

  // --- Mobile Money Pay button ---
  var momoBtn = document.getElementById('bemdic-momo-btn');
  if(momoBtn) momoBtn.addEventListener('click', function(){
    var phone = document.getElementById('bemdic-momo-phone').value.trim();
    var statusEl = document.getElementById('bemdic-momo-status');
    if(!phone || phone.length < 10){
      statusEl.style.color = 'crimson';
      statusEl.textContent = 'Please enter a valid phone number';
      return;
    }
    momoBtn.disabled = true;
    momoBtn.textContent = 'Processing...';
    statusEl.style.color = '#555';
    statusEl.textContent = 'Initiating payment...';

    var _api = window._bemdic_apiCall;
    var _did = window._bemdic_getDeviceId;
    if (!_api || !_did) { statusEl.style.color='crimson'; statusEl.textContent='Payment not available'; momoBtn.disabled=false; momoBtn.textContent='Pay '+PAYMENT_AMOUNT+' Now'; return; }

    _api('/subscribe/pay', {
      phone: phone,
      device_id: _did()
    }, function(resp){
      if(resp.ok){
        statusEl.style.color = '#2e7d32';
        statusEl.textContent = resp.message || 'Check your phone for payment prompt!';
        momoBtn.textContent = 'Waiting for confirmation...';
        // Poll for payment verification
        var txRef = resp.tx_ref;
        var pollCount = 0;
        var pollInterval = setInterval(function(){
          pollCount++;
          _api('/subscribe/verify', {
            tx_ref: txRef,
            device_id: _did()
          }, function(vResp){
            if(vResp.ok && vResp.status === 'successful' && vResp.subscription_code){
              clearInterval(pollInterval);
              if(activateSubscription(vResp.subscription_code)){
                statusEl.style.color = '#2e7d32';
                statusEl.innerHTML = '<b>Payment successful!</b> Enjoy ' + SUB_DAYS + ' days of unlimited access!';
                momoBtn.style.display = 'none';
                setTimeout(function(){
                  document.body.removeChild(modal);
                  var freeBar = document.getElementById('bemdic-free-bar');
                  if(freeBar) freeBar.parentNode.removeChild(freeBar);
                  var wl = document.getElementById('words-loader');
                  var pb = document.getElementById('pagination-btns-wrapper');
                  if(wl) wl.style.display = 'block';
                  if(pb) pb.style.display = 'block';
                  if(typeof _original_load_dictionary === 'function') _original_load_dictionary();
                }, 2000);
              }
            } else if(vResp.ok && vResp.status === 'failed'){
              clearInterval(pollInterval);
              statusEl.style.color = 'crimson';
              statusEl.textContent = 'Payment failed. Please try again.';
              momoBtn.disabled = false;
              momoBtn.textContent = 'Pay '+PAYMENT_AMOUNT+' Now';
            }
            // else still pending, keep polling
          });
          // Stop polling after 3 minutes
          if(pollCount > 36){
            clearInterval(pollInterval);
            statusEl.style.color = '#e65100';
            statusEl.textContent = 'Payment timed out. If you paid, contact '+PAYMENT_NUMBER;
            momoBtn.disabled = false;
            momoBtn.textContent = 'Try Again';
          }
        }, 5000); // poll every 5 seconds
      } else {
        statusEl.style.color = 'crimson';
        statusEl.textContent = resp.error || 'Payment failed. Try again.';
        momoBtn.disabled = false;
        momoBtn.textContent = 'Pay '+PAYMENT_AMOUNT+' Now';
      }
    });
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
    var daysLeft = getSubDaysLeft();
    var daysText = daysLeft === 1 ? 'day' : 'days';
    subItem.innerHTML = '<span>&#11088;</span> Premium <span style="background:#084;color:#fff;padding:2px 8px;border-radius:10px;font-size:12px;margin-left:4px;">' + daysLeft + ' ' + daysText + ' left</span>';
    subItem.style.color = '#084';
    subItem.style.fontWeight = 'bold';
  } else {
    subItem.innerHTML = '<span>&#11088;</span> Get Unlimited access ('+PAYMENT_AMOUNT+'/4 days)';
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
      var daysLeft = getSubDaysLeft();
      var daysText = daysLeft === 1 ? 'day' : 'days';
      subItem.innerHTML = '<span>&#11088;</span> Premium <span style="background:#084;color:#fff;padding:2px 8px;border-radius:10px;font-size:12px;margin-left:4px;">' + daysLeft + ' ' + daysText + ' left</span>';
      subItem.style.color = '#084';
      subItem.style.fontWeight = 'bold';
    } else {
      subItem.innerHTML = '<span>&#11088;</span> Get Unlimited access (' + PAYMENT_AMOUNT + '/4 days)';
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