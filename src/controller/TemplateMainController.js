import GLOBAL from '../scripts/constants.js';
import {BaseController} from './BaseController.js';

import icon from '../images/icon.png';
class TemplateMainController extends BaseController {
    constructor(args) {
        super(args);

    }
    //init happend only when bind to page
    init(app) {
        super.init(app);
        this.registerEvent();
        let imgContainer = document.querySelector('#img_container');
        
        const img = `<img src="${icon}">`;

        imgContainer.innerHTML = img;
    }

   
    registerEvent() {
        //bind this
        // for route
        document.querySelector('#b_next').addEventListener('click',evt =>{
            
            this.app.route('notif_main');
            
        });
        //for multi-lang useage
        document.querySelector('#v_zh').addEventListener('click',evt =>{
           
            let param = {'i18n':{locale: 'zh-CN', defaultCurrency: 'CNY', messageBundleName: 'messageBundle_zh'}};
            this.app.reRender(param);
            
        });
        document.querySelector('#v_en').addEventListener('click',evt =>{
            
            this.app.reRender();
            
        });
        
    }



}
export {TemplateMainController};