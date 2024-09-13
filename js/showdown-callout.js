'use strict';

const callout = function() {
  return [
    {
      type: 'output',
      filter: function(text) {
        const div = document.createElement('div');
        div.innerHTML = text;

        const blockquotes = div.querySelectorAll('blockquote');
        blockquotes.forEach(blockquote => {
          const firstP = blockquote.querySelector('p');
          if (firstP) {
            const match = firstP.innerHTML.match(/\s*\[!([\w]+)(\+|-)?\]\s*(.*)/);
            if (match) {
              const [fullMatch, className, collapsible, title] = match;
              blockquote.classList.add('callout', `callout-type-${className}`);
              
              let newTitle = title.trim();
              if (newTitle.length === 0) {
                newTitle = className.charAt(0).toUpperCase() + className.slice(1);
              }
              if (collapsible) {
                blockquote.classList.add('callout-collapsible');
                if (collapsible == '-') {
                  blockquote.classList.add('callout-collapsed');
                } else {
                  blockquote.classList.add('callout-expanded');
                }
              }
              
              // Replace the first paragraph content
              firstP.innerHTML = newTitle;
            }
          }
        });

        return div.innerHTML;
      }
    }
  ];
};

// Add Styling
const showdownCalloutStyle = document.createElement('style');
showdownCalloutStyle.innerHTML = `
.callout {
    border-left: 4px solid;
    border-radius: 3px;
    margin: 1em 0;
    padding: 0.5em 1em;
    position: relative;
    transition: background-color 0.3s;
}

.callout p:first-child {
    font-weight: bold;
    margin-top: 0;
}

.callout p:last-child {
    margin-bottom: 0;
}

.callout-collapsible {
    cursor: pointer;
}

/* Info */
.callout-type-info {
    background-color: #e8f4fd;
    border-color: #3498db;
    color: #0d47a1;
}

/* Todo */
.callout-type-todo {
    background-color: #fff8e1;
    border-color: #ffc107;
    color: #795548;
}

/* Spoiler */
.callout-type-spoiler {
    background-color: #f5f5f5;
    border-color: #9e9e9e;
    color: #424242;
}

/* Tip */
.callout-type-tip {
    background-color: #e8f5e9;
    border-color: #4caf50;
    color: #1b5e20;
}

/* Question */
.callout-type-question {
    background-color: #fff3e0;
    border-color: #ff9800;
    color: #e65100;
}

/* OK/Success */
.callout-type-ok,
.callout-type-success {
    background-color: #e8f5e9;
    border-color: #2ecc71;
    color: #1b5e20;
}

/* Fail */
.callout-type-fail {
    background-color: #fbe9e7;
    border-color: #ff5722;
    color: #bf360c;
}

/* Warning */
.callout-type-warning {
    background-color: #fff3e0;
    border-color: #f39c12;
    color: #e65100;
}

/* Danger */
.callout-type-danger {
    background-color: #ffebee;
    border-color: #f44336;
    color: #b71c1c;
}

/* Bug */
.callout-type-bug {
    background-color: #f3e5f5;
    border-color: #9c27b0;
    color: #4a148c;
}

/* Collapsed state */
.callout-collapsed > *:not(:first-child) {
    display: none;
}

/* Collapse/Expand icons */
.callout-collapsible p:first-child::before {
    content: '▾';
    display: inline-block;
    margin-right: 5px;
    transition: transform 0.3s;
}

.callout-collapsed p:first-child::before {
    transform: rotate(-90deg);
}
`;
document.head.appendChild(showdownCalloutStyle);

// Register Extension with Showdown if Available
if (typeof showdown !== 'undefined' && showdown.extension) {
  showdown.extension('callout', callout);
}

document.addEventListener('click', function(e) {
  const callout = e.target.closest('.callout-collapsible');
  if (callout) {
    callout.classList.toggle('callout-collapsed');
    callout.classList.toggle('callout-expanded');
    const firstP = callout.querySelector('p');
  }
});
