# -*- coding: utf-8 -*-
{
    'name': 'POS Customer Notes',
    'version': '1.0.0',
    'category': 'Point Of Sale',
    'author': 'Rob Harrington',
    'sequence': 10,
    'summary': 'Load resolvable customer notes into the POS interface',
    'description': "",
    'depends': ['point_of_sale'],
    'data': [
        'views/assets.xml',
        'views/notes_views.xml',
        'wizard/resolve_notes.xml',
        'security/ir.model.access.csv',
    ],
    'qweb': ['static/src/xml/pos_templates.xml'],
    'images': [],
    'installable': True,
    'application': False,
    'license': 'LGPL-3'
}
