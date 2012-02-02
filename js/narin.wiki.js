/**
 * 
 * 나린위키 공용 자바 스크립트
 * 
 * @license GPL 2 (http://www.gnu.org/licenses/gpl.html)
 * @author byfun (http://byfun.com)
 */
 
$(document).ready(function() {
		
	$(".wiki_modal").wiki_lightbox();
  
  $("#toc_fold").click(function(evt) {
  	evt.preventDefault();
  	$("#wiki_toc_content").slideToggle();
  	head = $("#wiki_toc_head a");
  	if(head.hasClass("fold_up")) {
  		head.removeClass("fold_up").addClass("fold_down");
  	} else head.removeClass("fold_down").addClass("fold_up");
  });  

  $(".button a, .button input").click(function() {
  	$(this).blur();
  }); 

	// 글쓰기의 에디터 툴바
	if(!is_comment) {
		$(".wr_content").narinEditor('wiki_write');
		$(".markItUp .narin_media").click(function() {
			win_pop_center(wiki_url + '/media.php', 1000, 600, 'toolbar=0,resizable=1,scrollbars=1');
		});
	}
	
	// 외부 링크는 새창으로
	$(".wiki_external_link").attr('target', '_blank');
	
	// 가로 너비보다 큰 이미지 리사이즈
	// FIXME : IE 에서 cw 의 사이즈가 좀 ..;;
	$(".narin_contents").find('img').load(function() {
			$(".narin_contents").find('img').each(function() {
				var img = $(this);
				var iw = img.width();
				var ih = img.height();
				var cw = img.parents('div').eq(0).width() - 10;
				if(iw > cw) {
					img.css('width', cw+'px').css('height', Math.floor(ih * cw / iw)+'px');
				}
		});	// each
	});	// load
		    
});


// 라이트박스 wrapper function
$.wiki_lightbox_close = $.fancybox.close;
$.fn.wiki_lightbox = function(opt) {
	var settings = { 
		'centerOnScroll' : true,
		'overlayOpacity' : 0.5,
		'showCloseButton' : true,
		'enableEscapeButton' : true,
		'overlayColor' : '#222'
	}		
	opt = $.extend(settings, opt);
	return this.each(function() {
		$(this).fancybox(opt);
	});
};


/**
 * 
 * @param docname 경로는 제외한 문서명
 */
