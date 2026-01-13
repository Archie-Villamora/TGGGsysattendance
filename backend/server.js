require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const app = express();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.use(cors());
app.use(express.json());

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error('Invalid file type'));
  }
});

const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return res.status(401).json({ error: 'Invalid token' });
  req.user = user;
  next();
};

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return res.status(401).json({ error: 'Invalid credentials' });
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', data.user.id)
    .single();
  
  res.json({ 
    token: data.session.access_token, 
    role: profile?.role || 'intern', 
    name: profile?.full_name || data.user.email 
  });
});

app.post('/api/signup', async (req, res) => {
  const { name, email, password } = req.body;
  
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return res.status(400).json({ error: error.message });
  
  if (data.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({ 
        id: data.user.id, 
        full_name: name, 
        role: 'intern' 
      });
    
    if (profileError) return res.status(500).json({ error: profileError.message });
  }
  
  res.json({ message: 'Account created successfully' });
});

app.post('/api/auth/google', async (req, res) => {
  const { token } = req.body;
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return res.status(401).json({ error: 'Invalid token' });
  
  let { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .single();
  
  if (!profile) {
    const { error: insertError } = await supabase
      .from('profiles')
      .insert({ 
        id: user.id, 
        full_name: user.user_metadata?.full_name || user.email, 
        role: 'intern' 
      });
    if (insertError) return res.status(500).json({ error: insertError.message });
    profile = { full_name: user.user_metadata?.full_name || user.email, role: 'intern' };
  }
  
  res.json({ 
    role: profile.role, 
    name: profile.full_name 
  });
});

app.post('/api/attendance/checkin', auth, upload.single('photo'), async (req, res) => {
  const { time_in } = req.body;
  const date = new Date().toISOString().split('T')[0];
  const timeInDate = new Date(`${date}T${time_in}`);
  const cutoffTime = new Date(`${date}T08:05:00`);
  const status = timeInDate > cutoffTime ? 'Late' : 'On-Time';
  
  let photoUrl = null;
  if (req.file) {
    const fileExt = req.file.originalname.split('.').pop();
    const fileName = `${req.user.id}/${uuidv4()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('checkinphoto')
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false
      });
    
    if (uploadError) return res.status(500).json({ error: uploadError.message });
    
    const { data: { publicUrl } } = supabase.storage
      .from('checkinphoto')
      .getPublicUrl(fileName);
    
    photoUrl = publicUrl;
  }

  const { data, error } = await supabase
    .from('attendance')
    .insert({ 
      user_id: req.user.id, 
      date, 
      time_in, 
      status, 
      photo_path: photoUrl
    })
    .select()
    .single();
  
  if (error) return res.status(500).json({ error: error.message });
  res.json({ id: data.id, status });
});

app.put('/api/attendance/checkout/:id', auth, async (req, res) => {
  try {
    const { time_out, work_documentation } = req.body;
    console.log('Checkout request:', { id: req.params.id, time_out, work_documentation, user_id: req.user.id });
    
    const { error } = await supabase
      .from('attendance')
      .update({ time_out, work_documentation })
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);
    
    if (error) {
      console.error('Checkout error:', error);
      return res.status(500).json({ error: error.message });
    }
    res.json({ success: true });
  } catch (err) {
    console.error('Checkout exception:', err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/attendance/overtime/:id', auth, async (req, res) => {
  const { ot_time_in, ot_time_out } = req.body;
  const { error } = await supabase
    .from('attendance')
    .update({ ot_time_in, ot_time_out })
    .eq('id', req.params.id)
    .eq('user_id', req.user.id);
  
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

app.get('/api/attendance/my', auth, async (req, res) => {
  const { data, error } = await supabase
    .from('attendance')
    .select('*')
    .eq('user_id', req.user.id)
    .order('date', { ascending: false })
    .order('time_in', { ascending: false });
  
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.get('/api/attendance/all', auth, async (req, res) => {
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', req.user.id)
    .single();
  
  if (profile?.role !== 'coordinator')
    return res.status(403).json({ error: 'Access denied' });
  
  const { data, error } = await supabase
    .from('attendance')
    .select(`
      *,
      profiles!attendance_user_id_fkey(full_name)
    `)
    .order('date', { ascending: false })
    .order('time_in', { ascending: false });
  
  if (error) return res.status(500).json({ error: error.message });
  
  const formatted = data.map(a => ({
    ...a,
    full_name: a.profiles?.full_name
  }));
  
  res.json(formatted);
});

app.get('/api/profile', auth, async (req, res) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', req.user.id)
    .single();
  
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ...data, email: req.user.email });
});

app.put('/api/profile', auth, async (req, res) => {
  const { full_name } = req.body;
  const { error } = await supabase
    .from('profiles')
    .update({ full_name })
    .eq('id', req.user.id);
  
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

app.post('/api/profile/picture', auth, upload.single('profile_pic'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    
    console.log('Profile pic upload:', { userId: req.user.id, fileName: req.file.originalname });
    
    const fileExt = req.file.originalname.split('.').pop();
    const fileName = `${req.user.id}/profile.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('profilepicture')
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: true
      });
    
    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return res.status(500).json({ error: uploadError.message });
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from('profilepicture')
      .getPublicUrl(fileName);
    
    const { error } = await supabase
      .from('profiles')
      .update({ profile_picture: publicUrl })
      .eq('id', req.user.id);
    
    if (error) {
      console.error('Database update error:', error);
      return res.status(500).json({ error: error.message });
    }
    
    console.log('Profile picture uploaded successfully:', publicUrl);
    res.json({ success: true, url: publicUrl });
  } catch (err) {
    console.error('Profile picture upload exception:', err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
