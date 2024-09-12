'use strict';

const footnote = {
  filters: [
    type: 'lang',
    filter: function filter(text) {
      return text.replace(/^\[\^([\d\w]+)\]:\s*((\n+(\s{2,4}|\t).+)+)$/mg, function (str, name, rawContent, _, padding) {
        var content = converter.makeHtml(rawContent.replace(new RegExp('^' + padding, 'gm'), ''));
        return '<div class="footnote" id="footnote-' + name + '"><a href="#footnote-' + name + '"><sup>[' + name + ']</sup></a>:' + content + '</div>';
      });
    }
  }, {
    type: 'lang',
    filter: function filter(text) {
      return text.replace(/^\[\^([\d\w]+)\]:( |\n)((.+\n)*.+)$/mg, function (str, name, _, content) {
        return '<small class="footnote" id="footnote-' + name + '"><a href="#footnote-' + name + '"><sup>[' + name + ']</sup></a>: ' + content + '</small>';
      });
    }
  }, {
    type: 'lang',
    filter: function filter(text) {
      return text.replace(/\[\^([\d\w]+)\]/m, function (str, name) {
        return '<a href="#footnote-' + name + '"><sup>[' + name + ']</sup></a>';
      });
    }
  }];
};

showdown.extension('footnote', () => footnoteExtension.filters);

