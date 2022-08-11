odoo.define('pos.customer_notes', function (require) {
"use strict";

var models = require('point_of_sale.models');

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

});
