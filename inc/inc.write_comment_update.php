<?
if (!defined("_GNUBOARD_")) exit; // ���� ������ ���� �Ұ� 


extract($wikiEvent->trigger("WRITE_COMMENT_UPDATE", array("w"=>$w, 
																			"wr_id"=>$wr_id, 
																			"wr_doc"=>stripcslashes($wr_doc),
																			"wr_name"=>stripcslashes($wr_name), 
																			"wr_email"=>stripcslashes($wr_email), 
																			"wr_content"=>stripcslashes($wr_content),
																			"comment_id"=>$comment_id)));	

?>