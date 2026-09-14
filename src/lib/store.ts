import { 
  UserProfile, 
  Employee,
  Service, 
  Project, 
  ProjectStatus, 
  ProjectStatusHistoryItem, 
  Quotation, 
  Payment, 
  Message, 
  ProjectFile, 
  ContactEnquiry, 
  AppNotification, 
  SiteSettings 
} from '../types';
import { INITIAL_SERVICES, INITIAL_SITE_SETTINGS } from './initialData';

const STORAGE_KEYS = {
  USER: 'nsk_auth_user',
  PROJECTS: 'nsk_db_projects',
  HISTORY: 'nsk_db_project_history',
  QUOTATIONS: 'nsk_db_quotations',
  PAYMENTS: 'nsk_db_payments',
  MESSAGES: 'nsk_db_messages',
  FILES: 'nsk_db_files',
  EMPLOYEES: 'nsk_db_employees',
  CONTACT: 'nsk_db_contact',
  NOTIFICATIONS: 'nsk_db_notifications',
  SERVICES: 'nsk_db_services',
  SETTINGS: 'nsk_db_settings',
  ADMIN_GATEWAY: 'nsk_admin_gateway_unlocked',
  VERSION: 'nsk_db_version_v3_clean'
};

// Valid Admin Access Keys for Private Gateway
export const VALID_ADMIN_ACCESS_KEYS = [
  'NSK-ADMIN-2026',
  'NSK@ADMIN#2026',
  'nsk-admin-key'
];

function loadLocal<T>(key: string, defaultVal: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
}

function saveLocal<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error('Storage error:', e);
  }
}

class AppStore {
  private listeners: (() => void)[] = [];

