/**
 * qitalk v0.1.2
 * qimessaging2 framework
 * @author: hikouki
 */
(function(global, $) {
    "use strict"

    var Qitalk = function() {};

    Qitalk.prototype.init = function(options) {
        this.options = $.extend({
            host    : null,
            root    : '#qitalk',
            tplDir  : './tpl'
        }, options);

        this.options.handle = $.extend({
            start : function(){},
            presented: function(){}
        }, this.options.handle);

        this.options.preload = $.extend({
            tpl     : [],
            service : ['ALMemory']
        }, this.options.preload);

        this.$root = $(this.options.root);
        this.tplCache = {};
        this.proxy = {};
        this.subscribeEventIds = [];
        var self = this;
        QiSession(function(session) {
            self.qisession = session;
            self._asyncCacheTpl();
            self._asyncCacheService().then(self.options.handle.start);
        }, function(a) { console.error('failed connection.') }, this.options.host);
    };

    Qitalk.prototype.presentView = function(tpl, params) {
        this.params = params;
        var $swapView = $('<div />');
        $swapView.css('position', 'absolute')
            .css('top', '0').css('left', '0');
        if(tpl in this.tplCache) {
            $swapView.html(this.tplCache[tpl]);
            this.params = null;
        } else {
            $swapView.load(this._makeTplPath(tpl));
        }

        this.$root.children().addClass('qitalk--scrap').css('z-index', '-1');
        this.$root.prepend($swapView);

        var self = this;
        $swapView.ready(function() {
            self.$root.find('.qitalk--scrap').remove();
            self.options.handle.presented();
        });
    };

    Qitalk.prototype.on = function(name, func, id) {
        if (id) {
            if ($.inArray(id,  this.subscribeEventIds) != -1) return;
            this.subscribeEventIds.push(id);
        }

        this.$root.on(name, function() {
            console.log('on: ' + name);
            Array.prototype.shift.apply(arguments);
            func.apply(null, arguments);
        });

        var self = this;
        this.qisession.service("ALMemory").then(function(m) {
            m.subscriber(name).then(function(sub) {
                sub.signal.connect(function(data) {
                    console.log('trigger: ' + name);
                    self.$root.trigger(name, data);
                });
            });
        });
    };

    Qitalk.prototype.send = function(name, value) {
        this.qisession.service("ALMemory").then(function(m) {
            m.raiseEvent(name, value);
        });
    };

    Qitalk.prototype.trigger = function(name, value) {
        this.$root.trigger(name, value);
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
            var serviceDef = new $.Deferred;
            self.qisession.service(name).then(function(service) {
                self.proxy[name] = service;
                serviceDef.resolve();
            }, function(error) {
                console.error("ERROR cache service: " + name);
            });
            serviceDefs.push(serviceDef.promise());
        });

        $.when.apply(null, serviceDefs).then(function() {
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
