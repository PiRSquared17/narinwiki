﻿<?
/**
 * 
 * js 병합 & minify 스크립트
 *
 * @package	narinwiki
 * @subpackage pages
 * @license http://narin.byfun.com/license GPL2
 * @author	byfun (http://byfun.com)
 * @filesource
 */
include_once "_common.php";
include_once $wiki['path']."/lib/Minifier/jsmin.php";

$offset = 60 * 60 * 24 * 7; // Cache for 1 weeks
$modified = 0;
$is_ie6 = false;
if(substr($_SERVER['HTTP_USER_AGENT'], 25, 8) == "MSIE 6.0"){ $is_ie6 = true; }

$included = "";

// js 파일 내용 버퍼
$script = "";

// js 폴더 로딩
$script .= get_files_contents($wiki['path']."/js", "js");
$script .= get_files_contents($wiki['skin_path'], "js");
if(file_exists($wiki['path']."/data/$bo_table/js"))  $script .= get_files_contents($wiki['path']."/data/$bo_table/js", "js");	// for plugin

$js_modified = wiki_get_option("js_modified");
if($js_modified) {
	$modified = max($js_modified['timestamp'], $modified);
	wiki_set_option("js_modified", null, null);
}

header ('Expires: ' . gmdate ("D, d M Y H:i:s", time() + $offset) . ' GMT');

if (isset($_SERVER['HTTP_IF_MODIFIED_SINCE']) && strtotime($_SERVER['HTTP_IF_MODIFIED_SINCE']) >= $modified) {
	header("HTTP/1.0 304 Not Modified");
	header ('Cache-Control:');
} else {
	header ('Cache-Control: max-age=' . $offset);
	header ('Content-type: text/javascript; charset='.$g4[charset]);
	header ('Pragma:');
	header ("Last-Modified: ".gmdate("D, d M Y H:i:s", $modified )." GMT");
		
	echo JSMin::minify($script);    
}

/**
 * 
 * JS 파일 읽어오기
 * 
 * @param array $files 추가할 파일 경로 배열
 * @return string 병합된 파일 내용
 */
function get_files_contents_array($files) {
	global $modified;
	$str = "";
	foreach($files as $k=>$file) {
    $age = filemtime($file);
    if($age > $modified) {
        $modified = $age;
    }		
		$str .= file_get_contents($file);
	}
	return $str;
}

/**
 * 
 * JS 파일 읽어오기
 * 
 * @param string $path 폴더 경로
 * @param string $extension 확장자
 * @return string 병합된 파일 내용
 */
function get_files_contents($path, $extension) {
	global $modified, $is_ie6, $included;
	$str = "";
	$files = scandir($path);
	$extlen = -1 * (strlen($extension)+1);
	foreach($files as $k=>$file) {
		if(is_dir($path."/".$file)) continue;		
		if(substr($file, $extlen) != '.'.$extension) continue;
		if(!$is_ie6 && strpos($file, "ie6") > 0) continue;

		$included .= "$file \\n";
    $age = filemtime($path."/".$file);
    if($age > $modified) {
        $modified = $age;
    }		
		$str .= file_get_contents($path."/".$file);
	}
	return $str;
}

?>
