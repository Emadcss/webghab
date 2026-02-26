
import React, { useState } from 'react';
import { MessageSquare, Star, ThumbsUp, ThumbsDown, Send, CornerDownLeft, CheckCircle, ShieldCheck, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductComment, Product, UserRole } from '../types';
import { toPersianDigits, toPersianDigitsGlobal } from '../utils/helpers';

const ProductComments: React.FC<{ product: Product }> = ({ product }) => {
  // Destructured addCommentReply from useApp context
  const { user, comments, addComment, toggleCommentLike, addCommentReply, orders, addNotification } = useApp();
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [showReplyBox, setShowReplyBox] = useState<string | null>(null);

  const productComments = comments.filter(c => c.productId === product.id);
  const userHasBought = orders.some(o => o.userId === user?.id && o.items.some(i => i.productId === product.id));

  const handleSubmitComment = () => {
    if (!user) {
      addNotification('برای ثبت نظر ابتدا وارد شوید.', 'warning');
      return;
    }
    if (!text.trim()) return;

    const newComment: ProductComment = {
      id: `c-${Date.now()}`,
      productId: product.id,
      userId: user.id,
      userName: user.name,
      text: text.trim(),
      rating,
      likes: 0,
      dislikes: 0,
      isBuyer: userHasBought,
      replies: [],
      timestamp: new Date().toISOString(),
      likedBy: [],
      dislikedBy: []
    };

    addComment(newComment);
    setText('');
    setRating(5);
    addNotification('نظر شما با موفقیت ثبت شد.', 'success');
  };

  const handleSubmitReply = (commentId: string) => {
    if (!user) return;
    const t = replyText[commentId];
    if (!t?.trim()) return;

    // Correctly using addCommentReply from context
    addCommentReply(commentId, {
      id: `r-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      text: t.trim(),
      timestamp: new Date().toISOString(),
      isAdmin: user.role === UserRole.ADMIN
    });

    setReplyText({ ...replyText, [commentId]: '' });
    setShowReplyBox(null);
  };

  return (
    <div className="space-y-12">
      <div className="bg-white dark:bg-white/5 p-8 md:p-12 rounded-[48px] border border-muted/10 shadow-2xl">
        <h3 className="text-xl font-black mb-8 flex items-center gap-3">
          <MessageSquare className="text-brand" size={24} /> نظرات و امتیازات کاربران
        </h3>

        {user ? (
          <div className="space-y-6 mb-12 p-8 bg-slate-50 dark:bg-black/20 rounded-[40px] border border-brand/10">
            <div className="flex items-center justify-between">
               <span className="text-[10px] font-black text-muted uppercase tracking-widest">امتیاز شما به این کالا</span>
               <div className="flex gap-1">
                 {[1, 2, 3, 4, 5].map(s => (
                   <button key={s} onClick={() => setRating(s)}>
                     <Star size={20} className={s <= rating ? 'fill-brand text-brand' : 'text-muted/30'} />
                   </button>
                 ))}
               </div>
            </div>
            <textarea 
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="تجربه خرید خود را با دیگران به اشتراک بگذارید..."
              className="w-full bg-white dark:bg-black p-6 rounded-3xl outline-none font-bold text-xs resize-none h-32 border border-muted/10 focus:border-brand transition-all"
            />
            <button 
              onClick={handleSubmitComment}
              className="w-full bg-brand text-primary py-4 rounded-2xl font-black text-xs shadow-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <Send size={18} /> ثبت نظر تخصصی
            </button>
          </div>
        ) : (
          <div className="p-8 bg-slate-100 dark:bg-white/5 rounded-[40px] text-center mb-12">
             <p className="text-xs font-bold text-muted">برای ثبت نظر، ابتدا وارد حساب کاربری خود شوید.</p>
          </div>
        )}

        <div className="space-y-10">
          {productComments.length > 0 ? productComments.map(c => (
            <div key={c.id} className="group animate-slide-up">
              <div className="flex items-start justify-between mb-4">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-tr from-brand to-yellow-400 rounded-2xl flex items-center justify-center text-primary font-black shadow-lg">
                      {c.userName.charAt(0)}
                    </div>
                    <div>
                       <div className="flex items-center gap-3">
                         <h4 className="font-black text-sm">{c.userName}</h4>
                         {c.isBuyer && (
                           <span className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-[8px] font-black border border-green-500/20">
                             <ShieldCheck size={12}/> خریدار این محصول
                           </span>
                         )}
                       </div>
                       <p className="text-[9px] text-muted font-bold mt-1">{toPersianDigitsGlobal(new Date(c.timestamp).toLocaleDateString('fa-IR'))}</p>
                    </div>
                 </div>
                 <div className="flex gap-1">
                    {[1,2,3,4,5].map(s => <Star key={s} size={12} className={s <= c.rating ? 'fill-brand text-brand' : 'text-muted/20'} />)}
                 </div>
              </div>

              <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-[32px] rounded-tr-none border border-muted/5">
                <p className="text-xs font-bold leading-relaxed">{toPersianDigitsGlobal(c.text)}</p>
                
                <div className="mt-6 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <button 
                        onClick={() => user && toggleCommentLike(c.id, user.id, true)}
                        className={`flex items-center gap-2 text-[10px] font-black transition-all ${c.likedBy.includes(user?.id || '') ? 'text-brand scale-110' : 'text-muted hover:text-brand'}`}
                      >
                         <ThumbsUp size={16} /> {toPersianDigits(c.likes)}
                      </button>
                      <button 
                        onClick={() => user && toggleCommentLike(c.id, user.id, false)}
                        className={`flex items-center gap-2 text-[10px] font-black transition-all ${c.dislikedBy.includes(user?.id || '') ? 'text-red-500 scale-110' : 'text-muted hover:text-red-500'}`}
                      >
                         <ThumbsDown size={16} /> {toPersianDigits(c.dislikes)}
                      </button>
                   </div>
                   <button 
                     onClick={() => user && setShowReplyBox(showReplyBox === c.id ? null : c.id)}
                     className="text-[10px] font-black text-brand flex items-center gap-2 hover:translate-x-[-4px] transition-all"
                   >
                     پاسخ به این نظر <CornerDownLeft size={14} />
                   </button>
                </div>

                {showReplyBox === c.id && (
                  <div className="mt-6 pt-6 border-t border-muted/5 flex gap-3 animate-slide-in">
                    <input 
                      value={replyText[c.id] || ''}
                      onChange={e => setReplyText({ ...replyText, [c.id]: e.target.value })}
                      placeholder="پاسخ خود را بنویسید..."
                      className="flex-1 bg-white dark:bg-black p-3 rounded-xl text-[10px] font-bold outline-none border border-muted/10"
                    />
                    <button onClick={() => handleSubmitReply(c.id)} className="bg-brand text-primary p-3 rounded-xl shadow-lg"><Send size={18}/></button>
                  </div>
                )}
              </div>

              {/* Replies */}
              {c.replies.length > 0 && (
                <div className="mt-4 mr-12 space-y-4">
                   {c.replies.map(r => (
                     <div key={r.id} className="bg-brand/5 p-5 rounded-[24px] rounded-tr-none border border-brand/10">
                        <div className="flex items-center justify-between mb-2">
                           <span className={`text-[9px] font-black ${r.isAdmin ? 'text-brand' : 'text-primary dark:text-white'}`}>
                             {r.isAdmin ? 'پاسخ کارشناس وب‌قاب' : r.userName}
                           </span>
                           <span className="text-[8px] text-muted font-bold">{toPersianDigitsGlobal(new Date(r.timestamp).toLocaleTimeString('fa-IR'))}</span>
                        </div>
                        <p className="text-[10px] font-bold leading-relaxed">{toPersianDigitsGlobal(r.text)}</p>
                     </div>
                   ))}
                </div>
              )}
            </div>
          )) : (
            <div className="py-20 text-center opacity-30">
               <MessageSquare size={64} className="mx-auto mb-6" />
               <p className="font-black italic">هنوز نظری برای این کالا ثبت نشده است.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductComments;
