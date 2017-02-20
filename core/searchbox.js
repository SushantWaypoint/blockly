/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Utility functions for handling procedures.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.Searchbox');

goog.require('Blockly.Blocks');
goog.require('Blockly.Field');
goog.require('Blockly.Names');
goog.require('Blockly.Workspace');
goog.require('Blockly.Toolbox');
goog.require('goog.ui.tree.TreeNode');
goog.require('goog.ui.tree.TreeControl');


/**
 * Category to separate procedure names from variables and generated functions.
 */
Blockly.Searchbox.SEARCH_TERMS = [];
Blockly.Searchbox.button = {};
Blockly.Searchbox.workspace_ = {};

Blockly.Searchbox.init = function(workspace){
        
        //create search button
        this.button = goog.dom.createDom('button');
        this.button.setAttribute('text', "Search...");
        this.button.setAttribute('callbackKey', 'START_SEARCH');
        this.workspace_ = workspace;

        workspace_.registerButtonCallback('START_SEARCH', function(button) {
                var searchTerm = Blockly.Searchbox.startSearch(button.getTargetWorkspace());
                console.log("Search Term: " + searchTerm);
                if(searchTerm) {
                    Blockly.Searchbox.setSearchTerms(searchTerm);
                    Blockly.Searchbox.searchBlocksByKeywords();
                }
        });
        
		console.log("Button!");
		//console.log(this.button);
        return this.button;
};

Blockly.Searchbox.startSearch = function(workspace) {
    var text = window.prompt("Enter search phrase", "");
    if(text) {
        return text;
    }
    return null;
};

Blockly.Searchbox.setSearchTerms = function(search){
	this.SEARCH_TERMS = search.trim().toLowerCase().split(" ");
	console.log(this.SEARCH_TERMS);
};

/**
 * Search for a block in the workspace using one or more keywords.
 * Uses the Block.search() function on each block.
 * @param {!Array.<string>} keywords Array of keywords to search for
 * @return {!Array.<!Blockly.Block>} Array of blocks containing the keywords
 */
Blockly.Searchbox.searchBlocksByKeywords = function(keywords) {
  var results = [];
  var blocks = this.workspace_.getAllBlocks();

  // Iterate through every block in the workspace.
  for(var i = 0; i < blocks.length; i++) {
    // If the current block contains all of the keywords searched for...
    if(!blocks[i].search(keywords)) {
      blocks[i].setDisabled(true);
    }
  }
  this.workspace_.render();
};

Blockly.Searchbox.createDom = function() {
	this.text_ = "search";
  var cssClass = this.isLabel_ ? 'blocklyFlyoutLabel' : 'blocklyFlyoutButton';
  if (this.cssClass_) {
    cssClass += ' ' + this.cssClass_;
  }

  this.svgGroup_ = Blockly.utils.createSvgElement('g', {'class': cssClass},
      this.workspace_.getCanvas());

  if (!this.isLabel_) {
    // Shadow rectangle (light source does not mirror in RTL).
    var shadow = Blockly.utils.createSvgElement('rect',
        {'class': 'blocklyFlyoutButtonShadow',
         'rx': 4, 'ry': 4, 'x': 1, 'y': 1},
         this.svgGroup_);
  }
  // Background rectangle.
  var rect = Blockly.utils.createSvgElement('rect',
      {'class': this.isLabel_ ?
        'blocklyFlyoutLabelBackground' : 'blocklyFlyoutButtonBackground',
        'rx': 4, 'ry': 4},
      this.svgGroup_);

  var svgText = Blockly.utils.createSvgElement('text',
      {'class': this.isLabel_ ? 'blocklyFlyoutLabelText' : 'blocklyText',
          'x': 0, 'y': 0, 'text-anchor': 'middle'},
      this.svgGroup_);
  svgText.textContent = this.text_;

  this.width = svgText.getComputedTextLength() +
      2 * Blockly.FlyoutButton.MARGIN;
  this.height = 20;  // Can't compute it :(

  if (!this.isLabel_) {
    shadow.setAttribute('width', this.width);
    shadow.setAttribute('height', this.height);
  }
  rect.setAttribute('width', this.width);
  rect.setAttribute('height', this.height);

  svgText.setAttribute('x', this.width / 2);
  svgText.setAttribute('y', this.height - Blockly.FlyoutButton.MARGIN);

  this.updateTransform_();
  return this.svgGroup_;
};

