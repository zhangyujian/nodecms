$(document).ready(function(){
	$(".dropdown-toggle").click(function(){
		if($(this).children("i").hasClass("icon-plus")){
			$(this).children("i").removeClass("icon-plus");
			$(this).children("i").addClass("icon-minus");
		}else{
			$(this).children("i").removeClass("icon-minus");
			$(this).children("i").addClass("icon-plus");
		}
		$(this).children("ul").toggle();
	});
	if($(".alert").text() === "×"){
		$(".alert").hide();
	}else{
		$(".alert").show();
	}
});