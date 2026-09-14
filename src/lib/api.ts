import { supabase, isSupabaseConfigured } from './supabase';
import { 
  UserProfile, 
  Service, 
  Project, 
  ProjectStatus, 
  ProjectStatusHistoryItem, 
  Employee, 
  Quotation, 
  Payment, 
  Message, 
  ProjectFile, 
  ContactEnquiry, 
  AppNotification,
  SiteSettings 
} from '../types';
import { store } from './store';
import { INITIAL_SERVICES, INITIAL_SITE_SETTINGS } from './initialData';

// --- AUTHENTICATION API ---

export const api = {
  // Check if live backend is connected
  isLive(): boolean {
    return isSupabaseConfigured && supabase !== null;
  },

  // 1. Sign Up Customer / Staff
  async signUp(data: {
    email: string;
    password: string;
    fullName: string;
    phone: string;
    role?: 'customer' | 'employee' | 'admin';
  }): Promise<{ user: UserProfile | null; error?: string }> {
    if (this.isLive()) {
      try {
        const { data: authData, error: authError } = await supabase!.auth.signUp({
          email: data.email.trim().toLowerCase(),
          password: data.password,
          options: {
            data: {
              full_name: data.fullName.trim(),
              phone: data.phone.trim(),
              role: data.role || 'customer'
            }
          }
        });

        if (authError) throw authError;
        if (!authData.user) throw new Error('User creation failed');

        // Upsert profile
        const profile: UserProfile = {
          id: authData.user.id,
          email: data.email.trim().toLowerCase(),
          full_name: data.fullName.trim(),
          phone: data.phone.trim(),
          role: data.role || 'customer',
          created_at: new Date().toISOString()
        };

        await supabase!.from('profiles').upsert([profile]);
        store.loginUser(profile.email, profile.role, profile.full_name);
        return { user: profile };
      } catch (err: any) {
        return { user: null, error: err.message || 'Registration failed' };
      }
    }

    // Local fallback
    const user = store.registerUser({
      email: data.email,
      full_name: data.fullName,
      phone: data.phone
    });
    return { user };
  },

  // 2. Sign In
  async signIn(email: string, password?: string): Promise<{ user: UserProfile | null; error?: string }> {
    if (this.isLive()) {
      try {
        const { data: authData, error: authError } = await supabase!.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password: password || 'default-password'
        });

        if (authError) throw authError;
        if (!authData.user) throw new Error('Login failed');

        // Fetch profile
        const { data: profileData } = await supabase!
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        const user: UserProfile = profileData || {
          id: authData.user.id,
          email: authData.user.email!,
          full_name: authData.user.user_metadata?.full_name || authData.user.email!.split('@')[0],
          role: authData.user.user_metadata?.role || 'customer',
          phone: authData.user.user_metadata?.phone || ''
        };

        store.loginUser(user.email, user.role, user.full_name);
        return { user };
      } catch (err: any) {
        return { user: null, error: err.message || 'Invalid credentials' };
      }
    }

    // Local fallback
    const user = store.login(email, password);
    return user ? { user } : { user: null, error: 'User not found' };
  },

  // 3. Sign Out
  async signOut(): Promise<void> {
    if (this.isLive()) {
      try {
        await supabase!.auth.signOut();
      } catch (e) {
        console.warn('Supabase signout error:', e);
      }
    }
    store.logout();
  },

  // 4. Get Current User Profile
  async getCurrentProfile(): Promise<UserProfile | null> {
    if (this.isLive()) {
      try {
        const { data: { user } } = await supabase!.auth.getUser();
        if (!user) return store.getCurrentUser();

        const { data: profile } = await supabase!
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        return profile || store.getCurrentUser();
      } catch (e) {
        return store.getCurrentUser();
      }
    }
    return store.getCurrentUser();
  },

  // --- SERVICES API ---

  async getServices(): Promise<Service[]> {
    if (this.isLive()) {
      try {
        const { data, error } = await supabase!
          .from('services')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: true });

        if (error) throw error;
        if (data && data.length > 0) {
          return data.map(s => ({
            id: s.id,
            slug: s.slug,
            title: s.name || s.title,
            short_desc: s.short_description || s.short_desc,
            full_desc: s.description || s.full_desc,
            icon: s.icon || 'Code2',
            image_url: s.image_url,
            starting_price: s.price || s.starting_price,
            currency: 'INR',
            estimated_timeline: s.estimated_timeline || '2 - 4 Weeks',
            features: s.features || [],
            deliverables: s.deliverables || [],
            process: s.process || [],
            is_active: s.is_active
          }));
        }
      } catch (e) {
        console.warn('Falling back to cache services:', e);
      }
    }
    return store.getServices();
  },

  async updateServiceShowcase(id: string, updates: { image_url?: string; price?: number; timeline?: string }): Promise<boolean> {
    if (this.isLive()) {
      try {
        const payload: any = {};
        if (updates.image_url !== undefined) payload.image_url = updates.image_url;
        if (updates.price !== undefined) payload.price = updates.price;
        if (updates.timeline !== undefined) payload.estimated_timeline = updates.timeline;
        payload.updated_at = new Date().toISOString();

        const { error } = await supabase!.from('services').update(payload).eq('id', id);
        if (error) throw error;
      } catch (e) {
        console.warn('Supabase updateService error:', e);
      }
    }
    if (updates.image_url) store.updateServiceImage(id, updates.image_url);
    return true;
  },

  async uploadServiceImage(file: File, slug: string): Promise<string | null> {
    if (this.isLive()) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${slug}-${Date.now()}.${fileExt}`;
        const filePath = `services/${fileName}`;

        const { error: uploadError } = await supabase!.storage
          .from('service-images')
          .upload(filePath, file, { upsert: true });

        if (uploadError) throw uploadError;

        const { data } = supabase!.storage.from('service-images').getPublicUrl(filePath);
        return data.publicUrl;
      } catch (e) {
        console.error('Failed to upload image to Supabase Storage:', e);
      }
    }
    return null;
  },

  // --- SERVICE REQUESTS & BOOKINGS ---

  async createServiceRequest(requestData: {
    client_name: string;
    client_email: string;
    client_phone: string;
    service_slug: string;
    service_title: string;
    project_title: string;
    description: string;
    required_features: string[];
    budget_range: string;
    preferred_deadline: string;
    reference_website?: string;
    customer_id?: string;
  }): Promise<{ request: Project | null; requestCode: string; error?: string }> {
    // Generate unique code format: NSK-2026-00001
    const year = new Date().getFullYear();
    const count = store.getProjects().length + 1;
    const generatedCode = `NSK-${year}-${String(count).padStart(5, '0')}`;

    if (this.isLive()) {
      try {
        const { data: { user } } = await supabase!.auth.getUser();
        const customerId = user?.id || requestData.customer_id;

        const { data, error } = await supabase!.from('service_requests').insert([{
          request_number: generatedCode,
          customer_id: customerId,
          service_slug: requestData.service_slug,
          service_title: requestData.service_title,
          project_title: requestData.project_title,
          description: requestData.description,
          requirements: requestData.required_features,
          budget: requestData.budget_range,
          preferred_deadline: requestData.preferred_deadline,
          reference_website: requestData.reference_website,
          status: 'pending'
        }]).select().single();

        if (error) throw error;

        // Also create a linked project row for active workflow
        const project = store.createProjectRequest({
          ...requestData,
          customer_id: customerId
        });

        return { request: project, requestCode: generatedCode };
      } catch (err: any) {
        console.warn('Supabase request creation warning:', err);
      }
    }

    const localProject = store.createProjectRequest(requestData);
    return { request: localProject, requestCode: localProject.request_code };
  },

  // --- PROJECTS & WORKFLOW ---

  async getProjects(userId?: string, role?: string): Promise<Project[]> {
    if (this.isLive()) {
      try {
        let query = supabase!.from('projects').select('*').order('created_at', { ascending: false });

        if (role === 'customer' && userId) {
          query = query.eq('customer_id', userId);
        } else if (role === 'employee' && userId) {
          query = query.eq('assigned_employee_id', userId);
        }

        const { data, error } = await query;
        if (error) throw error;
        if (data && data.length > 0) {
          return data.map(p => ({
            id: p.id,
            request_code: p.project_number || p.request_code || `PRJ-${p.id.slice(0, 5)}`,
            customer_id: p.customer_id,
            client_name: p.client_name || 'Client',
            client_email: p.client_email || '',
            client_phone: p.client_phone || '',
            service_slug: p.service_slug || 'website-development',
            service_title: p.service_title || 'Web Development',
            project_title: p.title || p.project_title,
            description: p.description,
            required_features: p.required_features || [],
            budget_range: p.budget_range || p.budget || '₹25,000 - ₹50,000',
            preferred_deadline: p.preferred_deadline || p.deadline || '2 - 4 Weeks',
            status: (p.status as ProjectStatus) || 'In Progress',
            progress_percentage: p.progress_percentage || 10,
            assigned_employee_id: p.assigned_employee_id,
            assigned_to: p.assigned_to,
            internal_notes: p.internal_notes,
            created_at: p.created_at,
            updated_at: p.updated_at
          }));
        }
      } catch (e) {
        console.warn('Projects fetch fallback:', e);
      }
    }
    const current = store.getCurrentUser();
    return store.getUserProjects(current);
  },

  async updateProjectStatus(projectId: string, newStatus: ProjectStatus, notes?: string, changedByName: string = 'Staff'): Promise<boolean> {
    if (this.isLive()) {
      try {
        await supabase!.from('projects').update({
          status: newStatus,
          updated_at: new Date().toISOString()
        }).eq('id', projectId);

        await supabase!.from('project_status_history').insert([{
          project_id: projectId,
          old_status: 'Previous',
          new_status: newStatus,
          notes: notes || `Status updated to ${newStatus}`,
          created_at: new Date().toISOString()
        }]);
      } catch (e) {
        console.warn('Supabase update status warning:', e);
      }
    }
    return store.updateProjectStatus(projectId, newStatus, notes, changedByName);
  },

  async assignProjectToEmployee(projectId: string, employeeId: string): Promise<boolean> {
    if (this.isLive()) {
      try {
        await supabase!.from('projects').update({
          assigned_employee_id: employeeId,
          updated_at: new Date().toISOString()
        }).eq('id', projectId);

        await supabase!.from('project_assignments').insert([{
          project_id: projectId,
          employee_id: employeeId,
          assigned_at: new Date().toISOString(),
          status: 'active'
        }]);
      } catch (e) {
        console.warn('Supabase assignment error:', e);
      }
    }
    return store.assignProjectToEmployee(projectId, employeeId);
  },

  // --- EMPLOYEES API ---

  async getEmployees(): Promise<Employee[]> {
    if (this.isLive()) {
      try {
        const { data, error } = await supabase!.from('employees').select('*, profiles(*)');
        if (error) throw error;
        if (data && data.length > 0) {
          return data.map(e => ({
            id: e.id,
            employee_id: e.employee_id,
            full_name: e.profiles?.full_name || e.full_name || 'Staff Member',
            email: e.profiles?.email || e.email || '',
            phone: e.profiles?.phone || e.phone || '',
            role: (e.position?.toLowerCase().includes('design') ? 'designer' : 'developer') as any,
            designation: e.position || e.department || 'Engineer',
            status: e.is_active ? 'active' : 'inactive',
            assigned_projects_count: 0,
            created_at: e.created_at
          }));
        }
      } catch (e) {
        console.warn('Employees fetch fallback:', e);
      }
    }
    return store.getEmployees();
  },

  async createEmployee(data: {
    full_name: string;
    email: string;
    phone?: string;
    role: 'developer' | 'designer' | 'manager' | 'employee' | 'admin';
    designation?: string;
    password?: string;
    status?: 'active' | 'inactive';
  }): Promise<Employee> {
    if (this.isLive()) {
      try {
        // Register in auth
        const { data: authData, error: authErr } = await supabase!.auth.signUp({
          email: data.email.trim().toLowerCase(),
          password: data.password || 'nsk@1234',
          options: {
            data: {
              full_name: data.full_name.trim(),
              phone: data.phone?.trim(),
              role: 'employee'
            }
          }
        });

        if (!authErr && authData.user) {
          const empId = `EMP-${String(Date.now()).slice(-3)}`;
          await supabase!.from('employees').insert([{
            profile_id: authData.user.id,
            employee_id: empId,
            department: data.role,
            position: data.designation || 'Software Engineer',
            is_active: data.status !== 'inactive'
          }]);
        }
      } catch (e) {
        console.warn('Supabase employee creation warning:', e);
      }
    }
    return store.createEmployee(data);
  },

  // --- MESSAGES & REALTIME ---

  async getMessages(projectId: string): Promise<Message[]> {
    if (this.isLive()) {
      try {
        const { data, error } = await supabase!
          .from('messages')
          .select('*')
          .eq('project_id', projectId)
          .order('created_at', { ascending: true });

        if (error) throw error;
        if (data && data.length > 0) return data as Message[];
      } catch (e) {
        console.warn('Messages fallback:', e);
      }
    }
    return store.getMessages(projectId);
  },

  async sendMessage(projectId: string, text: string, senderRole: 'customer' | 'employee' | 'admin', senderName: string, senderId?: string): Promise<Message> {
    if (this.isLive()) {
      try {
        const { data, error } = await supabase!.from('messages').insert([{
          project_id: projectId,
          sender_id: senderId || (await supabase!.auth.getUser()).data.user?.id,
          sender_name: senderName,
          sender_role: senderRole,
          message: text.trim(),
          is_read: false,
          created_at: new Date().toISOString()
        }]).select().single();

        if (!error && data) return data as Message;
      } catch (e) {
        console.warn('Supabase sendMessage warning:', e);
      }
    }
    return store.sendMessage(projectId, text, senderRole, senderName, senderId);
  },

  subscribeToMessages(projectId: string, onNewMessage: (msg: Message) => void): () => void {
    if (this.isLive()) {
      const channel = supabase!
        .channel(`project-messages-${projectId}`)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'messages', filter: `project_id=eq.${projectId}` },
          (payload) => {
            onNewMessage(payload.new as Message);
          }
        )
        .subscribe();

      return () => {
        supabase!.removeChannel(channel);
      };
    }
    return () => {};
  },

  // --- PROJECT FILES & STORAGE ---

  async getProjectFiles(projectId: string): Promise<ProjectFile[]> {
    if (this.isLive()) {
      try {
        const { data, error } = await supabase!
          .from('files')
          .select('*')
          .eq('project_id', projectId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data && data.length > 0) return data as ProjectFile[];
      } catch (e) {
        console.warn('Files fallback:', e);
      }
    }
    return store.getProjectFiles(projectId);
  },

  async uploadProjectFile(
    projectId: string, 
    file: File, 
    category: 'client_upload' | 'deliverable' = 'deliverable',
    uploaderId?: string,
    uploaderName?: string
  ): Promise<ProjectFile | null> {
    const user = store.getCurrentUser();
    const effectiveUploaderId = uploaderId || user?.id;
    const effectiveUploaderName = uploaderName || user?.full_name || 'Staff';

    if (this.isLive()) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
        const filePath = `projects/${projectId}/${fileName}`;

        const { error: uploadError } = await supabase!.storage
          .from('project-files')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: fileRow, error: dbError } = await supabase!.from('files').insert([{
          project_id: projectId,
          uploaded_by: effectiveUploaderId,
          file_name: file.name,
          storage_path: filePath,
          file_type: fileExt || 'bin',
          file_size: file.size,
          category,
          created_at: new Date().toISOString()
        }]).select().single();

        if (dbError) throw dbError;
        return fileRow as ProjectFile;
      } catch (e) {
        console.error('Supabase file upload error:', e);
      }
    }

    return store.addProjectFile(projectId, {
      file_name: file.name,
      file_url: URL.createObjectURL(file),
      file_size: file.size,
      file_type: file.type || 'file',
      category,
      uploader_name: effectiveUploaderName,
      uploader_id: effectiveUploaderId
    });
  },

  // --- STATUS HISTORY ---

  async getStatusHistory(projectId: string): Promise<ProjectStatusHistoryItem[]> {
    if (this.isLive()) {
      try {
        const { data, error } = await supabase!
          .from('project_status_history')
          .select('*')
          .eq('project_id', projectId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data && data.length > 0) return data as ProjectStatusHistoryItem[];
      } catch (e) {
        console.warn('History fallback:', e);
      }
    }
    return store.getStatusHistory(projectId);
  },

  // --- QUOTATIONS ---

  async getQuotationForProject(projectId: string): Promise<Quotation | undefined> {
    if (this.isLive()) {
      try {
        const { data, error } = await supabase!
          .from('quotations')
          .select('*')
          .eq('project_id', projectId)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!error && data) return data as Quotation;
      } catch (e) {
        console.warn('Quotation fetch fallback:', e);
      }
    }
    return store.getQuotationForProject(projectId);
  },

  async createQuotation(projectId: string, data: {
    line_items: { name: string; desc?: string; amount: number }[];
    discount?: number;
    taxRate?: number;
    payment_terms?: string;
    valid_until?: string;
  }): Promise<Quotation> {
    if (this.isLive()) {
      try {
        const subtotal = data.line_items.reduce((s, i) => s + (Number(i.amount) || 0), 0);
        const discount = data.discount || 0;
        const tax = Math.round((subtotal - discount) * ((data.taxRate || 18) / 100));
        const total = subtotal - discount + tax;

        const { data: qRow, error } = await supabase!.from('quotations').insert([{
          project_id: projectId,
          subtotal,
          discount,
          tax_amount: tax,
          total_amount: total,
          status: 'sent',
          line_items: data.line_items,
          terms: data.payment_terms,
          valid_until: data.valid_until,
          created_at: new Date().toISOString()
        }]).select().single();

        if (!error && qRow) return qRow as Quotation;
      } catch (e) {
        console.warn('Supabase createQuotation warning:', e);
      }
    }
    return store.createQuotation(projectId, {
      line_items: data.line_items,
      discount: data.discount || 0,
      taxRate: data.taxRate || 18,
      payment_terms: data.payment_terms || 'Standard Terms',
      valid_until: data.valid_until || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
    });
  },

  async respondToQuotation(quotationId: string, action: 'accept' | 'reject', notes?: string): Promise<boolean> {
    if (this.isLive()) {
      try {
        const status = action === 'accept' ? 'accepted' : 'rejected';
        const { error } = await supabase!.from('quotations').update({
          status,
          client_notes: notes,
          responded_at: new Date().toISOString()
        }).eq('id', quotationId);

        if (error) throw error;
      } catch (e) {
        console.warn('Supabase respondToQuotation warning:', e);
      }
    }
    return store.respondToQuotation(quotationId, action, notes);
  },

  // --- CONTACT ENQUIRIES ---

  async submitContactEnquiry(data: {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
  }): Promise<boolean> {
    if (this.isLive()) {
      try {
        const { error } = await supabase!.from('contact_enquiries').insert([{
          name: data.name.trim(),
          email: data.email.trim().toLowerCase(),
          phone: data.phone.trim(),
          subject: data.subject.trim(),
          message: data.message.trim(),
          status: 'New',
          created_at: new Date().toISOString()
        }]);

        if (error) throw error;
      } catch (e) {
        console.warn('Supabase contact enquiry warning:', e);
      }
    }
    store.submitContactEnquiry(data);
    return true;
  },

  async getContactEnquiries(): Promise<ContactEnquiry[]> {
    if (this.isLive()) {
      try {
        const { data, error } = await supabase!
          .from('contact_enquiries')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data && data.length > 0) return data as ContactEnquiry[];
      } catch (e) {
        console.warn('Enquiries fallback:', e);
      }
    }
    return store.getContactEnquiries();
  },

  // --- NOTIFICATIONS ---

  async getNotifications(userId?: string): Promise<AppNotification[]> {
    if (this.isLive() && userId) {
      try {
        const { data, error } = await supabase!
          .from('notifications')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data && data.length > 0) return data as AppNotification[];
      } catch (e) {
        console.warn('Notifications fallback:', e);
      }
    }
    return userId ? store.getNotifications(userId) : [];
  },

  async markNotificationRead(id: string): Promise<void> {
    if (this.isLive()) {
      try {
        await supabase!.from('notifications').update({ is_read: true }).eq('id', id);
      } catch (e) {
        console.warn('Mark notif read error:', e);
      }
    }
    store.markNotificationRead(id);
  },

  // --- LIVE KPI METRICS ---

  async getAdminKPIs(): Promise<{
    totalCustomers: number;
    newRequests: number;
    activeProjects: number;
    completedProjects: number;
    totalRevenue: number;
    pendingPayments: number;
  }> {
    const projects = await this.getProjects();
    const payments = store.getPayments();

    const activeCount = projects.filter(p => p.status === 'In Progress' || p.status === 'Design Stage' || p.status === 'Development Stage').length;
    const completedCount = projects.filter(p => p.status === 'Completed').length;
    const newRequestsCount = projects.filter(p => p.status === 'Request Received' || p.status === 'Under Review').length;

    const totalRev = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    const pendingPay = payments.filter(p => p.status === 'pending' || p.status === 'unpaid').reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    const uniqueClients = new Set(projects.map(p => p.client_email.toLowerCase())).size;

    return {
      totalCustomers: uniqueClients,
      newRequests: newRequestsCount,
      activeProjects: activeCount,
      completedProjects: completedCount,
      totalRevenue: totalRev,
      pendingPayments: pendingPay
    };
  }
};
