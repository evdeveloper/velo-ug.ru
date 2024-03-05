<?php
class ControllerExtensionModuleRegsms extends Controller {

	private $host = 'http://apiagent.ru/password_generation/api.php'; 
	private $eol = "\n";

	public function index() {

		$this->load->language('extension/module/regsms');

		$data['module_regsms_text_button'] = $this->config->get('module_regsms_text_button');
		$data['module_regsms_offer'] = sprintf($this->language->get('text_regsms_offer'),$this->config->get('module_regsms_text_button'));



		$this->load->model('tool/image');

		$data['tek_region'] = "";
		$data['tek_mask'] = "";
		$data['tek_placeholder'] = "";
		$data['tek_thumb'] = "";

		$data['module_regsms_mask'] = $this->config->get('module_regsms_mask');
    	foreach ($data['module_regsms_mask'] as $key => $mask) {

    		if (!$mask['status']) {
    			continue;
    		}

    		if (is_file(DIR_IMAGE . $mask['image'])) {
				$thumb = $this->model_tool_image->resize($mask['image'], 30, 30);
			} else {
				$thumb = $this->model_tool_image->resize('no_image.png', 30, 30);
			}
			$data['module_regsms_mask'][$key]['thumb'] = $thumb;

			if (!$data['tek_mask']) {
				$data['tek_region'] = $mask['region'];
				$data['tek_mask'] = $mask['mask'];
				$data['tek_placeholder'] = $mask['placeholder'];
				$data['tek_thumb'] = $thumb;
			}
    	}



		$this->response->setOutput($this->load->view('extension/module/regsms', $data));
		
	}

	public function auth() {

		$json = array();

		if (isset($this->request->post['code']) && isset($this->request->post['telephone'])) {

			if (isset($this->session->data['regsms'][$this->request->post['telephone']]['code']) && $this->session->data['regsms'][$this->request->post['telephone']]['code'] == $this->request->post['code']) {

				$this->load->model('extension/module/regsms');
				$customer_info = $this->model_extension_module_regsms->getCustomerByTelephone($this->request->post['telephone']);
				if (!$customer_info) {

					$customer_data = array(
						'firstname'		=> $this->request->post['telephone'],						
						'telephone'		=> $this->request->post['telephone']
					);

					$customer_id = $this->model_extension_module_regsms->addCustomer($customer_data);

					$address_data = array(
						'firstname'			=> $this->request->post['telephone'],						
						'telephone'			=> $this->request->post['telephone'],
						'zone_id'			=> $this->config->get('config_zone_id'),
						'country_id'		=> $this->config->get('config_country_id'),
						'default'			=> true
					);

					$this->model_extension_module_regsms->addAddress($customer_id, $address_data);				

				} 

				if ($this->customer->loginSms($this->request->post['telephone'])) {
					$this->load->model('account/address');

					if ($this->config->get('config_tax_customer') == 'payment') {
						$this->session->data['payment_address'] = $this->model_account_address->getAddress($this->customer->getAddressId());
					}

					if ($this->config->get('config_tax_customer') == 'shipping') {
						$this->session->data['shipping_address'] = $this->model_account_address->getAddress($this->customer->getAddressId());
					}


					$json['redirect'] = $this->url->link('account/account', '', true);
					$json['success'] = true;
				}
				
			} else {
				$json['error'] = true;
			}
		} else {
			$json['error'] = true;
		}		


		$this->response->addHeader('Content-Type: application/json');
		$this->response->setOutput(json_encode($json));
	}

	public function form_code() {

		if (isset($this->request->get['telephone']) && isset($this->session->data['regsms'][$this->request->get['telephone']])) {
			$this->load->language('extension/module/regsms');

			$data['text_regsms_send_code_header'] = sprintf($this->language->get('text_regsms_send_code_header'),$this->session->data['regsms'][$this->request->get['telephone']]['telephone']);
			$data['telephone'] = $this->request->get['telephone'];

			$this->response->setOutput($this->load->view('extension/module/regsms_code', $data));
		}
		
	}

	public function offer() {

		$this->load->language('extension/module/regsms');
		$data['module_regsms_offer'] = htmlspecialchars_decode($this->config->get('module_regsms_offer'));

		$this->response->setOutput($this->load->view('extension/module/regsms_offer', $data));
	}

