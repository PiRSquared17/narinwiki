<?
/**
 * 
 * include skin 스크립트
 *
 * @package	narinwiki
 * @subpackage event
 * @license http://narin.byfun.com/license GPL2
 * @author	byfun (http://byfun.com)
 * @filesource
 */
 
if (!defined("_GNUBOARD_")) exit; // 개별 페이지 접근 불가 

extract($wikiEvent->trigger("WRITE_COMMENT_UPDATE", 
							array("w"=>$w, 
									"wr_id"=>$wr_id, 
									"wr_doc"=>stripcslashes($wr_doc),
									"wr_name"=>stripcslashes($wr_name), 
									"wr_email"=>stripcslashes($wr_email), 
									"wr_content"=>stripcslashes($wr_content),
									"comment_id"=>$comment_id)));	

?>