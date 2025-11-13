import React from 'react'
export default function Playlist({ playlist, onRemove, onMove, clearAll }){
  const per=10
  const [page,setPage]=React.useState(1)
  const total=playlist.length
  const totalPages=Math.max(1,Math.ceil(total/per))
  const start=(page-1)*per
  const items=playlist.slice(start,start+per)
  return (
    <div className="playlist-panel">
      <div className="pl-head"><h3>🎵 我的歌单</h3><div className="pl-actions"><button onClick={()=>{
        if(!playlist.length){ alert('歌单为空'); return }
        const ids=playlist.map(p=>p.trackId).join(',')
        const url=window.location.origin+window.location.pathname+'?list='+ids
        navigator.clipboard.writeText(url).then(()=>alert('分享链接已复制'))
      }}>🔗 分享</button><button onClick={clearAll}>清空</button></div></div>
      <div className="pl-count">共 {total} 首</div>
      <div className="pl-list">{items.map((p,i)=>(
        <div className="pl-item" key={p.trackId}>
          <div className="pl-left"><div className="idx">{start+i+1}.</div><img src={p.artworkUrl100} alt=""/><div className="info"><div className="t">{p.trackName}</div><div className="a">{p.artistName}</div></div></div>
          <div className="pl-btns"><button onClick={()=>onMove(start+i,-1)}>↑</button><button onClick={()=>onMove(start+i,1)}>↓</button><button onClick={()=>onRemove(p.trackId)}>🗑️</button></div>
        </div>
      ))}</div>
      <div className="pl-pager"><button disabled={page===1} onClick={()=>setPage(p=>Math.max(1,p-1))}>上一页</button><span> 第 {page} / {totalPages} 页 </span><button disabled={page===totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))}>下一页</button></div>
    </div>
  )
}
