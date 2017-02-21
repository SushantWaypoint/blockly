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
goog.require('goog.ui.tree.TreeNode');
goog.require('goog.ui.tree.TreeControl');
goog.require('goog.math.Coordinate');


/**
 * Category to separate procedure names from variables and generated functions.
 */
Blockly.Searchbox.SEARCH_TERMS = [];
Blockly.Searchbox.button = {};
Blockly.Searchbox.workspace_ = {};
Blockly.Searchbox.text_ = null;
Blockly.Searchbox.cssClass = {};
Blockly.Searchbox.svgGroup_ = {};
Blockly.Searchbox.width = null;
Blockly.Searchbox.height = null;
Blockly.Searchbox.callback_ = null;

Blockly.Searchbox.init = function(workspace){
        this.position_ = new goog.math.Coordinate(0, 0);
        
        //create search button
        this.button = goog.dom.createDom('button');
        this.button.setAttribute('text', "Search...");
        this.button.setAttribute('callbackKey', 'START_SEARCH');
        this.workspace_ = workspace;
        
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
  this.width = 200;
  this.MARGIN = 5;
  var cssClass = 'blocklyFlyoutButton';
  if (this.cssClass_) {
    cssClass += ' ' + this.cssClass_;
  }

  this.svgGroup_ = Blockly.utils.createSvgElement('g', {'class': cssClass},
      this.workspace_.getCanvas());

  // Background rectangle.
  var rect = Blockly.utils.createSvgElement('rect',
      {'class': 'blocklyFlyoutButtonBackground',
        'rx': 4, 'ry': 4},
      this.svgGroup_);

  var svgText = Blockly.utils.createSvgElement('text',
      {'class': 'blocklyText',
          'x': 0, 'y': 0, 'text-anchor': 'middle'},
      this.svgGroup_);
  svgText.textContent = this.text_;
  console.log(svgText.getComputedTextLength());

  //this.width = svgText.getComputedTextLength() +      2*this.MARGIN;
  this.height = 100;  // Can't compute it :(

  rect.setAttribute('width', this.width);
  rect.setAttribute('height', this.height);

 svgText.setAttribute('x', this.width / 2);
  svgText.setAttribute('y', this.height - this.MARGIN);

  this.updateTransform_();
  
  Blockly.bindEventWithChecks_(this.svgGroup_, 'mouseup', this,
          this.onMouseUp);
  
  return this.svgGroup_;
};

/**
 * Update svg attributes to match internal state.
 * @private
 */
Blockly.Searchbox.updateTransform_ = function() {
  this.svgGroup_.setAttribute('transform',
      'translate(' + this.position_.x + ',' + this.position_.y + ')');
};

/**
 * Do something when the button is clicked.
 * @param {!Event} e Mouse up event.
 */
Blockly.Searchbox.onMouseUp = function(e) {
    console.log("click");
  // Don't scroll the page.
  e.preventDefault();
  // Don't propagate mousewheel event (zooming).
  e.stopPropagation();
  // Stop binding to mouseup and mousemove events--flyout mouseup would normally
  // do this, but we're skipping that.
  Blockly.Flyout.terminateDrag_();
 

  // Call the callback registered to this button.
                var searchTerm = Blockly.Searchbox.startSearch(Blockly.Searchbox.workspace_);
                console.log("Search Term: " + searchTerm);
                if(searchTerm) {
                    Blockly.Searchbox.setSearchTerms(searchTerm);
                    Blockly.Searchbox.searchBlocksByKeywords();
                }
  
};

