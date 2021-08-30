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
	page_title:"2024届6班合影",               //网页在标签栏中的名字
	top_letters:"2024届6班合影",             //大标题
	open_image_base:"<input type=button value='打开图床(Based on GitHub)' onclick=javascript:window.open('https://www.github.com/zqzx2024c6/zqzx2024c6_image','_blank');>",               //图库在GitHub上的地址(GitHub URL)
	copyright:"(c) <a href=https://github.com/zqzx2024c6 target=_blank>zqzx2024c6<img src=github.ico height=16px width=16px></a> <a href=https://github.com/cdn2021 target=_blank>cdn2021<img src=github.ico height=16px width=16px></a>",               //版权信息
	offical_mail:"lihugang@outlook.com",                         //官方邮箱
	photos_from:"@君邻天下 @alvinoscar @AIA 友邦 杨霖 @小五",                                                    //图片来源信息
	github_repo:"zqzx2024c6/zqzx2024c6_image",                                               //用户名/仓库名
	photos_per_page:15,                                                 //每页几张图片
	download_photos_url:"https://codeload.github.com/zqzx2024c6/zqzx2024c6_image/zip/refs/heads/main",                   //下载图片地址
	
	

};
setInterval(fillTemplate,500);
//填充模板时间，单位是毫秒ms

var persons = ["冯恩娜","齐芸瑶","徐希玮","张诗琪","林慧如","康恩茜","张嘉怡","吴妍琦","吴优","聂小雅","孙莹馨","万逾豪","赵一诚","李沪纲","胡峰源","王宇轩","徐亦辰","李雨丞","徐泽熙","张粟童","朱禹辰","陆哲文","朴有丽","胡艺菲","张海阳","徐辰羽","翁希娜","随天佑","杨佳宇","陈泰哲","姜城彬","李成浩","徐崇斌","张博","熊方周","杨可欣"];
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