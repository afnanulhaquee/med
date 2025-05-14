import React, { useRef, useState, useEffect } from 'react';
import Button from './Button';

interface SignatureCanvasProps {
  onSave: (signature: string) => void;
  initialSignature?: string;
  readOnly?: boolean;
}

export default function SignatureCanvas({ 
  onSave, 
  initialSignature,
  readOnly = false
}: SignatureCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    setCtx(context);
    context.lineWidth = 2;
    context.lineCap = 'round';
    context.strokeStyle = '#0284c7';

    // Clear canvas initially
    context.fillStyle = '#f9fafb';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add some styling to make it look like a signature field
    context.strokeStyle = '#e5e7eb';
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(0, canvas.height - 5);
    context.lineTo(canvas.width, canvas.height - 5);
    context.stroke();
    
    // Reset for actual drawing
    context.strokeStyle = '#0284c7';
    context.lineWidth = 2;

    // Load initial signature if provided
    if (initialSignature) {
      const img = new Image();
      img.onload = () => {
        context.drawImage(img, 0, 0);
      };
      img.src = initialSignature;
    }
  }, [initialSignature]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (readOnly) return;
    setIsDrawing(true);
    
    const canvas = canvasRef.current;
    if (!canvas || !ctx) return;
    
    let clientX: number, clientY: number;
    
    if ('touches' in e) {
      e.preventDefault();
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || readOnly) return;
    
    const canvas = canvasRef.current;
    if (!canvas || !ctx) return;
    
    let clientX: number, clientY: number;
    
    if ('touches' in e) {
      e.preventDefault();
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const endDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    if (readOnly) return;
    
    const canvas = canvasRef.current;
    if (!canvas || !ctx) return;
    
    ctx.fillStyle = '#f9fafb';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Redraw the bottom line
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - 5);
    ctx.lineTo(canvas.width, canvas.height - 5);
    ctx.stroke();
    
    // Reset for actual drawing
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2;
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dataUrl = canvas.toDataURL('image/png');
    onSave(dataUrl);
  };

  return (
    <div className="flex flex-col items-center">
      <div 
        className={`border-2 rounded-md ${readOnly ? 'border-gray-200' : 'border-gray-300'} mb-4 bg-gray-50`}
        style={{ touchAction: 'none' }}
      >
        <canvas
          ref={canvasRef}
          width={400}
          height={200}
          className="touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={endDrawing}
        />
      </div>
      {!readOnly && (
        <div className="flex space-x-4">
          <Button variant="outline" onClick={clearSignature}>
            Clear
          </Button>
          <Button variant="primary" onClick={saveSignature}>
            Save Signature
          </Button>
        </div>
      )}
    </div>
  );
}