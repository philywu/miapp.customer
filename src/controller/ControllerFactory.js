import GLOBAL from '../scripts/constants.js';

/**
 * controllerInstances: the collection of instance of controller class.
 * Format {"name":<controller name>
 *          "Instance":<controller instance>}
 */
//var controllerSet = new Set();
/**
 * ControllerFactory factory to manage the controllers
 */
class ControllerFactory {
    /**
     * dynamic load get controller instance by name
     * @param {string} name controller Name
     */
    static async getInstance(controllerName) {
        try {
            const module = await import(`./${controllerName}.js`);
            // The module exports a function named `loadPageInto`.
           // module.loadPageInto(main);
           let controllerClass = module[controllerName] ;
           
           if (controllerClass){
                let controller = new controllerClass;           
                //controllerSet.add (controller);
                return controller;
           }
          } catch (error) {
            //main.textContent = error.message;
            //console.error(error);
          }
        //return new name ;
    }
}


export {
    ControllerFactory,
};