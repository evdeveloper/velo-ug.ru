<?php
// Heading
$_['heading_title']    = 'Login and registration by phone (sms.ru)';

// Text
$_['text_extension']   = 'Extensions';
$_['text_success']     = 'Success: You have modified category module!';
$_['text_edit']        = 'Edit Category Module';

// Entry
$_['entry_status']     = 'Status';
$_['entry_redirect']     = 'The page to go to after registration';
$_['entry_redirect_description']     = 'For example <br> common/home - main <br>account/account - standard page of personal account';
$_['entry_key']     = 'api_id';
$_['entry_key_description']     = 'You can find your api_id on the main page of your personal account';
$_['entry_msg']     = 'Message being sent';
$_['entry_from']     = 'Sender\'s name';
$_['entry_from_description']     = 'Sender\'s name (must be agreed with the administration). If it is not filled in, your number will be indicated as the sender.';
$_['entry_test']     = 'Testing';
$_['entry_partner_id']     = 'Partner ID';
$_['entry_partner_id_description']     = 'If you participate in an affiliate program, specify this parameter in the request and get a percentage of the cost of sent messages.';

$_['entry_msg_pattern']     = '%CODE% - code<br>%SERVER% - store link';
$_['entry_phonemask']     = 'Phone mask';
$_['entry_phonemask_example']     = 'Example:<br> +7(000)000-00-00<br>+375(00)000-00-00<br>380(00)0000000';
$_['entry_phonemask_placeholder']     = 'Placeholder';

$_['entry_method']     = 'Authorization method';
$_['entry_method_list']     = '
<b>Authorization by SMS + temporary code</b> - each time the user will be sent a temporary authorization code. <i>(default)<i><br>
<b>SMS authorization + permanent password</b> - the first time the user will be sent a password for authorization + password recovery.<br>
<b>Call authorization</b> - each time the user will receive a call from a random number, the user must enter the last 4 digits of the calling phone number for authorization.
';
$_['entry_method_1']     = 'Authorization by SMS + temporary code';
$_['entry_method_2']     = 'SMS authorization + permanent password';
$_['entry_method_3']     = 'Call authorization';
$_['entry_login_attempts']     = 'Maximum authorization attempts';
$_['entry_login_attempts_description']     = 'Edited System->Settings->Options->Account';
$_['entry_log']     = 'Log file';

// Error
$_['error_permission'] = 'Warning: You do not have permission to modify category module!';
$_['error_key'] = 'The api_id field is required!';
$_['error_msg'] = 'The message field is required!';