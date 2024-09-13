// showdown-blinklink
//
// copyright 2024 kvmet
//
// MIT License
//
// Permission is hereby granted, free of charge, to any person obtaining a copy 
// of this software and associated documentation files (the “Software”), to deal
// in the Software without restriction, including without limitation the rights 
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell 
// copies of the Software, and to permit persons to whom the Software is 
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in 
// all copies or substantial portions of the Software. 
//
// THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS 
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
// IN THE SOFTWARE.

'use strict';

const blinklink = function() {
  return [
    {
      type: 'lang',
      regex: /\[\[(.*?)(\|.*?)?\]\]/g,
      replace: function(match, path, title) {
        const href = path.replace(/\//g, '.');
        const displayText = title ? title.slice(1) : path; // Remove the leading '|' if present
        return `<a href="?${href}">${displayText}</a>`;
      }
    }
  ];
};

// Register Extension with Showdown if Available
if (typeof showdown !== 'undefined' && showdown.extension) {
  showdown.extension('blinklink', blinklink);
}

