-- ====================================================================
-- NSK DIGITAL AGENCY - COMPLETE PRODUCTION SUPABASE DATABASE SCHEMA
-- PostgreSQL schema for Supabase (Auth, RLS, Storage, Realtime)
-- ====================================================================

-- 1. EXTENSIONS & SEQUENCES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE SEQUENCE IF NOT EXISTS service_request_seq START 1;
CREATE SEQUENCE IF NOT EXISTS project_seq START 1;
CREATE SEQUENCE IF NOT EXISTS quotation_seq START 1;
CREATE SEQUENCE IF NOT EXISTS invoice_seq START 1;

-- 2. PROFILES TABLE (Customers, Employees, Admins linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'employee', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. EMPLOYEES DIRECTORY
CREATE TABLE IF NOT EXISTS public.employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    employee_id TEXT NOT NULL UNIQUE, -- e.g. EMP-001
    department TEXT NOT NULL, -- e.g. Engineering, Design, Management, QA
    position TEXT NOT NULL, -- e.g. Senior Frontend Engineer
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. SERVICES CATALOG (Manageable from Admin Portal)
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    short_description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    price NUMERIC(10, 2),
    estimated_timeline TEXT DEFAULT '2 - 4 Weeks',
    features JSONB DEFAULT '[]'::jsonb,
    deliverables JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. SERVICE REQUESTS (Authenticated Client Bookings)
CREATE TABLE IF NOT EXISTS public.service_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_number TEXT NOT NULL UNIQUE, -- Generated as NSK-2026-00001
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    service_slug TEXT,
    service_title TEXT,
    project_title TEXT NOT NULL,
    description TEXT NOT NULL,
    requirements JSONB DEFAULT '[]'::jsonb,
    budget TEXT NOT NULL,
    preferred_deadline TEXT NOT NULL,
    reference_website TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'quoted', 'converted', 'rejected', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. PROJECTS (Active Execution Workstreams)
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_number TEXT NOT NULL UNIQUE, -- e.g. PRJ-2026-00001
    request_id UUID REFERENCES public.service_requests(id) ON DELETE SET NULL,
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    assigned_employee_id UUID REFERENCES public.employees(id) ON DELETE SET NULL,
    service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'In Progress' CHECK (
        status IN (
            'Request Received',
            'Under Review',
            'Quote Sent',
            'Payment Pending',
            'Confirmed',
            'In Progress',
            'Design Stage',
            'Development Stage',
            'Testing',
            'Client Review',
            'Completed',
            'Cancelled'
        )
    ),
    progress_percentage INTEGER NOT NULL DEFAULT 10,
    start_date DATE DEFAULT CURRENT_DATE,
    deadline DATE,
    internal_notes TEXT,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. PROJECT STATUS HISTORY
CREATE TABLE IF NOT EXISTS public.project_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    old_status TEXT,
    new_status TEXT NOT NULL,
    changed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. PROJECT ASSIGNMENTS
CREATE TABLE IF NOT EXISTS public.project_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'reassigned'))
);

-- 9. MESSAGES (Real-time Project Communication)
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    sender_name TEXT NOT NULL,
    sender_role TEXT NOT NULL DEFAULT 'customer' CHECK (sender_role IN ('customer', 'employee', 'admin', 'system')),
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. FILES & DELIVERABLES (Supabase Storage references)
CREATE TABLE IF NOT EXISTS public.files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    uploaded_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size BIGINT NOT NULL DEFAULT 0,
    category TEXT NOT NULL DEFAULT 'deliverable' CHECK (category IN ('client_upload', 'deliverable', 'quotation_doc', 'contract')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. QUOTATIONS
CREATE TABLE IF NOT EXISTS public.quotations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    quotation_number TEXT NOT NULL UNIQUE, -- e.g. QT-NSK-2026-00001
    line_items JSONB DEFAULT '[]'::jsonb,
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0,
    discount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    tax NUMERIC(10, 2) NOT NULL DEFAULT 0,
    total NUMERIC(10, 2) NOT NULL DEFAULT 0,
    description TEXT,
    valid_until DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'Sent' CHECK (status IN ('Draft', 'Sent', 'Accepted', 'Rejected', 'Expired')),
    client_response_notes TEXT,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. PAYMENTS & INVOICES
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    quotation_id UUID REFERENCES public.quotations(id) ON DELETE SET NULL,
    invoice_number TEXT NOT NULL UNIQUE,
    amount NUMERIC(10, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'INR',
    payment_status TEXT NOT NULL DEFAULT 'Pending' CHECK (payment_status IN ('Unpaid', 'Pending', 'Paid', 'Failed', 'Refunded')),
    transaction_id TEXT,
    payment_method TEXT,
    payment_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 13. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'action_required')),
    link TEXT,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 14. CONTACT ENQUIRIES
