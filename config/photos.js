window.template = {
	//图片信息储存在/data/photos-list.json 请自行修改
	/*
		图片信息格式：
		数组[
			{
				"date":当前日期,
				"ImageId":这张图片在上传到GitHub时的文件名,
				"size":图片占用空间（单位：Byte字节）,
				"list":[
					名字,名字,名字
				]
			},{
				......
			},{
				......
			}
		]
	*/
	//下面是模板配置信息
	page_title:"Test",               //网页在标签栏中的名字
	top_letters:"Test",             //大标题
	open_image_base:"<input type=button value='打开图床(Based on GitHub)' onclick=javascript:window.open('https://www.github.com/xxx/xxx','_blank');>",               //图库在GitHub上的地址(GitHub URL)
	copyright:"(c) <a href=https://github.com/xxx target=_blank>xxx<img src=github.ico height=16px width=16px></a>",               //版权信息
	offical_mail:"lihugang@outlook.com",                         //官方邮箱
	photos_from:"Test",                                                    //图片来源信息
	github_repo:"xxx/xxx",                                               //用户名/仓库名
	photos_per_page:10,                                                 //每页几张图片
	download_photos_url:"https://codeload.github.com/xxx/xxx/zip/refs/heads/main",                   //下载图片地址
	
	

};
setInterval(fillTemplate,500);
//填充模板时间，单位是毫秒ms

var persons = ["testcase1","testcase2","testcase3"];
//名单

//渲染过滤选项

{
	var html = "<option value=>All</option>";
	var i = 0;
	while (i < persons.length){
		html += "<option value=" + persons[i] + ">" + persons[i] + "</option>";
		i++;
	};
	window.template["query_html_element"] = html;
};
