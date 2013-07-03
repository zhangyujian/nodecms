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
    var elems = $('a' ,'.bs-docs-sidenav');
    //var elem_src = $('a' ,'.bs-docs-sidenav').attr('href');
    elems.each(function(index, item){
        item.href.indexOf(cur_path) === -1 ? $(this).addClass('') : $(this).addClass('active');
        //console.log(item.href);
        });
});