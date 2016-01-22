(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * qitalk v1.0
 * qimessaging2 framework
 * @author: hikouki
 */
(function(global, $) {
    "use strict"

    var Qitalk = function() {};

    Qitalk.prototype.init = function(options) {
        this.options = $.extend({
            host    : '',
            root    : '#qitalk',
            tplDir  : './tpl',
            preload : {
                tpl     : [],
                service : ['ALMemory']
            },
            handle : {
                start : function(){}
            }
        }, options);
        this.$root = $(this.options.root);
        this.tplCache = {};
        this.proxy = {};
        this.qisession = new QiSession(null, null, this.options.host);

        this._asyncCacheTpl();

        this._asyncCacheService().then(this.options.handle.start);
    };

    Qitalk.prototype.presentView = function(tpl, params) {
        this.params = params;
        if(tpl in this.tplCache) {
            this.$root.html(this.tplCache[tpl]);
            this.params = null;
        } else {
            var self = this;
            this.$root.load(this._makeTplPath(tpl), null, function() {
                this.params = null;
            });
        }
    };

    Qitalk.prototype.subscriber = function(name, func) {
        this.qisession.service("ALMemory").then(function(m) {
            m.subscriber(name).then(function(sub) {
                sub.signal.connect(func);
            });
        });
    };

    Qitalk.prototype.raiseEvent = function(name, value) {
        this.qisession.service("ALMemory").then(function(m) {
            m.raiseEvent(name, value);
        });
    };

    Qitalk.prototype._asyncCacheTpl = function() {
        var tpls = this.options.preload.tpl;
        if ( ! tpls) return;
        var self = this;
        $(tpls).each(function() {
            var tpl = this;
            $.ajax({
                type     : 'GET',
                url      : self._makeTplPath(this),
                dataType : 'html',
            }).done(function(d){
                self.tplCache[tpl] = d;
            });
        });
    };

    Qitalk.prototype._asyncCacheService = function() {
        var d = new $.Deferred;
        var services = this.options.preload.service;
        if ( ! services) return;
        var self = this;
        var serviceDefs = [];
        $(services).each(function() {
            var name = this;
            (function(d) {
                self.qisession.service(name).then(function(service) {
                    self.proxy[name] = service;
                    d.resolve();
                });
                serviceDefs.push(d.promise());
            })(new $.Deferred);
        });

        $.when.apply(this, serviceDefs).then(function() {
            d.resolve();
        });

        return d.promise();
    };

    Qitalk.prototype._makeTplPath = function(tpl) {
        return this.options.tplDir + '/' + tpl + '.tpl';
    };

    if ( typeof window !== "undefined" ) {
	    window.Qitalk = new Qitalk();
    }

    if ( typeof module !== "undefined" && module.exports ) {
	    module.exports = new Qitalk();
    }
})(window, jQuery);


},{}]},{},[1]);
