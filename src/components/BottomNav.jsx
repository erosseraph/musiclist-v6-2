import React from 'react'
export default function BottomNav({ count }){
  return (
    <div className="bottom-nav">
      <div>🎵 {count} 首</div>
      <div><button onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}>⬆️ 回顶部</button></div>
    </div>
  )
}
