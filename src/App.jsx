import React, {useEffect, useRef, useState} from 'react'
import axios from 'axios'
import SearchBar from './components/SearchBar'
import SongCard from './components/SongCard'
import Playlist from './components/Playlist'
import BottomNav from './components/BottomNav'

const famousChinese = ["周杰伦","林俊杰","陈奕迅","王菲","张学友","李荣浩","梁静茹","蔡依林","张国荣","陈慧娴","王力宏","五月天","邓紫棋","林宥嘉","刘若英","孙燕姿","张惠妹","赵传","那英","黄莺莺","陈奕希","林志炫","李宗盛","胡彦斌","萧敬腾","许志安","谭咏麟","周华健","李玖哲","莫文蔚","张韶涵","邓丽君","梁咏琪","许茹芸","张靓颖","吴青峰","苏打绿","张敬轩","古巨基","黄明志"]
const famousIntl = ["Taylor Swift","Ed Sheeran","Adele","Beyoncé","Coldplay","Drake","Rihanna","Bruno Mars","Katy Perry","Lady Gaga"]

export default function App(){
  const [query, setQuery] = useState('')
  const [mode, setMode] = useState('both')
  const [songs, setSongs] = useState([])
  const [playlist, setPlaylist] = useState([])
  const [notice, setNotice] = useState('')
  const [homeArtists, setHomeArtists] = useState([])
  const resultsRef = useRef(null)

  useEffect(()=>{
    const saved = localStorage.getItem('musiclist_v6_2_playlist')
    if(saved) setPlaylist(JSON.parse(saved))
    const ch = [...famousChinese].sort(()=>0.5-Math.random()).slice(0,40)
    const intl = [...famousIntl].sort(()=>0.5-Math.random()).slice(0,10)
    setHomeArtists([...ch,...intl].sort(()=>0.5-Math.random()))
  },[])

  useEffect(()=> localStorage.setItem('musiclist_v6_2_playlist', JSON.stringify(playlist)),[playlist])

  async function doSearch(q){
    const term = (q!==undefined? q: query).trim()
    if(!term) return
    setNotice('搜索中...')
    setSongs([])
    try{
      let all=[]
      const limit=50
      if(mode==='artist'){
        const ra = await axios.get('https://itunes.apple.com/search', {params:{term, entity:'musicArtist', limit:50}})
        const artists = ra.data.results||[]
        for(let a of artists.slice(0,8)){
          const r2 = await axios.get('https://itunes.apple.com/search', {params:{term:a.artistName, entity:'song', limit:5}})
          all = all.concat(r2.data.results||[])
        }
      } else {
        for(let i=0;i<4;i++){
          const offset = i*limit
          const res = await axios.get('https://itunes.apple.com/search', {params:{term, entity:'song', limit, offset}})
          if(res.data && res.data.results && res.data.results.length){
            all = all.concat(res.data.results)
            if(res.data.results.length < limit) break
          } else break
        }
        if(mode==='both'){
          try{
            const ra = await axios.get('https://itunes.apple.com/search', {params:{term, entity:'musicArtist', limit:6}})
            const artists = ra.data.results||[]
            for(let a of artists.slice(0,6)){
              const r2 = await axios.get('https://itunes.apple.com/search', {params:{term:a.artistName, entity:'song', limit:4}})
              all = all.concat(r2.data.results||[])
            }
          }catch(e){}
        }
      }
      if(all.length>200){ all=all.slice(0,200); setNotice('结果超过200首，仅显示前200首') }
      else if(all.length===0) setNotice('未找到相关歌曲或歌手')
      else setNotice('')
      setSongs(all)
      if(resultsRef.current) resultsRef.current.scrollTop = 0
    }catch(e){
      console.error(e); setNotice('搜索出错，请稍后重试')
    }
  }

  function addToPlaylist(song){
    if(playlist.find(p=>p.trackId===song.trackId)){ alert('已在歌单中'); return }
    setPlaylist(p=>[...p,song])
  }
  function removeFromPlaylist(id){ setPlaylist(p=>p.filter(x=>x.trackId!==id)) }
  function move(index,dir){ setPlaylist(p=>{const cp=[...p]; const to=index+dir; if(to<0||to>=cp.length) return cp; const [it]=cp.splice(index,1); cp.splice(to,0,it); return cp }) }
  function clearAll(){ if(confirm('确认清空歌单？')) setPlaylist([]) }

  return (
    <div className="app">
      <header className="topbar"><div className="logoCircle">🎵</div><div className="title">蓝白 · 你的专属歌单中心</div></header>
      <div style={{height:8}} />
      <div className="search-area"><SearchBar value={query} onChange={setQuery} onSearch={()=>doSearch()} onRefresh={()=>{setQuery(''); setSongs([]); setNotice('')}} mode={mode} setMode={setMode} /></div>
      <div className="layout">
        <main className="left">
          {songs.length===0 ? (
            <div className="home"><h3>首页推荐歌手（点击快速搜索）</h3><div className="artist-grid">{homeArtists.map((a,idx)=>(<button key={idx} onClick={()=>{ setQuery(a); doSearch(a) }}>{a}</button>))}</div></div>
          ) : (
            <>
              {notice && <div className="notice">{notice}</div>}
              <div ref={resultsRef} className="results"><div className="grid3">{songs.map(s=>(<SongCard key={s.trackId} song={s} onAdd={addToPlaylist} />))}</div></div>
            </>
          )}
        </main>
        <aside className="right"><Playlist playlist={playlist} onRemove={removeFromPlaylist} onMove={move} clearAll={clearAll} /></aside>
      </div>
      <BottomNav count={playlist.length} />
    </div>
  )
}
