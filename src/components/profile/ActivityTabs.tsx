import React,{useState,useEffect} from 'react';
import { supabase } from '@/integrations/supabase/client';
import { GlassCard } from '@/components/ui/glass-card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthContext } from '@/contexts/AuthContext';
import { EmptyState } from '@/components/EmptyState';

export const ActivityTabs:React.FC = ()=>{
  const { user } = useAuthContext();
  const [tab,setTab]=useState<'created'|'contributions'>('created');
  const [loading,setLoading]=useState(true);
  const [items,setItems]=useState<any[]>([]);

  useEffect(()=>{
    const fetch=async()=>{
      if(!user?.id) return;
      setLoading(true);
      if(tab==='created'){
        const {data}=await supabase.from('baskets').select('id,title,created_at').eq('creator_id',user.id);
        setItems(data||[]);
      }else{
        const {data}=await supabase
          .from('contributions')
          .select('id,amount_usd,created_at,baskets(title)')
          .eq('user_id',user.id);
        setItems(data||[]);
      }
      setLoading(false);
    };
    fetch();
  },[tab,user?.id]);

  return(
    <GlassCard className="p-4 space-y-4">
      <div className="flex gap-2 mb-2">
        {(['created','contributions'] as const).map(t=>(
          <button key={t} onClick={()=>setTab(t)} className={`px-3 py-1 rounded ${tab===t?'bg-purple-600 text-white':'bg-gray-700'}`}>{t==='created'?'Baskets Created':'Contributions'}</button>
        ))}
      </div>
      {loading?(<Skeleton className="h-14 w-full"/>):items.length===0?(<EmptyState title="No activity" description="Nothing here yet"/>):(
        <ul className="space-y-2">
          {items.map(it=>(
            <li key={it.id} className="text-sm text-gray-300 flex justify-between">
              <span>{tab==='created'?it.title:it.baskets?.title}</span>
              <span>{tab==='created'?new Date(it.created_at).toLocaleDateString():`$${it.amount_usd}`}</span>
            </li>
          ))}
        </ul>
      )}
    </GlassCard>
  );
}; 