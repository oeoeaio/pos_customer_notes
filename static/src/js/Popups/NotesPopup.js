odoo.define('point_of_sale.NotesPopup', function(require) {
    'use strict';

    const { useState, useRef } = owl.hooks;
    const { useAutofocus, useListener } = require('web.custom_hooks');
    const PosComponent = require('point_of_sale.PosComponent');
    const Registries = require('point_of_sale.Registries');
    const AbstractAwaitablePopup = require('point_of_sale.AbstractAwaitablePopup');

    class NotesPopup extends AbstractAwaitablePopup {
      constructor() {
        super(...arguments);

        this.props.client.notes_by_id = this.props.client.notes_by_id || {}

        this.state = useState({
            buffer: '',
            currentNote: null,
        });

        useAutofocus({ selector: '.note-edit textarea' });
        useListener('click-note-button', this.clickNoteButton);
      }
      get clientNotes() {
        return _.values(this.props.client.notes_by_id);
      }
      clickNoteButton(event){
          var noteId = event.detail.noteId;
          this.state.currentNote = this.props.client.notes_by_id[noteId];
          this.state.buffer = this.state.currentNote.text;
          this.render();
      }
      clickNewNoteButton(event){
          this.state.currentNote = { id: '', text:'', resolved: 'false' };
          this.render();
      }
      markResolved(){
          this.saveNote(true);
      }
      markUnresolved(){
          this.saveNote(false);
      }
      saveNote(resolved){
          this.state.currentNote.text = this.state.buffer;
          this.state.currentNote.resolved = resolved;
          this.state.buffer = '';

          // Submit an integer as partner_id
          var fields = _.extend({},this.state.currentNote,{partner_id: this.props.client.id});

          var self = this;
          self.rpc({
              model: 'pos.customer.note',
              method: 'create_from_ui',
              args: [fields],
          })
          .then(function(noteId){
              if (!self.state.currentNote.id) {
                  self.state.currentNote.id = noteId;
                  self.props.client.notes_by_id[noteId] = {};
              }
              _.extend(self.props.client.notes_by_id[noteId], self.state.currentNote);
              self.state.currentNote = null;
              self.render();
          }, async function(type,err){
              var error_body = _t('Your Internet connection is probably down.');
              if (err.data) {
                  var except = err.data;
                  error_body = except.arguments && except.arguments[0] || except.message || error_body;
              }
              await this.showPopup('ErrorPopup', {
                  'title': _t('Error: Could not Save Changes'),
                  'body': error_body,
              });
          });
      }
    }
    NotesPopup.template = 'NotesPopup';

    Registries.Component.add(NotesPopup);

    return NotesPopup;
});
