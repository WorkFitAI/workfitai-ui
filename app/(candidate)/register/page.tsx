"use client";

import {
  clearAuthError,
  registerUser,
  selectAuthError,
  selectAuthMessage,
  selectAuthStatus,
  selectUserId,
} from "@/redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import FormInput from "@/components/auth/FormInput";
import PasswordInput from "@/components/auth/PasswordInput";
import FormButton from "@/components/auth/FormButton";
import SocialLogin from "@/components/auth/SocialLogin";
import FormDivider from "@/components/auth/FormDivider";
import FormError from "@/components/auth/FormError";
import FormSuccess from "@/components/auth/FormSuccess";
import RoleSelector from "@/components/auth/RoleSelector";
import CompanySelector from "@/components/auth/CompanySelector";
import CompanyForm, { CompanyFormData } from "@/components/auth/CompanyForm";
import RegistrationSummary from "@/components/auth/RegistrationSummary";
import {
  validateEmail,
  validateFullName,
  validatePassword,
  validatePhoneNumber,
} from "@/lib/validation";

type RegistrationStep = 1 | 2 | 3 | 4;
type UserRole = "CANDIDATE" | "HR" | "HR_MANAGER";

export default function Register() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const status = useAppSelector(selectAuthStatus);
  const error = useAppSelector(selectAuthError);
  const message = useAppSelector(selectAuthMessage);
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const registeredUserId = useAppSelector(selectUserId);

  // Steps state
  const [step, setStep] = useState<RegistrationStep>(1);

  // Role state
  const [role, setRole] = useState<UserRole | null>(null);

  // Personal Info state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Company state (for HR/HR_MANAGER)
  const [companyName, setCompanyName] = useState<string>("");
  const [companyData, setCompanyData] = useState<CompanyFormData>({
    name: "",
    address: "",
  });

  // HR Profile state (for HR and HR_MANAGER)
  const [department, setDepartment] = useState<string>("");
  const [hrAddress, setHrAddress] = useState<string>("");
  const [hrManagerEmail, setHrManagerEmail] = useState<string>(""); // For HR staff only

  const [localError, setLocalError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const isLoading = status === "loading";

  // Redirect if already authenticated
  useEffect(() => {
    if (accessToken) {
      router.replace("/");
    }
  }, [accessToken, router]);

  // Redirect to OTP verification after successful registration
  useEffect(() => {
    // Check if we have a userId and a message indicating success
    // This is more robust than checking for specific text "verify OTP"
    if (registeredUserId && message) {
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
    }
  }, [registeredUserId, message, router, email]);

  // Clear errors on mount
  useEffect(() => {
    dispatch(clearAuthError());
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  const validateStep1 = () => {
    if (!role) {
      setLocalError("Please select a role to continue");
      return false;
    }
    setLocalError(null);
    return true;
  };

  const validateStep2 = () => {
    const errors: Record<string, string> = {};
    let isValid = true;

    if (!validateFullName(fullName)) {
      errors.fullName = "Full name must be between 3 and 255 characters";
      isValid = false;
    }
    if (!validateEmail(email)) {
      errors.email = "Invalid email format";
      isValid = false;
    }
    if (!validatePhoneNumber(phoneNumber)) {
      errors.phoneNumber = "Invalid phone number format";
      isValid = false;
    }
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      errors.password = `Password: ${passwordErrors.join(", ")}`;
      isValid = false;
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const validateStep3 = () => {
    const errors: Record<string, string> = {};
    let isValid = true;

    if (role === "HR") {
      // Validate HR profile fields
      if (!department || department.trim().length < 2) {
        errors.department = "Department is required";
        isValid = false;
      }
      if (!hrManagerEmail || !validateEmail(hrManagerEmail)) {
        errors.hrManagerEmail = "Valid HR Manager email is required";
        isValid = false;
      }
      if (!hrAddress || hrAddress.trim().length < 5) {
        errors.hrAddress = "Address is required";
        isValid = false;
      }
    } else if (role === "HR_MANAGER") {
      // Validate HR profile fields
      if (!department || department.trim().length < 2) {
        errors.department = "Department is required";
        isValid = false;
      }
      if (!hrAddress || hrAddress.trim().length < 5) {
        errors.hrAddress = "HR address is required";
        isValid = false;
      }
      // Validate company fields
      if (!companyData.name || companyData.name.length < 2) {
        errors.name = "Company name is required";
        isValid = false;
      }
      if (!companyData.address || companyData.address.length < 5) {
        errors.address = "Company address is required";
        isValid = false;
      }
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleNext = () => {
    let isValid = false;
    switch (step) {
      case 1:
        isValid = validateStep1();
        break;
      case 2:
        isValid = validateStep2();
        break;
      case 3:
        isValid = validateStep3();
        break;
      default:
        isValid = true;
    }

    if (isValid) {
      // Skip step 3 for CANDIDATE
      if (step === 2 && role === "CANDIDATE") {
        setStep(4);
      } else {
        setStep((prev) => (prev + 1) as RegistrationStep);
      }
      setLocalError(null);
    }
  };

  const handleBack = () => {
    if (step === 4 && role === "CANDIDATE") {
      setStep(2);
    } else {
      setStep((prev) => (prev - 1) as RegistrationStep);
    }
    setLocalError(null);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (step !== 4) return;

    setLocalError(null);

    // Build registration payload according to API spec
    const payload: any = {
      fullName,
      email,
      password,
      phoneNumber,
      role: role!,
    };

    // Add hrProfile for HR role
    if (role === "HR") {
      payload.hrProfile = {
        department,
        hrManagerEmail,
        address: hrAddress,
      };
    }

    // Add both hrProfile and company for HR_MANAGER role
    if (role === "HR_MANAGER") {
      payload.hrProfile = {
        department,
        address: hrAddress,
      };
      payload.company = {
        name: companyData.name,
        logoUrl: companyData.logoUrl,
        websiteUrl: companyData.websiteUrl,
        description: companyData.description,
        address: companyData.address,
        size: companyData.size,
      };
    }

    await dispatch(registerUser(payload));
  };

  const handleGoogleLogin = () => {
    console.log("Google login clicked");
  };

  const renderStep1 = () => (
    <div className="animate-fade-in">
      <h5 className="mb-20 text-center">Choose your role</h5>
      <RoleSelector
        value={role}
        onChange={(r) => {
          setRole(r);
          setLocalError(null);
        }}
        error={localError || undefined}
      />
    </div>
  );

  const renderStep2 = () => (
    <div className="animate-fade-in">
      <h5 className="mb-20 text-center">Personal Information</h5>
      <div className="row">
        <div className="col-12">
          <FormInput
            id="fullName"
            label="Full Name"
            value={fullName}
            onChange={setFullName}
            required
            placeholder="Steven Job"
            error={fieldErrors.fullName}
          />
        </div>
        <div className="col-12">
          <FormInput
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            required
            placeholder="stevenjob@gmail.com"
            autoComplete="email"
            error={fieldErrors.email}
          />
        </div>
        <div className="col-12">
          <FormInput
            id="phoneNumber"
            label="Phone Number"
            type="tel"
            value={phoneNumber}
            onChange={setPhoneNumber}
            required
            placeholder="+841234567890"
            helpText="Format: 10 digits or +84 followed by 9-10 digits."
            error={fieldErrors.phoneNumber}
          />
        </div>
        <div className="col-md-6">
          <PasswordInput
            id="password"
            label="Password"
            value={password}
            onChange={setPassword}
            required
            autoComplete="new-password"
            error={fieldErrors.password}
          />
        </div>
        <div className="col-md-6">
          <PasswordInput
            id="confirmPassword"
            label="Confirm Password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            required
            autoComplete="new-password"
            error={fieldErrors.confirmPassword}
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="animate-fade-in">
      {role === "HR" && (
        <>
          <h5 className="mb-20 text-center">Company & Profile Information</h5>

          <div className="mt-4">
            <FormInput
              id="department"
              label="Department"
              value={department}
              onChange={setDepartment}
              required
              placeholder="Engineering, Marketing, Sales, etc."
              error={fieldErrors.department}
            />
          </div>
          <div className="mt-3">
            <FormInput
              id="hrManagerEmail"
              label="HR Manager Email"
              type="email"
              value={hrManagerEmail}
              onChange={setHrManagerEmail}
              required
              placeholder="hrmanager@company.com"
              helpText="Enter your HR Manager's email for approval"
              error={fieldErrors.hrManagerEmail}
            />
          </div>
          <div className="mt-3">
            <div className="form-group">
              <label className="form-label" htmlFor="hrAddress">
                Your Work Address *
              </label>
              <textarea
                className={`form-control ${
                  fieldErrors.hrAddress ? "is-invalid" : ""
                }`}
                id="hrAddress"
                rows={3}
                value={hrAddress}
                onChange={(e) => setHrAddress(e.target.value)}
                placeholder="Your office location or work address"
                required
              />
              {fieldErrors.hrAddress && (
                <div className="invalid-feedback d-block">
                  {fieldErrors.hrAddress}
                </div>
              )}
            </div>
          </div>
        </>
      )}
      {role === "HR_MANAGER" && (
        <>
          <h5 className="mb-20 text-center">Company & Profile Information</h5>
          <CompanyForm
            value={companyData}
            onChange={setCompanyData}
            errors={
              fieldErrors as Partial<Record<keyof CompanyFormData, string>>
            }
          />
          <div className="mt-4">
            <h6 className="text-brand-1">Your Profile</h6>
            <FormInput
              id="department"
              label="Department"
              value={department}
              onChange={setDepartment}
              required
              placeholder="Engineering, Marketing, Sales, etc."
              error={fieldErrors.department}
            />
          </div>
          <div className="mt-3">
            <div className="form-group">
              <label className="form-label" htmlFor="hrAddress">
                Your Work Address *
              </label>
              <textarea
                className={`form-control ${
                  fieldErrors.hrAddress ? "is-invalid" : ""
                }`}
                id="hrAddress"
                rows={3}
                value={hrAddress}
                onChange={(e) => setHrAddress(e.target.value)}
                placeholder="Your office location or work address"
                required
              />
              {fieldErrors.hrAddress && (
                <div className="invalid-feedback d-block">
                  {fieldErrors.hrAddress}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderStep4 = () => (
    <div className="animate-fade-in">
      <h5 className="mb-20 text-center">Review & Submit</h5>
      <RegistrationSummary
        role={role!}
        personalInfo={{
          fullName,
          email,
          phoneNumber,
        }}
        companyName={
          role === "HR"
            ? companyName
            : role === "HR_MANAGER"
            ? companyData.name
            : undefined
        }
        // department can be added later
      />
    </div>
  );

  return (
    <AuthLayout
      title="Start for free Today"
      subtitle={`Register - Step ${step} of ${role === "CANDIDATE" ? 3 : 4}`}
      description="Access to all features. No credit card required."
      showSocialLogin={step === 1}
      imageVariant="3"
    >
      {step === 1 && (
        <>
          <SocialLogin
            provider="google"
            onClick={handleGoogleLogin}
            text="Sign up with Google"
          />
          <FormDivider text="Or continue with email" />
        </>
      )}

      <form className="login-register text-start mt-20" onSubmit={handleSubmit}>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}

        <FormError error={localError || error} />
        <FormSuccess message={message} />

        <div className="form-group mt-30">
          <div className="row">
            {step > 1 && (
              <div className="col-6">
                <button
                  type="button"
                  className="btn btn-default hover-up w-100"
                  onClick={handleBack}
                  disabled={isLoading}
                >
                  Back
                </button>
              </div>
            )}
            <div className={step > 1 ? "col-6" : "col-12"}>
              {step === 4 ? (
                <FormButton
                  type="submit"
                  loading={isLoading}
                  loadingText="Submitting..."
                  disabled={isLoading}
                >
                  Submit & Register
                </FormButton>
              ) : (
                <button
                  type="button"
                  className="btn btn-brand-1 hover-up w-100"
                  onClick={handleNext}
                >
                  Next Step
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="text-muted text-center mt-20">
          Already have an account?{" "}
          <Link href="/signin">
            <span>Sign in</span>
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
