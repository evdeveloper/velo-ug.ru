<?php
class Sms {
    private $ApiKey;
    private $protocol = 'https';
    private $domain = 'sms.ru';
    /**
     *  $count_repeat = количество попыток достучаться до сервера если он не доступен
     *  $count_repeat = number of attempts to reach the server if it is not available
     */
    private $count_repeat = 5; 

    function __construct($registry) {
        $this->config = $registry->get('config');
        $this->ApiKey = $this->config->get('module_sms_key');

        $this->logger = new \Log('sms.ru.log');
    }

    public function log($data, $write = true) {
        if ($write == true) {
            $this->logger->write($data);
        }
    }

    /**
     * Совершает отправку СМС сообщения одному или нескольким получателям.
     *
     * @param $post
     *   $post->to = string - Номер телефона получателя (либо несколько номеров, через запятую — до 100 штук за один запрос). Если вы указываете несколько номеров и один из них указан неверно, то на остальные номера сообщения также не отправляются, и возвращается код ошибки.
     *   $post->msg = string - Текст сообщения в кодировке UTF-8
     *   $post->multi = array('номер получателя' => 'текст сообщения') - Если вы хотите в одном запросе отправить разные сообщения на несколько номеров, то воспользуйтесь этим параметром (до 100 сообщений за 1 запрос). В этом случае, параметры to и text использовать не нужно
     *   $post->from = string - Имя отправителя (должно быть согласовано с администрацией). Если не заполнено, в качестве отправителя будет указан ваш номер.
     *   $post->time = Если вам нужна отложенная отправка, то укажите время отправки. Указывается в формате UNIX TIME (пример: 1280307978). Должно быть не больше 7 дней с момента подачи запроса. Если время меньше текущего времени, сообщение отправляется моментально.
     *   $post->translit = 1 - Переводит все русские символы в латинские. (по умолчанию 0)
     *   $post->test = 1 - Имитирует отправку сообщения для тестирования ваших программ на правильность обработки ответов сервера. При этом само сообщение не отправляется и баланс не расходуется. (по умолчанию 0)
     *   $post->partner_id = int - Если вы участвуете в партнерской программе, укажите этот параметр в запросе и получайте проценты от стоимости отправленных сообщений.
     * @return array|mixed|\stdClass
     */

     /**
     * Sends an SMS message to one or more recipients.
     *
     * @param $post
     *   $post->to = string - The recipient's phone number (or several numbers, separated by commas - up to 100 pieces per request). If you specify several numbers and one of them is incorrect, then messages are not sent to the other numbers either, and an error code is returned.
     *   $post->msg = string - Message text in UTF-8 encoding
     *   $post->multi = array('recipient number' => 'message text') - If you want to send different messages to several numbers in one request, then use this parameter (up to 100 messages per 1 request). In this case, the to and text parameters do not need to be used.
     *   $post->from = string - Sender's name (must be agreed with the administration). If left blank, your number will be listed as the sender.
     *   $post->time = If you need delayed sending, please specify the time of sending. Specified in UNIX TIME format (example: 1280307978). Should be no more than 7 days from the date of the request. If the time is less than the current time, the message is sent immediately.
     *   $post->translit = 1 - Converts all Russian characters to Latin. (default 0)
     *   $post->test = 1 - Simulates the sending of a message to test your programs for correct handling of server responses. In this case, the message itself is not sent and the balance is not spent. (default 0)
     *   $post->partner_id = int - If you participate in an affiliate program, specify this parameter in the request and receive a percentage of the cost of sent messages.
     * @return array|mixed|\stdClass
     */
    public function send_one($post) {
        $url = $this->protocol . '://' . $this->domain . '/sms/send';
        $request = $this->Request($url, $post);
        $resp = $this->CheckReplyError($request, 'send');

        if ($resp->status == "OK") {
            $temp = (array) $resp->sms;
            unset($resp->sms);

            $temp = array_pop($temp);

            if ($temp) {
                return $temp;
            } else {
                return $resp;
            }
        }
        else {
            return $resp;
        }

    }

    public function send($post) {
        $url = $this->protocol . '://' . $this->domain . '/sms/send';
        $request = $this->Request($url, $post);
        return $this->CheckReplyError($request, 'send');
    }

    /**
     * Совершает звонок.
     * @param $post
     *   $post->phone = string - Номер телефона получателя. Возващает 4 последние цифры звонившего номера телефона.
     * @return array|mixed|\stdClass
     */

      /**
     * Makes a call.
     * @param $post
     *   $post->phone = string - The recipient's phone number. Returns the last 4 digits of the calling phone number.
     * @return array|mixed|\stdClass
     */
    public function call($post) {
        $url = $this->protocol . '://' . $this->domain . '/code/call';
        $request = $this->Request($url, $post);
        $resp = $this->CheckReplyError($request, 'call');

        return $resp;
    }

