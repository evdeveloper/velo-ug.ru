<?php
class ModelExtensionModuleSms extends Model {
    public function getCustomerByPhone($telephone) {
        $customer = array();
        $search_symbols = array('+','-','(',')',' ');
        $telephone = substr(str_replace($search_symbols,'',$telephone), 1);

        $query = $this->db->query("SELECT * FROM " . DB_PREFIX . "customer");

        if ($query->rows) {
            foreach ($query->rows as $row) {
                $customer_phone = substr(str_replace($search_symbols,'',$row['telephone']), 1);
                if (stripos($customer_phone, $telephone) !== false) {
                    $customer = $row;
                    break;
                }
            }
        }
        return $customer;
    }


    public function addCustomer($phone) {

        $customer = array();

        $customer_group_id = $this->config->get('config_customer_group_id');

        $this->load->model('account/customer_group');

        $customer_group_info = $this->model_account_customer_group->getCustomerGroup($customer_group_id);


        $this->db->query("INSERT INTO " . DB_PREFIX . "customer SET customer_group_id = '" . (int)$customer_group_id . "', store_id = '" . (int)$this->config->get('config_store_id') . "', language_id = '" . (int)$this->config->get('config_language_id') . "', firstname = '', lastname = '', email = '', telephone = '" . $phone . "', fax = '', custom_field = '', salt = '" . $this->db->escape($salt = token(9)) . "', password = '" . $this->db->escape(sha1($salt . sha1($salt . sha1($phone)))) . "', newsletter = 0, ip = '" . $this->db->escape($this->request->server['REMOTE_ADDR']) . "', status = '1', date_added = NOW()");

        $customer_id = $this->db->getLastId();

        if (in_array('account', (array)$this->config->get('config_mail_alert'))) {

            $this->load->language('mail/customer');

            $message  = $this->language->get('text_signup') . "\n\n";
            $message .= $this->language->get('text_website') . ' ' . html_entity_decode($this->config->get('config_name'), ENT_QUOTES, 'UTF-8') . "\n";
            $message .= $this->language->get('text_telephone') . ' ' . $phone . "\n";

            $mail = new Mail();
            $mail->protocol = $this->config->get('config_mail_protocol');
            $mail->parameter = $this->config->get('config_mail_parameter');
            $mail->smtp_hostname = $this->config->get('config_mail_smtp_hostname');
            $mail->smtp_username = $this->config->get('config_mail_smtp_username');
            $mail->smtp_password = html_entity_decode($this->config->get('config_mail_smtp_password'), ENT_QUOTES, 'UTF-8');
            $mail->smtp_port = $this->config->get('config_mail_smtp_port');
            $mail->smtp_timeout = $this->config->get('config_mail_smtp_timeout');

            $mail->setTo($this->config->get('config_email'));
            $mail->setFrom($this->config->get('config_email'));
            $mail->setSender(html_entity_decode($this->config->get('config_name'), ENT_QUOTES, 'UTF-8'));
            $mail->setSubject(html_entity_decode($this->language->get('text_new_customer'), ENT_QUOTES, 'UTF-8'));
            $mail->setText($message);
            $mail->send();

            $emails = explode(',', $this->config->get('config_alert_email'));

            foreach ($emails as $email) {
                if (utf8_strlen($email) > 0 && filter_var($email, FILTER_VALIDATE_EMAIL)) {
                    $mail->setTo($email);
                    $mail->send();
                }
            }
        }

        $query = $this->db->query("SELECT * FROM " . DB_PREFIX . "customer WHERE customer_id = '" . (int)$customer_id . "'");
        if ($query->row) {
            $customer = $query->row;
        }
        return $customer;
    }

    public function changeCustomerPassword($customer_id, $password)
    {
        $this->db->query("UPDATE " . DB_PREFIX . "customer SET  salt = '" . $this->db->escape($salt = token(9)) . "', password = '" . $this->db->escape(sha1($salt . sha1($salt . sha1($password)))) . "', ip = '" . $this->db->escape($this->request->server['REMOTE_ADDR']) . "', date_added = NOW() WHERE customer_id = '" . (int)$customer_id . "'");
        return true;
    }

}