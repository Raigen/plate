/** @jsx jsx */

import { jsx } from '@udecode/slate-plugins-test-utils';
import { BoldPlugin } from '../../../../marks/bold/BoldPlugin';
import {
  deserializeHTMLToMarks,
  DeserializeMarksProps,
} from '../../utils/deserializeHTMLToMarks';

const input: DeserializeMarksProps = {
  plugins: [BoldPlugin()],
  element: document.createElement('strong'),
  children: <fragment>test</fragment>,
} as any;

const output = (
  <fragment>
    <htext bold>test</htext>
  </fragment>
);

it('should be', () => {
  expect(deserializeHTMLToMarks(input as any)).toEqual(output);
});
