<?php
class ModelExtensionModuleSmsReg extends Model {	
   
    public function addCustomerTel($data)
    {
        if ($this->config->get('control_lastname') == 2) {
            $data['lastname'] = '';
        }
        $customer_group_id = $this->config->get('config_customer_group_id');
        $this->load->model('account/customer_group');

        $customer_group_info = $this->model_account_customer_group->getCustomerGroup($customer_group_id);
        $this->db->query("INSERT INTO " . DB_PREFIX . "customer SET customer_group_id = '" . (int)$customer_group_id . "', store_id = '" . (int)$this->config->get('config_store_id') . "',firstname = '" . $this->db->escape($data['phone']) . "', lastname = '', telephone = '" . $this->db->escape($data['phone']) . "', email = '" . $this->db->escape($data['code'].'@'.$this->request->server['HTTP_HOST']) . "', salt = '" . $this->db->escape($salt = substr(md5(uniqid(rand(), true)), 0, 9)) . "', ip = '" . $this->db->escape($this->request->server['REMOTE_ADDR']) . "', status = '1', date_added = NOW()");

        $customer_id = $this->db->getLastId();
        return $customer_id;
    }
	public function loginTel($telephone) {
        $customer_query = $this->db->query("SELECT * FROM " . DB_PREFIX . "customer WHERE telephone = '" . $this->db->escape(utf8_strtolower($telephone)) . "' AND status = '1'");
        if ($customer_query->num_rows) {
            $this->session->data['customer_id'] = $customer_query->row['customer_id'];

            $this->customer_id = $customer_query->row['customer_id'];
            $this->firstname = $customer_query->row['firstname'];
            $this->lastname = $customer_query->row['lastname'];
            $this->customer_group_id = $customer_query->row['customer_group_id'];
            $this->email = $customer_query->row['email'];
            $this->telephone = $customer_query->row['telephone'];
            $this->fax = $customer_query->row['fax'];
            $this->newsletter = $customer_query->row['newsletter'];
            $this->address_id = $customer_query->row['address_id'];

            $this->db->query("UPDATE " . DB_PREFIX . "customer SET ip = '" . $this->db->escape($this->request->server['REMOTE_ADDR']) . "' WHERE customer_id = '" . (int)$this->customer_id . "'");

            return true;
        } else {
            return false;
        }
    }
}
?>