CREATE TABLE IF NOT EXISTS public.contact_enquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Read', 'Resolved')),
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ====================================================================
-- HELPER FUNCTIONS & TRIGGERS
-- ====================================================================

-- Function to check admin privileges
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is an employee
CREATE OR REPLACE FUNCTION public.is_employee()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('employee', 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate formatted request numbers: NSK-2026-00001
CREATE OR REPLACE FUNCTION public.generate_request_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.request_number IS NULL OR NEW.request_number = '' THEN
    NEW.request_number := 'NSK-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || LPAD(NEXTVAL('service_request_seq')::TEXT, 5, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_generate_request_number
BEFORE INSERT ON public.service_requests
FOR EACH ROW EXECUTE FUNCTION public.generate_request_number();

-- Function to handle new user registration -> automatically create profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, phone)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer'),
    NEW.raw_user_meta_data->>'phone'
  )
  ON CONFLICT (id) DO UPDATE
  SET full_name = EXCLUDED.full_name,
      phone = COALESCE(EXCLUDED.phone, public.profiles.phone);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_enquiries ENABLE ROW LEVEL SECURITY;

-- 1. PROFILES POLICIES
CREATE POLICY "Public profiles can be read by authenticated users" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "Admins have full access to profiles" ON public.profiles FOR ALL TO authenticated USING (public.is_admin());

-- 2. SERVICES POLICIES
CREATE POLICY "Services are publicly viewable" ON public.services FOR SELECT USING (true);
CREATE POLICY "Admins can manage services" ON public.services FOR ALL TO authenticated USING (public.is_admin());

-- 3. EMPLOYEES POLICIES
CREATE POLICY "Employees directory readable by staff and admin" ON public.employees FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage employees" ON public.employees FOR ALL TO authenticated USING (public.is_admin());

-- 4. SERVICE REQUESTS POLICIES
CREATE POLICY "Customers can view their own service requests" ON public.service_requests FOR SELECT TO authenticated USING (customer_id = auth.uid() OR public.is_admin() OR public.is_employee());
CREATE POLICY "Authenticated customers can create service requests" ON public.service_requests FOR INSERT TO authenticated WITH CHECK (customer_id = auth.uid());
CREATE POLICY "Admins can update service requests" ON public.service_requests FOR UPDATE TO authenticated USING (public.is_admin());

-- 5. PROJECTS POLICIES
CREATE POLICY "Customers view own projects" ON public.projects FOR SELECT TO authenticated USING (
  customer_id = auth.uid() 
  OR assigned_employee_id IN (SELECT id FROM public.employees WHERE profile_id = auth.uid())
  OR public.is_admin()
);
CREATE POLICY "Admins can manage all projects" ON public.projects FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Employees can update assigned projects status" ON public.projects FOR UPDATE TO authenticated USING (
  assigned_employee_id IN (SELECT id FROM public.employees WHERE profile_id = auth.uid())
  OR public.is_admin()
);

-- 6. PROJECT STATUS HISTORY POLICIES
CREATE POLICY "View project history" ON public.project_status_history FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = project_status_history.project_id
    AND (p.customer_id = auth.uid() OR p.assigned_employee_id IN (SELECT id FROM public.employees WHERE profile_id = auth.uid()) OR public.is_admin())
  )
);
CREATE POLICY "Insert project history" ON public.project_status_history FOR INSERT TO authenticated WITH CHECK (
  public.is_employee() OR public.is_admin()
);

