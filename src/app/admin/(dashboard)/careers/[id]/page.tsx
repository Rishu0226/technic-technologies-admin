"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ApiClient } from "../../../../../lib/api";
import { Plus, Trash2, Save, ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import AIGenerator from "../../../../../../components/admin/ui/AIGenerator";

function StringListSection({
  title,
  items,
  onChange,
  onAdd,
  onRemove,
  placeholder,
}: {
  title: string;
  items: string[];
  onChange: (index: number, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  placeholder: string;
}) {
  return (
    <div className="bg-white border border-technic-border rounded-2xl shadow-tn-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-technic-text">{title}</h2>
        <button type="button" onClick={onAdd} className="text-technic-cyan-deep text-sm flex items-center">
          <Plus className="w-4 h-4 mr-1" /> Add
        </button>
      </div>
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="flex gap-2">
            <input value={item} onChange={(e) => onChange(idx, e.target.value)} className="tn-input flex-1" placeholder={placeholder} />
            <button type="button" onClick={() => onRemove(idx)} className="p-2 text-technic-error hover:bg-technic-error-soft rounded-lg"><Trash2 className="w-5 h-5" aria-hidden="true" /><span className="sr-only">Delete</span></button>
          </div>
        ))}
        {items.length === 0 && <p className="text-technic-muted italic text-sm">Nothing added yet. Generate with AI or add items manually.</p>}
      </div>
    </div>
  );
}

const COMMON_FIELDS = [
  { name: 'firstName', label: 'First Name', type: 'text', required: true, active: true },
  { name: 'lastName', label: 'Last Name', type: 'text', required: true, active: true },
  { name: 'email', label: 'Email Address', type: 'email', required: true, active: true },
  { name: 'phone', label: 'Phone Number', type: 'tel', required: true, active: true },
  { name: 'resume', label: 'Resume/CV (URL)', type: 'text', required: true, active: true },
  { name: 'coverLetter', label: 'Cover Letter', type: 'textarea', required: false, active: true },
  { name: 'portfolio', label: 'Portfolio URL', type: 'text', required: false, active: true },
  { name: 'linkedin', label: 'LinkedIn Profile', type: 'text', required: false, active: true },
  { name: 'experience', label: 'Experience Level', type: 'select', required: true, active: true },
];

