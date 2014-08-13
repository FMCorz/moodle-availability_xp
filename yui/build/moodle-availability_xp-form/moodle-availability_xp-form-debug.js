YUI.add('moodle-availability_xp-form', function (Y, NAME) {

// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * @package    availability_xp
 * @copyright  2014 Frédéric Massart
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

var TEMPLATE = '<label>{{get_string "levelgreaterorequalto" "availability_xp"}} ' +
    '<select name="level">' +
    '{{#each levels}}<option value="{{this}}">{{this}}</option>{{/each}}' +
    '</select>' +
    '</label>';

M.availability_xp = M.availability_xp || {};

M.availability_xp.form = Y.merge(M.core_availability.plugin, {

    levels: null,
    _node: null,

    initInner: function(params) {
        this.levels = params.levels;
    },

    getNode: function(json) {
        var template,
            levelObj = [],
            node,
            i;

        if (!this._node) {

            for (i = 1; i <= this.levels; i++) {
                levelObj.push(i);
            }
            template = Y.Handlebars.compile(TEMPLATE);
            this._node = Y.Node.create(template({
                levels: levelObj
            }));

            Y.one('#fitem_id_availabilityconditionsjson').delegate('change', function() {
                M.core_availability.form.update();
            }, '.availability_xp select');
        }

        node = this._node.cloneNode(true);
        if (typeof json.requiredlvl !== 'undefined') {
            node.one('select option[value="' + json.requiredlvl + '"]').set('selected', 'selected');
        }

        return node;
    },

    fillValue: function(value, node) {
        var select = node.one('select'),
            level = select.get('value');
        value.requiredlvl = level;
    },

    fillErrors: function(errors, node) {
        var select = node.one('select'),
            level = parseInt(select.get('value'), 10);

        if (isNaN(level) || level < 1 || level > this.levels) {
            errors.push('availability_xp:invalidlevel');
        }
    }
});


}, '@VERSION@', {"requires": ["base", "node", "event", "handlebars", "moodle-core_availability-form"]});
