import GLOBAL from '../scripts/constants.js';
import {BaseController} from './BaseController.js';
import { RemoteUtil } from '../util/util.js';

var openpgp = require('openpgp');

class RegisterController extends BaseController {
    constructor(args) {
        super(args);

    }
    //init happend only when bind to page
    init(app) {
        super.init(app);
        this.eleFirstName = document.querySelector('#i_firstname');
        this.eleLastName = document.querySelector('#i_lastname');
        this.eleEmail = document.querySelector('#i_email');
        this.eleMobile = document.querySelector('#i_mobile');
        this.elePassword = document.querySelector('#i_newpassword');
        this.btnRegister = document.querySelector('#b_register');

        this.registerEvent();
        
    }

   
    registerEvent() {
        //bind this
        // for route
        this.btnRegister.addEventListener('click',async(evt) =>{
            const firstName = this.eleFirstName.value||'' ;
            const lastName = this.eleLastName.value||'';
            const email = this.eleEmail.value || '';
            const passwd = this.elePassword.value || '';
            const mobile = this.eleMobile.value || '';
            
            var options = {
                userIds: [{ name:firstName+' '+lastName, email:email }], // multiple user IDs
                curve: 'ed25519',                                         // ECC curve name
                passphrase: passwd         // protects the private key
            };
            
            let key = await openpgp.generateKey(options);

            var privkey = key.privateKeyArmored; // '-----BEGIN PGP PRIVATE KEY BLOCK ... '
            var pubkey = key.publicKeyArmored;   // '-----BEGIN PGP PUBLIC KEY BLOCK ... '
            var revocationCertificate = key.revocationCertificate; // '-----BEGIN PGP PUBLIC KEY BLOCK ... '
            const pgpKeys = {
                'privateKey':privkey,
                'publicKey':pubkey,
                'revokeCertificate':revocationCertificate
            };
            //encrypt infomration 
            let keySet = await openpgp.key.readArmored(pubkey);
            let publicKeys = keySet.keys;
            const enMobile = await this.encryptItem(publicKeys,'mobile',mobile);
            //const enEmail  = await this.encryptItem(publicKeys,'email',email);
            const postBody = {
                'firstName':firstName,
                'lastName':lastName,
                'email':email,
                'keys':pgpKeys,
                'encryptContent':[enMobile]
            };
            const apiUrl = GLOBAL.API_SERVICE.CUSTOMER_REGISTER;
            RemoteUtil.sendJsonToAPIServer(apiUrl,postBody);
        });
       
        
        
    }
    async encryptItem(pubKeys,type,value) {
        const option = 
        {
            message: openpgp.message.fromText(value),       // input as Message object
            publicKeys: pubKeys, // for encryption            
        };
        let cipherText = await openpgp.encrypt(option);
        
        return {'itemType':type,'encoded':cipherText.data};
    
    }



}
export {RegisterController};