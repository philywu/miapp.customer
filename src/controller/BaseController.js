/**
 * BaseController the base controller class of every controller
 */
class BaseController {
    constructor(args) {

    }
    /**
     * intial the controller
     * @param {*} app the app variable from page.
     */
    init(app) {
        this.app = app;
    }
}
export {BaseController};