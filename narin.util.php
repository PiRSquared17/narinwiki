<?
if (!defined('_GNUBOARD_')) exit;

/**
 * ������Ű �ܺο��� ����ϱ� ���� �Լ� ����
 */

class NarinWikiLib {

	var $wiki = array();
	var $wiki_path;
	var $bo_table;
	var $write_table;
	var $g4;
	
	/**
	 * ������
	 * @params (string) $wiki_path ��Ű ��� (g4�� ���� �����)
	 * @params (string) $bo_table ��Ű�� ���Ǵ� bo_table
	 */
	public function __construct($wiki_path, $bo_table)
	{
		global $g4;
		$this->g4 = $g4;
		$this->wiki_path = $wiki_path;
		$this->bo_table = $bo_table;
		include_once $wiki_path . "/narin.config.php";	 
		$this->wiki = $wiki;
		$this->write_table = $g4['write_prefix'] . $bo_table;
	}

	/**
	 * ��Ű ���� ���� ����/���� ��� ��ȯ
	 * @params (string) $folder ��ȸ�ϰ��� �ϴ� ����
	 * @params (boolean) $witharticle true �� ���� ��ϰ� �Բ� ������� ��ȯ, false �� ���� ��ϸ� ��ȯ
	 * @return (array) ��� �迭
	 */	 
	public function folderList($folder, $withArticle=true) {	
		$bo_table = $this->bo_table;	
		$wiki_path = $this->wiki[path];
		$ns_table = $this->wiki[ns_table];
		$nsboard_table = $this->wiki[nsboard_table];
		$write_table = $this->write_table;
		$escapedParent = mysql_real_escape_string($folder);
		$regp = ($folder == "/" ? "/" : $escapedParent."/");	
		if($parent != "/") {
			$add =	"nt.ns = '$escapedParent' OR ";
			$addSlash = "/";
		}
		
		$sql = "SELECT *  FROM $ns_table WHERE $add ns LIKE '$escapedParent%' AND ns NOT REGEXP '^$regp(.*)/' AND bo_table ='$bo_table'";
		if($withArticle) {
			$sql = "SELECT nt.ns, nt.bo_table, wb.wr_subject AS doc, wb.wr_id FROM $ns_table AS nt LEFT JOIN $nsboard_table AS nb ON nt.ns = nb.ns AND nt.bo_table = nb.bo_table LEFT JOIN $write_table AS wb ON nb.wr_id = wb.wr_id WHERE ( $add nt.ns LIKE '$escapedParent$addSlash%' AND nt.ns NOT REGEXP '^$regp(.*)/' ) AND nt.bo_table = '$bo_table'ORDER BY wb.wr_subject";
		}		
		$folders = array();
		$files = array();
		$already = array();
		$result = sql_query($sql);
		while ($row = sql_fetch_array($result))	
		{
			if($row[ns] == $parent) {
				if(!$row[doc]) continue;
				$path = ($row[ns] == "/" ? "/" : $row[ns]."/").$row[doc];
				$href = $wiki_path.'/narin.php?bo_table='.$bo_table.'&doc='.urlencode($path);
				$ilink = "[[".$path."]]";
				array_push($files, array("name"=>$row[doc], "path"=>$path, "href"=>$href, "wr_id"=>$row[wr_id], "type"=>"doc"));
			} else {				
				$href = $wiki_path.'/folder.php?bo_table='.$bo_table.'&loc='.urlencode($row[ns]);
				$name = ereg_replace($parent."/", "", $row[ns]);
				$name = ereg_replace($parent, "", $name);			
				if($already[$name]) continue;
				$already[$name] = $name;
				array_push($folders, array("name"=>$name, "path"=>$row[ns], "href"=>$href, "type"=>"folder"));
			}		
		}
		if(count($folders)) $folders = $this->subval_asort($folders, "name");
		$list = array_merge($folders, $files);
		return $list;
	}
	
	/**
	 * �ֱ� ������Ʈ �� ���� ���
	 */
	public function recentUpdate($count=5) {
	
		$sql = "SELECT wt.wr_id, wt.wr_subject as docname, nt.ns, ht.editor_mb_id, ht.reg_date
						FROM {$this->wiki[history_table]} AS ht 
						LEFT JOIN {$this->wiki[write_table]} AS wt ON ht.wr_id = wt.wr_id 
						LEFT JOIN {$this->wiki[nsboard_table]} AS nt ON nt.wr_id = wt.wr_id AND nt.bo_table = '{$this->wiki[bo_table]}' 
						WHERE ht.bo_table = '{$this->wiki[bo_table]}' 
						GROUP BY wt.wr_id 
						ORDER BY ht.id DESC LIMIT 0, $count";

		$res = sql_query($sql);
		$list = array();
		while($row = sql_fetch_array($res)) {
			$href = $this->wiki[path]."/narin.php?bo_table=".$this->wiki[bo_table]."&doc=".urlencode($this->doc($row[ns], $row[docname]));
			$row[href] = $href;
			array_push($list, $row);
		}
		return $list;		
	}	
	
	/**
	 * �ֱ� ���� ���� ���
	 */	
	public function recentChanges($count = 5) {
		$sql = "SELECT * FROM {$this->wiki[changes_table]} WHERE bo_table = '{$this->wiki[bo_table]}' ORDER BY id DESC LIMIT $count";		
		$list = array();
		$res = sql_query($sql);
		while($row = sql_fetch_array($res)) {
			$target = urlencode($row[target]);
			if($row[target_type] == "DOC") {
				$row[view_href] = $this->wiki[path]."/narin.php?bo_table=".$this->wiki[bo_table]."&doc=".$target;
			} else if($row[target_type] == "FOLDER") {
				$row[view_href] = $this->wiki[path]."/folder.php?bo_table=".$this->wiki[bo_table]."&loc=".$target;		
			}
			array_push($list, $row);
		}
		return $list;
	}
	
	/**
	 * �����迭�� Ű ������ ���� (asort)
	 * @params (array) $a ������ �迭
	 * @params (string) $subkey �迭�� Ű��
	 */
	protected function subval_asort($a,$subkey) {
		foreach($a as $k=>$v) {
			$b[$k] = strtolower($v[$subkey]);
		}
		asort($b);
		foreach($b as $key=>$val) {
			$c[] = $a[$key];
		}
		return $c;
	}
	
	/**
	 * �����迭�� Ű ������ ���� (sort)
	 * @params (array) $a ������ �迭
	 * @params (string) $subkey �迭�� Ű��
	 */
	protected function subval_sort($a,$subkey) {
		$c = subval_asort($a, $subkey);
		$c = array_reverse($c);
		return $c;
	}
	
	/** 
	 * ������� ������ ��ġ��
	 */
	protected function doc($ns, $docname) {
		return ($ns == "/" ? "" : $ns ) . "/" . $docname;
	}	
}	
?>