  constructor() {
    this.cleanLegacyData();

    // Initialize clean collections if not present
    if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)) {
      saveLocal(STORAGE_KEYS.PROJECTS, [] as Project[]);
    }
    if (!localStorage.getItem(STORAGE_KEYS.QUOTATIONS)) {
      saveLocal(STORAGE_KEYS.QUOTATIONS, [] as Quotation[]);
    }
    if (!localStorage.getItem(STORAGE_KEYS.PAYMENTS)) {
      saveLocal(STORAGE_KEYS.PAYMENTS, [] as Payment[]);
    }
    if (!localStorage.getItem(STORAGE_KEYS.MESSAGES)) {
      saveLocal(STORAGE_KEYS.MESSAGES, [] as Message[]);
    }
    if (!localStorage.getItem(STORAGE_KEYS.FILES)) {
      saveLocal(STORAGE_KEYS.FILES, [] as ProjectFile[]);
    }
    if (!localStorage.getItem(STORAGE_KEYS.EMPLOYEES)) {
      saveLocal(STORAGE_KEYS.EMPLOYEES, [] as Employee[]);
    }
    if (!localStorage.getItem(STORAGE_KEYS.HISTORY)) {
      saveLocal(STORAGE_KEYS.HISTORY, [] as ProjectStatusHistoryItem[]);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SERVICES)) {
      saveLocal(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CONTACT)) {
      saveLocal(STORAGE_KEYS.CONTACT, [] as ContactEnquiry[]);
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      saveLocal(STORAGE_KEYS.NOTIFICATIONS, [] as AppNotification[]);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      saveLocal(STORAGE_KEYS.SETTINGS, INITIAL_SITE_SETTINGS);
    }
  }

  // Purge any legacy data or fake records
  private cleanLegacyData(): void {
    try {
      const isCleaned = localStorage.getItem(STORAGE_KEYS.VERSION);
      if (!isCleaned) {
        // Clear demo mock projects & portfolio keys
        localStorage.removeItem('nsk_db_portfolio');
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify([]));
        localStorage.setItem(STORAGE_KEYS.QUOTATIONS, JSON.stringify([]));
        localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify([]));
        localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify([]));
        localStorage.setItem(STORAGE_KEYS.FILES, JSON.stringify([]));
        localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify([]));
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify([]));
        localStorage.setItem(STORAGE_KEYS.CONTACT, JSON.stringify([]));
        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]));
        localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(INITIAL_SERVICES));
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SITE_SETTINGS));
        
        // Remove demo client auth if active
        const user = this.getCurrentUser();
        if (user && (user.id === 'cust-demo-1' || user.email === 'customer@example.com')) {
          localStorage.removeItem(STORAGE_KEYS.USER);
        }

        localStorage.setItem(STORAGE_KEYS.VERSION, '3.0.0-clean');
      }
    } catch (e) {
      console.warn('Could not reset legacy data:', e);
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(listener => listener());
  }

  // --- ADMIN GATEWAY ACCESS ---
  public verifyAdminAccessKey(key: string): boolean {
    const trimmed = key.trim();
    return VALID_ADMIN_ACCESS_KEYS.includes(trimmed);
  }

  public isAdminGatewayUnlocked(): boolean {
    return sessionStorage.getItem(STORAGE_KEYS.ADMIN_GATEWAY) === 'true' || 
           localStorage.getItem(STORAGE_KEYS.ADMIN_GATEWAY) === 'true';
  }

  public setAdminGatewayUnlocked(unlocked: boolean, remember: boolean = false): void {
    if (unlocked) {
      sessionStorage.setItem(STORAGE_KEYS.ADMIN_GATEWAY, 'true');
      if (remember) {
        localStorage.setItem(STORAGE_KEYS.ADMIN_GATEWAY, 'true');
      }
    } else {
      sessionStorage.removeItem(STORAGE_KEYS.ADMIN_GATEWAY);
      localStorage.removeItem(STORAGE_KEYS.ADMIN_GATEWAY);
    }
    this.notify();
  }

  // --- AUTHENTICATION ---
  public getCurrentUser(): UserProfile | null {
    return loadLocal<UserProfile | null>(STORAGE_KEYS.USER, null);
  }

  public loginAdmin(email: string = 'nskdigitalagency1906@gmail.com', name: string = 'NSK Administrator'): UserProfile {
    const admin: UserProfile = {
      id: `admin-${Date.now()}`,
      email: email.trim(),
      full_name: name,
      role: 'admin',
      phone: '8807855118',
      company_name: 'NSK Agency HQ',
      created_at: new Date().toISOString()
    };
    saveLocal(STORAGE_KEYS.USER, admin);
    this.setAdminGatewayUnlocked(true, true);
    this.notify();
    return admin;
  }

  public loginUser(email: string, role: 'customer' | 'employee' | 'admin' = 'customer', name?: string): UserProfile {
    const user: UserProfile = {
      id: `usr-${Date.now()}`,
      email: email.trim(),
      full_name: name || (role === 'admin' ? 'Agency Admin' : email.split('@')[0]),
      role,
      created_at: new Date().toISOString()
    };
    saveLocal(STORAGE_KEYS.USER, user);
    this.notify();
    return user;
  }

  public registerUser(userData: {
    email: string;
    full_name: string;
    phone?: string;
    company_name?: string;
  }): UserProfile {
    const user: UserProfile = {
      id: `usr-${Date.now()}`,
      email: userData.email.trim().toLowerCase(),
      full_name: userData.full_name.trim(),
      phone: userData.phone?.trim() || '',
      company_name: userData.company_name?.trim() || '',
      role: 'customer',
      created_at: new Date().toISOString()
    };
    saveLocal(STORAGE_KEYS.USER, user);
    this.notify();
    return user;
  }

  public loginEmployee(identifier: string, password?: string): UserProfile | null {
    const employees = this.getEmployees();
    const cleanId = identifier.trim().toLowerCase();
    
    // Also allow admin to log in via employee portal
    if (cleanId === 'nskdigitalagency1906@gmail.com' || cleanId === 'admin') {
      return this.loginAdmin('nskdigitalagency1906@gmail.com', 'NSK Administrator');
    }

    const emp = employees.find(e => 
      e.status === 'active' && 
      (e.employee_id.toLowerCase() === cleanId || e.email.toLowerCase() === cleanId)
    );

    if (!emp) return null;

    const user: UserProfile = {
      id: emp.id,
      email: emp.email,
      full_name: emp.full_name,
      role: 'employee',
      employee_id: emp.employee_id,
      phone: emp.phone,
      company_name: 'NSK Digital Agency',
      created_at: emp.created_at
    };

    saveLocal(STORAGE_KEYS.USER, user);
    this.notify();
    return user;
  }

  public logout(): void {
    localStorage.removeItem(STORAGE_KEYS.USER);
    this.notify();
  }

  public updateProfile(data: Partial<UserProfile>): UserProfile | null {
    const current = this.getCurrentUser();
    if (!current) return null;
    const updated = { ...current, ...data };
    saveLocal(STORAGE_KEYS.USER, updated);
    this.notify();
    return updated;
  }

  // --- EMPLOYEE MANAGEMENT (ADMIN ONLY) ---
  public getEmployees(): Employee[] {
    return loadLocal<Employee[]>(STORAGE_KEYS.EMPLOYEES, [] as Employee[]);
  }

  public getEmployeeById(id: string): Employee | undefined {
    return this.getEmployees().find(e => e.id === id || e.employee_id === id);
  }

  public login(identifier: string, password?: string): UserProfile | null {
    const clean = identifier.trim().toLowerCase();
    if (clean === 'nskdigitalagency1906@gmail.com' || clean === 'admin@nsk.agency' || clean === 'admin') {
      return this.loginAdmin('nskdigitalagency1906@gmail.com', 'NSK Administrator');
    }
    const emp = this.loginEmployee(clean, password);
    if (emp) return emp;
    return this.loginUser(clean, 'customer');
  }

  public getRequests(): Project[] {
    return this.getProjects();
  }

  public createEmployee(data: {
    employee_id?: string;
    full_name: string;
    email: string;
    phone?: string;
    role: 'developer' | 'designer' | 'manager' | 'employee' | 'admin';
    designation?: string;
    password?: string;
    status?: 'active' | 'inactive';
  }): Employee {
    const employees = this.getEmployees();
    const empId = data.employee_id?.trim().toUpperCase() || `EMP-${String(employees.length + 1).padStart(3, '0')}`;
    const newEmp: Employee = {
      id: `emp-${Date.now()}`,
      employee_id: empId,
      full_name: data.full_name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone?.trim() || '',
      role: data.role,
      designation: data.designation?.trim() || (data.role.charAt(0).toUpperCase() + data.role.slice(1)),
      status: data.status || 'active',
      assigned_projects_count: 0,
      password: data.password || 'nsk@1234',
      created_at: new Date().toISOString()
    };

    employees.unshift(newEmp);
    saveLocal(STORAGE_KEYS.EMPLOYEES, employees);
    this.notify();
    return newEmp;
  }

  public updateEmployee(id: string, updates: Partial<Employee>): boolean {
    const employees = this.getEmployees();
    const idx = employees.findIndex(e => e.id === id);
    if (idx === -1) return false;
    employees[idx] = { ...employees[idx], ...updates, updated_at: new Date().toISOString() };
    saveLocal(STORAGE_KEYS.EMPLOYEES, employees);
    this.notify();
    return true;
  }

  public deleteEmployee(id: string): boolean {
    let employees = this.getEmployees();
    employees = employees.filter(e => e.id !== id);
    saveLocal(STORAGE_KEYS.EMPLOYEES, employees);
    this.notify();
    return true;
  }

  public assignProjectToEmployee(projectId: string, employeeId: string): boolean {
    const projects = this.getProjects();
    const pIdx = projects.findIndex(p => p.id === projectId);
    if (pIdx === -1) return false;

    const employee = this.getEmployeeById(employeeId);
    if (!employee) return false;

    projects[pIdx].assigned_employee_id = employee.id;
    projects[pIdx].assigned_to = `${employee.full_name} (${employee.designation})`;
    projects[pIdx].updated_at = new Date().toISOString();

    saveLocal(STORAGE_KEYS.PROJECTS, projects);

    // Update employee count
    const employees = this.getEmployees();
    const eIdx = employees.findIndex(e => e.id === employee.id);
    if (eIdx !== -1) {
      const assignedCount = projects.filter(p => p.assigned_employee_id === employee.id).length;
      employees[eIdx].assigned_projects_count = assignedCount;
      saveLocal(STORAGE_KEYS.EMPLOYEES, employees);
    }

    // Add History
    this.addStatusHistory(projectId, projects[pIdx].status, `Assigned to ${employee.full_name} (${employee.designation})`, 'NSK Admin');

    // Notify Employee
    this.createNotification({
      user_id: employee.id,
      title: 'New Project Assigned',
      message: `Project ${projects[pIdx].request_code} (${projects[pIdx].service_title}) has been assigned to you.`,
      link: 'employee'
    });

    this.notify();
    return true;
  }

  // --- SERVICES ---
  public getServices(): Service[] {
    return loadLocal<Service[]>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
  }

  public getServiceBySlug(slug: string): Service | undefined {
    return this.getServices().find(s => s.slug === slug);
  }

  public updateService(id: string, updates: Partial<Service>): boolean {
    const services = this.getServices();
    const idx = services.findIndex(s => s.id === id);
    if (idx === -1) return false;
    services[idx] = { ...services[idx], ...updates };
    saveLocal(STORAGE_KEYS.SERVICES, services);
    this.notify();
    return true;
  }

  public updateServiceImage(id: string, imageUrl: string): boolean {
    return this.updateService(id, { image_url: imageUrl });
  }

  // --- PROJECTS ---
  public getProjects(): Project[] {
    return loadLocal<Project[]>(STORAGE_KEYS.PROJECTS, [] as Project[]);
  }

  public getProjectById(id: string): Project | undefined {
    return this.getProjects().find(p => p.id === id);
  }

  public getProjectByCode(code: string): Project | undefined {
    return this.getProjects().find(p => p.request_code.toLowerCase() === code.trim().toLowerCase());
  }

  public getUserProjects(user: UserProfile | null): Project[] {
    if (!user) return [];
    if (user.role === 'admin') return this.getProjects();
    if (user.role === 'employee') {
      return this.getProjects().filter(p => 
        p.assigned_employee_id === user.id || p.assigned_to?.includes(user.full_name)
      );
    }
    const emailMatch = user.email.toLowerCase();
    return this.getProjects().filter(p => 
      p.customer_id === user.id || p.client_email.toLowerCase() === emailMatch
    );
  }

  public createProjectRequest(data: {
    client_name: string;
    client_email: string;
    client_phone: string;
    company_name?: string;
    service_slug: string;
    service_title: string;
    project_title: string;
    description: string;
    required_features: string[];
    budget_range: string;
    preferred_deadline: string;
    reference_website?: string;
    customer_id?: string;
  }): Project {
    const projects = this.getProjects();
    
    // Format: NSK-2026-00001
    const year = new Date().getFullYear();
    const count = projects.length + 1;
    const requestCode = `NSK-${year}-${String(count).padStart(5, '0')}`;

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      request_code: requestCode,
      customer_id: data.customer_id,
      client_name: data.client_name,
      client_email: data.client_email,
      client_phone: data.client_phone,
      company_name: data.company_name || '',
      service_slug: data.service_slug,
      service_title: data.service_title,
      project_title: data.project_title || `${data.service_title} for ${data.client_name}`,
      description: data.description,
      required_features: data.required_features,
      budget_range: data.budget_range,
      preferred_deadline: data.preferred_deadline,
      reference_website: data.reference_website,
      status: 'Request Received',
      progress_percentage: 10,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    projects.unshift(newProject);
    saveLocal(STORAGE_KEYS.PROJECTS, projects);

    // Initial status history
    this.addStatusHistory(newProject.id, 'Request Received', 'Project request registered on NSK platform.', 'System');

    // Notify Customer
    if (data.customer_id) {
      this.createNotification({
        user_id: data.customer_id,
        title: 'Project Request Received',
        message: `Your project request for ${data.service_title} (${requestCode}) has been received by our engineering team.`,
        link: 'projects'
      });
    }

    // Notify Admin
    this.createNotification({
      user_id: 'admin',
      title: 'New Service Request',
      message: `New request ${requestCode} submitted by ${data.client_name} for ${data.service_title}.`,
      link: 'admin/orders'
    });

    this.notify();
    return newProject;
  }

  public updateProjectStatus(projectId: string, newStatus: ProjectStatus, notes?: string, changedByName: string = 'NSK Admin'): boolean {
    const projects = this.getProjects();
    const idx = projects.findIndex(p => p.id === projectId);
    if (idx === -1) return false;

    const progressMap: Record<ProjectStatus, number> = {
      'Request Received': 10,
      'Under Review': 20,
      'Quote Sent': 30,
      'Payment Pending': 40,
      'Confirmed': 50,
      'In Progress': 60,
      'Design Stage': 70,
      'Development Stage': 80,
      'Testing': 90,
      'Client Review': 95,
      'Completed': 100,
      'Cancelled': 0
    };

    projects[idx].status = newStatus;
    projects[idx].progress_percentage = progressMap[newStatus] ?? projects[idx].progress_percentage;
    projects[idx].updated_at = new Date().toISOString();

    saveLocal(STORAGE_KEYS.PROJECTS, projects);

    // Add History
    this.addStatusHistory(projectId, newStatus, notes || `Status updated to ${newStatus}`, changedByName);

    // Notify Customer
    if (projects[idx].customer_id) {
      this.createNotification({
        user_id: projects[idx].customer_id!,
        title: `Project Status: ${newStatus}`,
        message: `Project ${projects[idx].request_code} status is now '${newStatus}'. ${notes ? `Note: ${notes}` : ''}`,
        link: 'projects'
      });
    }

    // Notify Admin if changed by employee
    if (changedByName !== 'NSK Admin') {
      this.createNotification({
        user_id: 'admin',
        title: `Project Updated by ${changedByName}`,
        message: `${projects[idx].request_code} updated to '${newStatus}'. Note: ${notes || 'No extra notes'}`,
        link: 'admin/orders'
      });
    }

    this.notify();
    return true;
  }

  public updateProjectDetails(projectId: string, data: Partial<Project>): boolean {
    const projects = this.getProjects();
    const idx = projects.findIndex(p => p.id === projectId);
    if (idx === -1) return false;

    projects[idx] = { ...projects[idx], ...data, updated_at: new Date().toISOString() };
    saveLocal(STORAGE_KEYS.PROJECTS, projects);
    this.notify();
    return true;
  }

  public deleteProject(projectId: string): boolean {
    let projects = this.getProjects();
    projects = projects.filter(p => p.id !== projectId);
    saveLocal(STORAGE_KEYS.PROJECTS, projects);
    this.notify();
    return true;
  }

  // --- STATUS HISTORY ---
  public getStatusHistory(projectId: string): ProjectStatusHistoryItem[] {
    const history = loadLocal<ProjectStatusHistoryItem[]>(STORAGE_KEYS.HISTORY, [] as ProjectStatusHistoryItem[]);
    return history.filter(h => h.project_id === projectId).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }

  public addStatusHistory(projectId: string, status: ProjectStatus, notes?: string, changedByName: string = 'System'): void {
    const history = loadLocal<ProjectStatusHistoryItem[]>(STORAGE_KEYS.HISTORY, [] as ProjectStatusHistoryItem[]);
    history.push({
      id: `hist-${Date.now()}`,
      project_id: projectId,
      status,
      notes,
      changed_by_name: changedByName,
      created_at: new Date().toISOString()
    });
    saveLocal(STORAGE_KEYS.HISTORY, history);
  }

  // --- QUOTATIONS ---
  public getQuotations(): Quotation[] {
    return loadLocal<Quotation[]>(STORAGE_KEYS.QUOTATIONS, [] as Quotation[]);
  }

  public getQuotationForProject(projectId: string): Quotation | undefined {
    return this.getQuotations().find(q => q.project_id === projectId);
  }

  public createQuotation(projectId: string, quoteData: {
    line_items: { name: string; desc?: string; amount: number }[];
    discount: number;
    taxRate: number;
    payment_terms: string;
    valid_until: string;
  }): Quotation {
    const quotes = this.getQuotations();
    const project = this.getProjectById(projectId);

    const subtotal = quoteData.line_items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const discount = Number(quoteData.discount) || 0;
    const discountedSubtotal = Math.max(0, subtotal - discount);
    const tax = Math.round(discountedSubtotal * (quoteData.taxRate / 100));
    const total_amount = discountedSubtotal + tax;

    const lineItemsWithId = quoteData.line_items.map((item, i) => ({
      id: `item-${Date.now()}-${i}`,
      name: item.name,
      desc: item.desc,
      amount: Number(item.amount)
    }));

    const quoteNumber = `QT-${project?.request_code || 'NSK-2026'}`;

    const newQuote: Quotation = {
      id: `quote-${Date.now()}`,
      project_id: projectId,
      quote_number: quoteNumber,
      line_items: lineItemsWithId,
      subtotal,
      discount,
      tax,
      total_amount,
      currency: 'INR',
      payment_terms: quoteData.payment_terms || '50% advance to initiate milestones, 50% upon final delivery.',
      valid_until: quoteData.valid_until,
      status: 'sent',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const filteredQuotes = quotes.filter(q => q.project_id !== projectId);
    filteredQuotes.unshift(newQuote);
    saveLocal(STORAGE_KEYS.QUOTATIONS, filteredQuotes);

    this.updateProjectStatus(projectId, 'Quote Sent', `Quotation ${quoteNumber} totaling ₹${total_amount.toLocaleString('en-IN')} dispatched.`, 'NSK Admin');

    this.notify();
    return newQuote;
  }

  public respondToQuotation(quotationId: string, action: 'accept' | 'reject', notes?: string): boolean {
    const quotes = this.getQuotations();
    const idx = quotes.findIndex(q => q.id === quotationId);
    if (idx === -1) return false;

    quotes[idx].status = action === 'accept' ? 'accepted' : 'rejected';
    quotes[idx].client_response_notes = notes;
    quotes[idx].updated_at = new Date().toISOString();
    saveLocal(STORAGE_KEYS.QUOTATIONS, quotes);

    const projectId = quotes[idx].project_id;
    if (action === 'accept') {
      this.updateProjectStatus(projectId, 'Confirmed', 'Quotation accepted by client. Milestone kickoff initiated.', 'Client');
    } else {
      this.updateProjectStatus(projectId, 'Under Review', `Quotation response from client: ${notes || 'Revision requested'}`, 'Client');
    }

    this.notify();
    return true;
  }

  // --- PAYMENTS ---
  public getPayments(): Payment[] {
    return loadLocal<Payment[]>(STORAGE_KEYS.PAYMENTS, [] as Payment[]);
  }

  public recordPayment(paymentData: Omit<Payment, 'id' | 'created_at'>): Payment {
    const payments = this.getPayments();
    const newPayment: Payment = {
      ...paymentData,
      id: `pay-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    payments.unshift(newPayment);
    saveLocal(STORAGE_KEYS.PAYMENTS, payments);
    this.notify();
    return newPayment;
  }

  // --- MESSAGING ---
  public getMessages(projectId: string): Message[] {
    const all = loadLocal<Message[]>(STORAGE_KEYS.MESSAGES, [] as Message[]);
    return all.filter(m => m.project_id === projectId).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }

  public sendMessage(projectId: string, text: string, senderRole: 'customer' | 'employee' | 'admin', senderName: string, senderId?: string): Message {
    const all = loadLocal<Message[]>(STORAGE_KEYS.MESSAGES, [] as Message[]);
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      project_id: projectId,
      sender_id: senderId,
      sender_name: senderName,
      sender_role: senderRole,
      message: text.trim(),
      is_read: false,
      created_at: new Date().toISOString()
    };
    all.push(newMsg);
    saveLocal(STORAGE_KEYS.MESSAGES, all);

    const project = this.getProjectById(projectId);
    if (project && senderRole !== 'customer' && project.customer_id) {
      this.createNotification({
        user_id: project.customer_id,
        title: 'New Project Message',
        message: `${senderName} sent a message regarding ${project.request_code}: "${text.slice(0, 60)}${text.length > 60 ? '...' : ''}"`,
        link: 'projects'
      });
    }

    this.notify();
    return newMsg;
  }

  // --- PROJECT FILES ---
  public getProjectFiles(projectId: string): ProjectFile[] {
    const files = loadLocal<ProjectFile[]>(STORAGE_KEYS.FILES, [] as ProjectFile[]);
    return files.filter(f => f.project_id === projectId).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public addProjectFile(projectId: string, fileData: {
    file_name: string;
    file_url: string;
    file_size: number;
    file_type: string;
    category: 'client_upload' | 'deliverable' | 'quotation_doc' | 'contract';
    uploader_name: string;
    uploader_id?: string;
  }): ProjectFile {
    const files = loadLocal<ProjectFile[]>(STORAGE_KEYS.FILES, [] as ProjectFile[]);
    const newFile: ProjectFile = {
      id: `file-${Date.now()}`,
      project_id: projectId,
      uploader_id: fileData.uploader_id,
      uploader_name: fileData.uploader_name,
      file_name: fileData.file_name,
      file_url: fileData.file_url,
      file_size: fileData.file_size,
      file_type: fileData.file_type,
      category: fileData.category,
      created_at: new Date().toISOString()
    };
    files.unshift(newFile);
    saveLocal(STORAGE_KEYS.FILES, files);
    this.notify();
    return newFile;
  }

  // --- CONTACT ENQUIRIES ---
  public getContactEnquiries(): ContactEnquiry[] {
    return loadLocal<ContactEnquiry[]>(STORAGE_KEYS.CONTACT, [] as ContactEnquiry[]).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public submitContactEnquiry(data: {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
  }): ContactEnquiry {
    const enquiries = this.getContactEnquiries();
    const newEnquiry: ContactEnquiry = {
      id: `cnt-${Date.now()}`,
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      subject: data.subject.trim(),
      message: data.message.trim(),
      status: 'new',
      created_at: new Date().toISOString()
    };
    enquiries.unshift(newEnquiry);
    saveLocal(STORAGE_KEYS.CONTACT, enquiries);
    this.notify();
    return newEnquiry;
  }

  public updateContactStatus(id: string, status: 'new' | 'read' | 'in_progress' | 'resolved', notes?: string): boolean {
    const enquiries = this.getContactEnquiries();
    const idx = enquiries.findIndex(e => e.id === id);
    if (idx === -1) return false;
    enquiries[idx].status = status;
    if (notes !== undefined) enquiries[idx].admin_notes = notes;
    saveLocal(STORAGE_KEYS.CONTACT, enquiries);
    this.notify();
    return true;
  }

  public deleteContactEnquiry(id: string): boolean {
    let enquiries = this.getContactEnquiries();
    enquiries = enquiries.filter(e => e.id !== id);
    saveLocal(STORAGE_KEYS.CONTACT, enquiries);
    this.notify();
    return true;
  }

  // --- NOTIFICATIONS ---
  public getNotifications(userId: string): AppNotification[] {
    const all = loadLocal<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, [] as AppNotification[]);
    return all.filter(n => n.user_id === userId || (userId === 'admin' && n.user_id === 'admin')).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public createNotification(data: Omit<AppNotification, 'id' | 'is_read' | 'created_at'>): AppNotification {
    const all = loadLocal<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, [] as AppNotification[]);
    const newNotif: AppNotification = {
      ...data,
      id: `notif-${Date.now()}`,
      is_read: false,
      created_at: new Date().toISOString()
    };
    all.unshift(newNotif);
    saveLocal(STORAGE_KEYS.NOTIFICATIONS, all);
    this.notify();
    return newNotif;
  }

  public markNotificationRead(id: string): void {
    const all = loadLocal<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, [] as AppNotification[]);
    const idx = all.findIndex(n => n.id === id);
    if (idx !== -1) {
      all[idx].is_read = true;
      saveLocal(STORAGE_KEYS.NOTIFICATIONS, all);
      this.notify();
    }
  }

  public markAllNotificationsRead(userId: string): void {
    const all = loadLocal<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, [] as AppNotification[]);
    all.forEach(n => {
      if (n.user_id === userId || (userId === 'admin' && n.user_id === 'admin')) n.is_read = true;
    });
    saveLocal(STORAGE_KEYS.NOTIFICATIONS, all);
    this.notify();
  }

  // --- SITE SETTINGS ---
  public getSettings(): SiteSettings {
    return loadLocal<SiteSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SITE_SETTINGS);
  }

  public updateSettings(data: Partial<SiteSettings>): SiteSettings {
    const current = this.getSettings();
    const updated = { ...current, ...data };
    saveLocal(STORAGE_KEYS.SETTINGS, updated);
    this.notify();
    return updated;
  }

  // --- ADMIN ANALYTICS ---
  public getAdminAnalytics() {
    const projects = this.getProjects();
    const quotes = this.getQuotations();
    const enquiries = this.getContactEnquiries();
    const employees = this.getEmployees();

    const uniqueEmails = new Set(projects.map(p => p.client_email.toLowerCase()));
    const totalCustomers = uniqueEmails.size;

    const newRequests = projects.filter(p => p.status === 'Request Received' || p.status === 'Under Review').length;
    const activeProjects = projects.filter(p => ['Confirmed', 'In Progress', 'Design Stage', 'Development Stage', 'Testing', 'Client Review'].includes(p.status)).length;
    const completedProjects = projects.filter(p => p.status === 'Completed').length;

    const acceptedQuotes = quotes.filter(q => q.status === 'accepted');
    const totalRevenue = acceptedQuotes.reduce((sum, q) => sum + q.total_amount, 0);

    const pendingQuotes = quotes.filter(q => q.status === 'sent');
    const pendingAmount = pendingQuotes.reduce((sum, q) => sum + q.total_amount, 0);

    const serviceDistribution: Record<string, number> = {};
    projects.forEach(p => {
      serviceDistribution[p.service_title] = (serviceDistribution[p.service_title] || 0) + 1;
    });

    const statusDistribution: Record<string, number> = {};
    projects.forEach(p => {
      statusDistribution[p.status] = (statusDistribution[p.status] || 0) + 1;
    });

    return {
      totalCustomers,
      totalEmployees: employees.length,
      activeEmployees: employees.filter(e => e.status === 'active').length,
      newRequests,
      activeProjects,
      completedProjects,
      totalRevenue,
      pendingAmount,
      pendingQuotesCount: pendingQuotes.length,
      totalEnquiries: enquiries.length,
      newEnquiriesCount: enquiries.filter(e => e.status === 'new').length,
      serviceDistribution,
      statusDistribution
    };
  }
}

export const store = new AppStore();
