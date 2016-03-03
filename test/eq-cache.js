/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */
/*jslint node: true */
/*global before, describe, it */
'use strict';


// Variables
let cache;
const util = require('util'),
    _ = require('lodash'),
    async = require('neo-async'),
    expect = require('expect.js'),
    mongoose = require('mongoose'),
    eq_cache = require('../'),
    host = 'localhost',
    port = 27017;


// Before
before(function () {
    mongoose.connect(util.format('mongodb://%s:%d/eq-session', host, port));
    cache = eq_cache(mongoose.connection);
});


describe('eq-cache', function () {
    it('Should set value', function (done) {
        const cache_id = 'CACHE_KEY_001',
            data = {value: 'TEST_VALUE_001'};

        async.waterfall([
            // Set cache
            function (done) {
                cache.set(cache_id, data, done);
            },

            // Get cache
            function (result, done) {
                mongoose.model('cache').findOne({cache_id: cache_id}, done);
            },

            // Expect cache
            function (result, done) {
                expect(result.cache_id).to.be(cache_id);
                expect(result.data).to.eql(data);

                done();
            }
        ], done);
    });

    describe('Should get data', function () {
        it('Data is exists', function (done) {
            const cache_id = 'CACHE_KEY_002',
                data = {value: 'TEST_VALUE_002'};

            async.waterfall([
                // Set cache
                function (done) {
                    cache.set(cache_id, data, done);
                },

                // Get cache
                function (result, done) {
                    cache.get(cache_id, done);
                },

                // Expect cache
                function (result, done) {
                    expect(result).to.eql(data);

                    done();
                }
            ], done);
        });

        it('Data is not exists', function (done) {
            const cache_id = 'CACHE_KEY_NOTFOUND';

            async.waterfall([
                // Get cache
                function (done) {
                    cache.get(cache_id, done);
                },

                // Expect cache
                function (result, done) {
                    expect(result).to.be(undefined);

                    done();
                }
            ], done);
        });
    });
});



/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */
