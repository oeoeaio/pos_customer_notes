odoo.define('pos.customer_notes.button', function (require) {
    "use strict";

    var screens = require('point_of_sale.screens');
    var gui = require('point_of_sale.gui');

    var NotesButton = screens.ActionButtonWidget.extend({
        template: 'NotesButton',
        new_note: function(client_id){
          return { text:'', resolved: 'false', res_partner_id: client_id };
        },
        init_client: function(){
          var client = this.pos.get_client();
          if (!client) return;
          client.notes_by_id = client.notes_by_id || {};
          return client;
        },
        button_click: function(){
            var client = this.init_client();
            if (!client) return;
            this.gui.show_popup('customernotes', {notes: client.notes_by_id});
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
        button_click: function(){
            var client = this.init_client();
            if (!client) return;
            this.deactivate_key_events();
            this.gui.show_popup('customernotes', {
                notes: client.notes_by_id,
                cancel: this.reactivate_key_events, // Called from PopupWidget
            });
        },
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