    /**
     * Отправка СМС сообщений по электронной почте
     * @param $post
     *   $post->from = string - Ваш электронный адрес
     *   $post->charset = string - кодировка переданных данных
     *   $post->send_charset = string - кодировка переданных письма
     *   $post->subject = string - тема письма
     *   $post->body = string - текст письма
     * @return bool
     */
      /**
     * Sending SMS messages via email
     * @param $post
     *   $post->from = string - Your e-mail address
     *   $post->charset = string - transmitted data encoding
     *   $post->send_charset = string - transmitted message encoding
     *   $post->subject = string - letter subject
     *   $post->body = string - text of the letter
     * @return bool
     */
    public function sendSmtp($post) {
        $post->to = $this->ApiKey . '@' . $this->domain;
        $post->subject = $this->sms_mime_header_encode($post->subject, $post->charset, $post->send_charset);
        if ($post->charset != $post->send_charset) {
            $post->body = iconv($post->charset, $post->send_charset, $post->body);
        }
        $headers = "From: $post->\r\n";
        $headers .= "Content-type: text/plain; charset=$post->send_charset\r\n";
        return mail($post->to, $post->subject, $post->body, $headers);
    }

    public function getStatus($id) {
        $url = $this->protocol . '://' . $this->domain . '/sms/status';

        $post = new stdClass();
        $post->sms_id = $id;

        $request = $this->Request($url, $post);
        return $this->CheckReplyError($request, 'getStatus');
    }

    /**
     * Возвращает стоимость сообщения на указанный номер и количество сообщений, необходимых для его отправки.
     * @param $post
     *   $post->to = string - Номер телефона получателя (либо несколько номеров, через запятую — до 100 штук за один запрос) Если вы указываете несколько номеров и один из них указан неверно, то возвращается код ошибки.
     *   $post->text = string - Текст сообщения в кодировке UTF-8. Если текст не введен, то возвращается стоимость 1 сообщения. Если текст введен, то возвращается стоимость, рассчитанная по длине сообщения.
     *   $post->translit = int - Переводит все русские символы в латинские
     * @return mixed|\stdClass
     */
     /**
     * Returns the cost of the message to the specified number and the number of messages required to send it.
     * @param $post
     *   $post->to = string - Recipient's phone number (or multiple numbers, separated by commas - up to 100 per request) If you specify multiple numbers and one of them is incorrect, an error code is returned.
     *   $post->text = string - Message text in UTF-8 encoding. If the text is not entered, then the cost of 1 message is returned. If text is entered, the cost calculated by the length of the message is returned.
     *   $post->translit = int - Converts all Russian characters to Latin
     * @return mixed|\stdClass
     */
    public function getCost($post) {
        $url = $this->protocol . '://' . $this->domain . '/sms/cost';
        $request = $this->Request($url, $post);
        return $this->CheckReplyError($request, 'getCost');
    }

    /**
     * Получение состояния баланса
     */
    /**
     * Getting the balance status
     */
    public function getBalance() {
        $url = $this->protocol . '://' . $this->domain . '/my/balance';
        $request = $this->Request($url);
        return $this->CheckReplyError($request, 'getBalance');
    }

    /**
     * Получение текущего состояния вашего дневного лимита.
     */
    /**
     * Getting the current status of your daily limit.
     */
    public function getLimit() {
        $url = $this->protocol . '://' . $this->domain . '/my/limit';
        $request = $this->Request($url);
        return $this->CheckReplyError($request, 'getLimit');
    }

    /**
     * Получение списка отправителей
     */
    /**
     * Getting a list of senders
     */
    public function getSenders() {
        $url = $this->protocol . '://' . $this->domain . '/my/senders';
        $request = $this->Request($url);
        return $this->CheckReplyError($request, 'getSenders');
    }

    /**
     * Проверка номера телефона и пароля на действительность.
     * @param $post
     *   $post->login = string - номер телефона
     *   $post->password = string - пароль
     * @return mixed|\stdClass
     */
    /**
     * Validate phone number and password.
     * @param $post
     *   $post->login = string - phone number
     *   $post->password = string - password
     * @return mixed|\stdClass
     */
    public function authCheck($post) {
        $url = $this->protocol . '://' . $this->domain . '/auth/check';
        $post->api_id = 'none';
        return $this->CheckReplyError($request, 'AuthCheck');
    }


    /**
     * На номера, добавленные в стоплист, не доставляются сообщения (и за них не списываются деньги)
     * @param string $phone Номер телефона.
     * @param string $text Примечание (доступно только вам).
     * @return mixed|\stdClass
     */
     /**
     * Messages are not delivered to numbers added to the stoplist (and money is not debited for them)
     * @param string $phone Phone number.
     * @param string $text Note (only available to you).
     * @return mixed|\stdClass
     */
    public function addStopList($phone, $text = "") {
        $url = $this->protocol . '://' . $this->domain . '/stoplist/add';

        $post = new stdClass();
        $post->stoplist_phone = $phone;
        $post->stoplist_text = $text;

        $request = $this->Request($url, $post);
        return $this->CheckReplyError($request, 'addStopList');
    }

    /**
     * Удаляет один номер из стоплиста
     * @param string $phone Номер телефона.
     * @return mixed|\stdClass
     */
    
