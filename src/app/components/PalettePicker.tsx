import React, { useCallback } from 'react';

import { useTextureCtx } from '../store/textureCtx';

import styles from '../styles/PalettePicker.module.scss';

import { TEXTURE_PALETTE, TEXTURE_PALETTE_SIZE } from '../../objects';

const PALETTE_GROUPED: Map<string, number>[] = TEXTURE_PALETTE
  .slice(0, TEXTURE_PALETTE_SIZE)
  .reduce((arr, color, i) => {
    // convert color int to css RGBA string
    const r = (color >> 24) & 0xFF;
    const g = (color >> 16) & 0xFF;
    const b = (color >> 8) & 0xFF;
    const a = color & 0xFF;
    const cssColor = `rgba(${r}, ${g}, ${b}, ${a / 255})`;
    // first color is transparent, which gets its own group
    if (i === 0)
      arr.push(new Map());
    // group on every 9 colors
    if ((i - 1) % 9 === 0)
      arr.push(new Map());
    // add color to current last group
    arr[arr.length - 1].set(cssColor, i);
    return arr;
  }, []);

export const PalettePicker: React.FunctionComponent = () => {

  const toolColor = useTextureCtx(state => state.toolColor);
  const setColor = useTextureCtx(state => state.setToolColor);

  return (
    <div className={ styles.root }>
      { PALETTE_GROUPED.map((group, groupIdx) => (
        <div className={ styles.swatchGroup } key={ groupIdx }>
          { Array.from(group.entries()).map(([color, colorIdx]) => (
            <div 
              className={ `${ styles.swatch } ${ (toolColor === colorIdx) && styles.swatchActive }` }
              onClick={ () => setColor(colorIdx) }
              key={ colorIdx }
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}