<?php

/**
 * @version 1.1
 */
class Targetsms
{
    public $login;
    public $password;
    public $error;
    public $abonent;
	public $message;
	public $phone;
	public $domen;
    

    /**
     * Создание подключения.
     *
     * @param string $login    логин в системе
     * @param string $password пароль в системе
     */
    public function setSmslogin($smslogin) {
		$this->login = $smslogin;
			
	}
	public function setSmspassword($smspassword) {
			$this->password = $smspassword;
			
		}
	public function setSmsfrom($smsfrom) {
			$this->abonent = $smsfrom;
		}
	public function setDomen($domen) {
			$this->domen = $domen;
		}

	public function setPhone($phone) {
			$this->phone = $phone;
		}
	public function setMessage($message) {
			$this->message = $message;
		}
   
    
   public function parseXml($xml)
    {
        $domXml = simplexml_load_string($xml);
        $arr = array();
        if (isset($domXml->error)) {
            $this->error = (string) $domXml->error;

            return;
        } else {
            $i = 0;
            foreach ($domXml->information as $val) {
                $arr[$i]['value'] = (string) $val;
                foreach ($val->attributes() as $attrName => $attrValue) {
                    $arr[$i][$attrName] = (string) $attrValue;
                }
                ++$i;
            }

            return $arr;
        }
    }
	/**
     * Отправка xml на сервер
     * @return array
     */
	public function curl_to()
	{
		$src = '<?xml version="1.0" encoding="utf-8"?>
			<request>
				<security>
					 <login value="'.$this->login.'" />
					 <password value="'.$this->password.'" />
				</security>
				<message type="sms">
					 <sender>'.$this->abonent.'</sender>
					 <text>'.$this->message.'</text>
					 <translite>1</translite>
					 <name_delivery>'.$this->domen.'</name_delivery>
					 <abonent phone="'.$this->phone.'" number_sms="1" />
				</message>
			</request>';
		$href = 'https://sms.targetsms.ru/xml/'; // адрес сервера
		$ch = curl_init();
		curl_setopt ($ch, CURLOPT_HTTPHEADER, array ('Content-type: text/xml','charset=utf8','Expect:'));
		curl_setopt ($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt ($ch, CURLOPT_SSL_VERIFYPEER, 0);
		curl_setopt ($ch, CURLOPT_SSL_VERIFYHOST, 0);
		curl_setopt ($ch, CURLOPT_CRLF, true);
		curl_setopt ($ch, CURLOPT_POST, true);
		curl_setopt ($ch, CURLOPT_POSTFIELDS, $src);
		curl_setopt ($ch, CURLOPT_URL, $href);
		$result = curl_exec($ch);
		curl_close($ch);
		return $result;
	}
	public function curl_to_status($id)
	{
		$src = '<?xml version="1.0" encoding="utf-8"?>
			<request>
				<security>
					 <login value="'.$this->login.'" />
					 <password value="'.$this->password.'" />
				</security>
				<get_state>
					<id_sms>'.$id.'</id_sms>
				</get_state>
			</request>';
			
		$href = 'https://sms.targetsms.ru/xml/state.php'; // адрес сервера
		$ch = curl_init();
		curl_setopt ($ch, CURLOPT_HTTPHEADER, array ('Content-type: text/xml','charset=utf8','Expect:'));
		curl_setopt ($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt ($ch, CURLOPT_SSL_VERIFYPEER, 0);
		curl_setopt ($ch, CURLOPT_SSL_VERIFYHOST, 0);
		curl_setopt ($ch, CURLOPT_CRLF, true);
		curl_setopt ($ch, CURLOPT_POST, true);
		curl_setopt ($ch, CURLOPT_POSTFIELDS, $src);
		curl_setopt ($ch, CURLOPT_URL, $href);
		$result = curl_exec($ch);
		curl_close($ch);
		return $result;
	}
}

