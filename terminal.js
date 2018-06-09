/* terminal.js - demo of a web based terminal REPL
 *
 * Copyright 2018 Elad Alfassa <elad@fedoraproject.org>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

"use strict"
var _keydown_timeout = null;
var _caret_timeout = null;

function set_caret_blink(state) {
    if (_caret_timeout !== null) {
        window.clearTimeout(_caret_timeout);
        _caret_timeout = null;
    }
    document.getElementById("caret").classList.remove('blink')
    if (state) {
        _caret_timeout = window.setTimeout(function() {
            document.getElementById("caret").classList.add('blink')
            _caret_timeout = null;
        }, 500);
    }
}

function update_input_display(input) {
    set_caret_blink(false);
    var before_caret = input.value.slice(0, input.selectionStart);
    var after_caret = input.value.slice(input.selectionEnd + 1);
    var in_caret = input.value.slice(input.selectionStart, input.selectionEnd + 1);
    caret.previousSibling.textContent = before_caret;
    caret.nextSibling.textContent = after_caret;
    caret.innerHTML = in_caret || '&nbsp;';
    set_caret_blink(true);
}

function init() {
    document.getElementById("terminal").addEventListener("click", function() {
        document.getElementById("in").focus();
    });
    var input = document.getElementById("in");
    input.value = ""; // browsers might pre-fill values on reload
    input.addEventListener("input", function(e) {
        update_input_display(this);
    });
    input.addEventListener("keydown", function(e) {
        var caret = document.getElementById("caret");
        if (_keydown_timeout !== null) {
            window.clearTimeout(_keydown_timeout);
        }
        _keydown_timeout = window.setTimeout(function() {
            var input = document.getElementById("in");
            if (e.key == "ArrowLeft" ||
                e.key == "ArrowRight" ||
                e.key == "Home" ||
                e.key == "End") {
                update_input_display(input);
            } else if (e.key == "Enter") {
                var line = document.createElement('p');
                line.textContent = input.value;
                input.value = "";
                document.querySelector("#terminal pre").appendChild(line);
                caret.previousSibling.textContent = "";
                caret.nextSibling.textContent = "";
                caret.innerHTML = "&nbsp;";
                set_caret_blink(true);
            }
            _keydown_timeout = null;
        }, 15); // Delay by 15ms to let the browser update the input
    });

}
document.addEventListener("DOMContentLoaded", init);
