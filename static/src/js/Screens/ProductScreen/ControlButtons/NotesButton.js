odoo.define('point_of_sale.NotesButton', function (require) {
    'use strict';

    const PosComponent = require('point_of_sale.PosComponent');
    const ProductScreen = require('point_of_sale.ProductScreen');
    const Registries = require('point_of_sale.Registries');
    const { useListener } = require('web.custom_hooks');
    const { useState } = owl.hooks;

    class NotesButton extends PosComponent {
        constructor() {
            super(...arguments);

            useListener('click', this._onClick);

            this.state = useState({
                noteCount: 0,
            });

            this.updateNoteCount();

            this.env.pos.on('change:selectedClient', this.updateNoteCount, this);
        }
        async _onClick(){
            if (!this.client) { return; }

            this.client.notesSeen = true;

            const { confirmed, payload } = await this.showPopup('NotesPopup', {
                client: this.client,
            });

            if (confirmed) { this.updateNoteCount(); }
        }
        get client() {
          return this.env.pos.get_client();
        }
        updateNoteCount(){
            this.state.noteCount = 0;
            if (this.client) {
              this.state.noteCount = _.size(
                  this.client.notes_by_id || {}
              );
            }
            this.render();
        }
    };

    NotesButton.template = 'NotesButton';

    ProductScreen.addControlButton({
        component: NotesButton,
        condition: function () {
            return true;
        },
    });

    Registries.Component.add(NotesButton);

    return NotesButton;
});
