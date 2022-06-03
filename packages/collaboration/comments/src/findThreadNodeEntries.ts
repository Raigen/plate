import { getNodes, getPluginType, PlateEditor } from '@udecode/plate-core';
import { NodeEntry } from 'slate';
import { ELEMENT_THREAD } from './createThreadPlugin';

export function* findThreadNodeEntries<T = {}>(
  editor: PlateEditor<T>
): Generator<NodeEntry<any>, void, undefined> {
  const type = getPluginType(editor, ELEMENT_THREAD);
  yield* getNodes(editor, {
    at: [],
    match: { type },
  });
}