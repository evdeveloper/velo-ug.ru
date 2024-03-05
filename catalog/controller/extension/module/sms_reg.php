<?php
class ControllerExtensionModuleSmsReg extends Controller {

    public function index()     {

        $this->load->language('extension/module/sms_reg');
        $data['sms_log'] = $this->language->get('sms_log');
        $data['sms_log_p'] = $this->language->get('sms_log_p');
        $data['entry_phone'] = $this->language->get('entry_phone');
        $data['entry_code'] = $this->language->get('entry_code');
        $data['button_sms_prov'] = $this->language->get('button_sms_prov');
        $data['button_sms_login'] = $this->language->get('button_sms_login');
        $data['text_purple'] = $this->language->get('text_purple');
        $data['text_loading'] = $this->language->get('text_loading');
        $this->document->addScript('catalog/view/javascript/jquery/jquery.maskedinput.js');
		$this->document->addScript('catalog/view/javascript/jquery/jquery.ddslick.min.js');
		$this->load->model('tool/image');
		$data['mask_region'] = array();

        if($this->config->get('module_sms_reg_form_mask')) {
            foreach ($this->config->get('module_sms_reg_form_mask') as $mask) {
				if (isset($mask['status'])) {
					if (is_file(DIR_IMAGE . $mask['image'])) {
						$image = $mask['image'];

					} else {
						$image = 'no_image.png';
						   }
					$data['mask_region'][] = array(
						'region'      => $mask['region'],
						'mask'      => $mask['mask'],
						'placeholder'       => $mask['placeholder'],
						'image'      => $this->model_tool_image->resize($image, 24, 19)

					);
				}
            }

        }

        if ($this->customer->isLogged()) {
            $data['login'] = true;
        } else {
            $data['login'] = false;
        }

        return $this->load->view('extension/module/sms_reg', $data);
    }

    public function num_word($value, $words, $show = true) {
        $num = $value % 100;
        if ($num > 19) {
            $num = $num % 10;
        }

        $out = ($show) ?  $value . ' ' : '';
        switch ($num) {
            case 1:  $out .= $words[0]; break;
            case 2:
            case 3:
            case 4:  $out .= $words[1]; break;
            default: $out .= $words[2]; break;
        }

        return $out;
    }
    public function ok_code($tel)
    {
        $code = substr(hexdec(substr(md5($tel . rand(100, 900)), 0, 6)),0, 4);

        $this->session->data['code_sms'] = $code;
        $this->session->data['sms_tel'] = $tel;
        return $code;
    }

