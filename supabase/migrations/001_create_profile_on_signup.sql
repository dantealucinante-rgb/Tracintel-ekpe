-- Supabase Migration: 001_create_profile_on_signup.sql
-- Automatic creation of Organization and Profile on Auth signup

-- 1. Create the handling function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
    new_org_id text;
BEGIN
    -- Create Organization 
    -- Note: Prisma uses cuid() but in SQL we will use UUID for the initial record
    new_org_id := gen_random_uuid()::text;

    INSERT INTO public."Organization" (id, name, plan, "scanLimit", "scansUsed")
    VALUES (
        new_org_id,
        'Personal Workspace',
        'STARTER',
        120,
        0
    );

    -- Create Profile linking to the new Org and the Auth user
    INSERT INTO public."Profile" (id, "userId", "organizationId", email)
    VALUES (
        gen_random_uuid()::text,
        NEW.id,
        new_org_id,
        NEW.email
    );

    RETURN NEW;
END;
$$;

-- 2. Bind function to auth.users trigger
-- Ensure the trigger doesn't already exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
