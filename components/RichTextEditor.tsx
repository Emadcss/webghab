
import React, { useRef } from 'react';
import { 
  Bold, Italic, Type, Image as ImageIcon, Link as LinkIcon, 
  List, Heading2, Heading3, AlignRight, AlignCenter, Code
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  label?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder, label }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertTag = (startTag: string, endTag: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const beforeText = value.substring(0, start);
    const afterText = value.substring(end);

    const newText = beforeText + startTag + selectedText + endTag + afterText;
    onChange(newText);

    // Reset focus and selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + startTag.length, start + startTag.length + selectedText.length);
    }, 0);
  };

  const handleInsertImage = () => {
    const url = prompt('لطفاً آدرس تصویر را وارد کنید:');
    if (url) {
      insertTag(`<img src="${url}" alt="image" class="w-full rounded-[32px] my-8 shadow-xl border border-muted/10" />\n`, '');
    }
  };

  const handleInsertLink = () => {
    const url = prompt('آدرس لینک (URL):', 'https://');
    if (url) {
      insertTag(`<a href="${url}" class="text-brand underline" target="_blank">`, '</a>');
    }
  };

  const toolbarBtnClass = "p-2.5 hover:bg-brand hover:text-primary rounded-xl transition-all text-muted-foreground";

  return (
    <div className="space-y-3">
      {label && <label className="text-[10px] font-black text-muted uppercase tracking-widest block pr-2">{label}</label>}
      
      <div className="bg-white dark:bg-[#0a0a20] rounded-[32px] border border-muted/10 shadow-lg overflow-hidden flex flex-col focus-within:border-brand transition-colors">
        {/* Toolbar */}
        <div className="p-2 bg-slate-50 dark:bg-black/40 border-b border-muted/10 flex flex-wrap gap-1">
          <button type="button" onClick={() => insertTag('<strong>', '</strong>')} className={toolbarBtnClass} title="Bold"><Bold size={16}/></button>
          <button type="button" onClick={() => insertTag('<em>', '</em>')} className={toolbarBtnClass} title="Italic"><Italic size={16}/></button>
          <div className="w-px h-6 bg-muted/20 mx-1 self-center" />
          <button type="button" onClick={() => insertTag('<h2 class="text-2xl font-black mt-10 mb-4 text-brand">', '</h2>')} className={toolbarBtnClass} title="Heading 2"><Heading2 size={16}/></button>
          <button type="button" onClick={() => insertTag('<h3 class="text-xl font-black mt-8 mb-3 text-primary dark:text-white">', '</h3>')} className={toolbarBtnClass} title="Heading 3"><Heading3 size={16}/></button>
          <div className="w-px h-6 bg-muted/20 mx-1 self-center" />
          <button type="button" onClick={handleInsertImage} className={toolbarBtnClass} title="Insert Image"><ImageIcon size={16}/></button>
          <button type="button" onClick={handleInsertLink} className={toolbarBtnClass} title="Insert Link"><LinkIcon size={16}/></button>
          <button type="button" onClick={() => insertTag('<ul class="list-disc pr-6 my-4 space-y-2">\n<li>', '</li>\n</ul>')} className={toolbarBtnClass} title="Bullet List"><List size={16}/></button>
          <div className="w-px h-6 bg-muted/20 mx-1 self-center" />
          <button type="button" onClick={() => insertTag('<div class="text-center">', '</div>')} className={toolbarBtnClass} title="Center Align"><AlignCenter size={16}/></button>
          <button type="button" onClick={() => insertTag('<pre class="bg-black/5 dark:bg-black/40 p-4 rounded-xl font-mono text-xs my-4 overflow-x-auto">', '</pre>')} className={toolbarBtnClass} title="Code Block"><Code size={16}/></button>
        </div>

        {/* Editor Area */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-80 md:h-[450px] p-6 bg-transparent outline-none font-medium text-sm leading-loose resize-none no-scrollbar"
          dir="rtl"
        />
        
        {/* Status Bar */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-black/20 border-t border-muted/10 flex justify-between items-center">
           <span className="text-[8px] font-black text-muted uppercase tracking-widest">HTML Support Enabled</span>
           <span className="text-[8px] font-black text-muted uppercase">{value.length} Characters</span>
        </div>
      </div>
      <p className="text-[9px] text-muted-foreground italic pr-4">می‌توانید از تگ‌های HTML برای شخصی‌سازی بیشتر استفاده کنید.</p>
    </div>
  );
};

export default RichTextEditor;
