var toc = {
  type: 'output', 
  filter: function(text, converter, options) {
    //OLD: var elements = $(text);
    var elements = Array.from(new DOMParser().parseFromString(text, 'text/html').body.childNodes);
    var output = [];
    var headingLevel = null;
    var tocId = null;
    for (var i=0; i<elements.length; i++) {
      var element = elements[i];
      var results = null;

      // Does the element consist only of [toc]?
      // If so, we can replace this element with out list.
      //OLD: if (element.text().trim()=='[toc]') {
      if (element.textContent.trim() == '[toc]') {
        //OLD: element = $('<ol>',{'class':'showdown-toc'});
        var element = document.createElement('ol');
        element.className = 'showdown-toc';
        headingLevel = null;
        tocId = output.length;
      }

      // Does this item contain a [toc] with other stuff?
      // If so, we'll split the element into two 
      else if (results = element.text().trim().match(/^([\s\S]*?)((?:\\)?\[toc\])([\s\S]*)$/)) {

        // If there was a \ before the [toc] they're trying to escape it,
        // so return the [toc] string without the \ and carry on. For
        // some reason (I'm guessing a bug in showdown) you actually
        // appear to need two \ (\\) in order to get this to show up for
        // the filter. Leaving this code here anyway for now because it's
        // "the right thing to do"(tm).
        if (results[2][0]=='\\') {
          element.text(results[1]+results[2].substr(1)+results[3]);
        }

        // Otherwise start building a new table of contents.
        else {
          var before = null;
          var after = null;

          // Create two of the same element.
          //OLD: if (element.prop('tagName')) 
          if(element.tagName) {
            if (results[1].trim().length>0) {
              //OLD: before = $('<'+element.prop('tagName')+'>').text(results[1]);
              var before = document.createElement(element.tagName);
              before.textContent = results[1];
            }
            if (results[3].trim().length>0) {
              //OLD: after = $('<'+element.prop('tagName')+'>').text(results[3]);
              var after = document.createElement(element.tagName);
              after.textContent = results[3];
            }
          }

          // Otherwise if there's no tagName assume it's a text node
          // and create two of those.
          else {
            if (results[1].trim().length>0) {
              //OLD: before = document.createTextNode(results[1]);
              var before = document.createTextNode(results[1]);
            }
            if (results[3].trim().length>0) {
              //OLD: after = document.createTextNode(results[3]);
              var after = document.createTextNode(results[3]);
            }
          }

          // Our new table of contents container.
          //OLD: toc = $('<ol>',{'class':'showdown-toc'});
          var toc = document.createElement('ol');
          toc.className = 'showdown-toc';

          // If there was text before our [toc], add that in
          if (before) {
            output.push(before);
          }

          // Keep track of where our current table is in the elements array.
          tocId = output.length;

          // If there was text after, push the contents onto the array and
          // use the after part as our current element.
          if (after) {
            output.push(toc);
            element = after;
          }

          // Otherwise use the contents as the current element.
          else {
            element = toc;
          }

          // Reset the heading level - we're going to start looking for new
          // headings again
          headingLevel = null;

        }
      }

      // If we've started a table of contents, but have nothing in it yet,
      // look for the first header tag we encounter (after the [toc]).
      // That's going to be what we use as contents entries for this table
      // of contents.
      //OLD:else if (tocId && !headingLevel && element.prop("tagName")) {
        //OLD:switch (element.prop("tagName")) {
          //OLD:case 'H1':
          //OLD:case 'H2':
          //OLD:case 'H3':
          //OLD:case 'H4':
          //OLD:case 'H5':
          //OLD:case 'H6':
            //OLD:headingLevel = parseInt(element.prop('tagName').substr(1));
            //OLD:break;
        //OLD:}
      //OLD:}
      else if (tocId && !headingLevel && element.tagName) {
        var tagName = element.tagName; // Get the tag name of the element

        if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(tagName)) {
          headingLevel = parseInt(tagName.substr(1), 10); // Extract the number part and convert it to an integer
        }
      }

      // If we know what header level we're looking for (either we just
      // found it above, or we're continuing to look for more) then check to
      // see if this heading should be added to the contents.
      //OLD:if (tocId && headingLevel) 
        //OLD:switch (element.prop('tagName')) 
          //OLD:case 'H1':
          //OLD:case 'H2':
          //OLD:case 'H3':
          //OLD:case 'H4':
          //OLD:case 'H5':
          //OLD:case 'H6':
            //OLD:var thisLevel = parseInt(element.prop('tagName').substr(1));
            //OLD:if (thisLevel==headingLevel) {
              //OLD://OLD: output[tocId] = $(output[tocId]).append($('<li>').append($('<a>',{href:'#'+element.attr('id'),text:element.text()})));
              //OLD:var li = document.createElement('li');
              //OLD:var a = document.createElement('a');
              //OLD:a.href = '#' + element.id;
              //OLD:a.textContent = element.textContent;
              //OLD:li.appendChild(a);
              //OLD:output[tocId].appendChild(li);
            //OLD:}
            //OLD:// If we move up in what would be the document tree
            //OLD:// (eg: if we're looking for H2 and we suddenly find an
            //OLD:// H1) then we can probably safely assume that we want
            //OLD:// the table of contents to end for this section.
            //OLD:else if (thisLevel<headingLevel) {
              //OLD:toc = null
              //OLD:tocId = null;
              //OLD:headingLevel = null;
            //OLD:}
            //OLD:break;
        //OLD:}
        var tagName = element.tagName;
        if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(tagName)) {
          var thisLevel = parseInt(tagName.substr(1), 10);
          if (thisLevel == headingLevel) {
            var li = document.createElement('li');
            var a = document.createElement('a');
            a.href = '#' + element.id;
            a.textContent = element.textContent;
            li.appendChild(a);
            output[tocId].appendChild(li);
          } else if (thisLevel < headingLevel) {
            toc = null;
            tocId = null;
            headingLevel = null;
          }
        }
      }
    // Push whatever element we've been looking at onto the output array.
    output.push(element);
    // Build some HTML to return
    // Return it.
    //OLD: return $('<div>').append(output).html();
    var div = document.createElement('div');
    output.forEach(function(child) {
      div.appendChild(child);
    });
    return div.innerHTML;
  }
};

showdown.extension('toc',toc);
//window.toc = toc;
