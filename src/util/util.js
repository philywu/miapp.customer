import GLOBAL from '../scripts/constants.js';

class Util {
    /**
     * set default values to        
     * @param {json class} sourceJson
     * @param {Array[String]} fields to be set   
     * @param {String} defaultValue    
     */
    static setDefaultValue(sourceJson,fields,defaultValue = '') {
        
        if (sourceJson && typeof sourceJson == 'object' && fields){
        //if json class exist        
            //   for (key in sourceJson){
            //       if (!sourceJson[key]) {
            //         sourceJson[key] = defaultValue;
            //       }
            //   }
         switch (fields.constructor) {
             case String :
                
                if (!sourceJson[fields]) {
                    sourceJson[fields] = defaultValue;
                }
                break; 
             case Array : 
                for (let name of fields){
                    if (!sourceJson[name]) {
                        sourceJson[name] = defaultValue;
                    }
                }
                break;
         }
         
        } 
    }
    /**
     * Get full server URL by using API service name
     * @param {string} service 
     * @param {string} param 
     */
    static getFullServerURL(service,param){
        let serverURL = GLOBAL.API_URL;
        serverURL += '/' + service;
        
        return serverURL;
    }
    /**
     * clear all child nodes.
     * @param {HTMLElement} element 
     */
    static clearChildNodes(element){
                while (element.firstChild) {
                    element.removeChild(element.firstChild);
                }  
    }
    /**
     * convert value to HTML format , add <br> tag if it is a 'enter'
     */
    static toHTMLFormat(value){
        if (value && (typeof value ==='string')){
            let retValue = value.replace(/\n/g, '<br>');
            return retValue;
        } else {
            return value;
        }
        
    }
    /**
     * convert base64String to uint8 array (used for firebase auth)
     * @param {string} base64String 
     */
    static urlB64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
          .replace(/-/g, '+')
          .replace(/_/g, '/');
      
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
      
        for (let i = 0; i < rawData.length; ++i) {
          outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
      }
      
}
class RemoteUtil {
    /**
     * get Json from backend server.
     * @param {*} serviceName 
     * @param {*} param 
     */
    static async getJsonFromAPIServer(serviceName, param) {
        const url = Util.getFullServerURL(serviceName);
        try {
            let res = await fetch(url);            
            return res.json();
        } catch(err) {
            return null; 
        }
        
    }
    /**
     * send Json file to backend server
     * @param {*} serviceName 
     * @param {*} postBody 
     * @param {*} sendMethod 
     * @param {*} header 
     */
    static async sendJsonToAPIServer(serviceName,postBody,sendMethod,header) {
        const url = Util.getFullServerURL(serviceName);
        if (!sendMethod){
            sendMethod='POST';
        }
        if (!header){
            header = {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            };
        }
        try {
            const rawResponse = await fetch(url, {                
                method: sendMethod,
                headers: header,
                 body:JSON.stringify(postBody)
                //body:postBody
            });
            return await rawResponse.json();
        } catch(err) {
            return null; 
        }
    }
 
}
export {Util,RemoteUtil};