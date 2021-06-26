import React, { useCallback } from 'react';

import { ToolBase, ToolType } from '../editor';

import { useTextureCtx } from '../store/textureCtx';

import { ReactComponent as IconPen } from '../graphics/iconPen.svg';
import { ReactComponent as IconErase } from '../graphics/iconErase.svg';
import { ReactComponent as IconFill } from '../graphics/iconFill.svg';
import { ReactComponent as IconGrabber } from '../graphics/iconGrabber.svg';
import { ReactComponent as IconEyedrop } from '../graphics/iconEyedrop.svg';

import styles from '../styles/ToolPicker.module.scss';

export const ToolPicker: React.FunctionComponent = () => (
  <div className={ styles.root }>
    <ToolIcon type={ ToolType.Pen }>
      <IconPen/>
    </ToolIcon>
    <ToolIcon type={ ToolType.Eraser }>
      <IconErase/>
    </ToolIcon>
    <ToolIcon type={ ToolType.Fill }>
      <IconFill/>
    </ToolIcon>
    <ToolIcon type={ ToolType.EyeDrop }>
      <IconEyedrop/>
    </ToolIcon>
    <ToolIcon type={ ToolType.Grabber }>
      <IconGrabber/>
    </ToolIcon>
  </div>
);

const ToolIcon: React.FunctionComponent<{ type: ToolType }> = ({ type, children }) => {
  const activeTool = useTextureCtx(state => state.activeTool);
  const setActiveTool = useTextureCtx(state => state.setActiveTool);
  return (
    <div
      className={ `${ styles.icon } ${ activeTool === type && styles.iconActive }` }
      onClick={ () => setActiveTool(type) }
    >
      { children }
    </div>
  );
};