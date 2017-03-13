/*Created by DingDang on 2017/3/10.
  Copyright © 2017年 DingDang. All rights reserved.*/
  
function setLoginInfoFromStorage(){
	chrome.storage.sync.get(['userName', 'password'], function(userInfo) {
		  document.getElementById('userName').value = userInfo.userName ? userInfo.userName : '027';
	      document.getElementById('password').value = userInfo.password ? userInfo.password : '';
	    });
}

//添加记住密码选项
function addRememberPasswordCheckBox(){

	var checkBox = document.createElement("input");
	checkBox.setAttribute("type","checkbox");
	checkBox.setAttribute("id","remPassword");
	checkBox.checked = true;
	checkBox.style.marginLeft = "40px";

	var li = document.getElementsByClassName("loginbtn")[0].parentNode;
	li.appendChild(checkBox);

	var lable = document.createElement("lable");
	var text = document.createTextNode("记住密码");
	lable.appendChild(text);
	lable.style.color = "red";
	lable.style.fontSize = "18pt";
	// lable.style.marginLeft = "20px";
	lable.style.paddingTop = "4px";

	li.appendChild(lable);
}

//登录相关
function httpRequest(url, callback){

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type","application/json;charset=utf-8");
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            callback(xhr.responseText);
        }
    }
    
    chrome.storage.sync.get(['userName', 'password'], function(userInfo) {

    	var loginInfo = {};
    	loginInfo.loginName = userInfo.userName;
    	loginInfo.password = userInfo.password;
    	 // userInfo.isRemember = document.getElementById('isRemember').value;
	    loginInfo.isRemember = 'undefine';

	    var string = JSON.stringify(loginInfo);
	    xhr.send(string);

    });
}

function loginResult(code){
	console.log(code);
	if(code == '1'){
		//登录成功
		window.location.href = homeDefaultUrl;
	}
	else{

	}
}

var homeDefaultUrl = '/home/default';

function autoLogin(){
	var loginUrl = "/Account/SignIn";
	httpRequest(loginUrl,loginResult);
}

if(window.location.pathname == '/' || window.location.pathname == '/Account/SignIn'){
	setLoginInfoFromStorage();
	addRememberPasswordCheckBox();
	autoLogin();
}
else if(window.location.pathname == homeDefaultUrl){
	console.log("登录成功");
}
