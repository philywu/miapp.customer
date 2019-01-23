import '@babel/polyfill';
import 'bootstrap';
import '../scss/custom.scss';
    import {
        Page
    } from './page.js';
    import GLOBAL from './constants.js';

    import {
        I18n
    } from './i18n.js'; {
        /*
        app: global vairable of app page
        */
        var app = {
            page: new Page()
        };
        // check service worker
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function () {
                navigator.serviceWorker.register('/service-worker.js').then(function (registration) {
                    // Registration was successful
                 //   console.log('ServiceWorker registration successful with scope: ', registration.scope);
                    app.swRegistration = registration;
                }, function (err) {
                    // registration failed :(
                 //   console.log('ServiceWorker registration failed: ', err);
                });
            });
        }

        /**
         * initial method, load the page by using pageName, if no page name, load the home page
         */
        app.init = function (pageName) {

            app.page.load(pageName).then(pageConfig => {
                if (pageConfig) {
                    app.render(pageConfig);
                // app.render(pageConfig,{"i18n":{locale: 'fr-CA', defaultCurrency: 'CAD', messageBundleName: "messageBundle_fr"}});
                }
            });
        
        };

        /**
         * route to page with page name, and add hisotry stack.
         */

        app.route = function (pageName, param) {

            app.page.historyPush(app.page.currentPageConfig);
            app.page.load(pageName).then(pageConfig => {
                if (pageConfig) {
                    app.render(pageConfig,param);
                // app.render(pageConfig,{"i18n":{locale: 'fr-CA', defaultCurrency: 'CAD', messageBundleName: "messageBundle_fr"}});
                }
            });
    
        };
        /**
         * rerender the same page
         */
        app.reRender = function (param) {
            //set current page 
            //header
            app.render(app.page.currentPageConfig, param);
        };
        /**
         * render page by using config
         */
        app.render = function (config, param) {
            //set current page 
            //header
            if (config) {
                app.renderHeader(config.header);
                app.renderMain(config, param);
            }
        };
        /**
         * render header of page by using config
         */
        app.renderHeader = function (headerConfig) {
            let header = document.getElementById('pageHeader');
            let title = header.getElementsByTagName('h4')[0];
            title.innerHTML = headerConfig.title;
            let headerLeft = document.getElementById('headerLeft');
            let leftIcon;
            if (headerConfig.isHome) {
                leftIcon = 'fa-home';
            }
            if (headerConfig.isBack) {
                leftIcon = 'fa-chevron-left';
                headerLeft.addEventListener('click', app.back);
            }
            headerLeft.innerHTML = `<i class="fas ${leftIcon} pl-1 pr-1"></i>`;

        };
        /**
         * render main page by using config
         */
        app.renderMain = async function (config, param) {
            let mainDiv = document.getElementsByClassName('main')[0];
            let html = await this.page.getFragmentFile(config.viewName);
            mainDiv.innerHTML = html;
            if (param && param.i18n) {
                let i18n = I18n.use(param.i18n);
                let loaded = await i18n.loadMessageBuldle();
                app.translateLocale(mainDiv, i18n);
            }


            app.setupController(config, param);
        };
        app.translateLocale = function (div, i18n) {
            let regex = /^\s*$/; //check if this is a blank line
            let textNodeArray = [],
                walk = document.createTreeWalker(div, NodeFilter.SHOW_TEXT, null, false);
                let n = walk.nextNode();
            while (n) {
                if (!n.nodeValue.match(regex)) {
                    // console.log(n.nodeValue);
                    textNodeArray.push(n);
                }
                n = walk.nextNode();
            }
            for (let node of textNodeArray) {
                if (node.nodeValue) {
                    let searchKey = node.nodeValue.trim();
                    //let translatFunc = (val) => i18n.translate2 `${val}`;
                    //let translated = translatFunc(searchKey);
                    let translated = i18n.translateString(searchKey);

                    if (translated) {
                        node.nodeValue = node.nodeValue.replace(searchKey, translated);
                    }
                    // console.log(node.nodeValue);
                }

            }

            return textNodeArray;
        };
        /**
         * call controller initial
         */
        app.setupController = function (config, param) {
            if (config.controllerInstance) {
                config.controllerInstance.init(app, param);
            }
        };
        /**
         * do history back action
         */
        app.back = function (e) {
           // console.log('back');
            let pageConfig = app.page.historyPop();
            app.page.currentPageConfig = pageConfig;
            app.render(pageConfig);
        };

        // initial the app, main entry of app.
        app.init();


    }