    public function SmsCheck()
    {
		$this->load->language('extension/module/sms_reg');
		
        if ($this->config->get('module_sms_reg_variant') == 'smscru') {
            $this->load->library('smsc_api');
            if (!empty($this->config->get('module_sms_reg_name'))) {
                $this->smsc_api->setSmslogin($this->config->get('module_sms_reg_name'));
            }
            if (!empty($this->config->get('module_sms_reg_password'))) {
                $this->smsc_api->setSmspassword($this->config->get('module_sms_reg_password'));

            }
            if (!empty($this->config->get('module_sms_reg_from'))) {
                $this->smsc_api->setSmsfrom($this->config->get('module_sms_reg_from'));
            }
        } elseif ($this->config->get('module_sms_reg_variant') == 'smsru') {
            require_once(DIR_SYSTEM . 'library/smsru_php/smsru.php');
            $this->smsc_api = new SMSRU($this->config->get('module_sms_reg_smsru_api'));

        } elseif ($this->config->get('module_sms_reg_variant') == 'smsassistent') {
            $this->load->library('sms_assistent');
            if (!empty($this->config->get('module_sms_reg_name_smsassistent'))) {
                $this->sms_assistent->setSmslogin($this->config->get('module_sms_reg_name_smsassistent'));
            }
            if (!empty($this->config->get('module_sms_reg_password_smsassistent'))) {
                $this->sms_assistent->setSmspassword($this->config->get('module_sms_reg_password_smsassistent'));

            }

        } elseif ($this->config->get('module_sms_reg_variant') == 'targetsms') {
            $this->load->library('targetsms');
            if (!empty($this->config->get('module_sms_reg_name_targetsms'))) {
                $this->targetsms->setSmslogin($this->config->get('module_sms_reg_name_targetsms'));
            }
            if (!empty($this->config->get('module_sms_reg_password_targetsms'))) {
                $this->targetsms->setSmspassword($this->config->get('module_sms_reg_password_targetsms'));
            }
            if (!empty($this->config->get('module_sms_reg_from_targetsms'))) {
                $this->targetsms->setSmsfrom($this->config->get('module_sms_reg_from_targetsms'));
            }
           $this->targetsms->setDomen($this->request->server['HTTP_HOST']);


        }
		
        $json = array();

        if (isset($this->request->post["phone"])) {
			$telephone = preg_replace('/[^-\+\(\)\d\s+]/','',$this->request->post["phone"]);
			
            if (!isset($this->session->data['session_time_sms_reg'])) {
                $this->session->data['session_time_sms_reg'] = time();
                if ($this->config->get('module_sms_reg_variant') == 'smscru') {
                    $r = $this->smsc_api->send_sms($telephone, $this->config->get('module_sms_reg_message') . $this->ok_code($telephone));

                    if ($r[1] > 0) {
                        $json['success'] = sprintf($this->language->get('text_code_success'),$telephone);
					} else {
						$json['error'] = $this->language->get('text_code_error');
                        unset($this->session->data['session_time_sms_reg']);
                    }
                } elseif ($this->config->get('module_sms_reg_variant') == 'smsru') {
                    $data = new stdClass();
                    $data->to = $telephone;
                    $data->translit = 1;
                    $data->msg = $this->config->get('module_sms_reg_message') . $this->ok_code($telephone); // Текст сообщения
                    if (!empty($this->config->get('module_sms_reg_smsru_from'))) {
                        $data->from = $this->config->get('module_sms_reg_smsru_from');
                    }
                    $sms = $this->smsc_api->send_one($data);
                    if ($sms->status == "OK") { // Запрос выполнен успешно
                        $json['success'] = sprintf($this->language->get('text_code_success'),$telephone);
					} else {
						$json['error'] = $this->language->get('text_code_error');
                        unset($this->session->data['session_time_sms_reg']);
                    }
                } elseif ($this->config->get('module_sms_reg_variant') == 'turbosms') { 
					if (!empty($this->config->get('module_sms_reg_from_turbosms'))) {
						$status = $this->SoapCl('http://turbosms.in.ua/api/wsdl.html', $this->config->get('module_sms_reg_name_turbosms'), $this->config->get('module_sms_reg_password_turbosms'), $this->config->get('module_sms_reg_from_turbosms'), $telephone, $this->config->get('module_sms_reg_message') . $this->ok_code($telephone));
						if ($status->GetMessageStatusResult == 'Сообщение доставлено получателю') {
							$json['success'] = sprintf($this->language->get('text_code_success'),$telephone);
						} elseif (preg_match("/(В очереди|Отправлено|Сообщение передано в мобильную сеть)/iu",$status->GetMessageStatusResult)) {
							$json['success'] = sprintf($this->language->get('text_code_success'),$telephone,$status->GetMessageStatusResult);
							
						} else {
							$json['error'] = $this->language->get('text_code_error');
                            unset($this->session->data['session_time_sms_reg']);
						}
					} else {
						$json['error'] = $this->language->get('text_code_error');
					}
				} elseif ($this->config->get('module_sms_reg_variant') == 'smsassistent') {
                    if (!empty($this->config->get('module_sms_reg_from_smsassistent'))) {
                        //$this->sms_assistent->setUrl('https://ta2.sms-assistent.by/');
                        $result = $this->sms_assistent->sendSms($this->config->get('module_sms_reg_from_smsassistent'), $telephone, $this->config->get('module_sms_reg_message') . $this->ok_code($telephone));
                        if ($result['error'] == false) {
                            $json['success'] = sprintf($this->language->get('text_code_success'),$telephone);
                        } else {
                            $json['error'] = $this->language->get('text_code_error');
                            unset($this->session->data['session_time_sms_reg']);
                        }
                    }
                } elseif ($this->config->get('module_sms_reg_variant') == 'eskiz') {
                    if (!empty($this->config->get('module_sms_reg_from_eskiz'))) {

                        $status_token = $this->eskiz_token($this->config->get('module_sms_reg_name_eskiz'), $this->config->get('module_sms_reg_password_eskiz'));
                        $status_token = json_decode($status_token);
                        if(isset($status_token->data->token)) {
                            $status = $this->eskiz($telephone, $status_token->data->token, $this->config->get('module_sms_reg_message') . $this->ok_code($telephone));
                            $status = json_decode($status);
                            // echo '<pre>'; print_r($status); die('</pre>') ;
                            if ($status->status == 'waiting') {
                                $json['success'] = sprintf($this->language->get('text_code_success'),$telephone);
                                    } else {
                                        $json['error'] = $this->language->get('text_code_error');
                                        unset($this->session->data['session_time_sms_reg']);
                                    }
                                } else {
                                    $json['error'] = $this->language->get('text_code_error');
                        }


                    } else {
                        $json['error'] = $this->language->get('text_code_error');
                    }
                } elseif ($this->config->get('module_sms_reg_variant') == 'ocdev') {
                         $this->load->model('extension/module/ocd_sms_notify');
    //Подготовка данных для отправки
                        $sms_data = [
                            'phone' => $telephone, //Номер телефона в международном формате
                            'message' => $this->config->get('module_sms_reg_message') . $this->ok_code($telephone) //Любой заранее подготовленный текст
                        ];
    //Отправка данных в модель
                        $status = $this->model_extension_module_ocd_sms_notify->sendSms($sms_data);
                            if ($status) {
                                $json['success'] = sprintf($this->language->get('text_code_success'),$telephone);
                            } else {
                                $json['error'] = $this->language->get('text_code_error');
                                unset($this->session->data['session_time_sms_reg']);
                            }

                } elseif ($this->config->get('module_sms_reg_variant') == 'targetsms') {
                    $this->targetsms->setPhone($telephone);
                    $this->targetsms->setMessage($this->config->get('module_sms_reg_message') . $this->ok_code($telephone));
                    $response_xml = $this->targetsms->curl_to();
                    $parseXml = $this->targetsms->parseXml($response_xml);
                    if ($parseXml[0]['value'] == 'send') {
                        $json['success'] = sprintf($this->language->get('text_code_success'),$telephone);
                        // $status_xml = $this->targetsms->curl_to_status($parseXml[0]['id_sms']);
                    } else {
                        $json['error'] = $this->language->get('text_code_error');
                        unset($this->session->data['session_time_sms_reg']);
                    }

                }
				
            } else {
                if (time() >= (int)$this->session->data['session_time_sms_reg']+(int)$this->config->get('module_sms_reg_session')*60) {
                    $this->session->data['session_time_sms_reg'] = time();
                    if ($this->config->get('module_sms_reg_variant') == 'smscru') {
                    $r = $this->smsc_api->send_sms($telephone, $this->config->get('module_sms_reg_message') . $this->ok_code($telephone));

                    if ($r[1] > 0) {
                        $json['success'] = sprintf($this->language->get('text_code_success'),$telephone);
					} else {
						$json['error'] = $this->language->get('text_code_error');
                        unset($this->session->data['session_time_sms_reg']);
                    }
                } elseif ($this->config->get('module_sms_reg_variant') == 'smsru') {
                    $data = new stdClass();
                    $data->to = $telephone;
                    $data->translit = 1;
                    $data->msg = $this->config->get('module_sms_reg_message') . $this->ok_code($telephone); // Текст сообщения
                    if (!empty($this->config->get('module_sms_reg_smsru_from'))) {
                        $data->from = $this->config->get('module_sms_reg_smsru_from');
                    }
                    $sms = $this->smsc_api->send_one($data);
                    if ($sms->status == "OK") { // Запрос выполнен успешно
                        $json['success'] = sprintf($this->language->get('text_code_success'),$telephone);
					} else {
						$json['error'] = $this->language->get('text_code_error');
                        unset($this->session->data['session_time_sms_reg']);
                    }
                } elseif ($this->config->get('module_sms_reg_variant') == 'turbosms') { 
					if (!empty($this->config->get('module_sms_reg_from_turbosms'))) {
						$status = $this->SoapCl('http://turbosms.in.ua/api/wsdl.html', $this->config->get('module_sms_reg_name_turbosms'), $this->config->get('module_sms_reg_password_turbosms'), $this->config->get('module_sms_reg_from_turbosms'), $telephone, $this->config->get('module_sms_reg_message') . $this->ok_code($telephone));
						if ($status->GetMessageStatusResult == 'Сообщение доставлено получателю') {
							$json['success'] = sprintf($this->language->get('text_code_success'),$telephone);
						} elseif (preg_match("/(В очереди|Отправлено|Сообщение передано в мобильную сеть)/iu",$status->GetMessageStatusResult)) {
							$json['success'] = sprintf($this->language->get('text_code_success'),$telephone,$status->GetMessageStatusResult);
							
						} else {
							$json['error'] = $this->language->get('text_code_error');
                            unset($this->session->data['session_time_sms_reg']);
						}
					} else {
						$json['error'] = $this->language->get('text_code_error');
					}
				} elseif ($this->config->get('module_sms_reg_variant') == 'smsassistent') {
                    if (!empty($this->config->get('module_sms_reg_from_smsassistent'))) {
                        //$this->sms_assistent->setUrl('https://ta2.sms-assistent.by/');
                        $result = $this->sms_assistent->sendSms($this->config->get('module_sms_reg_from_smsassistent'), $telephone, $this->config->get('module_sms_reg_message') . $this->ok_code($telephone));
                        if ($result['error'] == false) {
                            $json['success'] = sprintf($this->language->get('text_code_success'),$telephone);
                        } else {
                            $json['error'] = $this->language->get('text_code_error');
                            unset($this->session->data['session_time_sms_reg']);
                        }
                    }
                } elseif ($this->config->get('module_sms_reg_variant') == 'eskiz') {
                    if (!empty($this->config->get('module_sms_reg_from_eskiz'))) {

                        $status_token = $this->eskiz_token($this->config->get('module_sms_reg_name_eskiz'), $this->config->get('module_sms_reg_password_eskiz'));
                        $status_token = json_decode($status_token);
                        if(isset($status_token->data->token)) {
                            $status = $this->eskiz($telephone, $status_token->data->token, $this->config->get('module_sms_reg_message') . $this->ok_code($telephone));
                            $status = json_decode($status);
                            // echo '<pre>'; print_r($status); die('</pre>') ;
                            if ($status->status == 'waiting') {
                                $json['success'] = sprintf($this->language->get('text_code_success'),$telephone);
                                    } else {
                                        $json['error'] = $this->language->get('text_code_error');
                                        unset($this->session->data['session_time_sms_reg']);
                                    }
                                } else {
                                    $json['error'] = $this->language->get('text_code_error');
                        }


                    } else {
                        $json['error'] = $this->language->get('text_code_error');
                    }
                } elseif ($this->config->get('module_sms_reg_variant') == 'ocdev') {
                         $this->load->model('extension/module/ocd_sms_notify');
    //Подготовка данных для отправки
                        $sms_data = [
                            'phone' => $telephone, //Номер телефона в международном формате
                            'message' => $this->config->get('module_sms_reg_message') . $this->ok_code($telephone) //Любой заранее подготовленный текст
                        ];
    //Отправка данных в модель
                        $status = $this->model_extension_module_ocd_sms_notify->sendSms($sms_data);
                            if ($status) {
                                $json['success'] = sprintf($this->language->get('text_code_success'),$telephone);
                            } else {
                                $json['error'] = $this->language->get('text_code_error');
                                unset($this->session->data['session_time_sms_reg']);
                            }

                } elseif ($this->config->get('module_sms_reg_variant') == 'targetsms') {
                    $this->targetsms->setPhone($telephone);
                    $this->targetsms->setMessage($this->config->get('module_sms_reg_message') . $this->ok_code($telephone));
                    $response_xml = $this->targetsms->curl_to();
                    $parseXml = $this->targetsms->parseXml($response_xml);
                    if ($parseXml[0]['value'] == 'send') {
                        $json['success'] = sprintf($this->language->get('text_code_success'),$telephone);
                        // $status_xml = $this->targetsms->curl_to_status($parseXml[0]['id_sms']);
                    } else {
                        $json['error'] = $this->language->get('text_code_error');
                        unset($this->session->data['session_time_sms_reg']);
                    }

                }
                } else {
                    $time_m = ceil((($this->session->data['session_time_sms_reg']+$this->config->get('module_sms_reg_session')*60) - time())/60);
                    $json['error'] = $this->language->get('text_minute'). $this->num_word($time_m, $this->language->get('text_array_minute'));
                }
            }



        }

        $this->response->addHeader('Content-Type: application/json');
        $this->response->setOutput(json_encode($json));
    }


