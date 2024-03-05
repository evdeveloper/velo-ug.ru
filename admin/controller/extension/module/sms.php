<?php
class ControllerExtensionModuleSms extends Controller {
    private $error = array();

    public function index() {
        $this->load->language('extension/module/sms');

        $this->document->setTitle($this->language->get('heading_title'));

        $this->load->model('setting/setting');

        if (($this->request->server['REQUEST_METHOD'] == 'POST') && $this->validate()) {
            $this->model_setting_setting->editSetting('module_sms', $this->request->post);

            $this->session->data['success'] = $this->language->get('text_success');

            $this->response->redirect($this->url->link('marketplace/extension', 'user_token=' . $this->session->data['user_token'] . '&type=module', true));
        }

        $data['heading_title'] = $this->language->get('heading_title');

        $data['text_edit'] = $this->language->get('text_edit');
        $data['text_enabled'] = $this->language->get('text_enabled');
        $data['text_disabled'] = $this->language->get('text_disabled');

        $data['entry_status'] = $this->language->get('entry_status');
        $data['entry_key'] = $this->language->get('entry_key');
        $data['entry_key_description'] = $this->language->get('entry_key_description');
        $data['entry_msg'] = $this->language->get('entry_msg');
        $data['entry_msg_pattern'] = $this->language->get('entry_msg_pattern');
        $data['entry_from'] = $this->language->get('entry_from');
        $data['entry_from_description'] = $this->language->get('entry_from_description');
        $data['entry_test'] = $this->language->get('entry_test');
        $data['entry_partner_id'] = $this->language->get('entry_partner_id');
        $data['entry_redirect'] = $this->language->get('entry_redirect');
        $data['entry_redirect_description'] = $this->language->get('entry_redirect_description');
        $data['entry_partner_id_description'] = $this->language->get('entry_partner_id_description');
        $data['entry_phonemask'] = $this->language->get('entry_phonemask');
        $data['entry_phonemask_example'] = $this->language->get('entry_phonemask_example');
        $data['entry_phonemask_placeholder'] = $this->language->get('entry_phonemask_placeholder');
        $data['entry_method'] = $this->language->get('entry_method');
        $data['entry_method_list'] = $this->language->get('entry_method_list');
        $data['entry_method_1'] = $this->language->get('entry_method_1');
        $data['entry_method_2'] = $this->language->get('entry_method_2');
        $data['entry_method_3'] = $this->language->get('entry_method_3');
        $data['entry_login_attempts'] = $this->language->get('entry_login_attempts');
        $data['entry_login_attempts_description'] = $this->language->get('entry_login_attempts_description');
        $data['entry_log'] = $this->language->get('entry_log');
        $data['entry_log_file'] = DIR_LOGS . 'sms.ru.log';

        $data['button_save'] = $this->language->get('button_save');
        $data['button_cancel'] = $this->language->get('button_cancel');

        if (isset($this->error['warning'])) {
            $data['error_warning'] = $this->error['warning'];
        } else {
            $data['error_warning'] = '';
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

        $data['breadcrumbs'][] = array(
            'text' => $this->language->get('heading_title'),
            'href' => $this->url->link('extension/module/sms', 'user_token=' . $this->session->data['user_token'], true)
        );

        $data['action'] = $this->url->link('extension/module/sms', 'user_token=' . $this->session->data['user_token'], true);

        $data['cancel'] = $this->url->link('marketplace/extension', 'user_token=' . $this->session->data['user_token'] . '&type=module', true);

        if (isset($this->request->post['module_sms_key'])) {
            $data['module_sms_key'] = $this->request->post['module_sms_key'];
        } else {
            $data['module_sms_key'] = $this->config->get('module_sms_key');
        }

        if (isset($this->request->post['module_sms_from'])) {
            $data['module_sms_from'] = $this->request->post['module_sms_from'];
        } else {
            $data['module_sms_from'] = $this->config->get('module_sms_from');
        }

        if (isset($this->request->post['module_sms_test'])) {
            $data['module_sms_test'] = $this->request->post['module_sms_test'];
        } else {
            $data['module_sms_test'] = $this->config->get('module_sms_test');
        }

        if (isset($this->request->post['module_sms_partner_id'])) {
            $data['module_sms_partner_id'] = $this->request->post['module_sms_partner_id'];
        } else {
            $data['module_sms_partner_id'] = $this->config->get('module_sms_partner_id');
        }

        if (isset($this->request->post['module_sms_redirect'])) {
            $data['module_sms_redirect'] = $this->request->post['module_sms_redirect'];
        } elseif($this->config->get('module_sms_redirect')) {
            $data['module_sms_redirect'] = $this->config->get('module_sms_redirect');
        }else{
            $data['module_sms_redirect'] = 'account/account';
        }

        if (isset($this->request->post['module_sms_phonemask'])) {
            $data['module_sms_phonemask'] = $this->request->post['module_sms_phonemask'];
        } elseif($this->config->get('module_sms_phonemask')) {
            $data['module_sms_phonemask'] = $this->config->get('module_sms_phonemask');
        }else{
            $data['module_sms_phonemask'] = '+7(000)000-00-00';
        }

        if (isset($this->request->post['module_sms_phonemask_placeholder'])) {
            $data['module_sms_phonemask_placeholder'] = $this->request->post['module_sms_phonemask_placeholder'];
        } elseif($this->config->get('module_sms_phonemask_placeholder')) {
            $data['module_sms_phonemask_placeholder'] = $this->config->get('module_sms_phonemask_placeholder');
        }else{
            $data['module_sms_phonemask_placeholder'] = '+7(___)___-__-__';
        }

        if (isset($this->request->post['module_sms_msg'])) {
            $data['module_sms_msg'] = $this->request->post['module_sms_msg'];
        } elseif($this->config->get('module_sms_msg')) {
            $data['module_sms_msg'] = $this->config->get('module_sms_msg');
        }else{
            $data['module_sms_msg'] = '%CODE% %SERVER%';
        }

        if (isset($this->request->post['module_sms_status'])) {
            $data['module_sms_status'] = $this->request->post['module_sms_status'];
        } else {
            $data['module_sms_status'] = $this->config->get('module_sms_status');
        }

        if (isset($this->request->post['module_sms_method'])) {
            $data['module_sms_method'] = $this->request->post['module_sms_method'];
        } elseif($this->config->get('module_sms_method')) {
            $data['module_sms_method'] = $this->config->get('module_sms_method');
        } else{
            $data['module_sms_method'] = 1;
        }

        $data['header'] = $this->load->controller('common/header');
        $data['column_left'] = $this->load->controller('common/column_left');
        $data['footer'] = $this->load->controller('common/footer');

        $this->response->setOutput($this->load->view('extension/module/sms', $data));
    }

    protected function validate() {
        if (!$this->user->hasPermission('modify', 'extension/module/sms')) {
            $this->error['warning'] = $this->language->get('error_permission');
        }
        if(!isset($this->request->post['module_sms_key']) || !trim($this->request->post['module_sms_key'])){
            $this->error['warning'] = $this->language->get('error_key');
        }
        if(!isset($this->request->post['module_sms_msg']) || !trim($this->request->post['module_sms_msg'])){
            $this->error['warning'] = $this->language->get('error_msg');
        }

        return !$this->error;
    }
}