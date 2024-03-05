<?php

class ControllerExtensionModuleSms extends Controller
{
  public function index()
  {
    if (!$this->customer->isLogged()) {
      $status = $this->config->get('module_sms_status');

      if ($status) {
        $this->document->addScript('catalog/view/javascript/sms/sms-inputmask.js');
        $this->document->addScript('catalog/view/javascript/sms/sms.js');

        $this->load->language('extension/module/sms');

        $data['heading_title'] = $this->language->get('heading_title');
        $data['entry_telephone'] = $this->language->get('entry_telephone');
        $data['entry_getcode'] = $this->language->get('entry_getcode');
        $data['entry_code'] = $this->language->get('entry_code');
        $data['entry_sendcode'] = $this->language->get('entry_sendcode');
        $data['entry_back'] = $this->language->get('entry_back');
        $data['entry_repeat'] = $this->language->get('entry_repeat');
        $data['entry_password'] = $this->language->get('entry_password');
        $data['entry_new_password'] = $this->language->get('entry_new_password');
        $data['entry_success_password'] = $this->language->get('entry_success_password');
        $data['entry_continue_login'] = $this->language->get('entry_continue_login');
        $data['entry_send_again'] = $this->language->get('entry_send_again');

        if ($this->config->get('module_sms_phonemask')) {
          $data['phone_mask'] = $this->config->get('module_sms_phonemask');
        } else {
          $data['phone_mask'] = '(000)000-00-00';
        }

        $data['placeholder'] = $data['phone_mask'];
        if ($this->config->get('module_sms_phonemask_placeholder')) {
          $data['placeholder'] = $this->config->get('module_sms_phonemask_placeholder');
        }

        $data['method'] = 1;
        if ($this->config->get('module_sms_method')) {
          $data['method'] = $this->config->get('module_sms_method');
        }

        return $this->load->view('extension/module/sms', $data);
      }
    }

  }

  public function randomCode($n = 4)
  {
    $p = '';
    mt_srand(microtime(true));
    for ($i = 0; $i < $n; $i++) {
      $p .= mt_rand(0, 9);
    }
    return $p;
  }

  public function randomPassword($n = 8)
  {
    $data = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcefghijklmnopqrstuvwxyz';
    return substr(str_shuffle($data), 0, $n);
  }

  public function getCode()
  {
    $this->load->language('extension/module/sms');

    $json = array();
    if (($this->request->server['REQUEST_METHOD'] == 'POST')) {

      $post = new stdClass();

      $search_symbols = array('+', '-', '(', ')', ' ');

      $telephone = str_replace($search_symbols, '', $this->request->post['telephone']);

      if ($this->request->post['method'] == 2) {

        $this->load->model('extension/module/sms');

        $customer_info = $this->model_extension_module_sms->getCustomerByPhone($this->request->post['telephone']);

        if (!$customer_info) {
          $customer_info = $this->model_extension_module_sms->addCustomer($this->request->post['telephone']);
        }
      }

      if ($this->request->post['method'] != 3) {

        $post->to = $telephone;

        if ($this->config->get('module_sms_from')) {
          $post->from = $this->config->get('module_sms_from');
        }

        if ($this->config->get('module_sms_test')) {
          $post->test = $this->config->get('module_sms_test');
        }

        if ($this->config->get('module_sms_partner_id')) {
          $post->partner_id = $this->config->get('module_sms_partner_id');
        }

        if (isset($_SERVER['REMOTE_ADDR']) && $_SERVER['REMOTE_ADDR']) {
          $post->ip = $_SERVER['REMOTE_ADDR'];
        }

        $code = $this->randomCode(4);

        if ($this->request->post['method'] == 2) {
          $code = $this->randomPassword(8);
        }

        if ($this->request->server['HTTPS']) {
          $server = $this->config->get('config_ssl');
        } else {
          $server = $this->config->get('config_url');
        }

        $msg_symbols = ["%CODE%" => $code, "%SERVER%" => $server];
        $msg = strtr($this->config->get('module_sms_msg'), $msg_symbols);
        $post->msg = $msg;

        $sms = $this->sms->send_one($post);

        if ($sms->status == "OK") {
          $this->session->data['code'] = $code;
          $this->session->data['login_phone'] = $this->request->post['telephone'];
          if ($this->request->post['method'] == 2) {
            $this->model_extension_module_sms->changeCustomerPassword($customer_info['customer_id'], $code);
          }
          $message = $this->language->get('entry_msg');
          $json['phone_text'] = sprintf($message, $this->request->post['telephone']);
          $json['success'] = true;
        } else {
          $this->sms->log($sms);
          $this->sms->log($post);
          $json['error'] = $this->language->get('error_send');
        }
      } else {
        $post->phone = $telephone;

        if (isset($_SERVER['REMOTE_ADDR']) && $_SERVER['REMOTE_ADDR']) {
          $post->ip = $_SERVER['REMOTE_ADDR'];
        }

        $sms = $this->sms->call($post);

        if ($sms->status == "OK") {
          $this->session->data['code'] = $sms->code;
          $this->session->data['login_phone'] = $this->request->post['telephone'];
          $message = $this->language->get('entry_msg_call');
          $json['phone_text'] = sprintf($message, $this->request->post['telephone']);
          $json['success'] = true;
        } else {
          $this->sms->log($sms);
          $this->sms->log($post);
          $json['error'] = $this->language->get('error_send');
        }
      }

    }

    $this->response->addHeader('Content-Type: application/json');
    $this->response->setOutput(json_encode($json));
  }

