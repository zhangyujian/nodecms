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

    function setcookie(){
		//获取cookie的值
		var username = $.cookie('username');
		var password = $.cookie('password');
		//将获取的值填充入输入框中
		$('#username').val(username);
		$('#password').val(password); 
		if(username != null && username != '' && password != null && password != ''){//选中保存秘密的复选框
			$("#remember-me").attr('checked',true);
		}

		$("#button").click(function() {
			if ($("#remember-me").attr("checked") == "checked") {
				var username = $("#username").val();
				var password = $("#password").val();
				$.cookie("username", username, { expires: 7 });
				$.cookie("password", password, { expires: 7 });
			}else{
				$.cookie('username', '', { expires: -1 });
				$.cookie('password', '', { expires: -1 }); 
			}
		});
	}
	setcookie();
});