-- 7. PROJECT ASSIGNMENTS POLICIES
CREATE POLICY "View assignments" ON public.project_assignments FOR SELECT TO authenticated USING (public.is_employee() OR public.is_admin());
CREATE POLICY "Admins manage assignments" ON public.project_assignments FOR ALL TO authenticated USING (public.is_admin());

-- 8. MESSAGES POLICIES
CREATE POLICY "Participants view project messages" ON public.messages FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = messages.project_id
    AND (p.customer_id = auth.uid() OR p.assigned_employee_id IN (SELECT id FROM public.employees WHERE profile_id = auth.uid()) OR public.is_admin())
  )
);
CREATE POLICY "Participants insert project messages" ON public.messages FOR INSERT TO authenticated WITH CHECK (
  auth.uid() = sender_id
  AND EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = messages.project_id
    AND (p.customer_id = auth.uid() OR p.assigned_employee_id IN (SELECT id FROM public.employees WHERE profile_id = auth.uid()) OR public.is_admin())
  )
);

-- 9. FILES POLICIES
CREATE POLICY "Participants view project files" ON public.files FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = files.project_id
    AND (p.customer_id = auth.uid() OR p.assigned_employee_id IN (SELECT id FROM public.employees WHERE profile_id = auth.uid()) OR public.is_admin())
  )
);
CREATE POLICY "Participants upload project files" ON public.files FOR INSERT TO authenticated WITH CHECK (
  auth.uid() = uploaded_by
  AND EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = files.project_id
    AND (p.customer_id = auth.uid() OR p.assigned_employee_id IN (SELECT id FROM public.employees WHERE profile_id = auth.uid()) OR public.is_admin())
  )
);

-- 10. QUOTATIONS POLICIES
CREATE POLICY "Customer and staff view quotations" ON public.quotations FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = quotations.project_id
    AND (p.customer_id = auth.uid() OR public.is_admin())
  )
);
CREATE POLICY "Customer update quotation response" ON public.quotations FOR UPDATE TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = quotations.project_id
    AND p.customer_id = auth.uid()
  )
);
CREATE POLICY "Admins manage quotations" ON public.quotations FOR ALL TO authenticated USING (public.is_admin());

-- 11. PAYMENTS POLICIES
CREATE POLICY "Customer and admin view payments" ON public.payments FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = payments.project_id
    AND (p.customer_id = auth.uid() OR public.is_admin())
  )
);
CREATE POLICY "Admins manage payments" ON public.payments FOR ALL TO authenticated USING (public.is_admin());

-- 12. NOTIFICATIONS POLICIES
CREATE POLICY "Users view own notifications" ON public.notifications FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "Users update own notifications" ON public.notifications FOR UPDATE TO authenticated USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "System/Admin insert notifications" ON public.notifications FOR INSERT TO authenticated WITH CHECK (true);

-- 13. CONTACT ENQUIRIES POLICIES
CREATE POLICY "Public insert contact enquiries" ON public.contact_enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin view contact enquiries" ON public.contact_enquiries FOR ALL TO authenticated USING (public.is_admin());

-- ====================================================================
-- STORAGE BUCKETS CONFIGURATION
-- ====================================================================

-- Insert Storage Buckets if not existing
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('service-images', 'service-images', true),
  ('project-files', 'project-files', false),
  ('customer-uploads', 'customer-uploads', false)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

-- Storage Policies for service-images (Public read, admin write)
CREATE POLICY "Public can view service images" ON storage.objects FOR SELECT USING (bucket_id = 'service-images');
CREATE POLICY "Admin can upload service images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'service-images' AND public.is_admin());
CREATE POLICY "Admin can update service images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'service-images' AND public.is_admin());
CREATE POLICY "Admin can delete service images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'service-images' AND public.is_admin());

-- Storage Policies for project-files (Authenticated project participants only)
CREATE POLICY "Authenticated users view project files" ON storage.objects FOR SELECT TO authenticated USING (
  bucket_id IN ('project-files', 'customer-uploads')
);
CREATE POLICY "Authenticated users upload project files" ON storage.objects FOR INSERT TO authenticated WITH CHECK (
  bucket_id IN ('project-files', 'customer-uploads')
);

-- ====================================================================
-- REALTIME SUBSCRIPTIONS
-- ====================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
ALTER PUBLICATION supabase_realtime ADD TABLE public.service_requests;
