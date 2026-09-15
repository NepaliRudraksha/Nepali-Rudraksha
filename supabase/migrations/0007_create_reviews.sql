-- Create Reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Policies for reviews

-- 1. Anyone can view APPROVED reviews
CREATE POLICY "Anyone can view approved reviews" ON public.reviews
    FOR SELECT USING (is_approved = true);

-- 2. Anyone can insert a review (it will be unapproved by default)
CREATE POLICY "Anyone can insert reviews" ON public.reviews
    FOR INSERT WITH CHECK (true);

-- 3. Admins can view ALL reviews (approved and pending)
CREATE POLICY "Admins can view all reviews" ON public.reviews
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()::text AND profiles.role = 'admin'
        )
    );

-- 4. Admins can update reviews (to approve them)
CREATE POLICY "Admins can update reviews" ON public.reviews
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()::text AND profiles.role = 'admin'
        )
    );

-- 5. Admins can delete reviews
CREATE POLICY "Admins can delete reviews" ON public.reviews
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()::text AND profiles.role = 'admin'
        )
    );