  public function sendCode()
  {
    $this->load->language('extension/module/sms');

    $this->load->model('extension/module/sms');
    $this->load->model('account/customer');

    $json = array();
    if (($this->request->server['REQUEST_METHOD'] == 'POST')) {
      if (
        !isset($this->request->post['password']) &&
        (!isset($this->session->data['login_phone']) || !$this->session->data['login_phone'] ||
          !isset($this->session->data['code']) || !$this->session->data['code'])
      ) {
        $json['error'] = $this->language->get('error_msg');
      }


      if (!isset($json['error'])) {
        if (!isset($this->request->post['password']) && $this->request->post['code'] != $this->session->data['code']) {
          $json['error'] = $this->language->get('error_cod');
        }

        $telephone = isset($this->request->post['telephone']) && $this->request->post['telephone'] ? $this->request->post['telephone'] : $this->session->data['login_phone'];
        $customer_info = $this->model_extension_module_sms->getCustomerByPhone($telephone);

        if (!$customer_info && !isset($this->request->post['password'])) {
          $customer_info = $this->model_extension_module_sms->addCustomer($this->session->data['login_phone']);
        }

        if (!$customer_info && isset($this->request->post['password'])) {
          $json['error'] = $this->language->get('error_login');
        }

        if ($customer_info) {
          $this->model_account_customer->addLoginAttempt($customer_info['telephone']);

          $login_info = $this->model_account_customer->getLoginAttempts($customer_info['telephone']);

          if ($login_info && ($login_info['total'] >= $this->config->get('config_login_attempts')) && strtotime('-1 hour') < strtotime($login_info['date_modified'])) {
            $json['error'] = $this->language->get('error_attempts');
          }
        }

        if (!isset($json['error'])) {

          $error = $this->language->get('error_msg');

          if (isset($this->request->post['password'])) {
            $login = $this->customer->login($customer_info['telephone'], $this->request->post['password'], false);
            $error = $this->language->get('error_login');
          } else {
            $login = $this->customer->login($customer_info['telephone'], '', true);
          }

          if (!$login) {
            $json['error'] = $error;
            $this->model_account_customer->addLoginAttempt($customer_info['telephone']);
          } else {
            $this->model_account_customer->deleteLoginAttempts($customer_info['telephone']);

            unset($this->session->data['guest']);
            unset($this->session->data['login_phone']);
            unset($this->session->data['code']);

            $this->load->model('account/address');

            if ($this->config->get('config_tax_customer') == 'payment') {
              if ($this->customer->getAddressId()) {
                $this->session->data['payment_address'] = $this->model_account_address->getAddress($this->customer->getAddressId());
              }
            }

            if ($this->config->get('config_tax_customer') == 'shipping') {
              if ($this->customer->getAddressId()) {
                $this->session->data['shipping_address'] = $this->model_account_address->getAddress($this->customer->getAddressId());
              }
            }

            if (isset($this->session->data['wishlist']) && is_array($this->session->data['wishlist'])) {
              $this->load->model('account/wishlist');

              foreach ($this->session->data['wishlist'] as $key => $product_id) {
                $this->model_account_wishlist->addWishlist($product_id);

                unset($this->session->data['wishlist'][$key]);
              }
            }

            if ($this->config->get('config_customer_activity')) {
              $this->load->model('account/activity');

              $activity_data = array(
                'customer_id' => $this->customer->getId(),
                'name' => $this->customer->getFirstName() . ' ' . $this->customer->getLastName()
              );

              $this->model_account_activity->addActivity('login', $activity_data);
            }

            if ($this->config->get('module_sms_redirect')) {
              $json['redirect'] = $this->url->link($this->config->get('module_sms_redirect'), '', true);
            } else {
              $json['redirect'] = $this->url->link('account/account', '', true);
            }

          }

        }

      }

    }
    $this->response->addHeader('Content-Type: application/json');
    $this->response->setOutput(json_encode($json));
  }

}