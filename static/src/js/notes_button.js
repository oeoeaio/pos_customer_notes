odoo.define('pos.customer_notes.button', function (require) {
    "use strict";

    var screens = require('point_of_sale.screens');
    var gui = require('point_of_sale.gui');

    var NotesButton = screens.ActionButtonWidget.extend({
        template: 'NotesButton',
        init: function(parent, options){
            this._super(parent, options);
            this.set_client();
            this.renderElement();

            this.pos.bind('change:selectedClient', function() {
                this.set_client();
                this.renderElement();
            }, this);
        },
        button_click: function(){
            if (!this.set_client()) { return; }
            this.before_popup_open();
            this.gui.show_popup('customernotes', {
                client: this.client,
                cancel: this.after_popup_close.bind(this), // Called from PopupWidget
            });
        },
        set_client: function(){
            this.client = this.pos.get_client();
            this.count_notes();
            return this.client;
        },
        count_notes: function(){
            this.note_count = 0;
            if (!this.client) { return; }
            this.note_count = _.size(
                this.client.notes_by_id || {}
            );
        },
        before_popup_open: function(){
            this.client.notes_seen = true;
        },
        after_popup_close: function(){
            this.count_notes();
            this.renderElement();
        },
    });

    screens.define_action_button({
        'name': 'customer_notes',
        'widget': NotesButton,
        'condition': function(){
            return true; // TODO maybe add a config variable for this?
        },
    });

    var PaymentNotesButton = NotesButton.extend({
        deactivate_key_events: function(){
            var payment_screen = this.gui.screen_instances['payment'];
            $('body').off('keypress', payment_screen.keyboard_handler);
            $('body').off('keydown', payment_screen.keyboard_keydown_handler);
            window.document.body.removeEventListener('keypress',payment_screen.keyboard_handler);
            window.document.body.removeEventListener('keydown',payment_screen.keyboard_keydown_handler);
        },
        reactivate_key_events: function(){
            var payment_screen = this.gui.screen_instances['payment'];
            $('body').keypress(payment_screen.keyboard_handler);
            $('body').keydown(payment_screen.keyboard_keydown_handler);
            window.document.body.addEventListener('keypress',payment_screen.keyboard_handler);
            window.document.body.addEventListener('keydown',payment_screen.keyboard_keydown_handler);
        },
        before_popup_open: function(){
            this._super();
            this.deactivate_key_events();
        },
        after_popup_close: function(){
          this._super();
          this.reactivate_key_events();
        },
    });

    screens.PaymentScreenWidget.include({
        renderElement: function() {
          this._super();
          if (this.$('.payment-buttons .show-notes').length) return;
          var widget = new PaymentNotesButton(this,{});
          widget.appendTo(this.$('.payment-buttons'));
        },
    });
});
