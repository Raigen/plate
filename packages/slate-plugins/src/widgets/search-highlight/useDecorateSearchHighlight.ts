import { Decorate, getPluginOptions } from '@udecode/slate-plugins-core';
import { Editor, NodeEntry, Range, Text } from 'slate';
import { MARK_SEARCH_HIGHLIGHT } from './defaults';
import { DecorateSearchHighlightOptions } from './types';

export const useDecorateSearchHighlight = ({
  search,
}: DecorateSearchHighlightOptions): Decorate => (editor: Editor) => {
  const options = getPluginOptions(editor, MARK_SEARCH_HIGHLIGHT);

  return ([node, path]: NodeEntry) => {
    const ranges: Range[] = [];

    if (search && Text.isText(node)) {
      const { text } = node;
      const parts = text.split(search);
      let offset = 0;
      parts.forEach((part, i) => {
        if (i !== 0) {
          ranges.push({
            anchor: { path, offset: offset - search.length },
            focus: { path, offset },
            [options.type]: true,
          });
        }
        offset = offset + part.length + search.length;
      });
    }

    return ranges;
  };
};
