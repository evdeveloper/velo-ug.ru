<?php
class ControllerExtensionModuleSmsReg extends Controller {
	private $error = array();

	public function index() {
		$this->load->language('extension/module/sms_reg');
		$this->document->setTitle($this->language->get('title'));
		
		$this->load->model('setting/setting');
		$this->document->addScript('view/javascript/jquery/LC-switch-master/lc_switch.min.js');
		$this->document->addStyle('view/javascript/jquery/LC-switch-master/lc_switch.css');
		$this->document->addScript('view/javascript/jquery/bootstrap-checkbox/dist/js/bootstrap-checkbox.js');

		if (($this->request->server['REQUEST_METHOD'] == 'POST') && $this->validate()) {
			$this->model_setting_setting->editSetting('module_sms_reg', $this->request->post);

			$this->session->data['success'] = $this->language->get('text_success');

			$this->response->redirect($this->url->link('marketplace/extension', 'user_token=' . $this->session->data['user_token'] . '&type=module', true));
		}



		if (isset($this->error['module_sms_reg_warning'])) {
			$data['error_module_sms_reg_warning'] = $this->error['module_sms_reg_warning'];
		} else {
			$data['error_module_sms_reg_warning'] = '';
		}

		if (isset($this->error['module_sms_reg_name'])) {
			$data['error_module_sms_reg_name'] = $this->error['module_sms_reg_name'];
		} else {
			$data['error_module_sms_reg_name'] = '';
		}
		if (isset($this->error['module_sms_reg_bottom'])) {
			$data['error_module_sms_reg_bottom'] = $this->error['module_sms_reg_bottom'];
		} else {
			$data['error_module_sms_reg_bottom'] = '';
		}

		if (isset($this->error['module_sms_reg_password'])) {
			$data['error_module_sms_reg_password'] = $this->error['module_sms_reg_password'];
		} else {
			$data['error_module_sms_reg_password'] = '';
		}
          
        if (isset($this->error['module_sms_reg_from'])) {
			$data['error_module_sms_reg_from'] = $this->error['module_sms_reg_from'];
		} else {
			$data['error_module_sms_reg_from'] = '';
		} 
		if (isset($this->error['module_sms_reg_name_turbosms'])) {
			$data['error_module_sms_reg_name_turbosms'] = $this->error['module_sms_reg_name_turbosms'];
		} else {
			$data['error_module_sms_reg_name_turbosms'] = '';
		} 
		if (isset($this->error['module_sms_reg_password_turbosms'])) {
			$data['error_module_sms_reg_password_turbosms'] = $this->error['module_sms_reg_password_turbosms'];
		} else {
			$data['error_module_sms_reg_password_turbosms'] = '';
		}
		if (isset($this->error['module_sms_reg_from_turbosms'])) {
			$data['error_module_sms_reg_from_turbosms'] = $this->error['module_sms_reg_from_turbosms'];
		} else {
			$data['error_module_sms_reg_from_turbosms'] = '';
		}
		
		 if (isset($this->error['module_sms_reg_name_smsassistent'])) {
            $data['error_module_sms_reg_name_smsassistent'] = $this->error['module_sms_reg_name_smsassistent'];
        } else {
            $data['error_module_sms_reg_name_smsassistent'] = '';
        }
        if (isset($this->error['module_sms_reg_password_smsassistent'])) {
            $data['error_module_sms_reg_password_smsassistent'] = $this->error['module_sms_reg_password_smsassistent'];
        } else {
            $data['error_module_sms_reg_password_smsassistent'] = '';
        }
        if (isset($this->error['module_sms_reg_from_smsassistent'])) {
            $data['error_module_sms_reg_from_smsassistent'] = $this->error['module_sms_reg_from_smsassistent'];
        } else {
            $data['error_module_sms_reg_from_smsassistent'] = '';
        }
		
		if (isset($this->error['module_sms_reg_name_targetsms'])) {
            $data['error_module_sms_reg_name_targetsms'] = $this->error['module_sms_reg_name_targetsms'];
        } else {
            $data['error_module_sms_reg_name_targetsms'] = '';
        }
        if (isset($this->error['module_sms_reg_password_targetsms'])) {
            $data['error_module_sms_reg_password_targetsms'] = $this->error['module_sms_reg_password_targetsms'];
        } else {
            $data['error_module_sms_reg_password_targetsms'] = '';
        }
        if (isset($this->error['module_sms_reg_from_targetsms'])) {
            $data['error_module_sms_reg_from_targetsms'] = $this->error['module_sms_reg_from_targetsms'];
        } else {
            $data['error_module_sms_reg_from_targetsms'] = '';
        }

        if (isset($this->error['module_sms_reg_name_eskiz'])) {
            $data['error_module_sms_reg_name_eskiz'] = $this->error['module_sms_reg_name_eskiz'];
        } else {
            $data['error_module_sms_reg_name_eskiz'] = '';
        }
        if (isset($this->error['module_sms_reg_password_eskiz'])) {
            $data['error_module_sms_reg_password_eskiz'] = $this->error['module_sms_reg_password_eskiz'];
        } else {
            $data['error_module_sms_reg_password_eskiz'] = '';
        }
        if (isset($this->error['module_sms_reg_from_eskiz'])) {
            $data['error_module_sms_reg_from_eskiz'] = $this->error['module_sms_reg_from_eskiz'];
        } else {
            $data['error_module_sms_reg_from_eskiz'] = '';
        }

        if (isset($this->error['module_sms_reg_smsru_api'])) {
			$data['error_module_sms_reg_smsru_api'] = $this->error['module_sms_reg_smsru_api'];
		} else {
			$data['error_module_sms_reg_smsru_api'] = '';
		} 
		if (isset($this->error['sms_reg_smsru_from'])) {
			$data['error_sms_reg_smsru_from'] = $this->error['sms_reg_smsru_from'];
		} else {
			$data['error_sms_reg_smsru_from'] = '';
		} 
		 if (isset($this->error['module_sms_reg_message'])) {
			$data['error_module_sms_reg_message'] = $this->error['module_sms_reg_message'];
		} else {
			$data['error_module_sms_reg_message'] = '';
		} 
		 if (isset($this->error['module_sms_reg_session'])) {
			$data['error_module_sms_reg_session'] = $this->error['module_sms_reg_session'];
		} else {
			$data['error_module_sms_reg_session'] = '';
		} 
		$data['breadcrumbs'] = array();

		$data['breadcrumbs'][] = array(
			'text' => $this->language->get('text_home'),
			'href' => $this->url->link('common/dashboard', 'user_token=' . $this->session->data['user_token'], true)
		);

		$data['breadcrumbs'][] = array(
			'text' => $this->language->get('text_extension'),
			'href' => $this->url->link('marketplace/extension', 'user_token=' . $this->session->data['user_token'] . '&type=module', true)
		);

		if (!isset($this->request->get['module_id'])) {
			$data['breadcrumbs'][] = array(
				'text' => $this->language->get('heading_title'),
				'href' => $this->url->link('extension/module/sms_reg', 'user_token=' . $this->session->data['user_token'], true)
			);
		} else {
			$data['breadcrumbs'][] = array(
				'text' => $this->language->get('heading_title'),
				'href' => $this->url->link('extension/module/sms_reg', 'user_token=' . $this->session->data['user_token'] . '&module_id=' . $this->request->get['module_id'], true)
			);
		}

		
		$data['action'] = $this->url->link('extension/module/sms_reg', 'user_token=' . $this->session->data['user_token'], true);
		$data['cancel'] = $this->url->link('marketplace/extension', 'user_token=' . $this->session->data['user_token'] . '&type=module', true);

		
		$data['user_token'] = $this->session->data['user_token'];
		
		if (isset($this->request->post['module_sms_reg_variant'])) {
			$data['module_sms_reg_variant'] = $this->request->post['module_sms_reg_variant'];
		} elseif (!empty($this->config->get('module_sms_reg_variant'))) {
			$data['module_sms_reg_variant'] = $this->config->get('module_sms_reg_variant');
		} else {
			$data['module_sms_reg_variant'] = '';
		}

		if (isset($this->request->post['module_sms_reg_name'])) {
			$data['module_sms_reg_name'] = $this->request->post['module_sms_reg_name'];
		} elseif (!empty($this->config->get('module_sms_reg_name'))) {
			$data['module_sms_reg_name'] = $this->config->get('module_sms_reg_name');
		} else {
			$data['module_sms_reg_name'] = '';
		}

		$this->load->model('catalog/product');

		if (isset($this->request->post['module_sms_reg_name_turbosms'])) {
			$data['module_sms_reg_name_turbosms'] = $this->request->post['module_sms_reg_name_turbosms'];
		} elseif (!empty($this->config->get('module_sms_reg_name_turbosms'))) {
			$data['module_sms_reg_name_turbosms'] = $this->config->get('module_sms_reg_name_turbosms');
		} else {
			$data['module_sms_reg_name_turbosms'] = '';
		}
		if (isset($this->request->post['module_sms_reg_password_turbosms'])) {
			$data['module_sms_reg_password_turbosms'] = $this->request->post['module_sms_reg_password_turbosms'];
		} elseif (!empty($this->config->get('module_sms_reg_password_turbosms'))) {
			$data['module_sms_reg_password_turbosms'] = $this->config->get('module_sms_reg_password_turbosms');
		} else {
			$data['module_sms_reg_password_turbosms'] = '';
		}
		if (isset($this->request->post['module_sms_reg_from_turbosms'])) {
			$data['module_sms_reg_from_turbosms'] = $this->request->post['module_sms_reg_from_turbosms'];
		} elseif (!empty($this->config->get('module_sms_reg_from_turbosms'))) {
			$data['module_sms_reg_from_turbosms'] = $this->config->get('module_sms_reg_from_turbosms');
		} else {
			$data['module_sms_reg_from_turbosms'] = '';
		}

		if (isset($this->request->post['module_sms_reg_name_smsassistent'])) {
            $data['module_sms_reg_name_smsassistent'] = $this->request->post['module_sms_reg_name_smsassistent'];
        } elseif (!empty($this->config->get('module_sms_reg_name_smsassistent'))) {
            $data['module_sms_reg_name_smsassistent'] = $this->config->get('module_sms_reg_name_smsassistent');
        } else {
            $data['module_sms_reg_name_smsassistent'] = '';
        }
        if (isset($this->request->post['module_sms_reg_password_smsassistent'])) {
            $data['module_sms_reg_password_smsassistent'] = $this->request->post['module_sms_reg_password_smsassistent'];
        } elseif (!empty($this->config->get('module_sms_reg_password_smsassistent'))) {
            $data['module_sms_reg_password_smsassistent'] = $this->config->get('module_sms_reg_password_smsassistent');
        } else {
            $data['module_sms_reg_password_smsassistent'] = '';
        }
        if (isset($this->request->post['module_sms_reg_from_smsassistent'])) {
            $data['module_sms_reg_from_smsassistent'] = $this->request->post['module_sms_reg_from_smsassistent'];
        } elseif (!empty($this->config->get('module_sms_reg_from_smsassistent'))) {
            $data['module_sms_reg_from_smsassistent'] = $this->config->get('module_sms_reg_from_smsassistent');
        } else {
            $data['module_sms_reg_from_smsassistent'] = '';
        }
		
		if (isset($this->request->post['module_sms_reg_name_targetsms'])) {
            $data['module_sms_reg_name_targetsms'] = $this->request->post['module_sms_reg_name_targetsms'];
        } elseif (!empty($this->config->get('module_sms_reg_name_targetsms'))) {
            $data['module_sms_reg_name_targetsms'] = $this->config->get('module_sms_reg_name_targetsms');
        } else {
            $data['module_sms_reg_name_targetsms'] = '';
        }
        if (isset($this->request->post['module_sms_reg_password_targetsms'])) {
            $data['module_sms_reg_password_targetsms'] = $this->request->post['module_sms_reg_password_targetsms'];
        } elseif (!empty($this->config->get('module_sms_reg_password_targetsms'))) {
            $data['module_sms_reg_password_targetsms'] = $this->config->get('module_sms_reg_password_targetsms');
        } else {
            $data['module_sms_reg_password_targetsms'] = '';
        }
        if (isset($this->request->post['module_sms_reg_from_targetsms'])) {
            $data['module_sms_reg_from_targetsms'] = $this->request->post['module_sms_reg_from_targetsms'];
        } elseif (!empty($this->config->get('module_sms_reg_from_targetsms'))) {
            $data['module_sms_reg_from_targetsms'] = $this->config->get('module_sms_reg_from_targetsms');
        } else {
            $data['module_sms_reg_from_targetsms'] = '';
        }

        if (isset($this->request->post['module_sms_reg_name_eskiz'])) {
            $data['module_sms_reg_name_eskiz'] = $this->request->post['module_sms_reg_name_eskiz'];
        } elseif (!empty($this->config->get('module_sms_reg_name_eskiz'))) {
            $data['module_sms_reg_name_eskiz'] = $this->config->get('module_sms_reg_name_eskiz');
        } else {
            $data['module_sms_reg_name_eskiz'] = '';
        }
        if (isset($this->request->post['module_sms_reg_password_eskiz'])) {
            $data['module_sms_reg_password_eskiz'] = $this->request->post['module_sms_reg_password_eskiz'];
        } elseif (!empty($this->config->get('module_sms_reg_password_eskiz'))) {
            $data['module_sms_reg_password_eskiz'] = $this->config->get('module_sms_reg_password_eskiz');
        } else {
            $data['module_sms_reg_password_eskiz'] = '';
        }
        if (isset($this->request->post['module_sms_reg_from_eskiz'])) {
            $data['module_sms_reg_from_eskiz'] = $this->request->post['module_sms_reg_from_eskiz'];
        } elseif (!empty($this->config->get('module_sms_reg_from_eskiz'))) {
            $data['module_sms_reg_from_eskiz'] = $this->config->get('module_sms_reg_from_eskiz');
        } else {
            $data['module_sms_reg_from_eskiz'] = '';
        }

		if (isset($this->request->post['module_sms_reg_password'])) {
			$data['module_sms_reg_password'] = $this->request->post['module_sms_reg_password'];
		} elseif (!empty($this->config->get('module_sms_reg_password'))) {
			$data['module_sms_reg_password'] = $this->config->get('module_sms_reg_password');
		} else {
			$data['module_sms_reg_password'] = '';
		}
		
		if (isset($this->request->post['module_sms_reg_smsru_api'])) {
			$data['module_sms_reg_smsru_api'] = $this->request->post['module_sms_reg_smsru_api'];
		} elseif (!empty($this->config->get('module_sms_reg_smsru_api'))) {
			$data['module_sms_reg_smsru_api'] = $this->config->get('module_sms_reg_smsru_api');
		} else {
			$data['module_sms_reg_smsru_api'] = '';
		}
		
		if (isset($this->request->post['module_sms_reg_smsru_from'])) {
			$data['module_sms_reg_smsru_from'] = $this->request->post['module_sms_reg_smsru_from'];
		} elseif (!empty($this->config->get('module_sms_reg_smsru_from'))) {
			$data['module_sms_reg_smsru_from'] = $this->config->get('module_sms_reg_smsru_from');
		} else {
			$data['module_sms_reg_smsru_from'] = '';
		}
		
        if (isset($this->request->post['module_sms_reg_from'])) {
			$data['module_sms_reg_from'] = $this->request->post['module_sms_reg_from'];
		} elseif (!empty($this->config->get('module_sms_reg_from'))) {
			$data['module_sms_reg_from'] = $this->config->get('module_sms_reg_from');
		} else {
			$data['module_sms_reg_from'] = '';
		}
        
		if (isset($this->request->post['module_sms_reg_bottom'])) {
			$data['module_sms_reg_bottom'] = $this->request->post['module_sms_reg_bottom'];
		} elseif (!empty($this->config->get('module_sms_reg_bottom'))) {
			$data['module_sms_reg_bottom'] = $this->config->get('module_sms_reg_bottom');
		} else {
			$data['module_sms_reg_bottom'] = '';
		}     

		
               
		if (isset($this->request->post['module_sms_reg_message'])) {
			$data['module_sms_reg_message'] = $this->request->post['module_sms_reg_message'];
		} elseif (!empty($this->config->get('module_sms_reg_message'))) {
			$data['module_sms_reg_message'] = $this->config->get('module_sms_reg_message');
		} else {
			$data['module_sms_reg_message'] = '';
		}
		
		if (isset($this->request->post['module_sms_reg_session'])) {
			$data['module_sms_reg_session'] = $this->request->post['module_sms_reg_session'];
		} elseif (!empty($this->config->get('module_sms_reg_session'))) {
			$data['module_sms_reg_session'] = $this->config->get('module_sms_reg_session');
		} else {
			$data['module_sms_reg_session'] = '';
		}


        $data['form_mask'] = array();

        $this->load->model('tool/image');
        $data['placeholder_form'] = $this->model_tool_image->resize('no_image.png', 30, 30);

        if (isset($this->request->post['module_sms_reg_form_mask'])) {
            $form_mask = $this->request->post['module_sms_reg_form_mask'];
        } elseif (!empty($this->config->get('module_sms_reg_form_mask'))) {
            $form_mask = $this->config->get('module_sms_reg_form_mask');
        } else {
            $form_mask = array();
        }
        foreach ($form_mask as $key => $mask) {

            if (isset($mask['status'])) {
                $status = $mask['status'];
            } else {
                $status = '';
            }

            if (is_file(DIR_IMAGE . $mask['image'])) {
                $image = $mask['image'];
                $thumb = $mask['image'];
            } else {
                $image = '';
                $thumb = 'no_image.png';
            }
            $data['form_mask'][] = array(
                'region'      => $mask['region'],
                'mask'      => $mask['mask'],
                'placeholder'       => $mask['placeholder'],
                'status'       => $status,
                'image'      => $image,
                'thumb'      => $this->model_tool_image->resize($thumb, 30, 30)
            );
        }
//echo '<pre>'; print_r($data); echo '</pre>';
		/*if (isset($this->request->post['module_sms_reg_status_mask1'])) {
			$data['module_sms_reg_status_mask1'] = $this->request->post['module_sms_reg_status_mask1'];
		} elseif (!empty($this->config->get('module_sms_reg_status_mask1'))) {
			$data['module_sms_reg_status_mask1'] = $this->config->get('module_sms_reg_status_mask1');
		} else {
			$data['module_sms_reg_status_mask1'] = '';
		}
		
		if (isset($this->request->post['module_sms_reg_status_mask2'])) {
			$data['module_sms_reg_status_mask2'] = $this->request->post['module_sms_reg_status_mask2'];
		} elseif (!empty($this->config->get('module_sms_reg_status_mask2'))) {
			$data['module_sms_reg_status_mask2'] = $this->config->get('module_sms_reg_status_mask2');
		} else {
			$data['module_sms_reg_status_mask2'] = '';
		}

        if (isset($this->request->post['module_sms_reg_status_mask3'])) {
            $data['module_sms_reg_status_mask3'] = $this->request->post['module_sms_reg_status_mask3'];
        } elseif (!empty($this->config->get('module_sms_reg_status_mask3'))) {
            $data['module_sms_reg_status_mask3'] = $this->config->get('module_sms_reg_status_mask3');
        } else {
            $data['module_sms_reg_status_mask3'] = '';
        }
		
		if (isset($this->request->post['module_sms_reg_mask1'])) {
			$data['module_sms_reg_mask1'] = $this->request->post['module_sms_reg_mask1'];
		} elseif (!empty($this->config->get('module_sms_reg_mask1'))) {
			$data['module_sms_reg_mask1'] = $this->config->get('module_sms_reg_mask1');
		} else {
			$data['module_sms_reg_mask1'] = '';
		}
		
		if (isset($this->request->post['module_sms_reg_mask2'])) {
			$data['module_sms_reg_mask2'] = $this->request->post['module_sms_reg_mask2'];
		} elseif (!empty($this->config->get('module_sms_reg_mask2'))) {
			$data['module_sms_reg_mask2'] = $this->config->get('module_sms_reg_mask2');
		} else {
			$data['module_sms_reg_mask2'] = '';
		}
        if (isset($this->request->post['module_sms_reg_mask3'])) {
            $data['module_sms_reg_mask3'] = $this->request->post['module_sms_reg_mask3'];
        } elseif (!empty($this->config->get('module_sms_reg_mask3'))) {
            $data['module_sms_reg_mask3'] = $this->config->get('module_sms_reg_mask3');
        } else {
            $data['module_sms_reg_mask3'] = '';
        }*/




		if (isset($this->request->post['module_sms_reg_status'])) {
			$data['module_sms_reg_status'] = $this->request->post['module_sms_reg_status'];
		} elseif (!empty($this->config->get('module_sms_reg_status'))) {
			$data['module_sms_reg_status'] = $this->config->get('module_sms_reg_status');
		} else {
			$data['module_sms_reg_status'] = '';
		}
		$data['header'] = $this->load->controller('common/header');
		$data['column_left'] = $this->load->controller('common/column_left');
		$data['footer'] = $this->load->controller('common/footer');

		$this->response->setOutput($this->load->view('extension/module/sms_reg', $data));
	}

	protected function validate() {
		if (!$this->user->hasPermission('modify', 'extension/module/sms_reg')) {
			$this->error['module_sms_reg_warning'] = $this->language->get('error_module_sms_reg_permission');
		}



		if ((utf8_strlen($this->request->post['module_sms_reg_bottom']) < 3) || (utf8_strlen($this->request->post['module_sms_reg_bottom']) > 64)) {
			$this->error['module_sms_reg_bottom'] = $this->language->get('error_module_sms_reg_name');
		}

		return !$this->error;
	}
}
