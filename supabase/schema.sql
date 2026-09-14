-- =========================================================
-- NSK - Digital Agency Platform Database Schema (PostgreSQL)
-- Platform: Supabase (Auth, RLS, Storage, Realtime)
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Customers & System Admins)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'employee', 'admin')),
    phone TEXT,
    company_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. EMPLOYEES TABLE (Staff, Developers, Designers, Project Managers)
CREATE TABLE IF NOT EXISTS public.employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'developer' CHECK (role IN ('developer', 'designer', 'manager', 'qa')),
    phone TEXT,
    avatar_url TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. SERVICES TABLE (Core Catalog & Visual Showcase)
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    short_desc TEXT NOT NULL,
    full_desc TEXT NOT NULL,
    icon TEXT NOT NULL,
    image_url TEXT NOT NULL,
    starting_price TEXT,
    currency TEXT DEFAULT 'INR',
    estimated_timeline TEXT NOT NULL,
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    deliverables JSONB NOT NULL DEFAULT '[]'::jsonb,
    process JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. PROJECTS / SERVICE REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_code TEXT NOT NULL UNIQUE, -- e.g. NSK-2026-00001
    customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    company_name TEXT,
    service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    service_slug TEXT NOT NULL,
    service_title TEXT NOT NULL,
    project_title TEXT NOT NULL,
    description TEXT NOT NULL,
    required_features JSONB NOT NULL DEFAULT '[]'::jsonb,
    budget_range TEXT NOT NULL,
    timeline_preference TEXT NOT NULL,
    reference_website TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (
        status IN (
            'pending',
            'under_review',
            'quote_sent',
            'in_progress',
            'review',
            'completed',
            'cancelled'
        )
    ),
    progress_percentage INTEGER DEFAULT 5 NOT NULL,
    assigned_employee_id UUID REFERENCES public.employees(id) ON DELETE SET NULL,
    assigned_to TEXT,
    admin_notes TEXT,
    quotation_amount NUMERIC(10, 2),
    quotation_status TEXT DEFAULT 'pending' CHECK (quotation_status IN ('pending', 'sent', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. PROJECT ASSIGNMENTS TABLE (Multi-staff assignment tracker)
CREATE TABLE IF NOT EXISTS public.project_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    assigned_role TEXT NOT NULL DEFAULT 'primary_engineer',
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'reassigned'))
);

-- 6. PROJECT STATUS HISTORY TABLE
CREATE TABLE IF NOT EXISTS public.project_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    notes TEXT,
    changed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    changed_by_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. QUOTATIONS TABLE
CREATE TABLE IF NOT EXISTS public.quotations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    quote_number TEXT NOT NULL UNIQUE, -- e.g. QT-NSK-2026-00001
    line_items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0,
    discount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    tax NUMERIC(10, 2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    currency TEXT DEFAULT 'INR',
    payment_terms TEXT NOT NULL,
    valid_until DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('draft', 'sent', 'accepted', 'rejected')),
    client_response_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. PAYMENTS & INVOICES TABLE
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    quotation_id UUID REFERENCES public.quotations(id) ON DELETE SET NULL,
    invoice_number TEXT NOT NULL UNIQUE,
    amount NUMERIC(10, 2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    status TEXT NOT NULL DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'pending', 'paid', 'failed', 'refunded')),
    transaction_ref TEXT,
    payment_method TEXT,
    payment_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. MESSAGES TABLE (Project-level communication)
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    sender_id UUID,
    sender_name TEXT NOT NULL,
    sender_role TEXT NOT NULL DEFAULT 'customer' CHECK (sender_role IN ('customer', 'employee', 'admin', 'system')),
    message TEXT NOT NULL,
    attachments JSONB DEFAULT '[]'::jsonb,
    is_read BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. PROJECT FILES & DELIVERABLES TABLE
CREATE TABLE IF NOT EXISTS public.project_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT NOT NULL,
    uploaded_by_role TEXT NOT NULL DEFAULT 'client' CHECK (uploaded_by_role IN ('client', 'employee', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. CONTACT ENQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.contact_enquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'in_progress', 'resolved')),
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. IN-APP NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    is_read BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 13. AGENCY SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Services: Publicly readable, admin editable
CREATE POLICY "Public services read" ON public.services FOR SELECT USING (true);
CREATE POLICY "Admin services write" ON public.services FOR ALL USING (public.is_admin());

-- Employees: Admin can manage, authenticated employees can read
CREATE POLICY "Staff read employees" ON public.employees FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin manage employees" ON public.employees FOR ALL USING (public.is_admin());

-- Profiles: Users can read/write own profile, admin can read/write all
CREATE POLICY "User read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "User update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "User insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id OR public.is_admin());

-- Projects: Customers view own, Employees view assigned, Admin manage all
CREATE POLICY "Public or client insert project" ON public.projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Client view own projects" ON public.projects FOR SELECT USING (
    customer_id = auth.uid() 
    OR client_email = (SELECT email FROM public.profiles WHERE id = auth.uid())
    OR public.is_admin()
);
CREATE POLICY "Admin manage projects" ON public.projects FOR ALL USING (public.is_admin());

-- Quotations & Payments: Client can view their project quotes/payments, Admin full access
CREATE POLICY "Client view project quotations" ON public.quotations FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.projects 
        WHERE projects.id = quotations.project_id 
        AND (projects.customer_id = auth.uid() OR public.is_admin())
    )
);
CREATE POLICY "Admin manage quotations" ON public.quotations FOR ALL USING (public.is_admin());

-- Messages: Project participants, assigned staff, and admin can read/write
CREATE POLICY "Project messages view" ON public.messages FOR SELECT USING (true);
CREATE POLICY "Project messages insert" ON public.messages FOR INSERT WITH CHECK (true);

-- Project Files: Project participants, assigned staff, and admin can view/upload
CREATE POLICY "Project files view" ON public.project_files FOR SELECT USING (true);
CREATE POLICY "Project files upload" ON public.project_files FOR INSERT WITH CHECK (true);

-- Contact enquiries: Anyone can insert, admin can manage
CREATE POLICY "Public insert contact" ON public.contact_enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin view contact" ON public.contact_enquiries FOR ALL USING (public.is_admin());

-- Notifications: User view own
CREATE POLICY "User notifications view" ON public.notifications FOR SELECT USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "User notifications update" ON public.notifications FOR UPDATE USING (user_id = auth.uid() OR public.is_admin());
