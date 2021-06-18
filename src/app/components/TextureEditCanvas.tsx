import React, { useEffect, useRef } from 'react';
import { useTextureCtx } from '../store/textureCtx';

export const TextureEditCanvas: React.FunctionComponent = () => {
  const canvasRef = useRef<HTMLCanvasElement>();
  const idx = useTextureCtx(state => state.idx);
  const editor = useTextureCtx(state => state.editor);
  
  useEffect(() => {
    editor.setRenderDst(canvasRef.current);
  }, [idx]);

  return (
    <div>
      <canvas
        ref={ canvasRef }
        onMouseMove={ (e) => editor.onInputMove(e as any as MouseEvent) }
        onMouseDown={ (e) => editor.onInputDown(e as any as MouseEvent) }
        // onMouseUp={ editor.onInputUp }
      />
    </div>
  );
}