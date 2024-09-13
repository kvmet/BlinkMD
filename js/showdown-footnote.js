'use strict';

const footnote = function() {
  const footnotes = {};
  const subscriptLetters = 'abcdefghijklmnopqrstuvwxyz';

  return [
    {
      type: 'lang',
      filter: function(text) {
        const regexReference = /\[\^([\d\w]+)\](?!:)/gm;
        const regexDefinition = /^\[\^([\d\w]+)\]:\s*([\s\S]+?)(?=\n{2,}|\Z|\[\^)/gm;
        const placeholderPrefix = "FOOTNOTE_DEF_START_";
        const placeholderSuffix = "FOOTNOTE_DEF_END";

        // Function to generate unique IDs for multiple references
        const generateId = (id, count) => `footnote-${id}-${count}`;

        // Initialize footnote object properly
        footnotes.clear = () => {
          for (const key in footnotes) {
            if (key !== 'clear') {
              delete footnotes[key];
            }
          }
        };
        footnotes.clear();

        // First, process footnote definitions
        text = text.replace(regexDefinition, (match, id, content) => {
          footnotes[id] = { count: 0, refs: [], content: '', placeholder: '' };
          footnotes[id].content = content.replace(/(^|\n)( {4}|\t)/g, '$1'); // Remove leading indentation if any
          footnotes[id].placeholder = `${placeholderPrefix}${id}`;

          const placeholderDefinition = `${placeholderPrefix}${id}${placeholderSuffix}`;
          return `<!--${placeholderPrefix}${id}-->${footnotes[id].content}<!--${placeholderSuffix}-->`;
        });

        // Then, process footnote references
        text = text.replace(regexReference, (match, id) => {
          if (!footnotes[id]) {
            return match; // Return the original reference if no definition exists
          }
          const uniqueId = generateId(id, ++footnotes[id].count);
          footnotes[id].refs.push({ id: uniqueId });
          const subscript = subscriptLetters[footnotes[id].refs.length - 1];
          return `<a class="footnote-reference" href="#footnote-def-${id}" id="${uniqueId}"><sup>${id}<sub>${subscript}</sub></sup></a>`;
        });

        return text;
      }
    },
    {
      type: 'output',
      filter: function(text) {
        const regexPlaceholder = /<!--FOOTNOTE_DEF_START_([\d\w]+)-->([\s\S]*?)<!--FOOTNOTE_DEF_END-->/gm;

        text = text.replace(regexPlaceholder, (match, id, content) => {
          const backLinks = footnotes[id].refs.map(
            (ref, index) => `<a href="#${ref.id}" class="footnote-backref">↩${subscriptLetters[index]}</a>`
          ).join(' ');

          return `
            <div class="footnote" id="footnote-def-${id}">
              <div class="footnote-header">
                <sup>${id}:</sup>
                <span class="footnote-backlinks">${backLinks}</span>
              </div>
              <div class="footnote-content">${content.trim()}</div>
            </div>`;
        });

        return text;
      }
    }
  ];
};

const style = document.createElement('style');
style.innerHTML = `
  .footnote {
    margin-top: 0.5em;
    font-size: 0.9em;
  }
  .footnote-header {
    display: flex;
    align-items: center;
  }
  .footnote-header sup {
    margin-right: 0.25em;
  }
  .footnote-backlinks {
    font-size: 0.8em;
    color: #555;
    margin-left: 0.5em;
  }
  .footnote-content {
    margin-left: 1.5em;
  }
  .footnote-reference {
    text-decoration: none;
  }
  .footnote-backref {
    margin-left: 0.25em;
    text-decoration: none;
  }
  sub {
    font-size: 70%;
    vertical-align: sub;
  }
`;
document.head.appendChild(style);

if (typeof showdown !== 'undefined' && showdown.extension) {
  showdown.extension('footnote', footnote);
}
