import React from 'react'
export default function SongCard({ song, onAdd }){
  return (
    <div className="song-card">
      <img src={song.artworkUrl100} alt={song.trackName} />
      <div className="meta">
        <div className="track">{song.trackName}</div>
        <div className="artist">{song.artistName}</div>
        <div className="actions">
          <button className="add" onClick={()=>onAdd(song)}>＋ 加入歌单</button>
          {song.previewUrl && <audio controls preload="none" src={song.previewUrl}></audio>}
        </div>
      </div>
    </div>
  )
}
