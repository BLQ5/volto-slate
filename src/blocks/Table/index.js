import codeSVG from '@plone/volto/icons/code.svg';
import TableEdit from './Edit';
import TableView from './View';
import { extractTables } from './deconstruct';

export default function install(config) {
  config.settings.slate = {
    ...config.settings.slate,
    voltoBlockEmiters: [
      ...(config.settings.slate.voltoBlockEmiters || []),
      extractTables,
    ],
  };
  config.blocks.blocksConfig.slateTable = {
    id: 'slateTable',
    title: 'Slate Table',
    icon: codeSVG,
    group: 'text',
    view: TableView,
    edit: TableEdit,
    restricted: false,
    mostUsed: true,
    blockHasOwnFocusManagement: true,
    sidebarTab: 1,
    security: {
      addPermission: [],
      view: [],
    },
    // blockHasValue: (data) => {
    //   return true;
    // },
  };
  return config;
}
