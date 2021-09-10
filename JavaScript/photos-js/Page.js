console.log("%c没事别研究别人接口了，好好做站去吧！","color:red");
var err = false;
if (typeof(window.JSON) == "undefined")
{
	//不支持JSON对象，自定义一个JSON解析器
	if (window.XMLHttpRequest)
		var xhr = new XMLHttpRequest();
	else
		var xhr = new ActiveXObject("Microsoft.XMLHTTP");
	xhr.open("GET","https://cdn2021.github.io/JSON.js",false);
	xhr.send();	
	eval(xhr.responseText);

};
onload = function(){
	var hash = location.hash;
	if (hash == "" || hash == "#")
	{
		//Hash为空
		location.hash = "#page/1";
		//默认加载第一页
	};
	if ((parseInt(hash.substring(6))) != (parseInt(hash.substring(6))))
	{
		//无法解析页码
		location.hash = "#page/1";
		//默认加载第一页
	};
	var qv = decodeURI(ParseURLArgvment().query);
	if (typeof(qv) != "undefined")
		document.querySelector("#query_value").value = qv;
	if (typeof(ParseURLArgvment().sort) != "undefined")
		document.querySelector("#sort_method").value = ParseURLArgvment().sort;
	init();
};
if (typeof(window.btoa) == "undefined")
{
	window.btoa = function(a) {
		return a;
	};
	window.atob = function(a) {
		return a;
	};
};
function init(){
  document.getElementById("back_button").disabled = false;
  document.getElementById("next_button").disabled = false;
  var page = location.hash.substring(6);
  page = parseInt(page);
  if (page < 2)
    document.getElementById("back_button").disabled = true;
    window.cqlist = [];
	//当前请求数据记录数组
    window.cloglist = [];
	//阻塞代码段记录数组
  document.getElementById("page_num").innerHTML = "第" +page + "页";
  document.getElementById("page_num2").innerHTML = page;
  console.log("[Basic Infomation] the " + page + "th page");
  var xhr = new XMLHttpRequest();
  //xhr.open("GET","https://cdn.jsdelivr.net/gh/zqzx2024c6/zqzx2024c6.github.io/image/list.json",false);
  xhr.open("GET","data/photos-list.json",false);
  xhr.send();
  //请求图片文件
  if (xhr.status == 200)
  {
    sessionStorage.setItem("image_json",xhr.responseText);
  } else return;
  document.getElementById("settings").innerHTML = "<span style='font-size:1.5em'>设置</span><br>全球CDN加速<input type=checkbox id=whether_CDN_box onclick=javascript:eval('UseCDN=!UseCDN'); checked><br><a href=https://cdn.jsdelivr.net/gh/zqzx2024c6/zqzx2024c6.github.io/image/cdn.pdf target=_blank><span style='font-size:0.8em'>什么是cdn</span></a><br>HTTP请求并发数<input type=number id=https_request_limit_area value=3><br><input type=button value=保存 onclick=javascript:config_save();>";
  document.getElementById("whether_CDN_box").checked = GetConfig("cdn");
  document.getElementById("https_request_limit_area").value = GetConfig("MaxRequestLimit");
  render_img();
};
InitConfig();
DownloadSpeed();
function GetConfig(str)
{
  var val = localStorage.getItem(str);
  if (Number(val).toString() == val)
    return Number(val);
  if (val == "true")
    return true;
  if (val == "false")
    return false;
  return val;
};
function InitConfig()
{
  if (GetConfig("cdn") == null)
    localStorage.setItem("cdn",true);
  if (GetConfig("MaxRequestLimit") == null)
    localStorage.setItem("MaxRequestLimit",3);
  //初始化配置
};
function config_save()
{
	localStorage.setItem("cdn",UseCDN);
	var mrl = document.getElementById("https_request_limit_area").value;
	mrl = parseInt(mrl);
	if (mrl != mrl)
		mrl = 0;
	localStorage.setItem("MaxRequestLimit",mrl);
	DownloadSpeed();
};
UseCDN = GetConfig("cdn");
console.log("[Basic infomation] UseCDN:" + UseCDN);
function Display_DownloadSpeed()
{
    var ds_f = Number(DownloadSpeed().toFixed(2));
    if (ds_f < 1024)
    {
      var ds = ds_f + "B/S";
    } else {
      if (ds_f < 1024*1024)
      {
        var ds = (ds_f / 1024).toFixed(2) + "KB/S";
      } else {
        if (ds_f < 1024*1024*1024)
        {
          var ds = (ds_f / 1024 / 1024).toFixed(2) + "MB/S";
        } else {
          if (ds_f < 1024*1024*1024*1024)
          {
            var ds = (ds_f / 1024 / 1024 / 1024).toFixed(2) + "GB/S";
          } else {
            var ds = (ds_f / 1024 / 1024 / 1024 / 1024).toFixed(2) + "TB/S";
          };
        };
      };
    };
    document.getElementById("p.DownloadSpeed.SonNode.JavaScript.Write.Node1").innerHTML = ds;
};
/*
*实时更新下载速度
*/
setTimeout(function(){
	setInterval(function(){
		window.dsp_cdn = undefined;
		window.dsp_api = undefined;
		DownloadSpeed();
	},400);
},10000);

