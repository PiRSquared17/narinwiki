<?
/**
 * 
 * 꼬리 문서 include 스크립트
 *
 * @package	narinwiki
 * @subpackage pages
 * @license http://narin.byfun.com/license GPL2
 * @author	byfun (http://byfun.com)
 * @filesource
 */

if (!defined("_GNUBOARD_")) exit; // 개별 페이지 접근 불가
if($wiki['tail_file'] && !$no_layout) include_once $wiki['path'] . "/" . $wiki['tail_file'];
else include_once $g4['path']."/tail.sub.php";
?>