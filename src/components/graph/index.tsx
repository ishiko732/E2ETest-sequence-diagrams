'use client';

import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { set } from 'mermaid/dist/diagrams/state/id-cache.js';
import { E2EDisplay } from '@/lib/convert';

const MermaidChart = ({ chart }: { chart: string }) => {
  mermaid.initialize({ startOnLoad: false }); // 设置为 false 防止自动渲染
  useEffect(() => {
    new Promise(async () => {
      const { svg } = await mermaid.render('mermaid', chart);
      document.getElementById('mermaid')!.innerHTML = svg;
    });
  }, [chart]); // 依赖项数组包含 chart，每当 chart 更新时重新渲染图表

  return (
    <div>
      <div id='mermaid'></div>
    </div>
  );
};

export function Graph() {
  mermaid.initialize({ startOnLoad: false }); // 设置为 false 防止自动渲染
  const [json, setJson] = useState('');
  const [content, setcontent] = useState(`sequenceDiagram
    Alice->>John: Hello John, how are you?
    John-->>Alice: Great!
    Alice-)John: See you later!`);
  const [svg, setSvg] = useState('');
  useEffect(() => {
    new Promise(async () => {
      await fetch('/charge-checkout.json')
        .then((res) => res.json())
        .then((data) => {
          setJson(JSON.stringify(data));
        });
    });
  }, []);

  useEffect(() => {
    if (json) {
      const content = new E2EDisplay(JSON.parse(json)).convert();
      new Promise(async () => {
        try {
          const { svg } = await mermaid.render(`mermaid`, content);
          setSvg(svg);
          console.log(svg);
        } catch (e) {
          console.log(e);
        }
      });
      setcontent(content);
    }
  }, [json]);
  return (
    <>
      <div className='flex justify-center items-center w-full'>
        <div className='grid w-full gap-1.5 md:w-1/2 m-1'>
          <Label htmlFor='message'>E2E test .json:</Label>
          <Textarea
            placeholder='json'
            id='message'
            value={json}
            onChange={(e) => setJson(e.target.value)}
            rows={10}
          />
        </div>
        <div className='grid w-full gap-1.5 md:w-1/2 m-1'>
          <Label htmlFor='message'>sequenceDiagram code:</Label>
          <Textarea
            placeholder='json'
            id='message'
            value={content}
            onChange={(e) => setcontent(e.target.value)}
            rows={10}
            disabled
          />
        </div>
      </div>
      <div className='grid w-full gap-1.5 m-1'>
        <div dangerouslySetInnerHTML={{ __html: svg }} />
      </div>
    </>
  );
}
