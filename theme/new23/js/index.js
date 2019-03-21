
//关闭购买成功信息
function closeSuccess(){
	$(".after_buyNow").removeClass("show");
	$(".black_overlay").removeClass("show");
}
//打开购买成功信息
function show_successwin(){
	$(".after_buyNow").addClass("show");
	$(".black_overlay").addClass("show");
}
//弹出检查状态
function showStateSer(){
	$(".black_overlay").addClass("show");
	$(".state_show").addClass("show");
}
//关闭检查状态
function closeStateSer(){
	$(".black_overlay").removeClass("show");
	$(".state_show").removeClass("show");
}

//弹出规格选择和地址填写
function showOrder(){
	$("#page-order").addClass("show");
}

function closeOrder(){
	$("#page-order").removeClass("show");
}

//购买信息滚动
$.get(appData.apiserver+"/getpurchaseinfo/" +appData.language).success(function(data){
	setTimeout(function() {
		$('#marqueeContainer').empty();
		var li="";
		for(var i in data){
			/*li+='<li><div style="background-image:url('+ data[i].img + ')"></div></li>'*/
			li+='<li><div style="background-image: url(/'+ data[i].img + ')">'+data[i].info+'</div></li>'
		}
		$("#marqueeContainer").append(li);
		setInterval(function(){doscroll()}, 2000);
	}, 0);
});
var doscroll = function(){
	var parent = $('#marqueeContainer');
	var first = parent.find('li:first');
	var height = parseInt(first.height())+30;
	first.animate({
		marginTop: -height + 'px'
	}, 1000, function() {
		first.css('marginTop', 0).appendTo(parent);
	});
};
function leftTimer(end){
	var now = new Date();
	var leftTime = new Date(end.getFullYear(),end.getMonth()+1,end.getDay(),23,59,59) - now;
	now = null;end=null;
	//var days = parseInt(leftTime / 1000 / 60 / 60 / 24 , 10);
	var hours = parseInt(leftTime / 1000 / 60 / 60 % 24 , 10);
	var minutes = parseInt(leftTime / 1000 / 60 % 60, 10);
	var seconds = parseInt(leftTime / 1000 % 60, 10);
	//var wseconds  = parseInt(leftTime % 1000, 10);
	$('#timeHour').text(checkTime(hours));
	$('#timeMin').text(checkTime(minutes));
	$('#timeSec').text(checkTime(seconds));
	//$('#timeWSec').text(checkTime(wseconds));
	leftTime=null;
}
function checkTime(i){
	if(i<10)
	{
		i = "0" + i;
	}
	return i;
}
setInterval('leftTimer(new Date())',60);