    /**
     * Removes one number from the stoplist
     * @param string $phone Phone number.
     * @return mixed|\stdClass
     */
    public function delStopList($phone) {
        $url = $this->protocol . '://' . $this->domain . '/stoplist/del';

        $post = new stdClass();
        $post->stoplist_phone = $phone;

        $request = $this->Request($url, $post);
        return $this->CheckReplyError($request, 'delStopList');
    }

    /**
     * Получить номера занесённые в стоплист
     */
    /**
     * Get the numbers entered in the stoplist
     */
    public function getStopList() {
        $url = $this->protocol . '://' . $this->domain . '/stoplist/get';
        $request = $this->Request($url);
        return $this->CheckReplyError($request, 'getStopList');
    }

    /**
     * Позволяет отправлять СМС сообщения, переданные через XML компании UCS, которая создала ПО R-Keeper CRM (RKeeper). Вам достаточно указать адрес ниже в качестве адреса шлюза и сообщения будут доставляться автоматически.
     */
    /**
     * Allows you to send SMS messages transmitted via XML to the UCS company, which created the R-Keeper CRM (RKeeper) software. You just need to specify the address below as the gateway address and the messages will be delivered automatically.
     */
    public function ucsSms() {
        $url = $this->protocol . '://' . $this->domain . '/ucs/sms';
        $request = $this->Request($url);
        $output->status = "OK";
        $output->status_code = '100';
        return $output;
    }

    /**
     * Добавить URL Callback системы на вашей стороне, на которую будут возвращаться статусы отправленных вами сообщений
     * @param $post
     *    $post->url = string - Адрес обработчика (должен начинаться на http://)
     * @return mixed|\stdClass
     */
    /**
     * Add the Callback URL of the system on your side, to which the statuses of messages sent by you will be returned
     * @param $post
     *    $post->url = string - Processor address (must start with http://)
     * @return mixed|\stdClass
     */
    public function addCallback($post) {
        $url = $this->protocol . '://' . $this->domain . '/callback/add';
        $request = $this->Request($url, $post);
        return $this->CheckReplyError($request, 'addCallback');
    }

    /**
     * Удалить обработчик, внесенный вами ранее
     * @param $post
     *   $post->url = string - Адрес обработчика (должен начинаться на http://)
     * @return mixed|\stdClass
     */
    /**
     * Delete the handler you added earlier
     * @param $post
     *   $post->url = string - Processor address (must start with http://)
     * @return mixed|\stdClass
     */
    public function delCallback($post) {
        $url = $this->protocol . '://' . $this->domain . '/callback/del';
        $request = $this->Request($url, $post);
        return $this->CheckReplyError($request, 'delCallback');
    }

    /**
     * Все имеющиеся у вас обработчики
     */
     /**
     * All handlers you have
     */
    public function getCallback() {
        $url = $this->protocol . '://' . $this->domain . '/callback/get';
        $request = $this->Request($url);
        return $this->CheckReplyError($request, 'getCallback');
    }

    private function Request($url, $post = FALSE) {
        if ($post) {
            $r_post = $post;
        }
        $ch = curl_init($url . "?json=1");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);

        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);

        curl_setopt($ch, CURLOPT_VERBOSE, 1);

        if (!$post) {
            $post = new stdClass();
        }

        if (!empty($post->api_id) && $post->api_id=='none'){
        }
        else {
            $post->api_id = $this->ApiKey;
        }

        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query((array) $post));

        $body = curl_exec($ch);
        if ($body === FALSE) {
            $error = curl_error($ch);
        }
        else {
            $error = FALSE;
        }
        curl_close($ch);
        if ($error && $this->count_repeat > 0) {
            $this->count_repeat--;
            return $this->Request($url, $r_post);
        }
        return $body;
    }

    private function CheckReplyError($res, $action) {

        if (!$res) {
            $temp = new stdClass();
            $temp->status = "ERROR";
            $temp->status_code = "000";
            $temp->status_text = "Невозможно установить связь с сервером SMS.RU. Проверьте - правильно ли указаны DNS сервера в настройках вашего сервера (nslookup sms.ru), и есть ли связь с интернетом (ping sms.ru). | Unable to establish connection with the SMS.RU server. Check if the DNS servers are correctly specified in your server settings (nslookup sms.ru), and if there is an Internet connection (ping sms.ru).";
            return $temp;
        }

        $result = json_decode($res);

        if (!$result || !$result->status) {
            $temp = new stdClass();
            $temp->status = "ERROR";
            $temp->status_code = "000";
            $temp->status_text = "Невозможно установить связь с сервером SMS.RU. Проверьте - правильно ли указаны DNS сервера в настройках вашего сервера (nslookup sms.ru), и есть ли связь с интернетом (ping sms.ru) | Unable to establish connection with the SMS.RU server. Check if the DNS servers are correctly specified in your server settings (nslookup sms.ru), and if there is an Internet connection (ping sms.ru)";
            return $temp;
        }

        return $result;
    }

    private function sms_mime_header_encode($str, $post_charset, $send_charset) {
        if ($post_charset != $send_charset) {
            $str = iconv($post_charset, $send_charset, $str);
        }
        return "=?" . $send_charset . "?B?" . base64_encode($str) . "?=";
    }


}