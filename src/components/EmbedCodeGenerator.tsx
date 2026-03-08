import { useState } from "react";
import { Copy, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface EmbedCodeGeneratorProps {
  title: string;
  description: string;
  embedUrl: string;
  defaultWidth?: number;
  defaultHeight?: number;
}

const EmbedCodeGenerator = ({ title, description, embedUrl, defaultWidth = 400, defaultHeight = 200 }: EmbedCodeGeneratorProps) => {
  const [width, setWidth] = useState(defaultWidth);
  const [height, setHeight] = useState(defaultHeight);

  const embedCode = `<iframe src="${embedUrl}" width="${width}" height="${height}" frameborder="0" style="border:0;border-radius:10px;overflow:hidden;" loading="lazy"></iframe>`;

  const copy = () => {
    navigator.clipboard.writeText(embedCode);
    toast.success("Embed code copied!");
  };

  return (
    <div className="rounded-xl border border-border bg-card/80 p-6 space-y-4">
      <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
        <Code className="h-4 w-4 text-gold" />
        {title}
      </h3>
      <p className="text-xs text-muted-foreground">{description}</p>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="text-xs text-muted-foreground mb-1 block">Width</label>
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
            className="w-full bg-background border border-border rounded-md px-3 py-1.5 text-xs text-foreground"
            min={200}
            max={1200}
          />
        </div>
        <div className="flex-1">
          <label className="text-xs text-muted-foreground mb-1 block">Height</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
            className="w-full bg-background border border-border rounded-md px-3 py-1.5 text-xs text-foreground"
            min={100}
            max={800}
          />
        </div>
      </div>

      <div className="relative">
        <pre className="rounded-lg bg-background border border-border p-4 text-xs font-mono text-muted-foreground overflow-x-auto whitespace-pre-wrap break-all">
          {embedCode}
        </pre>
        <Button variant="heroOutline" size="sm" className="absolute top-2 right-2" onClick={copy}>
          <Copy className="h-3 w-3 mr-1" /> Copy
        </Button>
      </div>

      <div className="rounded-lg border border-border bg-background p-4">
        <p className="text-xs text-muted-foreground mb-2">Preview:</p>
        <iframe
          src={embedUrl}
          width={Math.min(width, 360)}
          height={Math.min(height, 200)}
          style={{ border: 0, borderRadius: 8, overflow: "hidden" }}
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default EmbedCodeGenerator;
