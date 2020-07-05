import React from 'react';
import { useSlate } from 'slate-react';
import { Editor, Range, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { Segment } from 'semantic-ui-react';

import { Icon as VoltoIcon } from '@plone/volto/components';
import superindexSVG from '@plone/volto/icons/superindex.svg';
import briefcaseSVG from '@plone/volto/icons/briefcase.svg';
import formatClearSVG from '@plone/volto/icons/format-clear.svg';
import checkSVG from '@plone/volto/icons/check.svg';
import clearSVG from '@plone/volto/icons/clear.svg';

import SidebarPopup from 'volto-slate/futurevolto/SidebarPopup';
import InlineForm from 'volto-slate/futurevolto/InlineForm';

import { ToolbarButton } from 'volto-slate/editor/ui';
import { FootnoteSchema } from './schema';
import { FOOTNOTE } from './constants';

export const wrapFootnote = (editor, data) => {
  if (isActiveFootnote(editor)) {
    unwrapFootnote(editor);
  }

  const { selection } = editor;
  const isCollapsed = selection && Range.isCollapsed(selection);
  const footnote = {
    type: FOOTNOTE,
    data,
  };

  if (isCollapsed) {
    Transforms.insertNodes(editor, footnote);
  } else {
    Transforms.wrapNodes(editor, footnote, { split: true });
    Transforms.collapse(editor, { edge: 'end' });
  }
};

function insertFootnote(editor, data) {
  if (editor.selection) {
    wrapFootnote(editor, data);
  }
}

function unwrapFootnote(editor) {
  Transforms.unwrapNodes(editor, { match: (n) => n.type === FOOTNOTE });
}

export const isActiveFootnote = (editor) => {
  const [note] = Editor.nodes(editor, { match: (n) => n.type === FOOTNOTE });
  // console.log('links', Array.from(links));
  // return Array.from(links).length === 1;

  return !!note;
};

export const getActiveFootnote = (editor) => {
  const [note] = Editor.nodes(editor, { match: (n) => n.type === FOOTNOTE });
  return note;
};

const FootnoteButton = () => {
  const editor = useSlate();
  const [showForm, setShowForm] = React.useState(false);
  const [selection, setSelection] = React.useState(null);
  const note = getActiveFootnote(editor);
  let data = {};
  if (note) {
    data = note.data;
  }
  console.log('note', note);
  const [formData, setFormdata] = React.useState(data);

  const submitHandler = React.useCallback(
    (formData) => {
      // TODO: have an algorithm that decides which one is used
      console.log('formData', formData, selection);
      const { footnote } = formData;
      if (footnote) {
        Transforms.select(editor, selection);
        insertFootnote(editor, formData);
      } else {
        unwrapFootnote(editor);
      }
    },
    [editor, selection],
  );

  const isFootnote = isActiveFootnote(editor);

  return (
    <>
      <SidebarPopup open={showForm}>
        <InlineForm
          schema={FootnoteSchema}
          title={FootnoteSchema.title}
          icon={<VoltoIcon size="24px" name={briefcaseSVG} />}
          onChangeField={(id, value) => {
            setFormdata({ ...formData, [id]: value });
          }}
          formData={formData}
          headerActions={
            <>
              <button
                onClick={() => {
                  setShowForm(false);
                  submitHandler(data);
                  ReactEditor.focus(editor);
                }}
              >
                <VoltoIcon size="24px" name={checkSVG} />
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  unwrapFootnote(editor);
                  ReactEditor.focus(editor);
                }}
              >
                <VoltoIcon size="24px" name={formatClearSVG} />
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  console.log('editor', editor);
                  ReactEditor.focus(editor);
                }}
              >
                <VoltoIcon size="24px" name={clearSVG} />
              </button>
            </>
          }
        />
        <Segment>bla</Segment>
      </SidebarPopup>
      <ToolbarButton
        active={isFootnote}
        onMouseDown={() => {
          if (!showForm) {
            setSelection(editor.selection);
            setShowForm(true);
          }
        }}
        icon={superindexSVG}
      />
    </>
  );
};

export default FootnoteButton;