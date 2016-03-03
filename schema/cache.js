/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */
/*jslint node: true */
'use strict';



// Variables
const mongoose = require('mongoose');


// Export module
module.exports = {
    cache_id: {
        type: String,
        required: true,
        unique: true
    },
    code: {
        type: Number,
        default: 200
    },
    data: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
};



/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */
