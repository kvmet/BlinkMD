'use strict';

const footnoteExtension = {
  type: 'lang', 
  filters: [
    {
      type: 'lang',
      filter: text => {
        return text.replace(/^\[\^([\d\w]+)\]:\s*((\n+(\s{2,4}|\t).+)+)$/mg, (str, name, rawContent, _, padding) => {
          const content = converter.makeHtml(rawContent.replace(new RegExp(`^${padding}`, 'gm'), ''));
          return `<div class="footnote" id="footnote-${name}"><a href="#footnote-${name}"><sup>[${name}]</sup></a>: ${content}</div>`;
        });
      }
    },
    {
      type: 'lang',
      filter: text => {
        return text.replace(/^\[\^([\d\w]+)\]:( |\n)((.+\n)*.+)$/mg, (str, name, _, content) => {
          return `<small class="footnote" id="footnote-${name}"><a href="#footnote-${name}"><sup>[${name}]</sup></a>: ${content}</small>`;
        });
      }
    },
    {
      type: 'lang',
      filter: text => {
        return text.replace(/\[\^([\d\w]+)\]/m, (str, name) => {
          return `<a href="#footnote-${name}"><sup>[${name}]</sup></a>`;
        });
      }
    }
  ]
};

showdown.extension('footnote', () => footnoteExtension.filters);

