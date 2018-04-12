from odoo import models, fields, api
from odoo.exceptions import UserError

import logging

_logger = logging.getLogger(__name__)

class Resolve(models.TransientModel):
    _register = False

    @api.multi
    def run(self):
        context = dict(self._context or {})
        active_model = context.get('active_model', False)
        active_ids = context.get('active_ids', [])

        records = self.env[active_model].browse(active_ids)

        return self._run(records)


class NoteResolver(Resolve):
    _name = 'pos.note.resolver'

    @api.multi
    def _run(self, records):
        _logger.info(records)
        for record in records:
            record.write({'resolved': True})
        return {}

class NoteUnresolver(Resolve):
    _name = 'pos.note.unresolver'

    @api.multi
    def _run(self, records):
        _logger.info(records)
        for record in records:
            record.write({'resolved': False})
        return {}
