/** @jsx jsx */

import { jsx } from '@udecode/slate-plugins-test-utils';
import { Editor } from 'slate';
import { ELEMENT_PARAGRAPH } from '../../../elements/paragraph/defaults';
import { withTrailingNode } from '../../withTrailingNode';

const input = (
  <editor>
    <hh1>
      <hp>test</hp>
    </hh1>
    <hh1>
      <hp>test2</hp>
    </hh1>
  </editor>
) as any;

const output = (
  <editor>
    <hh1>
      <hp>test</hp>
    </hh1>
    <hh1>
      <hp>test2</hp>
    </hh1>
    <hp>
      <htext />
    </hp>
  </editor>
) as any;

it('should be', () => {
  const editor = withTrailingNode({
    type: ELEMENT_PARAGRAPH,
    level: 0,
  })(input as Editor);

  editor.normalizeNode([input, []]);

  expect(input.children).toEqual(output.children);
});