function DownloadSpeed()
{
	if (GetConfig("cdn"))
	{
		if (typeof window.dsp_cdn == "undefined")
		{
			var img = document.createElement("img");
			var o_t = new Date().getTime();
			img.onload = function(){
				var c_t = new Date().getTime();
				var speed = 12482 / ((c_t - o_t)/1000);
				window.dsp_cdn = speed;
				console.log("[Basic infomation] Download Speed:" + speed + "byte/second [CDN]");
				Display_DownloadSpeed();
				return speed;
			};
			img.src = "https://cdn.jsdelivr.net/gh/pig-cmd/pig-cmd.github.io/img/c.png?pid=" + Math.random();
		} else {
			return window.dsp_cdn;
		};
	} else {
		if (typeof window.dsp_api == "undefined")
		{
			var img = document.createElement("img");
			img.src = "https://raw.githubusercontent.com/pig-cmd/pig-cmd.github.io/main/img/c.png?pid=" + Math.random();
			var o_t = new Date().getTime();
			img.onload = function(){
				var c_t = new Date().getTime();
				var speed = 12482 / ((c_t - o_t)/1000);
				window.dsp_api = speed;
				console.log("[Basic infomation] Download Speed:" + speed + "byte/second [SOURCE]");
				Display_DownloadSpeed();
				return speed;
			};
		} else {
			return window.dsp_api;
		};
	};
};
function back_page()
{
	AbortRequest();
	var page = parseInt(location.hash.substring(6));
	page -= 1;
	document.getElementById("page_num").innerHTML = "第" + page + "页";
	document.getElementById("page_num2").innerHTML = page;
	console.log("[Basic infomation] the " + page + "th page");
	location.hash = "#page/" + page;
	document.getElementById("back_button").disabled = false;
	document.getElementById("next_button").disabled = false;
	if (page < 2)
		document.getElementById("back_button").disabled = true;
	render_img();

};
function next_page()
{
	AbortRequest();
	var page = parseInt(location.hash.substring(6));
	page += 1;
	if (page < 2)
		document.getElementById("back_button").disabled = true;
	document.getElementById("page_num").innerHTML = "第" + page + "页";
	document.getElementById("page_num2").innerHTML = page;
	console.log("[Basic infomation] the " + page + "th page");
	location.hash = "#page/" + page;
	document.getElementById("back_button").disabled = false;
	document.getElementById("next_button").disabled = false;
	render_img();


};
function Image_FullScreen(ImageSource)
{
	ImageSource = atob(ImageSource);
	//解析图片资源信息
	if (GetConfig("cdn"))
	{
		//使用CDN加速
		var src = "https://cdn.jsdelivr.net/gh/" + getTemplate("github_repo") + "/" + ImageSource;
		//构建URL
	} else {
		var src = "https://raw.githubusercontent.com/" + getTemplate("github_repo") + "/" + ImageSource;
		//构建URL
	};
	var box = document.createElement("div");
	//构建显示图片用的框
	box.style.position = "fixed";
	box.style.top = "5%";
	box.style.left = "5%";
	box.style.height = "90%";
	box.style.width = "90%";
	//定位图片框
	box.style.background = "skyblue";
	//设置背景颜色
	box.id = "image-full-screen-box";
	//设置图片框ID
	box.overflow = "auto";
	//溢出时显示滑动条
	document.body.appendChild(box);
	//添加元素到文档
	var close_button = document.createElement("span");
	//构建关闭按钮
	close_button.setAttribute("data-element-id",btoa(box.id));
	//绑定图片框ID
	close_button.style.position = "absolute";
	close_button.style.top = "0%";
	close_button.style.right = "0%";
	//定位关闭按钮
	close_button.style.background = "red";
	//设置背景颜色
	close_button.innerHTML = "X";
	//设置关闭按钮文字
	close_button.addEventListener("click",function(){
		//监听关闭按钮点击事件
		var element_id = atob(this.getAttribute("data-element-id"));
		//解析图片框ID
		var element_object = document.querySelector("#" + element_id);
		//得到图片框的DOM对象
		if (element_object != null && typeof(element_object) != "undefined")
		{
			//判断对象是否为空
			document.body.removeChild(element_object);
			//删除元素
		};
	});
	//添加删除元素事件
	box.appendChild(close_button);
	//添加关闭按钮
	var img = document.createElement("img");
	//构建图片对象
	img.id = "image-full.screen-box.child.img";
	img.src = "https://image.uisdc.com/wp-content/uploads/2015/05/load20150504-5.gif";
	img.height = "480px";
	img.width = "640px";
	//设置图片大小
	box.append(img);
	//添加图片
	box.append(document.createElement("br"));
	//添加换行符
	var letter = document.createElement("span");
	//构建文字的对象
	letter.style.position = "absolute";
	letter.style.background = "white";
	letter.style.color = "red";
	letter.style.bottom = "0%";
	letter.style.right = "0%";
	letter.style["font-size"] = "1em";
	letter.innerHTML = "图片正在请求，请耐心等待";
	letter.id = "image-full-screen-box.child.letter";
	box.append(letter);
	if (window.XMLHttpRequest)
		var xhr = new XMLHttpRequest();
	else
		var xhr = new ActiveXObject("Microsoft.XMLHTTP");
	//构建一个xhr对象
	xhr.open("GET",src,true);
	xhr.responseType = "blob";
	//设置返回类型为Blob
	xhr.onreadystatechange = function(){
		//监听事件
		if (xhr.readyState == 1)
			letter.innerHTML = "服务器连接已建立，正在发送请求";
		if (xhr.readyState == 2)
			letter.innerHTML = "服务器已接受请求，等待响应";
		if (xhr.readyState == 3)
			letter.innerHTML = "服务器正在处理请求，请稍后";
		if (xhr.readyState == 4)
		{
			if (xhr.status == 200)
			{
				letter.innerHTML = "请求已完成，响应就绪，正在处理图片";
				var file = xhr.response;
				//得到Blob对象
				if (window.Blob)
				{
					//支持Blob
					var image_url = window.URL.createObjectURL(file);
					//得到Blob地址
					img.addEventListener("load",function(){
						//图片加载完成时，删除Blob地址
						window.URL.revokeObjectURL(image_url);
					});
				} else {
					//不支持Blob
					var image_url = src;
					//返回源地址
				};
				img.src = image_url;
				img.addEventListener("load",function(){
					var download_url = window.Blob?window.URL.createObjectURL(file):src;
					letter.innerHTML = "图片已加载 <a href=" + download_url + " target=_blank download>下载</a>";
					var image = document.createElement("img");
					//构建一个图片对象
					image.src = src;
					//加载链接
					image.onload = function(){
						var height = parseInt(image.height);
						var width = parseInt(image.width);
						//得到图片大小
						var page_height = parseInt(window.innerWidth?window.innerWidth:document.body.clientWidth);
						var page_width = parseInt(window.innerHeight?window.innerHeight:document.body.clientHeight);
						//得到网页大小
						var box_height = parseInt(page_height * 0.9);
						var box_width = parseInt(page_width * 0.9);
						console.log("[Basic Infomation]ClientHeight:" + page_height + "\nClientWidth:" + page_width);
						console.log("[Set the image size]BoxHeight:" + box_height + "\nBoxWidth:" + box_width + "\n\nImageHeight:" + height + "\nImageWidth:" + width);
						//得到图片框大小
						img.height = (box_height > height)?height:box_height;
						img.width = (((box_height > height)?height:box_height) * (width / height));
						letter.innerHTML = "<font color=black>图片尺寸<font color=green>" + height + "x" + width + "</font>图片缩放后尺寸<font color=green>" + img.height + "x" + img.width + "</font></font>" + "<br><font color=black>图片大小<font color=red>" + file.size + "</font>字节</font>     " + letter.innerHTML;
						console.log("[Set the image size] ImageHeight:" + ((box_height > height)?height:box_height) + "\nImageWidth:" + (((box_height > height)?height:box_height) * (width / height)));

					};
				});

			} else {
				letter.innerHTML = "错误：无法请求图片 HTTP状态码：" + xhr.status;
			};
				
		};
	};
	xhr.send();
	
};
function Query_JSON()
{
	var query_argument = document.querySelector("#query_value").value;
	//得到输入
	location.hash = "page/1";
	location.search = "query=" + query_argument + "&sort=" + ParseURLArgvment().sort;
	
};
function download_image()
{
	var a = document.createElement("a");
	a.href = getTemplate("download_photos_url");
	a.click();
};
function edit_sort_method(){
	var sort_method = document.querySelector("#sort_method").value;
	var obj = ParseURLArgvment();
	obj.sort = sort_method;
	location.hash = "page/1";
	if (typeof(obj.query) == "undefined")
		location.search = "?sort=" + obj.sort;
	else
		location.search = "?sort" + obj.sort + "&query=" + obj.query;
};