function check_doc_name(docname, hidemsg)
{
	if($.trim(docname) == '') {
		if(!hidemsg) alert("문서명을 입력하세요");
		return false;
	}	
	var pattern = /[\|\/\\\\\?#\+]/;
	if(pattern.test(docname)) {
		if(!hidemsg) alert("문서명에 다음 문자는 사용할 수 없습니다 : \\, |, /, ?, #, +");
		return false;
	}		
	return true;
}

/**
 * 
 * @param foldername 폴더 경로 전체
 */
function check_folder_name(foldername, hidemsg)
{
	if($.trim(foldername) == '') {
		if(!hidemsg) alert("폴더명을 입력하세요");
		return false;
	}
	var pattern = /[\|\\\\\?#\+]/;
	if(pattern.test(foldername)) {
		if(!hidemsg) alert("폴더명에 다음 문자는 사용할 수 없습니다 : \\, |, ?, #, +");
		return false;
	}
	
	pattern = /[\/]{2,}/;
	if(pattern.test(foldername)) {
		if(!hidemsg) alert("폴더명에 / 를 연속하여 사용할 수 없습니다.");
		return false;
	}	
	
	pattern = /^\//;
	if(!pattern.test(foldername)) {
		if(!hidemsg) alert("폴더명은 / 로 시작하는 문자열 이어야 합니다.");
		return false;
	}	
	
	return true;
}

function recover_history(wr_id, hid)
{
	if(confirm("이 문서로 복원하시겠습니까?")) {
		$.post(wiki_url+"/exe/history.php", { w : 'r', wr_id : wr_id, hid : hid}, function(data) {
			if(data == 1) {
				location.href = g4_url + "/" + g4_bbs + "/board.php?bo_table="+g4_bo_table+"&wr_id=" + wr_id;
			} else {			
				alert("문서 이력 복원를 못하였습니다.");
			}
		});
	}
}

function delete_history(hid)
{
	if(confirm("이 문서 이력을 삭제하시겠습니까?")) {
		$.post(wiki_url+"/exe/history.php", { w : 'd', hid : hid}, function(data) {
			if(data == 1) {
				location.reload();
			} else {
				alert("문서 이력 삭제를 못하였습니다.");
			}
		});
	}
}

function clear_history(wr_id)
{
	if(confirm("이 문서의 모든 이력을 삭제하시겠습니까?\n페이지에 표시되지 않는 이력도 삭제됩니다.")) {
		$.post(wiki_url+"/exe/history.php", { w : 'da', wr_id : wr_id}, function(data) {
			if(data == 1) {
				location.href = g4_url + "/" + g4_bbs + "/board.php?bo_table="+g4_bo_table+"&wr_id=" + wr_id;
			} else {
				alert("문서 이력 삭제를 못하였습니다.");
			}
		});
	}	
}

function delete_selected_history(wr_id)
{
	var hids = [];
	var chks = $("input[@name='hid[]']:checked").map(function() {
		hids.push(this.value);
	});
	
  if (hids.length == 0) 
  {
      alert("문서를 하나 이상 선택하세요.");
      return false;
  }	
	
	if(confirm("선택한 문서 이력을 삭제하시겠습니까?")) {		
		$.post(wiki_url+"/exe/history.php", { w : 'ds', wr_id : wr_id, hids : hids}, function(data) {
			if(data == 1) {
				location.reload();
			} else {
				alert("문서 이력 삭제를 못하였습니다.");				
			}
		});
	}	
}

function delete_selected_changes()
{
	var cids = [];
	var chks = $("input[@name='cid[]']:checked").map(function() {
		cids.push(this.value);
	});
	
  if (cids.length == 0) 
  {
      alert("변경내역을 하나 이상 선택하세요.");
      return false;
  }	
	
	if(confirm("선택한 변경내역을 삭제하시겠습니까?")) {		
		$.post(wiki_url+"/exe/changes.php", { w : 'ds', cids : cids}, function(data) {
			if(data == 1) {
				location.reload();
			} else {
				alert("변경내역 삭제를 못하였습니다.");				
			}
		});
	}	
}

function clear_changes()
{
	if(confirm("모든 변경내역을 삭제하시겠습니까?\n페이지에 표시되지 않는 내역도 모두 삭제됩니다.")) {
		$.post(wiki_url+"/exe/changes.php", { w : 'da'}, function(data) {
			if(data == 1) {
				location.reload();
			} else {
				alert("변경내역 삭제를 못하였습니다.");
			}
		});
	}	
}

function createDoc(folder)
{
	if(!check_folder_name(folder)) return;
	var doc = prompt('문서명 입력 : ', '');
	if(doc != null) {
		if(!check_doc_name(doc)) {
			createDoc(folder);
			return;
		}
		docpath = ( folder == "/" ? "/" : folder+"/") + doc;
		if(typeof wiki_fancy != 'undefined') {
			location.href = wiki_url + '/read' + docpath;
		} else {
			location.href = wiki_url + "/narin.php?doc=" + encodeURIComponent(docpath) + "&fj=1";
		}
		
	}
}

function wiki_search(f)
{
	var stx = $.trim(f.stx.value);
	if(stx == '') {
		alert("검색어를 입력하세요");
		return false;
	}
	if(typeof wiki_fancy != 'undefined') {
		location.href = wiki_url + '/search/' + stx;
		return false;
	}
	
	return true;
}




$.center = function($this) {
	var win = $(window);
	var top = (win.height() - $this.outerHeight()) / 2;
	var left = (win.width() - $this.outerWidth()) / 2;
	var pos = 'fixed';
	if($.browser.msie) {
		top += win.scrollTop() || 0;
		top = (top > 0 ? top : 0);
		left += win.scrollLeft() || 0;
		left = (left > 0 ? left : 0);			
		pos = 'absolute';		
	}
	$this.css({position:pos, top : top, left : left});				  			
};

$.fn.center = function() {
	return this.each(function() {
		$this = $(this);
		$(window).resize(function() { $.center($this); } ).scroll( function() { $.center($this); } );			 	    
		$.center($(this));
	});		
};

$.fn.center_now = function() {
	return this.each(function() {
		$.center($(this));
	});
};



function wiki_dialog(title, msg, options)
{
	var settings = { 
		msg_id : 'wiki_dialog', 
		title_bgcolor : "#555", 
		title_color : "#fff", 
		buttons : '<span class="button"><a href="javascript:$.wiki_lightbox_close();">확인</a></span>',
		onClose : function() {} 
	};	
	jQuery.extend(settings, options);	
	
	msgLayer = $("<div></div>")
						.attr('style', 'display:none;')
						.html([
							'<div id="'+settings.msg_id+'">',
							'<div style="padding:5px 10px;background-color:'+settings.title_bgcolor+';color:'+settings.title_color+';font-weight:bold;">',
							title,
							'</div>',
							'<div style="padding:10px;line-height:160%;">',
							msg,
							'</div>',
							'<div style="margin-top:10px;border-top:1px dashed #ccc;padding-top:10px;text-align:center">',
							settings.buttons,
							'</div>',
							'<a href="#'+settings.msg_id+'" id="btn_'+settings.msg_id+'" style="display:none"></a>',
							'</div>'
							].join(''));
							
	$(document.body).prepend(msgLayer);
		
	$("#btn_"+settings.msg_id).wiki_lightbox({
		'hideOnOverlayClick' : false,
		'enableEscapeButton' : false,
		'onClosed'		: function() {
				msgLayer.remove();
				settings.onClose();
		}
	}).trigger('click');

}


function wiki_msg(msg, options) {
	
	var settings = { msg_id : 'wiki_msg', seconds : 2500, bgcolor : "#555", color : "#fff", callback : function() {} };
	jQuery.extend(settings, options);
	msgLayer = $("<div></div>")
		.attr('style', 'display:none;position:absolute;padding:10px 30px;text-align:center;background-color:'+settings.bgcolor+';color:'+settings.color+';z-index:999999')
		.html(msg).prependTo($('body'));
	msgLayer.center().fadeIn();
	// msgLayer.center_now();
	setTimeout(function() { msgLayer.fadeOut(function() { msgLayer.remove(); settings.callback(); });  }, settings.seconds);			
}

function objToString(o){
	var parse = function(_o){    
		var a = [], t;        
		for(var p in _o){        
			if(_o.hasOwnProperty(p)){            
				t = _o[p];                
				if(t && typeof t == "object"){                
					a[a.length]= p + ":{ " + arguments.callee(t).join(", ") + "}";                    
				}
				else {                    
					if(typeof t == "string"){                    
					  a[a.length] = [ p+ ": \"" + t.toString() + "\"" ];
					}
					else{
					  a[a.length] = [ p+ ": " + t.toString()];
					}                    
				}
			}
		}        
		return a;        
	}    
	return "{" + parse(o).join(", ") + "}";    
}

function win_pop_center(loc, w, h, opts) {
    var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
    var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;    
    var left = ((screen.width / 2) - (w / 2)) + dualScreenLeft;
    var top = ((screen.height / 2) - (h / 2)) + dualScreenTop;
    
    if(opts != undefined) opts = ',' + opts;
    else opts = '';
         
    var newwin = window.open(''+loc, 'narin_popup', 'top=' + top + ',left=' + left +',width=' + w + ',height=' + h + opts);
    if (window.focus) {newwin.focus();}
}
