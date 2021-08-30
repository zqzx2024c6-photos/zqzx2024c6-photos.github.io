function getTemplate(key){
	if (typeof(window.template[key]) == "undefined")
		return "";
	else
		return window.template[key];
};
function fillTemplate(){
	var eles = document.getElementsByTagName("*");
	var i = 0;
	var reg_exp = /{{2}\s\w*\s}{2}/gim;
	while (i < eles.length){
		var match_strs = eles[i].innerHTML.match(reg_exp);
		if (match_strs == null){
			i++;
			continue;
		};
		var j = 0;
		while (j < match_strs.length){
			eles[i].innerHTML = eles[i].innerHTML.replaceAll(match_strs[j],getTemplate(match_strs[j].substring(3,match_strs[j].length-3)));
			j++;
		};
		i++;	
	};

};
