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
	var cur_path = document.location.pathname;
    $('a' ,'.bs-docs-sidenav').each(function(){
    	if($(this).attr('href') == cur_path){
    		$(this).addClass('active');
    	}
    });
});