	public function sendcode() {

		$json = array();
		$code = '';

		$this->load->language('extension/module/regsms');
		$this->load->model('extension/module/regsms');
		

		$telephone = $this->validateTelephone($this->request->post['telephone']);

		if (!$telephone) {
			$json['error']['telephone'] = $this->language->get('text_regsms_error_telephone');
		}

		if (isset($this->session->data['regsms'][$telephone]['time']) && $this->session->data['regsms'][$telephone]['telephone'] == $this->request->post['telephone'] && ($this->session->data['regsms'][$telephone]['time'] + (int)$this->config->get('module_regsms_time_session')) >= time()) {
			$json['error']['session'] = sprintf($this->language->get('text_regsms_error_session'), ($this->session->data['regsms'][$telephone]['time'] + (int)$this->config->get('module_regsms_time_session') - time()));
		}

		$telephone_info = $this->model_extension_module_regsms->getTelephone($telephone);
		if ($telephone_info && !$json) {
			if (($telephone_info['time'] + (int)$this->config->get('module_regsms_time_session')) >= time()) {
				$json['error']['session'] = sprintf($this->language->get('text_regsms_error_session'), ($telephone_info['time'] + (int)$this->config->get('module_regsms_time_session') - time()));
			}
		}

		if (!$json) {

			$param = '';
			$param .= '<?xml version="1.0" encoding="utf-8"?>' . $this->eol;
			$param .= '<request>' . $this->eol;
				$param .= '<security>' . $this->eol;
					$param .= '<login>' . $this->config->get('module_regsms_login') . '</login>' . $this->eol;
					$param .= '<password>' . $this->config->get('module_regsms_password') . '</password>' . $this->eol;
				$param .= '</security>' . $this->eol;
				$param .= '<phone>' . $telephone . '</phone>' . $this->eol;
				$param .= '<sender>' . $this->config->get('module_regsms_from') . '</sender>' . $this->eol;
				$param .= '<random_string_len>' . $this->config->get('module_regsms_count_code') . '</random_string_len>' . $this->eol;
				$param .= '<text>' . $this->config->get('module_regsms_text_sms') . '</text>' . $this->eol;
			$param .= '</request>' . $this->eol;

	        
	 		/*$xml = '<?xml version="1.0" encoding="utf-8"?><response><success code="13800" id_sms="2075083947" status="send" /></response>';*/

	 		$result = $this->getRequest($param);
			
			if (isset($result->success)) {
				if (isset($result->success['code'][0]) && $result->success['code'][0]) {
					$code = (string)$result->success['code'][0];
				}			
			}

			
		}

		if ($code) {
			$time = time();
			$this->session->data['regsms'][$telephone]['code'] = $code;
			$this->session->data['regsms'][$telephone]['time'] = $time;
			$this->session->data['regsms'][$telephone]['telephone'] = $this->request->post['telephone'];
			$this->model_extension_module_regsms->addTelephoneCode($telephone, $code, $time);
			$json['telephone'] = $telephone;
		}



		


		//var_dump($json);
		


		$this->response->addHeader('Content-Type: application/json');
		$this->response->setOutput(json_encode($json));
		
	}

	private function validateTelephone($phone) {
        
        $phone = str_replace(")","",$phone);
        $phone = str_replace("(","",$phone);
        $phone = str_replace("-","",$phone);
        $phone = str_replace(" ","",$phone);
        $phone = str_replace("+","",$phone);

        $first_3 = substr($phone,0,3);
        $first_1 = substr($phone,0,1);
        $error = 0;

        if (($first_3 == '380') || ($first_3 == '375')) {
            $last = substr($phone,3);
            if (strlen($last) == 9) {
                $phone = "+" . $phone;
            } else {
                $error = 1;
            }
            
        } elseif ($first_1 == '7') {
            $last = substr($phone,1);
            if (strlen($last) == 10) {
                $phone = "+" . $phone;
            } else {
                $error = 1;
            }

        } elseif ($first_1 == '8') {
            $last = substr($phone,1);
            if (strlen($last) == 10) {
                $phone = "+7" . $last;
            } else {
                $error = 1;
            }
        } else {
            $error = 1;
        }

        if (!$error) {
            return $phone; 
        } else {
            return false; 
        }
        
    }

    public function getRequest($param) {

		$param_xml = $param;      
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: text/xml','charset=utf8'));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $param_xml);
        curl_setopt($ch, CURLOPT_TIMEOUT, 600);
        curl_setopt($ch, CURLOPT_URL, $this->host);
        curl_setopt ($ch, CURLOPT_SSL_VERIFYPEER, 0);
        curl_setopt ($ch, CURLOPT_SSL_VERIFYHOST, 0);
        $res = curl_exec($ch);
        
        $xml = simplexml_load_string($res);
        curl_close($ch);

        return $xml;

	}


}
