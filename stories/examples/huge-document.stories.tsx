import React from 'react';
import {
  getSlatePluginsOptions,
  SlatePlugins,
  useBasicElementPlugins,
  useHistoryPlugin,
  useReactPlugin,
} from '@udecode/slate-plugins';
import { getSlatePluginsComponents } from '@udecode/slate-plugins-components';
import {
  editableProps,
  initialValueHugeDocument,
} from '../config/initialValues';

const id = 'Examples/Huge Document';

export default {
  title: id,
};

const components = getSlatePluginsComponents();
const options = getSlatePluginsOptions();

export const Example = () => {
  const plugins = [
    useReactPlugin(),
    useHistoryPlugin(),
    ...useBasicElementPlugins(),
  ];

  return (
    <SlatePlugins
      id={id}
      plugins={plugins}
      components={components}
      options={options}
      editableProps={editableProps}
      initialValue={initialValueHugeDocument}
    />
  );
};
