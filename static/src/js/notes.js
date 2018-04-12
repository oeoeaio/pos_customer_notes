odoo.define('pos.customer_notes', function (require) {
"use strict";

var gui = require('point_of_sale.gui');
var models = require('point_of_sale.models');
var PopupWidget = require('point_of_sale.popups');
var core = require('web.core');
var rpc = require('web.rpc');

var QWeb = core.qweb;
var _t = core._t;

// At POS Startup, load any unresolved customer notes, and add them to the relevant customer
models.load_models({
    model: 'pos.customer.note',
    fields: ['text','partner_id', 'resolved'],
    domain: function(self){ return [['resolved','=',false]]; },
    loaded: function(self,notes){
        var partner;
        var note;
        for (var i = 0; i < notes.length; i++){
            note = notes[i];
            partner = self.db.partner_by_id[note.partner_id[0]]
            partner.notes_by_id = partner.notes_by_id || {};
            partner.notes_by_id[note.id] = note;
        }
    },
});

var CustomerNotesPopupWidget = PopupWidget.extend({
    template: 'CustomerNotesPopupWidget',
    events: _.extend({}, PopupWidget.prototype.events, {
        'click .mark-resolved': 'mark_resolved',
        'click .mark-unresolved': 'mark_unresolved',
        'click .note-button': 'click_note_button',
        'click .new-note-button': 'click_new_note_button',
    }),
    init: function (parent, args) {
        this._super(parent, args);
        this.current_note = null;
        this.client = {};
    },
    click_note_button: function(event){
        var note_id = $(event.target).data('note-id');
        this.current_note = this.client.notes_by_id[note_id];
        this.renderElement();
        this.$('.note-edit textarea').focus();
    },
    click_new_note_button: function(event){
        this.current_note = { id: '', text:'', resolved: 'false' };
        this.renderElement();
        this.$('.note-edit textarea').focus();
    },
    show: function(options){
        options = options || {};
        this._super(options);

        this.client = options.client
        this.client.notes_by_id = this.client.notes_by_id || {}
        this.current_note = null;

        this.renderElement();
    },
    mark_resolved: function(){
        this.save_note(true);
    },
    mark_unresolved: function(){
        this.save_note(false);
    },
    save_note: function(resolved){
        this.current_note.text = this.$('.note-edit textarea').val(),
        this.current_note.resolved = resolved;

        // Submit an integer as partner_id
        var fields = _.extend({},this.current_note,{partner_id: this.client.id});

        var self = this;
        rpc.query({
            model: 'pos.customer.note',
            method: 'create_from_ui',
            args: [fields],
        })
        .then(function(note_id){
            if (!self.current_note.id){
              self.current_note.id = note_id;
              self.client.notes_by_id[note_id] = {};
            }
            _.extend(self.client.notes_by_id[note_id], self.current_note);
            self.current_note = null;
            self.renderElement();
        },function(type,err){
            var error_body = _t('Your Internet connection is probably down.');
            if (err.data) {
                var except = err.data;
                error_body = except.arguments && except.arguments[0] || except.message || error_body;
            }
            self.gui.show_popup('error',{
                'title': _t('Error: Could not Save Changes'),
                'body': error_body,
            });
        });
    },
});
gui.define_popup({name:'customernotes', widget: CustomerNotesPopupWidget});


return CustomerNotesPopupWidget;

});
