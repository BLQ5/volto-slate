import React, { Fragment, useRef, useEffect } from 'react';
import { ReactEditor, useSlate } from 'slate-react';
import { Editor, Range } from 'slate';
import cx from 'classnames';
import { Portal } from 'react-portal';

import { settings } from '~/config';
import ToolbarToggleButton from './ToolbarToggleButton';
import BasicToolbar from './BasicToolbar';

const Toolbar = ({ mainToolbarShown, onToggle, showMasterToggleButton }) => {
  const ref = useRef();

  const editor = useSlate();
  const { toolbarButtons, availableButtons } = settings.slate;

  if (typeof showMasterToggleButton !== 'boolean') {
    showMasterToggleButton = true;
  }

  function handleOnToggle() {
    onToggle();
  }

  useEffect(() => {
    const el = ref.current;
    const { selection } = editor;

    if (
      !selection ||
      !ReactEditor.isFocused(editor) ||
      Range.isCollapsed(selection) ||
      Editor.string(editor, selection) === ''
    ) {
      el.removeAttribute('style');
      return;
    }

    const domSelection = window.getSelection();
    const domRange = domSelection.getRangeAt(0);
    const rect = domRange.getBoundingClientRect();

    el.style.opacity = 1;
    el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight}px`;
    el.style.left = `${
      rect.left + window.pageXOffset - el.offsetWidth / 2 + rect.width / 2
    }px`;
  });

  return (
    <Portal>
      <BasicToolbar className="slate-inline-toolbar" ref={ref}>
        {toolbarButtons.map((name, i) => (
          <Fragment key={`${name}-${i}`}>{availableButtons[name]}</Fragment>
        ))}
        <ToolbarToggleButton
          className={cx({ hidden: !showMasterToggleButton })}
          active={mainToolbarShown}
          onToggle={handleOnToggle}
        />
      </BasicToolbar>
    </Portal>
  );
};

export default Toolbar;