    public function SmsStart()
    {
		if (isset($this->request->post["phone"])) {
            $this->load->language('extension/module/sms_reg');
            $telephone = preg_replace('/[^-\+\(\)\d\s+]/', '', $this->request->post["phone"]);
			$this->load->library('smsc_api');
			$json = array();

			$this->load->model('account/customer');
			$this->load->model('extension/module/sms_reg');
			if ($this->customer->isLogged()) {
				$this->load->model('account/activity');
				if ($this->session->data['code_sms'] == $this->request->post["code"]) {
					$activity_data = array(
						'customer_id' => $this->customer->getId(),
						'name' => $this->customer->getFirstName() . ' ' . $this->customer->getLastName()
					);

					$this->model_account_activity->addActivity('login', $activity_data);
					$json['success'] = true;
				}
				$json['islogged'] = true;
			} else if (isset($this->request->post['code']) && !empty($this->request->post['code'])) {
				if ($this->session->data['code_sms'] == $this->request->post["code"]) {
					$this->load->model('account/activity');
					if (!empty($telephone) && $telephone == $this->session->data['sms_tel']) {
						if (!$this->model_extension_module_sms_reg->loginTel($telephone)) {
							$this->model_extension_module_sms_reg->addCustomerTel($this->request->post);
							$this->model_extension_module_sms_reg->loginTel($telephone);
							unset($this->session->data['guest']);
							$activity_data = array(
								'customer_id' => $this->customer->getId(),
								'name' => $this->customer->getFirstName() . ' ' . $this->customer->getLastName()
							);

							$this->model_account_activity->addActivity('login', $activity_data);
							$json['registr'] = $this->language->get('text_sms_register');
						}
					}
				}
			} else {
				$json['error'] = $this->language->get('text_sms_error');
			}
			if (!$json) {

				unset($this->session->data['guest']);
				$this->load->model('account/activity');


				if ($this->session->data['code_sms'] == $this->request->post["code"]) {
					$activity_data = array(
						'customer_id' => $this->customer->getId(),
						'name' => $this->customer->getFirstName() . ' ' . $this->customer->getLastName()
					);

					$this->model_account_activity->addActivity('login', $activity_data);
					$json['success'] = $this->language->get('text_sms_success');
				} else {
					$json['error'] = $this->language->get('text_sms_code_error');
				}

			}

			$this->response->addHeader('Content-Type: application/json');
			$this->response->setOutput(json_encode($json));
		}
    }

