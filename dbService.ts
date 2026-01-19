
const SUPABASE_URL = 'https://mycbjreiocjdggpwiwhq.supabase.co';
const SUPABASE_KEY = 'sb_publishable_bmvPaiUa3JU4ATdUmeHoAQ_MZofmTSD';

export const dbService = {
  async request(table: string, method: string = 'GET', body?: any, query: string = '') {
    const url = `${SUPABASE_URL}/rest/v1/${table}${query}`;
    
    const headers: Record<string, string> = {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    };

    // 如果是 POST 且包含 ID，通常意味着我们需要执行 upsert 操作
    if (method === 'POST' && body && body.id) {
      headers['Prefer'] = 'return=representation,resolution=merge-duplicates';
    }

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
          const errText = await response.text();
          console.error(`Supabase Error [${response.status}]:`, errText);
          throw new Error(`云端服务异常: ${response.status}`);
      }
      
      if (method === 'DELETE') return true;
      return await response.json();
    } catch (error) {
      console.error("Network Request Failed:", error);
      throw error;
    }
  },

  async login(un: string, pw: string) {
    const data = await this.request('users', 'GET', null, `?username=eq.${un}&password=eq.${pw}&select=*`);
    return data && data.length > 0 ? data[0] : null;
  },

  async fetchAllData() {
    try {
      const [reports, announcements, projects, users, attendance] = await Promise.all([
        this.request('reports', 'GET', null, '?order=date.desc'),
        this.request('announcements', 'GET', null, '?order=publishDate.desc'),
        this.request('projects', 'GET'),
        this.request('users', 'GET'),
        this.request('attendance', 'GET', null, '?order=time.desc&limit=200')
      ]);
      return { reports, announcements, projects, users, attendance };
    } catch (e) {
      console.error("Fetch All Data Error:", e);
      return { reports: [], announcements: [], projects: [], users: [], attendance: [] };
    }
  },

  async saveReport(r: any) { 
    return this.request('reports', 'POST', r); 
  },
  
  async saveAttendance(a: any) { 
    return this.request('attendance', 'POST', a); 
  },
  
  async saveUser(u: any) { 
    return this.request('users', 'POST', u); 
  },
  
  async saveProject(p: any) { 
    return this.request('projects', 'POST', p); 
  },
  
  async saveAnnouncement(n: any) { 
    return this.request('announcements', 'POST', n); 
  },

  async deleteProject(id: string) { 
    return this.request('projects', 'DELETE', null, `?id=eq.${id}`); 
  },
  
  async deleteUser(id: string) { 
    return this.request('users', 'DELETE', null, `?id=eq.${id}`); 
  }
};
