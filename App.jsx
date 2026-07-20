import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

// YOUR SUPABASE CONNECTION
const SUPABASE_URL = "https://enrxlqsfmydcxokpovd.supabase.co"
const SUPABASE_ANON_KEY = "sb_publishable_9uqYjLn9E4vQ_odvQjKyaw_X-o9W4py"
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export default function App() {
  const [videos, setVideos] = useState([])
  const [blogs, setBlogs] = useState([])
  const [messages, setMessages] = useState([])
  const [activeTab, setActiveTab] = useState('home')
  const [formData, setFormData] = useState({name: '', email: '', message: ''})

  useEffect(() => {
    fetchVideos()
    fetchBlogs()
  }, [])

  async function fetchVideos() {
    const { data } = await supabase.from('videos').select('*').order('created_at', {ascending: false})
    setVideos(data || [])
  }

  async function fetchBlogs() {
    const { data } = await supabase.from('blogs').select('*').order('created_at', {ascending: false})
    setBlogs(data || [])
  }

  async function handleContactSubmit(e) {
    e.preventDefault()
    const { error } = await supabase.from('messages').insert([formData])
    if (!error) {
      alert('Message sent! I will reply soon.')
      setFormData({name: '', email: '', message: ''})
    }
  }

  return (
    <div style={{fontFamily: 'system-ui'}}>
      {/* NAV */}
      <nav style={{padding: '1rem', background: '#000', color: '#fff', display: 'flex', justifyContent: 'space-between'}}>
        <h2 style={{margin: 0}}>Travel Vlog Pro</h2>
        <div style={{display: 'flex', gap: '1rem'}}>
          {['home','videos','blog','contact'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{background: 'none', border: 'none', color: '#fff', cursor: 'pointer'}}>
              {tab.toUpperCase()}
            </button>
          ))}
        </div>
      </nav>

      {/* HOME */}
      {activeTab === 'home' && (
        <section style={{padding: '4rem 1rem', textAlign: 'center', background: 'url(https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070) center/cover', color: '#fff'}}>
          <h1>Welcome to My Travel Vlog</h1>
          <p>Stories, videos, and guides from around the world</p>
        </section>
      )}

      {/* VIDEOS */}
      {activeTab === 'videos' && (
        <section style={{padding: '2rem 1rem'}}>
          <h2>My Videos</h2>
          <div style={{display: 'grid', gap: '1rem'}}>
            {videos.map(v => (
              <div key={v.id} style={{border: '1px solid #ddd', padding: '1rem', borderRadius: '8px'}}>
                <h3>{v.title}</h3>
                <p>{v.description}</p>
                <a href={v.youtube_url} target="_blank">Watch on YouTube</a>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* BLOG */}
      {activeTab === 'blog' && (
        <section style={{padding: '2rem 1rem'}}>
          <h2>Latest Blog Posts</h2>
          <div style={{display: 'grid', gap: '1rem'}}>
            {blogs.map(b => (
              <div key={b.id} style={{border: '1px solid #ddd', padding: '1rem', borderRadius: '8px'}}>
                <h3>{b.title}</h3>
                <p>{b.excerpt}</p>
                <p><small>{new Date(b.created_at).toLocaleDateString()}</small></p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CONTACT */}
      {activeTab === 'contact' && (
        <section style={{padding: '2rem 1rem'}}>
          <h2>Contact Me</h2>
          <form onSubmit={handleContactSubmit} style={{display: 'grid', gap: '1rem', maxWidth: '500px'}}>
            <input placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required style={{padding: '0.5rem'}}/>
            <input placeholder="Email" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required style={{padding: '0.5rem'}}/>
            <textarea placeholder="Message" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} required style={{padding: '0.5rem', minHeight: '120px'}}/>
            <button type="submit" style={{padding: '0.7rem', background: '#000', color: '#fff', border: 'none', cursor: 'pointer'}}>Send Message</button>
          </form>
        </section>
      )}
    </div>
  )
}
