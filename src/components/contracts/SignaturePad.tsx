import { useRef, useEffect, useState } from 'react';
import SignaturePad from 'signature_pad';
import { Button } from '@/components/ui/button';
import { Eraser, Check } from 'lucide-react';

interface SignaturePadComponentProps {
  onSave: (signature: string) => void;
  disabled?: boolean;
}

const SignaturePadComponent = ({ onSave, disabled }: SignaturePadComponentProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const signaturePadRef = useRef<SignaturePad | null>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    if (canvasRef.current) {
      signaturePadRef.current = new SignaturePad(canvasRef.current, {
        backgroundColor: 'rgb(255, 255, 255)',
        penColor: 'rgb(0, 0, 0)',
      });

      signaturePadRef.current.addEventListener('endStroke', () => {
        setIsEmpty(signaturePadRef.current?.isEmpty() ?? true);
      });

      // Resize canvas
      const resizeCanvas = () => {
        const canvas = canvasRef.current;
        if (canvas) {
          const ratio = Math.max(window.devicePixelRatio || 1, 1);
          canvas.width = canvas.offsetWidth * ratio;
          canvas.height = canvas.offsetHeight * ratio;
          canvas.getContext('2d')?.scale(ratio, ratio);
          signaturePadRef.current?.clear();
        }
      };

      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);

      return () => {
        window.removeEventListener('resize', resizeCanvas);
        signaturePadRef.current?.off();
      };
    }
  }, []);

  const handleClear = () => {
    signaturePadRef.current?.clear();
    setIsEmpty(true);
  };

  const handleSave = () => {
    if (signaturePadRef.current && !signaturePadRef.current.isEmpty()) {
      const dataUrl = signaturePadRef.current.toDataURL('image/png');
      onSave(dataUrl);
    }
  };

  return (
    <div className="space-y-3">
      <div className="border-2 border-dashed border-border rounded-xl overflow-hidden bg-card">
        <canvas
          ref={canvasRef}
          className="w-full h-40 touch-none"
          style={{ display: 'block' }}
        />
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleClear}
          disabled={disabled || isEmpty}
          className="flex-1"
        >
          <Eraser className="w-4 h-4 mr-1" />
          Ryd
        </Button>
        <Button
          type="button"
          variant="warm"
          size="sm"
          onClick={handleSave}
          disabled={disabled || isEmpty}
          className="flex-1"
        >
          <Check className="w-4 h-4 mr-1" />
          Bekræft signatur
        </Button>
      </div>
      <p className="text-xs text-muted-foreground text-center">
        Tegn din underskrift med musen eller fingeren
      </p>
    </div>
  );
};

export default SignaturePadComponent;
