# coding: utf-8

import logging

from odoo import api, fields, models

_logger = logging.getLogger(__name__)

class Partner(models.Model):
    _name = 'res.partner'
    _inherit = 'res.partner'

    notes = fields.One2many('pos.customer.note', 'partner_id', 'Notes')

class Note(models.Model):
    _name = 'pos.customer.note'

    partner_id = fields.Many2one('res.partner', string='Customer', ondelete='cascade')
    text = fields.Text('Note')
    resolved = fields.Boolean('Resolved?', default=False)

    @api.model
    def create_from_ui(self, note):
        _logger.info("DOING SOME STUFF")
        _logger.info("note: %s", note)
        note_id = note.pop('id', False)
        if note_id:  # Modifying existing note
            self.browse(note_id).write(note)
        else:
            note_id = self.create(note).id
        return note_id