export default function CareerFormPage() {
  const router = useRouter();
  const params = useParams();
  const isNew = params.id === "new";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    department: "",
    location: "",
    employmentType: "",
    experience: "",
    description: "",
    status: "Draft",
    salary: "",
    applicationEmail: "",
  });

  const [experienceOptions, setExperienceOptions] = useState<string[]>([]);
  const [responsibilities, setResponsibilities] = useState<string[]>([]);
  const [requirements, setRequirements] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [applicationFields, setApplicationFields] = useState<any[]>(isNew ? JSON.parse(JSON.stringify(COMMON_FIELDS)) : []);

  useEffect(() => {
    if (!isNew) {
      fetchCareer();
    }
  }, [isNew]);

  const fetchCareer = async () => {
    try {
      // Backend actually uses /api/careers/:slug for public fetch, 
      // but for admin edit we can use /api/careers or a specific admin get if it exists
      // Wait, let's just fetch all and find it since there's no /admin/careers/:id get endpoint currently.
      const response = await ApiClient.get<any[]>(`/api/careers`);
      const career = response.data.find((c: any) => c._id === params.id);
      if (career) {
        setFormData({
          title: career.title || "",
          slug: career.slug || "",
          department: career.department || "",
          location: career.location || "",
          employmentType: career.employmentType || "",
          experience: career.experience || "",
          description: career.description || "",
          status: career.status || "Draft",
          salary: career.salary || "",
          applicationEmail: career.applicationEmail || "",
        });
        setExperienceOptions(career.experienceOptions || []);
        setResponsibilities(career.responsibilities || []);
        setRequirements(career.requirements || []);
        setSkills(career.skills || []);
        
        const existingFields = career.applicationFields || [];
        // Merge existing with common fields to maintain standard set
        const mergedFields = COMMON_FIELDS.map(common => {
          const existing = existingFields.find((ef: any) => ef.name === common.name);
          return existing ? existing : { ...common, active: false };
        });
        
        // Add any custom fields that were created before (if any)
        existingFields.forEach((ef: any) => {
          if (!mergedFields.find(mf => mf.name === ef.name)) {
             mergedFields.push(ef);
          }
        });
        
        setApplicationFields(mergedFields);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load career data");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerateCareer = async (prompt: string) => {
    const response = await ApiClient.post('/api/admin/ai/generate-career', { prompt });
    const data = response.data?.data;
    
    if (data) {
      setFormData(prev => ({
        ...prev,
        title: data.title ?? prev.title,
        slug: data.slug ?? prev.slug,
        department: data.department ?? prev.department,
        location: data.location ?? prev.location,
        employmentType: data.employmentType ?? prev.employmentType,
        experience: data.experience ?? prev.experience,
        description: data.description ?? prev.description,
        salary: data.salary ?? prev.salary,
        applicationEmail: data.applicationEmail ?? prev.applicationEmail,
      }));

      if (Array.isArray(data.experienceOptions)) setExperienceOptions(data.experienceOptions);
      if (Array.isArray(data.responsibilities)) setResponsibilities(data.responsibilities);
      if (Array.isArray(data.requirements)) setRequirements(data.requirements);
      if (Array.isArray(data.skills)) setSkills(data.skills);
    }
  };

  const handleArrayChange = (setter: any, index: number, value: string, array: string[]) => {
    const newArray = [...array];
    newArray[index] = value;
    setter(newArray);
  };

  const addArrayItem = (setter: any, array: string[]) => {
    setter([...array, ""]);
  };

  const removeArrayItem = (setter: any, index: number, array: string[]) => {
    const newArray = array.filter((_, i) => i !== index);
    setter(newArray);
  };

  const addApplicationField = () => {
    setApplicationFields([...applicationFields, { name: "", label: "", type: "text", required: true, active: true }]);
  };

  const removeApplicationField = (index: number) => {
    const newFields = applicationFields.filter((_, i) => i !== index);
    setApplicationFields(newFields);
  };

  const updateApplicationField = (index: number, key: string, value: any) => {
    const newFields = [...applicationFields];
    newFields[index][key] = value;
    setApplicationFields(newFields);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      ...formData,
      experienceOptions: experienceOptions.filter(Boolean),
      responsibilities: responsibilities.filter(Boolean),
      requirements: requirements.filter(Boolean),
      skills: skills.filter(Boolean),
      applicationFields
    };

    try {
      if (isNew) {
        await ApiClient.post('/api/admin/careers', payload);
      } else {
        await ApiClient.put(`/api/admin/careers/${params.id}`, payload);
      }
      router.push('/admin/careers');
    } catch (err: any) {
      setError(err.response?.data?.error || "An error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-technic-text p-8">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex items-center mb-8">
        <Link href="/admin/careers" className="text-technic-muted hover:text-technic-cyan-deep mr-4 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-3xl font-bold text-technic-text font-heading">
          {isNew ? 'Create New Career' : 'Edit Career'}
        </h1>
      </div>

      <AIGenerator onGenerate={handleGenerateCareer} disabled={saving} replaceExisting={!isNew && Boolean(formData.title)} type="career" />

      {error && (
        <div className="bg-technic-error-soft border border-technic-error/20 text-technic-error p-4 rounded-xl mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-white border border-technic-border rounded-2xl shadow-tn-md p-6">
          <h2 className="text-xl font-bold text-technic-text mb-6">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="tn-label">Job Title *</label>
              <input name="title" value={formData.title} onChange={handleChange} required className="tn-input" />
            </div>
            <div>
              <label className="tn-label">Slug (URL friendly) *</label>
              <input name="slug" value={formData.slug} onChange={handleChange} required className="tn-input" />
            </div>
            <div>
              <label className="tn-label">Department *</label>
              <input name="department" value={formData.department} onChange={handleChange} required className="tn-input" />
            </div>
            <div>
              <label className="tn-label">Location *</label>
              <input name="location" value={formData.location} onChange={handleChange} required className="tn-input" />
            </div>
            <div>
              <label className="tn-label">Employment Type *</label>
              <input name="employmentType" value={formData.employmentType} onChange={handleChange} required className="tn-input" placeholder="e.g. Full-time" />
            </div>
            <div>
              <label className="tn-label">Experience Level (Display) *</label>
              <input name="experience" value={formData.experience} onChange={handleChange} required className="tn-input" placeholder="e.g. Mid-Level (3-5 Years)" />
            </div>
            <div>
              <label className="tn-label">Salary Range</label>
              <input name="salary" value={formData.salary} onChange={handleChange} className="tn-input" />
            </div>
            <div>
              <label className="tn-label">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="tn-input">
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="tn-label">Job Description *</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required rows={5} className="tn-input"></textarea>
            </div>
          </div>
        </div>

        {/* Dynamic Experience Options */}
        <div className="bg-white border border-technic-border rounded-2xl shadow-tn-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-technic-text">Application Experience Dropdown Options</h2>
            <button type="button" onClick={() => addArrayItem(setExperienceOptions, experienceOptions)} className="text-technic-cyan-deep text-sm flex items-center">
              <Plus className="w-4 h-4 mr-1" /> Add Option
            </button>
          </div>
          <p className="text-sm text-technic-muted mb-4">These options will populate the "Experience" select field on the frontend application form.</p>
          <div className="space-y-3">
            {experienceOptions.map((item, idx) => (
              <div key={idx} className="flex gap-2">
                <input value={item} onChange={(e) => handleArrayChange(setExperienceOptions, idx, e.target.value, experienceOptions)} className="tn-input flex-1" placeholder="e.g. 0-2 Years" />
                <button type="button" onClick={() => removeArrayItem(setExperienceOptions, idx, experienceOptions)} className="p-2 text-technic-error hover:bg-technic-error-soft rounded-lg"><Trash2 className="w-5 h-5" aria-hidden="true" /><span className="sr-only">Delete</span></button>
              </div>
            ))}
            {experienceOptions.length === 0 && <p className="text-technic-muted italic text-sm">No options added yet.</p>}
          </div>
        </div>

        <StringListSection
          title="Responsibilities"
          items={responsibilities}
          onChange={(index, value) => handleArrayChange(setResponsibilities, index, value, responsibilities)}
          onAdd={() => addArrayItem(setResponsibilities, responsibilities)}
          onRemove={(index) => removeArrayItem(setResponsibilities, index, responsibilities)}
          placeholder="e.g. Design and ship product features"
        />

        <StringListSection
          title="Requirements"
          items={requirements}
          onChange={(index, value) => handleArrayChange(setRequirements, index, value, requirements)}
          onAdd={() => addArrayItem(setRequirements, requirements)}
          onRemove={(index) => removeArrayItem(setRequirements, index, requirements)}
          placeholder="e.g. 3+ years with TypeScript"
        />

        <StringListSection
          title="Skills"
          items={skills}
          onChange={(index, value) => handleArrayChange(setSkills, index, value, skills)}
          onAdd={() => addArrayItem(setSkills, skills)}
          onRemove={(index) => removeArrayItem(setSkills, index, skills)}
          placeholder="e.g. React"
        />

        {/* Application Fields Builder */}
        <div className="bg-white border border-technic-border rounded-2xl shadow-tn-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-technic-text">Application Fields</h2>
            <button type="button" onClick={addApplicationField} className="text-technic-cyan-deep text-sm flex items-center">
              <Plus className="w-4 h-4 mr-1" /> Add Custom Field
            </button>
          </div>
          <p className="text-sm text-technic-muted mb-6">Choose which fields should be visible on the application form for this position, or add custom ones.</p>
          
          <div className="space-y-4">
            {applicationFields.map((field, idx) => {
              const isCommon = COMMON_FIELDS.some(c => c.name === field.name);
              return (
              <div key={idx} className={`flex flex-wrap gap-4 items-start p-4 rounded-xl border transition-all ${field.active !== false ? 'bg-technic-bg border-technic-border' : 'bg-technic-neutral-soft border-technic-border opacity-60'}`}>
                {!isCommon && (
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-xs text-technic-muted mb-1">Field ID *</label>
                    <input value={field.name} onChange={(e) => updateApplicationField(idx, 'name', e.target.value)} disabled={field.active === false} className="tn-input text-sm text-sm disabled:opacity-50" placeholder="e.g. githubUrl" />
                  </div>
                )}
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-xs text-technic-muted mb-1">Display Label</label>
                  <input value={field.label} onChange={(e) => updateApplicationField(idx, 'label', e.target.value)} disabled={field.active === false} className="tn-input text-sm text-sm disabled:opacity-50" />
                </div>
                <div className="w-32">
                  <label className="block text-xs text-technic-muted mb-1">Input Type</label>
                  <select value={field.type} onChange={(e) => updateApplicationField(idx, 'type', e.target.value)} disabled={field.active === false || isCommon} className="tn-input text-sm text-sm disabled:opacity-50">
                    <option value="text">Text</option>
                    <option value="email">Email</option>
                    <option value="tel">Phone</option>
                    <option value="textarea">Long Text</option>
                    <option value="select">Dropdown</option>
                    <option value="file">File Upload</option>
                  </select>
                </div>
                <div className="w-20 pt-6 flex justify-center">
                  <label className="flex items-center text-sm text-technic-secondary cursor-pointer">
                    <input type="checkbox" checked={field.required} onChange={(e) => updateApplicationField(idx, 'required', e.target.checked)} disabled={field.active === false} className="mr-2" />
                    Req
                  </label>
                </div>
                <div className="w-28 pt-5">
                  <button type="button" onClick={() => updateApplicationField(idx, 'active', field.active === false ? true : false)} className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center justify-center w-full transition-colors ${field.active !== false ? 'bg-technic-success-soft text-technic-success hover:opacity-90' : 'bg-technic-neutral-soft text-technic-muted hover:bg-technic-border'}`}>
                    {field.active !== false ? <><Eye className="w-4 h-4 mr-2" /> Show</> : <><EyeOff className="w-4 h-4 mr-2" /> Hide</>}
                  </button>
                </div>
                {!isCommon && (
                  <div className="pt-5 flex items-center">
                    <button type="button" onClick={() => removeApplicationField(idx)} className="p-2 text-technic-error hover:bg-technic-error-soft rounded-lg"><Trash2 className="w-5 h-5" aria-hidden="true" /><span className="sr-only">Delete</span></button>
                  </div>
                )}
              </div>
            )})}
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="bg-brand-gradient text-white px-8 py-3 rounded-xl font-bold flex items-center hover:shadow-tn-sm transition-all disabled:opacity-50">
            {saving ? 'Saving...' : <><Save className="w-5 h-5 mr-2" /> Save Career</>}
          </button>
        </div>
      </form>
    </div>
  );
}
