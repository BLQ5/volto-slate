import { TextBlockView, TextBlockEdit } from './TextBlock';
import codeSVG from '@plone/volto/icons/code.svg';
import * as slateConfig from './editor/config';

export function applyConfig(config) {
  config.blocks.blocksConfig.slate = {
    id: 'slate',
    title: 'Slate',
    icon: codeSVG,
    group: 'text',
    view: TextBlockView,
    edit: TextBlockEdit,
    restricted: false,
    mostUsed: true,
    blockHasOwnFocusManagement: false,
    sidebarTab: 1,
    security: {
      addPermission: [],
      view: [],
    },
  };

  config.settings.slate = {
    ...slateConfig,
  };

  return config;
}
