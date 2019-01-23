var instance = null;
const typeInfoRegex = /^:([a-z])(\((.+)\))?/;
const _I18N_FILE_PATH = './i18n/';
const _I18N_FILE_PREFIX = 'messageBundle_';
const _I18N_FILE_SUFFIX = '.json';
const _FETCH_ARGS = {
  mode: 'cors',
  headers: {
    'Access-Control-Allow-Origin': '*'
  }
};
class I18n {
  constructor() {

  }
  static use({
    locale,
    defaultCurrency,
    messageBundleName
  }) {
    if (!instance) {
      instance = new I18n();
    }
    instance.locale = locale;
    instance.defaultCurrency = defaultCurrency;
    instance.messageBundleName = messageBundleName;
    return instance;
    //translace
  }


  async loadMessageBuldle(messageBundleName) {
    if (!messageBundleName) {
      messageBundleName = this.messageBundleName;
    }
    const fileName = _I18N_FILE_PATH + messageBundleName + _I18N_FILE_SUFFIX;

    try {

      let res = await fetch(fileName, _FETCH_ARGS);
      let json = await res.json();
      this.messageBundle = json;
      return true;

    } catch (err) {
      return false;
    }
  }

  translate(strings, ...values) {
    //console.log(strings, values);
    let translationKey = this._buildKey(strings);
    let translationString = this.messageBundle[translationKey];

    if (translationString) {
      let typeInfoForValues = strings.slice(1).map(this._extractTypeInfo);
      let localizedValues = values.map((v, i) => this._localize(v, typeInfoForValues[i]));
      return this._buildMessage(translationString, ...localizedValues);
    }

    return null; //'Error: translation missing!';
  }

  translateString(string) {
    let translationKey = string;


    let varMap = this.buildTemplateFromString(string);
    if (varMap) {
      translationKey = this.generateKey(string, varMap);      
     
    }
    let translationString = this.messageBundle[translationKey];
    if (translationString) {
      // let typeInfoForValues = strings.slice(1).map(this._extractTypeInfo);
      // let localizedValues = values.map((v, i) => this._localize(v, typeInfoForValues[i]));
      // return this._buildMessage(translationString, ...localizedValues);
      if (varMap){
        return this.buildContent(translationString,varMap);
      } else {
        return translationString;
      }
      
    }
  }
  generateKey(string, map) {

    map.forEach((item,key,m) => {
      key = '\\'+key;
      let search =new RegExp(key, 'g');
      string = string.replace(search,`{${item.index}}`);
    });
    return string;

  }
  buildContent(translationString,map){
    let result = translationString;
    
    map.forEach((item,key,m) => {
      
      let search =new RegExp(`\\{${item.index}\\}`, 'g');
      result = result.replace(search,`${key}`);
    });
    return result;
  }
  buildTemplateFromString(string) {

    const SEP = /\${.+?}/g;
    if (string) {
      let arrWords = string.split(SEP);
      //variables array like [${name},${value}]...
      let arrVars = string.match(SEP);

      if (arrVars) {
        let cnt = 0;
        let varMap = new Map();
        for (let v of arrVars) {
          //build index of vars 
          if (!varMap.has(v)) {
            varMap.set(v, {
              'index': cnt++,
              'name': v.slice(2, -1)
            });

          }

        }
       // console.log(varMap);
        return varMap;
      }

    }

  }


  _extractTypeInfo(str) {
    let match = typeInfoRegex.exec(str);
    if (match) {
      return {
        type: match[1],
        options: match[3]
      };
    } else {
      return {
        type: 's',
        options: ''
      };
    }
  }

  _localize(value, {
    type,
    options
  }) {

    let _localizers = {
      s /*string*/: v => v.toLocaleString(this.locale),
      c /*currency*/: (v, currency) => (
        v.toLocaleString(this.locale, {
          style: 'currency',
          currency: currency || this.defaultCurrency
        })
      ),
      n /*number*/: (v, fractionalDigits) => (
        v.toLocaleString(this.locale, {
          minimumFractionDigits: fractionalDigits,
          maximumFractionDigits: fractionalDigits
        })
      )
    };
    return _localizers[type](value, options);
  }

  // e.g. I18n._buildKey(['', ' has ', ':c in the']) == '{0} has {1} in the bank'
  _buildKey(strings) {
    let stripType = s => s.replace(typeInfoRegex, '');
    let lastPartialKey = stripType(strings[strings.length - 1]);
    let prependPartialKey = (memo, curr, i) => `${stripType(curr)}{${i}}${memo}`;

    return strings.slice(0, -1).reduceRight(prependPartialKey, lastPartialKey);
  }

  // e.g. I18n._formatStrings('{0} {1}!', 'hello', 'world') == 'hello world!'
  _buildMessage(str, ...values) {
    return str.replace(/{(\d)}/g, (_, index) => values[Number(index)]);
  }
}
export {
  I18n
};