	//Подключения Turbosms
	public function SoapCl($url, $login, $password, $sender, $destination, $text) 
	{
		$client = new SoapClient($url);
		$auth = [  
        'login' => $login,  
        'password' => $password  
    ];  

    // Авторизируемся на сервере  
    $result = $client->Auth($auth);  
	// Текст сообщения ОБЯЗАТЕЛЬНО отправлять в кодировке UTF-8  
    $text = iconv('windows-1251', 'utf-8', $text);  
	$sms = [  
        'sender' => $sender,  
        'destination' => $destination,  
        'text' => $text  
    ]; 
    $result = $client->SendSMS($sms); 
		
	$sms = ['MessageId' => $result->SendSMSResult->ResultArray[1]]; 
    $status = $client->GetMessageStatus($sms);
	return $status;
	}
	
    //Подключения eskiz
    public function eskiz_token($login, $password) {

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL => "notify.eskiz.uz/api/auth/login",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_POSTFIELDS => array('email' => $login,'password' => $password),
        ));

        $response = curl_exec($curl);

        curl_close($curl);

        return $response;
    }

    public function eskiz($to, $token, $content) {

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL => "notify.eskiz.uz/api/message/sms/send",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_POSTFIELDS => array('mobile_phone' => $to,'message' => $content),
            CURLOPT_HTTPHEADER => array(
                "Authorization: Bearer ".$token.""
            ),
        ));

        $response = curl_exec($curl);

        curl_close($curl);
        return $response;
    }
}