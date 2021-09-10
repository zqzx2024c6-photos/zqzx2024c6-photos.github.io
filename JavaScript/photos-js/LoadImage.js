// Copyright Hugang Li,Yichen Xu # lihugang@outlook.com xyc_35@163.com
// Server:GitHub
// ORIGIN:zqzx2024c6.github.io
function GetURL(ImageId,callback,clog)
{
  if (typeof clog == "undefined")
    clog = false;
  //默认不阻塞，向下兼容
  if(!GetConfig("cdn"))
  {
    var url = "https://raw.githubusercontent.com/" + getTemplate("github_repo") + "/main/"+ImageId;
    //构建URL
    var method = "API";
  } else {
    var url = "https://cdn.jsdelivr.net/gh/" + getTemplate("github_repo") + "/"+ImageId;
    //构建URL
    var method = "CDN";
  };
  //判断是否使用CDN加速
  var MaxRequestLimit = GetConfig("MaxRequestLimit");
  //得到最大请求数
  var CurrentRequestList = window.cqlist;
  //得到当前请求列表
  if (typeof CurrentRequestList == "undefined")
    CurrentRequestList = [];
  if (window.XMLHttpRequest)
    var xhr = new XMLHttpRequest();
  else
    var xhr = new ActiveXObject("Microsoft.XMLHTTP");
  //构建一个XHR请求
  xhr.open("GET",url,true);
  //打开请求
  console.log("[Basic infomation] RequestLimit:" + MaxRequestLimit);
  console.log("[Basic infomation] CurrentRequest:" + CurrentRequestList.length);
  if (MaxRequestLimit > CurrentRequestList.length)
  {
    //如果没有达到最大请求数
    //请求
    var pid = parseInt(Math.random().toString().substring(3)).toString(16);
    //生成请求ID
    CurrentRequestList[CurrentRequestList.length] = {url:url,method:"GET",async:true,pid:pid,xhr:xhr,ImageId:ImageId};
    //更新请求列表
    window.cqlist = CurrentRequestList;
    //提交请求列表到全局变量
    if (method == "CDN" || true)
    {
      //使用CDN加速
      xhr.responseType = "blob";
      //将返回类型设为Blob
    };
    xhr.onreadystatechange = function(){
      //Listen事件
      if (xhr.readyState == 4)
      {
        console.log("[Request infomation] The request have finished. " + url + "\nRequest ID:" + pid + "\nReturnStatus:" + xhr.status);
        //请求完成
        var i = 0;
        var CurrentRequestList = window.cqlist;
        //获得当前请求清单
        while(i < CurrentRequestList.length)
        {
          if (CurrentRequestList[i].pid == pid)
          {
            //PID匹配
            CurrentRequestList.splice(i,1);
            //删除当前请求列表
          };
          i++;
        };
        window.cqlist = CurrentRequestList;
        //更新全局变量
        if (xhr.status == 200)
        {
          
          //请求成功
          if (method == "CDN" || true)
          {
            //使用CDN加速
            if (window.Blob)
            {
	console.log("[Image infomation] SOURCE_URL: " + url + "\nImageId:" + ImageId + "\nSize:%c" + xhr.response.size,"color:red");
              //支持Blob
              var blob_url = window.URL.createObjectURL(xhr.response);
              setTimeout(function(){
                window.URL.revokeObjectURL(blob_url);
                console.log("[Image infomation] ImageId:" + ImageId + "\nBlob URL:" + blob_url + "\nSource URL:" + url);
              },3000);
              callback({status:200,url:blob_url});
              //返回BlobURL
            } else {
              callback({status:200,url:url});
              //不支持Blob,返回源URL
            };
          } else {
            //使用API
          };
        } else {
          //请求失败
          callback({status:xhr.status});
        };
      };
    };
    console.log("[Request infomation] Send the request: " + url + "\nRequest ID:" + pid);
    xhr.send();
    //发送请求
  } else {
    //请求挂起
    var s = setInterval(function(){
      //监听
      MaxRequestLimit = GetConfig("MaxRequestLimit");
      if (MaxRequestLimit > window.cqlist.length)
      {
        //如果有空余请求
        clearInterval(s);
        if (!clog)
          GetURL(ImageId,callback,clog);
        //反复调用函数
      };
    },200);
    window.cloglist[window.cloglist.length] = s;
    //记录监听程序ID  
    window.cloglist_obj[window.cloglist_obj.length] = {ClogId:s,ImageId:ImageId};
  };
};
window.cloglist_obj = [];
function render_img(){
	document.getElementById("images").innerHTML = "";
	//渲染图片前先清空页面
	var image_json = sessionStorage.getItem("image_json");
	image_json = JSON.parse(image_json);
	//获得图片信息，并解析
	if (location.search == "" || location.search == "?")
	{
		//没有提交参数
	} else {
		var query = ParseURLArgvment();
		if (typeof query["query"] != "undefined")
		{
			//查询人物
			var str = decodeURI(query["query"]);
			console.log("[Basic Infomation] Search argument:%c" + str,"color:blue");
			var i = 0;
			var result = [];
			while (i < image_json.length)
			{
				var j = 0;
				//遍历JSON对象
				//console.log("%c[Debugger]","color:#00ff00;background:black",image_json[i],image_json[i].list);
				var arr = image_json[i].list;
				if (arr == null || typeof(arr) == "undefined")
				{
					//JSON数据中不存在人物列表，为了向下兼容，跳过此项
					i++;
					continue;
				};
				while (j < arr.length)
				{
					//得到JSON对象的人物列表
					arr[j] = arr[j].toString();
					{
						//查询参数是字符串
					
						//console.log("%c[Debugger]","color:#00ff00;background:black",arr[j],number);
						if (arr[j] == str)
						{
							result[result.length] = image_json[i];
							//Copy
						};
					 };
						//查询参数是正则表达式
					try {
						str = new RegExp(str);
						//字符串化正则表达式
						console.log("%c[Debugger]","color:#00ff00;background:black",arr[j],str,arr[j].match(str),typeof arr[j],typeof str);
						
						if (arr[j].match(str) != null)
						{
							//包含指定人物
							result[result.length] = image_json[i];
							break;
							//复制当前项JSON信息的result数组	
						};
					} catch(e) {
						console.log(e);
					};
					j++;
				};
				i++;
			};
			image_json = result;
			//覆盖数组
		};
		if (typeof query["sort"] != "undefined")
		{
			if (query["sort"] == "later")
			{
				//按时间从晚到早排序
				//不做改变
			};
			if (query["sort"] == "earlier")
			{
				//按时间从早到晚排序
				var result = [];
				var i = image_json.length-1;
				while (i > -1)
				{
					result[result.length] = image_json[i];
					i--;
				};
				//覆盖数组
				image_json = result;
			};
		};
	};
	console.log("%c[Query infomation] Match results:","background:black;color:white",image_json);
	var i = (parseInt(location.hash.substring(6))-1)*parseInt(getTemplate("photos_per_page"));
	var j = 0;
	//按页渲染图片，每页 {{ photos_per_page }} 张
	var arr = [];
	while (i < image_json.length && j < getTemplate("photos_per_page"))
	{
		j++;
		var date = document.createElement("span");
		date.className = "image-date";
		date.id = "date-" + parseInt(Math.random().toString().substring(3)).toString(16);
		date.style["font-size"] = "1.8em";
		date.innerHTML = image_json[i].date + "<br>";
		document.getElementById("images").appendChild(date);
		//渲染日期
		if (image_json[i].MIME == "video/*" && typeof(image_json[i].MIME) != "undefined")
		{
			//文件类型是视频
			try {	
				/*
				var frame = document.createElement("iframe");
				//创建一个框架
				if (typeof frame == "undefined" || frame == null)
					throw("The browser not support the frame.");
				frame.id = "video-" + parseInt(Math.random().toString().substring(3)).toString(16);
				frame.className = "video-element";
				frame.setAttribute("height","960px");
				frame.setAttribute("width","1280px");
				frame.setAttribute("data-src",btoa(image_json[i].ImageId));
				document.getElementById("images").appendChild(frame);
				//把框架添加进页面中
				//封装参数
				//解析图片资源信息
				if (GetConfig("cdn")) {
					//使用CDN加速
					var src = "https://cdn.jsdelivr.net/gh/" + getTemplate("github_repo") + "/" + image_json[i].ImageId;
					//构建URL
				} else {
					var src = "https://raw.githubusercontent.com/" + getTemplate("github_repo") + "/" + image_json[i].ImageId;
					//构建URL
				};
				frame.contentWindow.window.name = JSON.stringify({player:"p-player-v1.0",source:btoa(src),encode_method:"base64",load_method:"blob",control:"player-default",volume:100,autoplay:false,currentTime:0});
				frame.contentWindow.location.href = "https://cdn2021.github.io/p-player/embed-player";
				//加载播放器
				*/
				var ele = document.createElement("video"); //创建一个视频元素
				ele.src = (GetConfig("cdn")?("https://cdn.jsdelivr.net/gh/" + getTemplate("github_repo") + "/" + image_json[i].ImageId):("https://raw.githubusercontent.com/" + getTemplate("github_repo") + "/" + image_json[i].ImageId));
				ele.setAttribute("controls","true")
				document.querySelector("#images").appendChild(ele);
			} catch (err) {
				console.error(err);
				var frame = document.createElement("span");
				//不支持框架
				frame.id = "video-" + parseInt(Math.random().toString().substring(3)).toString(16);
				frame.className = "video-element-not-support-frame";
				frame.setAttribute("data-src",btoa(image_json[i].ImageId));
				frame.innerHTML = "您的浏览器不支持此框架，视频控件无法加载，请更换浏览器";
				frame.style["font-size"] = "1.2em";
				frame.style.color = "red";
				document.getElementById("images").appendChild(frame);
			};
			document.getElementById("images").appendChild(document.createElement("br"));
			var video_letter = document.createElement("span");
			video_letter.innerHTML = "该文件类型是视频，我们将会为您加载播放器，请耐心等待<br>";
			document.getElementById("images").appendChild(video_letter);
		} else {
			var img = document.createElement("img");
			img.className = "image-element";
			img.id = "img-" + parseInt(Math.random().toString().substring(3)).toString(16);
			var letter_status_id = "img-letter-status-" + parseInt(Math.random().toString().substring(3)).toString(16);
			img.setAttribute("data-letter-status-id",letter_status_id);
			img.setAttribute("height","480px");
			img.setAttribute("width","640px");
			img.setAttribute("data-src",btoa(image_json[i].ImageId));
			img.setAttribute("data-src-decode",image_json[i].ImageId);
			document.getElementById("images").appendChild(img);
			img.onmouseover = function(){
				var pid = this.id;
				var data_letter_status_id = this.getAttribute("data-letter-status-id");
				//document.getElementById(data_letter_status_id).innerHTML = "状态：准备请求服务器资源";
				var i = 0;
				while (i < arr.length)
				{
					if (arr[i] == pid)
					{
						//图片被重复加载，不再请求
						return;
					};
					i++;
				};
				//把图片ID加进列表中
				arr[arr.length] = pid;
				var ImageId = atob(this.getAttribute("data-src"));
				//得到图片地址
				document.getElementById(pid).src = "https://image.uisdc.com/wp-content/uploads/2015/05/load20150504-5.gif";
				//显示图片正在加载
				var s = setInterval(function(){
					//监听图片请求情况
					var CurrentRequestList = window.cqlist;
					//得到当前请求记录表
					var i = 0;
					var bool = false;
					while (i < CurrentRequestList.length)
					{
						if (CurrentRequestList[i].ImageId == ImageId)
						{
							bool = true;
							//ImageId匹配
							document.getElementById(data_letter_status_id).innerHTML = "状态：请求已发出，等待服务器响应";
						};
						i++;
					};
					i = 0;
					if (!bool)
					{
						var ClogList = window.cloglist_obj;
						//得到堵塞请求记录表
						while (i < ClogList.length)
						{
							if (ClogList[i].ImageId == ImageId)
							{	
								//ImageId匹配
								document.getElementById(data_letter_status_id).innerHTML = "状态：请求已进入队列，正在排队";
							};
							i++;
						};
					};
					if (document.getElementById(pid).src.substring(0,28) == "https://cdn.jsdelivr.net/gh/" || document.getElementById(pid).src.substring(0,34) == "https://raw.githubusercontent.com/" || document.getElementById(pid).src.substring(0,5) == "blob:")
					{
						//图片已加载
						document.getElementById(data_letter_status_id).innerHTML = "状态：请求完毕，图片已加载";
						clearInterval(s);
						//关闭监听
					};
				},200);
				GetURL(ImageId,function(argv){
					//请求图片
					if (argv.status == 200)
					{ 
						//请求成功，显示图片
						var page_width = window.first_page_width?window.first_page_width:(window.innerWidth?window.innerWidth:document.body.clientWidth);
						var page_height = window.first_page_height?window.first_page_height:(window.window.innerHeight?window.innerHeight:document.body.clientHeight);
						//得到页面大小
						window.first_page_width = window.first_page_width?window.first_page_width:page_width;
						window.first_page_height = window.first_page_height?window.first_page_height:page_height;
						//Save
						var img = document.createElement("img");
						img.src = argv.url;
						img.onload = function(){
							var img_width = img.width;
							var img_height = img.height;
							//得到图片大小
							var current_height = (page_height > img_height)?img_height:page_height;
							//得到渲染图片大小
							var img_radio = img_width / img_height;
							//得到图片宽与高之比
							var current_width = current_height * img_radio;
							document.getElementById(pid).height = current_height;
							document.getElementById(pid).width = current_width;
							document.getElementById(pid).setAttribute("data-current-height",current_height);
							document.getElementById(pid).setAttribute("data-current-width",current_width);
							document.getElementById(pid).setAttribute("data-origin-height",img_height);
							document.getElementById(pid).setAttribute("data-origin-width",img_height);
							document.getElementById(pid).setAttribute("data-page-height",page_height);
							document.getElementById(pid).setAttribute("data-page-width",page_height);
	
							//渲染图片，设置图片大小
							document.getElementById(pid).src = argv.url;
							document.getElementById(pid).onerror = function(){
								//加载图片时发生错误
								GetURL(ImageId,function(argv2){
									if (argv2.status == 200)
										document.getElementById(pid).src = argv2.url;
									else
										document.getElementById(pid).src = "https://tse4-mm.cn.bing.net/th/id/OIP.0WZKH9lCcFtu_J8U9UuDEAHaHa?pid=ImgDet&w=2000&h=2000&rs=1";
								});
							};
						};
					} else {
						//请求失败，显示错误
						document.getElementById(pid).src = "https://tse4-mm.cn.bing.net/th/id/OIP.0WZKH9lCcFtu_J8U9UuDEAHaHa?pid=ImgDet&w=2000&h=2000&rs=1";
						console.log("[Error:Cannot load the image] ImageId:" + atob(document.getElementById(pid).getAttribute("data-src")));
					};
				},window.geturl_clog);
				if (window.geturl_clog)
					arr = [];
			};	
			img.onclick = img.onmouseover;
			//渲染图片
			document.getElementById("images").appendChild(document.createElement("br"));
			var letter = document.createElement("span");
			letter["font-size"] = "0.8em";
			letter.innerHTML = "<span class=image-element.child.letter.status id=" + letter_status_id + " style='color:red'>状态：等待用户点击</span>   ";
			if (!UseCDN)
				letter.innerHTML += "图片大小:" + image_json[i].size + "字节 预计加载用时:" + (image_json[i].size/DownloadSpeed()).toFixed(0) + "秒 请耐心等待 <a class=image-download-href href=https://raw.githubusercontent.com/" + getTemplate("github_repo") + "/main/" + image_json[i].ImageId + " target=_blank download>下载</a>";
			else
				letter.innerHTML += "图片大小:" + image_json[i].size + "字节 预计加载用时:" + (image_json[i].size/DownloadSpeed()).toFixed(0) + "秒 请耐心等待 <a class=image-download-href href=https://cdn.jsdelivr.net/gh/" + getTemplate("github_repo") + "/" + image_json[i].ImageId + " target=_blank  download>下载</a>";
			letter.innerHTML += "     <input type=button value=全屏 onclick=javascript:Image_FullScreen('" + btoa(image_json[i].ImageId) +"') style='display:none;'><br>";
			document.getElementById("images").appendChild(letter);
			//渲染文字
		}
		i++;
	};
	if (i == image_json.length)
	{
		document.getElementById("next_button").disabled = true;
		var end = document.createElement("div");
		//创建一个结尾标记
		end.style.color = "red";
		end.style["font-size"] = "1.5em";
		end.innerHTML = "<br><hr>没有更多内容了！";
		document.getElementById("images").appendChild(end);
	};
	//渲染版权
	var copyright = document.createElement("div");
	copyright.style["background-image"] = 'url("https://cdn.jsdelivr.net/gh/pig-cmd/pig-cmd.github.io/eso1242a/eso1242a-screen.jpg")';
	copyright.style.color = "yellow";
	copyright.style["text-align"] = "center";
	copyright.style.width = "100%";
	copyright.innerHTML = "<hr><br><br><br>版权所有 <span style='color:black;background:white'>{{ copyright }}</span><br><br>如果你想为这个项目增添一些照片，请向邮箱{{ offical_mail }}发送邮件，并在附件中附加照片，谢谢！<br>照片来自 {{ photos_from }}<br>基于GitHub Pages搭建<br>内容储存服务器 raw.githubusercontent.com<br>全球CDN加速节点 cdn.jsdelivr.net<br>开发语言：HTML(HTML5.0) JavaScript(ECMAScript6) CSS(CSS1.0)<br><br><br>背景图片来自于ESO<br><br><br><span style='font-size:0.3em'>条条大路通川陀，群星尽头，此之谓也</span><br><br><br><br><br>";
	copyright.id = "copyright";
	document.getElementById("images").appendChild(copyright);

	var i = 0;
	var ele = document.getElementsByClassName("image-element");
	while (i < ele.length)
	{
		//模拟用户点击元素（直接加载缓存文件，不需用户点击）
		ele[i].click();
		i++;
	};
	i = 1;
	var ele = document.getElementsByClassName("image-date");
	while (i < image_json.length && i < 11)
	{
		if (ele[i].innerHTML == ele[i-1].innerHTML)
		{
			ele[i].style.display = "none";
			//如果这张照片与前一张照片日期相同，则隐藏这张照片的时间
		};	
		i++;	
	};
	

/*
	i = 0;
	setTimeout(function(){
		//200毫秒后阻止所有ajax请求（无缓存请求）
		var cql = window.cqlist;
		window.geturl_clog = true;
		window.cqlist = [];
		while (i < cql.length)
		{
			cql[i].xhr.abort();
			//阻止请求
			i++;
		};
		i = 0;
		var ele = document.getElementsByClassName("image-element");
		while (i < ele.length)
		{
			if (ele[i].src == "https://image.uisdc.com/wp-content/uploads/2015/05/load20150504-5.gif" || ele[i].src == "https://tse4-mm.cn.bing.net/th/id/OIP.0WZKH9lCcFtu_J8U9UuDEAHaHa?pid=ImgDet&w=2000&h=2000&rs=1")
			{
				//如果图片显示正在加载的动图，将地址设为空
				ele[i].src = "https://gss0.baidu.com/-vo3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/6a600c338744ebf82fb24242daf9d72a6159a78f.jpg";
			}
			i++;
		};
		setTimeout(function(){
			window.geturl_clog = false;
		},500);
	},200);
*/	
};
function AbortRequest()
{
	var i = 0;
	var v_cloglist = window.cloglist;
	//得到监听代码段ID
	if (!(typeof v_cloglist != "object" || typeof(v_cloglist.length) == "undefined"))
	{
		//监听代码段ID是数组
		while (i < v_cloglist.length)
		{
			clearInterval(v_cloglist[i]);
			//关闭监听
			i++;
		};
		window.cloglist = [];
		//清空监听代码段ID数组
	} else throw("[Error:Function AbortRequest] Connot close the interval.");
	i = 0;
	var v_cqlist = window.cqlist;
	//得到当前请求数据存储数组
	if (!(typeof v_cqlist != "object" || typeof(v_cloglist.length) == "undefined"))
	{
		//当前请求数组储存是数组
		while (i < v_cqlist.length)
		{
			v_cqlist[i].xhr.abort();
			//中断请求
			i++;
		};
	} else throw("[Error:Function AbortRequest] Connot abort the request.");
};
