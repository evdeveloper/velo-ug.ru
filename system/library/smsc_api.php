<?php
class smsc_api {

protected $smslogin = ''; // ����� �������
protected $smspassword = ''; // ������
protected $smsfrom = ''; // e-mail ����� �����������
protected $smspost = 0; // ������������ ����� POST
protected $smshttps = 0; // ������������ HTTPS ��������
protected $smscharset = "windows-1251"; // ��������� ���������: utf-8, koi8-r ��� windows-1251 (�� ���������)
protected $smsdebug = 0; // ���� �������


public function setSmslogin($smslogin) {
		$this->smslogin = $smslogin;
			
	}
public function setSmspassword($smspassword) {
		$this->smspassword = $smspassword;
		
	}
public function setSmsfrom($smsfrom) {
		$this->smsfrom = $smsfrom;
	}
	
public function send_sms($phones, $message, $translit = 0, $time = 0, $id = 0, $format = 0, $sender = false, $query = "", $files = array())
{
	static $formats = array(1 => "flash=1", "push=1", "hlr=1", "bin=1", "bin=2", "ping=1", "mms=1", "mail=1", "call=1", "viber=1", "soc=1");

	$m = $this->_smsc_send_cmd("send", "cost=3&phones=".urlencode($phones)."&mes=".urlencode($message).
					"&translit=$translit&id=$id".($format > 0 ? "&".$formats[$format] : "").
					($sender === false ? "" : "&sender=".urlencode($sender)).
					($time ? "&time=".urlencode($time) : "").($query ? "&$query" : ""), $files);

	// (id, cnt, cost, balance) ��� (id, -error)

	if ($this->smsdebug) {
		if ($m[1] > 0)
			echo "��������� ���������� �������. ID: $m[0], ����� SMS: $m[1], ���������: $m[2], ������: $m[3].\n";
		else
			echo "������ �", -$m[1], $m[0] ? ", ID: ".$m[0] : "", "\n";
	}

	return $m;
}

// SMTP ������ ������� �������� SMS

public function send_sms_mail($phones, $message, $translit = 0, $time = 0, $id = 0, $format = 0, $sender = "")
{
	return mail("send@send.smsc.ru", "", $this->smslogin.":".$this->smspassword.":$id:$time:$translit,$format,$sender:$phones:$message", "From: ".$this->smsfrom."\nContent-Type: text/plain; charset=".$this->smscharset."\n");
}

// ������� ��������� ��������� SMS
//
// ������������ ���������:
//
// $phones - ������ ��������� ����� ������� ��� ����� � �������
// $message - ������������ ���������
//
// �������������� ���������:
//
// $translit - ���������� ��� ��� � �������� (1,2 ��� 0)
// $format - ������ ��������� (0 - ������� sms, 1 - flash-sms, 2 - wap-push, 3 - hlr, 4 - bin, 5 - bin-hex, 6 - ping-sms, 7 - mms, 8 - mail, 9 - call, 10 - viber, 11 - soc)
// $sender - ��� ����������� (Sender ID)
// $query - ������ �������������� ����������, ����������� � URL-������ ("list=79999999999:��� ������: 123\n78888888888:��� ������: 456")
//
// ���������� ������ (<���������>, <���������� sms>) ���� ������ (0, -<��� ������>) � ������ ������

public function get_sms_cost($phones, $message, $translit = 0, $format = 0, $sender = false, $query = "")
{
	static $formats = array(1 => "flash=1", "push=1", "hlr=1", "bin=1", "bin=2", "ping=1", "mms=1", "mail=1", "call=1", "viber=1", "soc=1");

	$m = $this->_smsc_send_cmd("send", "cost=1&phones=".urlencode($phones)."&mes=".urlencode($message).
					($sender === false ? "" : "&sender=".urlencode($sender)).
					"&translit=$translit".($format > 0 ? "&".$formats[$format] : "").($query ? "&$query" : ""));

	// (cost, cnt) ��� (0, -error)

	if ($this->smsdebug) {
		if ($m[1] > 0)
			echo "��������� ��������: $m[0]. ����� SMS: $m[1]\n";
		else
			echo "������ �", -$m[1], "\n";
	}

	return $m;
}

// ������� �������� ������� ������������� SMS ��� HLR-�������
//
// $id - ID c�������� ��� ������ ID ����� �������
// $phone - ����� �������� ��� ������ ������� ����� �������
// $all - ������� ��� ������ ������������� SMS, ������� ����� ��������� (0,1 ��� 2)
//
// ���������� ������ (��� �������������� ������� ��������� ������):
//
// ��� ���������� SMS-���������:
// (<������>, <����� ���������>, <��� ������ ��������>)
//
// ��� HLR-�������:
// (<������>, <����� ���������>, <��� ������ sms>, <��� IMSI SIM-�����>, <����� ������-������>, <��� ������ �����������>, <��� ���������>,
// <�������� ������ �����������>, <�������� ���������>, <�������� ����������� ������>, <�������� ������������ ���������>)
//
// ��� $all = 1 ������������� ������������ �������� � ����� �������:
// (<����� ��������>, <����� ��������>, <���������>, <sender id>, <�������� �������>, <����� ���������>)
//
// ��� $all = 2 ������������� ������������ �������� <������>, <��������> � <������>
//
// ��� ������������� �������:
// ���� $all = 0, �� ��� ������� ��������� ��� HLR-������� ������������� ������������ <ID ���������> � <����� ��������>
//
// ���� $all = 1 ��� $all = 2, �� � ����� ����������� <ID ���������>
//
// ���� ������ (0, -<��� ������>) � ������ ������

public function get_status($id, $phone, $all = 0)
{
	$m = $this->_smsc_send_cmd("status", "phone=".urlencode($phone)."&id=".urlencode($id)."&all=".(int)$all);

	// (status, time, err, ...) ��� (0, -error)

	if (!strpos($id, ",")) {
		if ($this->smsdebug )
			if ($m[1] != "" && $m[1] >= 0)
				echo "������ SMS = $m[0]", $m[1] ? ", ����� ��������� ������� - ".date("d.m.Y H:i:s", $m[1]) : "", "\n";
			else
				echo "������ �", -$m[1], "\n";

		if ($all && count($m) > 9 && (!isset($m[$idx = $all == 1 ? 14 : 17]) || $m[$idx] != "HLR")) // ',' � ���������
			$m = explode(",", implode(",", $m), $all == 1 ? 9 : 12);
	}
	else {
		if (count($m) == 1 && strpos($m[0], "-") == 2)
			return explode(",", $m[0]);

		foreach ($m as $k => $v)
			$m[$k] = explode(",", $v);
	}

	return $m;
}

// ������� ��������� �������
//
// ��� ����������
//
// ���������� ������ � ���� ������ ��� false � ������ ������

public function get_balance()
{
	$m = $this->_smsc_send_cmd("balance"); // (balance) ��� (0, -error)

	if ($this->smsdebug) {
		if (!isset($m[1]))
			echo "����� �� �����: ", $m[0], "\n";
		else
			echo "������ �", -$m[1], "\n";
	}

	return isset($m[1]) ? false : $m[0];
}


// ���������� �������

// ������� ������ �������. ��������� URL � ������ 5 ������� ������ ����� ������ ����������� � �������

public function _smsc_send_cmd($cmd, $arg = "", $files = array())
{
	$url = $_url = ($this->smshttps ? "https" : "http")."://smsc.ru/sys/$cmd.php?login=".urlencode($this->smslogin)."&psw=".urlencode($this->smspassword)."&fmt=1&charset=".$this->smscharset."&".$arg;

	$i = 0;
	do {
		if ($i++)
			$url = str_replace('://smsc.ru/', '://www'.$i.'.smsc.ru/', $_url);

		$ret = $this->_smsc_read_url($url, $files, 3 + $i);
	}
	while ($ret == "" && $i < 5);

	if ($ret == "") {
		if ($this->smsdebug)
			echo "������ ������ ������: $url\n";

		$ret = ","; // ��������� �����
	}

	$delim = ",";

	if ($cmd == "status") {
		parse_str($arg, $m);

		if (strpos($m["id"], ","))
			$delim = "\n";
	}

	return explode($delim, $ret);
}

// ������� ������ URL. ��� ������ ������ ���� ��������:
// curl ��� fsockopen (������ http) ��� �������� ����� allow_url_fopen ��� file_get_contents

public function _smsc_read_url($url, $files, $tm = 5)
{
	$ret = "";
	$post = $this->smspost || strlen($url) > 2000 || $files;

	if (function_exists("curl_init"))
	{
		static $c = 0; // keepalive

		if (!$c) {
			$c = curl_init();
			curl_setopt_array($c, array(
					CURLOPT_RETURNTRANSFER => true,
					CURLOPT_CONNECTTIMEOUT => $tm,
					CURLOPT_TIMEOUT => 60,
					CURLOPT_SSL_VERIFYPEER => 0,
					CURLOPT_HTTPHEADER => array("Expect:")
					));
		}

		curl_setopt($c, CURLOPT_POST, $post);

		if ($post)
		{
			list($url, $post) = explode("?", $url, 2);

			if ($files) {
				parse_str($post, $m);

				foreach ($m as $k => $v)
					$m[$k] = isset($v[0]) && $v[0] == "@" ? sprintf("\0%s", $v) : $v;

				$post = $m;
				foreach ($files as $i => $path)
					if (file_exists($path))
						$post["file".$i] = function_exists("curl_file_create") ? curl_file_create($path) : "@".$path;
			}

			curl_setopt($c, CURLOPT_POSTFIELDS, $post);
		}

		curl_setopt($c, CURLOPT_URL, $url);

		$ret = curl_exec($c);
	}
	elseif ($files) {
		if ($this->smsdebug)
			echo "�� ���������� ������ curl ��� �������� ������\n";
	}
	else {
		if (!$this->smshttps && function_exists("fsockopen"))
		{
			$m = parse_url($url);

			if (!$fp = fsockopen($m["host"], 80, $errno, $errstr, $tm))
				$fp = fsockopen("212.24.33.196", 80, $errno, $errstr, $tm);

			if ($fp) {
				stream_set_timeout($fp, 60);

				fwrite($fp, ($post ? "POST $m[path]" : "GET $m[path]?$m[query]")." HTTP/1.1\r\nHost: smsc.ru\r\nUser-Agent: PHP".($post ? "\r\nContent-Type: application/x-www-form-urlencoded\r\nContent-Length: ".strlen($m['query']) : "")."\r\nConnection: Close\r\n\r\n".($post ? $m['query'] : ""));

				while (!feof($fp))
					$ret .= fgets($fp, 1024);
				list(, $ret) = explode("\r\n\r\n", $ret, 2);

				fclose($fp);
			}
		}
		else
			$ret = file_get_contents($url);
	}

	return $ret;
}

}

?>
