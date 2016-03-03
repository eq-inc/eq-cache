/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */
/*jslint node: true */
'use strict';



// Variables
const _ = require('lodash'),
    async = require('async'),
    mongoose = require('mongoose');

/**
 * EqSession
 *
 * @class
 */
class EqCache {

    constructor(connection, config) {
        const self = this;
        self.connection = connection;
        self.config = config || {};
        self.ttl = self.config.expire || 60 * 60 * 24 * 7;

        self.initialize();
    }


    /**
     * Initialize instance
     */
    initialize() {
        const self = this,
            cache_collection = self.config.cache_collection || 'cache',
            options = {
                timestamps: {
                    createdAt: 'created_at',
                    updatedAt: 'updated_at'
                }
            };

        // Cache
        try {
            self.model = self.connection.model(cache_collection);
        } catch (e) {
            if ('MissingSchemaError' === e.name) {
                const schema = new mongoose.Schema(require('../schema/cache'), options);
                schema.index('updated_at', {index: true}, self.ttl);
                self.model = self.connection.model(cache_collection, schema);
            } else {
                throw e;
            }
        }
    }


    /**
     * Set cache
     *
     * @param   {string} key
     * @param   {Object} value
     * @param   {Function} callback
     */
    set(key, value, callback) {
        const self = this,
            data = {data: value},
            options = {upsert: true};

        return self.model.findOneAndUpdate({cache_id: key}, data, options, callback);
    }


    /**
     * Get cache
     *
     * @param {string} key
     * @param {Function} callback
     */
    get(key, callback) {
        const self = this;
        self.model.findOne({cache_id: key}, function (error, result) {
            if (error) {
                callback(null, result);
            } else {
                callback(null, _.get(result, 'data'));
            }
        });
    }
}


// Export module
module.exports = function (connection, config) {
    return new EqCache(connection, config);
};




/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */
