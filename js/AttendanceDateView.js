  /*Created by DingDang on 2017/3/10.
  Copyright © 2017年 DingDang. All rights reserved.*/

/*自动登录相关*/
function loginRequest(url, callback){

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
        console.log(window.location);
        requestAttendanceDetail(totalPages);
    }
    else if(code == '-7'){
        var errorMsg = "<strong>之前登录未正常退出,请在之前浏览器地址栏执行<br/>";
        errorMsg += "<a id='copySignOffLink' title='拷贝地址' href='#'>拷贝退出地址到原浏览器</a></strong>";
        errorMsg += "<textarea id='textarea' rows='1' cols='40'>";
        errorMsg += signOffUrl;
        errorMsg += "</textarea>";
        showOPResult(errorMsg);
        copySignOffToClipboard();
    }
    else{
        var errorMsg = "<strong>无法自动登录获取数据，请<a href='options.html'>检查账号密码</a>是否有误</strong>";
        errorMsg += "<br/>";
        showOPResult(errorMsg);
    }
}

function copySignOffToClipboard() {
        document.getElementById('copySignOffLink').addEventListener('click', function(e) {

        document.getElementById('textarea').select();
        var successful = document.execCommand('copy');
    });
}

var hometUrl = 'domainOfPunchSite';
var signOffUrl = hometUrl + "Account/SignOff";

function autoLogin(){
    var loginUrl = hometUrl + "/Account/SignIn";
    loginRequest(loginUrl,loginResult);
}

/*导航相关*/
var pageIdPrefix = 'go2Page';
function showNavigator() {
    var navigatorDiv = document.getElementById('navigator');
    var childs = navigatorDiv.childNodes;
    if(navigatorDiv.childElementCount != 0)
        return;

    for (var i = totalPages; i >= 1; i--) {
            var a = document.createElement('a');
            a.id = pageIdPrefix + i;
            a.href = '#';
            a.innerHTML = i;
            a.addEventListener('click', function(e) {
                if(this.innerHTML != currentPage){
                    currentPage = this.innerHTML;
                    requestAttendanceDetail(this.innerHTML);
                }
        });
        navigatorDiv.appendChild(a);
    }

    var goPunchSite = document.createElement('a');
    goPunchSite.href = hometUrl;
    goPunchSite.target = '_blank';
    goPunchSite.innerHTML = '登录考勤站点';

    navigatorDiv.appendChild(goPunchSite);

    navigatorDiv.style.display = 'block';       
}

function setPageIndicator() {
    for (var i = totalPages; i >= 1; i--) {
        var a = document.getElementById(pageIdPrefix + i);
        a.style.textDecoration = (i == currentPage ? "none" : "underline");
    }
}
/*获取刷卡明细相关*/
function httpRequest(url, callback){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            callback(xhr.responseText);
        }
    }
    xhr.send();
}

function showOPResult(result){
     document.getElementById('dateView').innerHTML = result;
}

var hasRetryFirstPage = false; //防止无数据时死循环
function requestAttendanceCallBack(result){
    
    console.log(result);
    if(result.indexOf("欢迎登陆《易勤WEB考勤管理软件》V7.0") >= 0)
        autoLogin();    //未登录
    else if(result.indexOf("无数据") >= 0){
        totalPages -= 1;    //无数据说明该同学调休比较多天，尝试取前一页的数据
        if(totalPages < 1){
            totalPages = 1;
            hasRetryFirstPage = true;
        }
        if(!hasRetryFirstPage){
            currentPage = totalPages;
            requestAttendanceDetail(totalPages);
        }  
        else{
            showOPResult(result);   
            setCardDetailFilter();
            window.location.reload();
        }
    }
    else{
        result = result.replace(/福建智度考勤机/g,"小叮当考勤🐓");
        showOPResult(result);
        showNavigator();
        setPageIndicator();
    }
}

function requestAttendanceDetail(pageIndex){
    var detailUrl = hometUrl + 'Staff/EmpRegisterData/RefreshRecordDetail?PageIndex=' + pageIndex;
    httpRequest(detailUrl, requestAttendanceCallBack);
}

function setCardFilterCallback(result) {
    if(result.indexOf('issuccess') < 0){
        console.log('setCardFilter error' + result);
    }
}

function setCardDetailFilter () {
    var cardDetailFilterUrl = hometUrl + 'Staff/EmpRegisterData/SetCardDetailFilter';
    var myDate = new Date();
    var day = myDate.getDate();
    var month = myDate.getMonth() + 1;
    var year = myDate.getFullYear();   
    var daycount = new Date(myDate.getFullYear(), month, 0).getDate();
    var dateValue = year + "-" + month + "-" + 1;
    dateValue += " - ";
    dateValue += year + "-" + month + "-" + daycount;
    var setCardFilterUrl = hometUrl + '/Staff/EmpRegisterData/SetCardDetailFilter?Date=' + dateValue;
    httpRequest(setCardFilterUrl, setCardFilterCallback);
}

// var timestamp = currentDate.valueOf();
var workDays = 22;
countWorkDays();
function countWorkDays() {
    var endDate = new Date();
    var beginDate = new Date(endDate.getFullYear(),endDate.getMonth(),1);
    var workDayVal = (endDate - beginDate)/86400000 + 1;  
    var remainder = workDayVal % 7;
    var divisor = Math.floor(workDayVal / 7);  
    var weekendDay = 2 * divisor;  
      
    var nextDay = beginDate.getDay();  
    for(var tempDay = remainder; tempDay>=1; tempDay--) {  
        //第一天不用加1  
        if(tempDay == remainder) {  
            nextDay = nextDay + 0;  
        } else if(tempDay != remainder) {  
            nextDay = nextDay + 1;  
        }  
        //周日，变更为0  
        if(nextDay == 7) {  
            nextDay = 0;  
        }  
        //周六日  
        if(nextDay == 0 || nextDay == 6) {  
            weekendDay = weekendDay + 1;
        }  
    }  
    //实际工时（天） = 起止日期差 - 周六日数目。  
    workDays = workDayVal - weekendDay; 
}

var totalPages = Math.floor( workDays / 5) + ((workDays % 5)!= 0 ? 1 : 0);   //5天10条数据一页
var currentPage = totalPages;
requestAttendanceDetail(totalPages);


