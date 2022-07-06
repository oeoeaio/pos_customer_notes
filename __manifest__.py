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
        'views/notes_views.xml',
        'wizard/resolve_notes.xml',
        'security/ir.model.access.csv',
    ],
    'assets': {
        'point_of_sale.assets': [
            'pos_customer_notes/static/src/css/**/*',
            'pos_customer_notes/static/src/js/**/*',
        ],
        'web.assets_qweb': [
            'pos_customer_notes/static/src/xml/**/*',
        ],
    },
    'images': [],
    'installable': True,
    'application': False,
    'license': 'LGPL-3'
}
