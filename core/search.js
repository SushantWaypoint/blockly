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

goog.provide('Blockly.Search');

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
Blockly.Search.NAME_TYPE = 'SEARCH';

Blockly.Search.flyoutCategory = function(node, workspace) {
    console.log("We made it");
    var openNode = node.getParent();
	var searchNode = {};
	for (var i = 0; i < openNode.getChildren().length; i++) {
		console.log("Hello " + openNode.getChildren()[i].getHtml().toUpperCase());
		if ((openNode.getChildren()[i].getHtml().toUpperCase()) == "SEARCH"){
			searchNode = openNode.getChildren()[i];
			console.log("Condition is true");
			break;
		}
	}
	if (searchNode){
		searchNode.blocks = [];
		console.log("");

		for (var i  = 0; i < openNode.getChildren().length; i++) {
			
			if (openNode.getChildren()[i].blocks){
				console.log("Length of block array" + openNode.getChildren()[i].blocks.length);
				for (var j = 0; j < openNode.getChildren()[i].blocks.length; j++) {
					searchNode.blocks.push(openNode.getChildren()[i].blocks[j]);
					console.log("Pushed " + openNode.getChildren()[i].blocks[j]);
				}
			}

			else {
				searchNode.blocks.push(openNode.getChildren()[i]);
				console.log("Pushed " + openNode.getChildren()[i]);
			}
		}
	} 

	if (searchNode.blocks) {
		for (var i = 0; i < searchNode.blocks.length; i++) {
			//console.log(seachNode.blocks[i].getAttribute("type"));
		}
	}
	else {
		console.log("searchNode.blocks appears to be empty");
	}
return searchNode.blocks;
};
