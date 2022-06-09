import { useDrag } from 'react-dnd';
import { DragSourceHookSpec } from 'react-dnd/src/hooks/types';
import { TEditor, Value } from '@udecode/plate-core';
import { DragItemNode } from '../types';

export interface UseDragNodeOptions
  extends DragSourceHookSpec<DragItemNode, unknown, { isDragging: boolean }> {
  id: string;
}

/**
 * `useDrag` hook to drag a node from the editor. `item` with `id` is required.
 *
 * On drag start:
 * - set `editor.isDragging` to true
 * - add `dragging` class to `body`
 *
 * On drag end:
 * - set `editor.isDragging` to false
 * - remove `dragging` class to `body`
 *
 * Collect:
 * - isDragging: true if mouse is dragging the block
 */
export const useDragNode = <V extends Value>(
  editor: TEditor<V>,
  { id, item, ...options }: UseDragNodeOptions
) => {
  return useDrag<DragItemNode, unknown, { isDragging: boolean }>(
    () => ({
      item(monitor) {
        editor.isDragging = true;
        document.body.classList.add('dragging');

        const _item = typeof item === 'function' ? item(monitor) : item;

        return {
          id,
          ..._item,
        };
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: () => {
        editor.isDragging = false;
        document.body.classList.remove('dragging');
      },
      ...options,
    }),
    []
  );
};
