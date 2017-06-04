/*Created by DingDang on 2017/3/10.
  Copyright © 2017年 DingDang. All rights reserved.*/
  
chrome.storage.sync.get(['userName', 'password'], function(userInfo) {
	  document.getElementById('userName').value = userInfo.userName ? userInfo.userName : '027';
      document.getElementById('password').value = userInfo.password ? userInfo.password : '';
    });

document.getElementById('save').onclick = function(){

	  chrome.storage.sync.set({'userName': document.getElementById('userName').value, 
							 'password': document.getElementById('password').value}, function() {
      console.log('userInfo saved');
      window.close();
    });
}

document.getElementById('showPassword').onclick = function(){
	document.getElementById('password').type = document.getElementById('showPassword').checked ? 'text':'password';
}