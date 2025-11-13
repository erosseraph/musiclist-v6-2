import React from 'react'
export default function SearchBar({ value, onChange, onSearch, onRefresh, mode, setMode }){
  return (
    <div className="searchbar-fixed">
      <div className="left">
        <select className="mode-select" value={mode} onChange={e=>setMode(e.target.value)}>
          <option value="both">歌手+歌曲</option>
          <option value="artist">仅歌手</option>
          <option value="song">仅歌曲</option>
        </select>
        <input className="search-input" value={value} onChange={e=>onChange(e.target.value)} placeholder="搜索歌手或歌曲..." onKeyDown={e=>{ if(e.key==='Enter') onSearch() }} />
      </div>
      <div className="right">
        <button className="btn-search" onClick={()=>onSearch()}>搜索</button>
        <button className="btn-refresh" onClick={onRefresh}>🔄</button>
      </div>
    </div>
  )
}
