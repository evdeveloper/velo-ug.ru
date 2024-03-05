function smsSender(params)
{
    this.loginPhoneForm = document.querySelector(params.loginPhoneForm);
    this.loginCodeForm = document.querySelector(params.loginCodeForm);
    this.maskPhone = document.querySelector(params.maskPhone);
    this.maskCode = document.querySelector(params.maskCode);
    this.password = document.querySelector(params.password);
    this.resultPhone = document.querySelector(params.resultPhone);
    this.smsRepeat = document.querySelector(params.smsRepeat);
    this.errorPhone = document.querySelector(params.errorPhone);
    this.errorCode = document.querySelector(params.errorCode);
    this.successCode = document.querySelector(params.successCode);
    this.getCodeButton = document.querySelector(params.getCodeButton);
    this.sendCodeButton = document.querySelector(params.sendCodeButton);
    this.smsMethod = params.smsMethod?params.smsMethod:1;

    let phoneIMask = new IMask(this.maskPhone, {mask: this.maskPhone.getAttribute('data-mask')});
    phoneIMask.on("accept", () => this.getCodeButton.setAttribute('disabled', 'disabled'));
    phoneIMask.on("complete", () => this.getCodeButton.removeAttribute('disabled'));

    let codeIMask = new IMask(this.maskCode, {mask: this.maskCode.getAttribute('data-mask')});
    codeIMask.on("accept", () => this.sendCodeButton.setAttribute('disabled', 'disabled'));
    codeIMask.on("complete", () => this.sendCodeButton.removeAttribute('disabled'));
    
}
smsSender.prototype.timer = function (){
    if(this.smsRepeat){
        var count = 60;
        this.countdown = setInterval(()=>{
            count--;
            this.smsRepeat.querySelector('span').innerText = count;
            if(count == 0) {
                this.smsRepeat.innerText = this.smsRepeat.getAttribute('data-load-text');
                this.smsRepeat.removeAttribute('disabled');
                clearInterval(this.countdown);
            }
        },1000);
    }
}

smsSender.prototype.codeSend = function() {
    this.errorPhone.style.display = 'none';
    this.smsRepeat.style.display = 'none';
    this.errorCode.style.display = 'none';
    if(this.successCode){
        this.successCode.style.display = 'none';
    }

    let request = new XMLHttpRequest(),
        telephone =  this.password?this.maskCode.value:this.maskPhone.value,
        params = 'telephone=' + encodeURIComponent(telephone) + '&method=' + encodeURIComponent(this.smsMethod);

    request.open('POST', 'index.php?route=extension/module/sms/getCode', true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.responseType = "json";
    request.send(params);
    request.onreadystatechange = () => {
        if (request.readyState == XMLHttpRequest.DONE && request.status == 200) {
            const result = request.response;
            if (result.success) {
                if(!this.password){
                    this.loginPhoneForm.style.display = 'none';
                    this.loginCodeForm.style.display = 'block';
                    this.resultPhone.innerHTML = result.phone_text;
                } else {
                    this.successCode.style.display = 'block';
                    this.sendCodeButton.style.display = 'none';
                }
                this.smsRepeat.setAttribute('disabled', 'disabled');
                this.smsRepeat.style.display = 'block';
                this.smsRepeat.innerHTML = this.smsRepeat.getAttribute('data-text');
                this.timer();
            }
            if (result.error) {
                this.errorPhone.innerHTML = result.error;
                this.errorPhone.style.display = 'block';
            }
        }
    }
};


smsSender.prototype.login = function() {
    this.errorCode.style.display = 'none';
    let request = new XMLHttpRequest(), params = '';
    if(this.password){
        params = 'telephone=' + encodeURIComponent(this.maskPhone.value) + '&password=' + encodeURIComponent(this.password.value);
    }else{
        params = 'code=' + encodeURIComponent(this.maskCode.value);
    }
    
    request.open('POST', 'index.php?route=extension/module/sms/sendCode', true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.responseType = "json";
    request.send(params);
    request.onreadystatechange = () => {
        if (request.readyState == XMLHttpRequest.DONE && request.status == 200) {
            const result = request.response;
            if(result.redirect){
                location.href = result.redirect;
            }
            if (result.error) {
               this.errorCode.innerHTML = result.error;
               this.errorCode.style.display = 'block';
            }
        }
    }
}

smsSender.prototype.getPassword = function() {
    this.loginPhoneForm.style.display = 'none';
    this.loginCodeForm.style.display = 'block';
    this.errorCode.innerHTML = '';
    this.errorCode.style.display = 'none';
}

smsSender.prototype.back = function() {
    this.loginPhoneForm.style.display = 'block';
    this.loginCodeForm.style.display = 'none';
    this.smsRepeat.innerHTML = '';
    if(!this.password){
        this.maskCode.value = '';
    }else{
        this.sendCodeButton.style.display = 'block';
        this.successCode.style.display = 'none';
    }
    clearInterval(this.countdown);
}

