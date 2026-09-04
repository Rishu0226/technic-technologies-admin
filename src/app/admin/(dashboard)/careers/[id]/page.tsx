"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ApiClient } from "../../../../../lib/api";
import { Plus, Trash2, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

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
  const [applicationFields, setApplicationFields] = useState<any[]>([]);

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
        setApplicationFields(career.applicationFields || []);
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
    setApplicationFields([...applicationFields, { name: "", label: "", type: "text", required: true }]);
  };

  const updateApplicationField = (index: number, key: string, value: any) => {
    const newFields = [...applicationFields];
    newFields[index][key] = value;
    setApplicationFields(newFields);
  };

  const removeApplicationField = (index: number) => {
    const newFields = applicationFields.filter((_, i) => i !== index);
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

  if (loading) return <div className="text-white p-8">Loading...</div>;

  return (
    <div className="max-w-4xl pb-20">
      <div className="flex items-center mb-8">
        <Link href="/admin/careers" className="text-slate-400 hover:text-white mr-4 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-3xl font-bold text-white font-heading">
          {isNew ? 'Create New Career' : 'Edit Career'}
        </h1>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-xl mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-[#131C31] border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-slate-300 mb-2">Job Title *</label>
              <input name="title" value={formData.title} onChange={handleChange} required className="w-full bg-[#0B1221] border border-white/10 rounded-lg px-4 py-2 text-white" />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-2">Slug (URL friendly) *</label>
              <input name="slug" value={formData.slug} onChange={handleChange} required className="w-full bg-[#0B1221] border border-white/10 rounded-lg px-4 py-2 text-white" />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-2">Department *</label>
              <input name="department" value={formData.department} onChange={handleChange} required className="w-full bg-[#0B1221] border border-white/10 rounded-lg px-4 py-2 text-white" />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-2">Location *</label>
              <input name="location" value={formData.location} onChange={handleChange} required className="w-full bg-[#0B1221] border border-white/10 rounded-lg px-4 py-2 text-white" />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-2">Employment Type *</label>
              <input name="employmentType" value={formData.employmentType} onChange={handleChange} required className="w-full bg-[#0B1221] border border-white/10 rounded-lg px-4 py-2 text-white" placeholder="e.g. Full-time" />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-2">Experience Level (Display) *</label>
              <input name="experience" value={formData.experience} onChange={handleChange} required className="w-full bg-[#0B1221] border border-white/10 rounded-lg px-4 py-2 text-white" placeholder="e.g. Mid-Level (3-5 Years)" />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-2">Salary Range</label>
              <input name="salary" value={formData.salary} onChange={handleChange} className="w-full bg-[#0B1221] border border-white/10 rounded-lg px-4 py-2 text-white" />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-2">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-[#0B1221] border border-white/10 rounded-lg px-4 py-2 text-white">
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-slate-300 mb-2">Job Description *</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required rows={5} className="w-full bg-[#0B1221] border border-white/10 rounded-lg px-4 py-2 text-white"></textarea>
            </div>
          </div>
        </div>

        {/* Dynamic Experience Options */}
        <div className="bg-[#131C31] border border-white/10 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Application Experience Dropdown Options</h2>
            <button type="button" onClick={() => addArrayItem(setExperienceOptions, experienceOptions)} className="text-orange-400 text-sm flex items-center">
              <Plus className="w-4 h-4 mr-1" /> Add Option
            </button>
          </div>
          <p className="text-sm text-slate-400 mb-4">These options will populate the "Experience" select field on the frontend application form.</p>
          <div className="space-y-3">
            {experienceOptions.map((item, idx) => (
              <div key={idx} className="flex gap-2">
                <input value={item} onChange={(e) => handleArrayChange(setExperienceOptions, idx, e.target.value, experienceOptions)} className="flex-1 bg-[#0B1221] border border-white/10 rounded-lg px-4 py-2 text-white" placeholder="e.g. 0-2 Years" />
                <button type="button" onClick={() => removeArrayItem(setExperienceOptions, idx, experienceOptions)} className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg"><Trash2 className="w-5 h-5" /></button>
              </div>
            ))}
            {experienceOptions.length === 0 && <p className="text-slate-500 italic text-sm">No options added yet.</p>}
          </div>
        </div>

        {/* Dynamic Application Fields Builder */}
        <div className="bg-[#131C31] border border-white/10 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Dynamic Application Fields</h2>
            <button type="button" onClick={addApplicationField} className="text-orange-400 text-sm flex items-center">
              <Plus className="w-4 h-4 mr-1" /> Add Field
            </button>
          </div>
          <p className="text-sm text-slate-400 mb-6">Define exactly what fields the applicant must fill out. The form on the frontend will generate itself automatically.</p>
          
          <div className="space-y-4">
            {applicationFields.map((field, idx) => (
              <div key={idx} className="flex flex-wrap gap-4 items-start bg-white/5 p-4 rounded-xl border border-white/5">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-xs text-slate-400 mb-1">Field Name (ID) *</label>
                  <input value={field.name} onChange={(e) => updateApplicationField(idx, 'name', e.target.value)} placeholder="e.g. portfolioUrl" className="w-full bg-[#0B1221] border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
                </div>
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-xs text-slate-400 mb-1">Display Label *</label>
                  <input value={field.label} onChange={(e) => updateApplicationField(idx, 'label', e.target.value)} placeholder="e.g. Portfolio URL" className="w-full bg-[#0B1221] border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
                </div>
                <div className="w-32">
                  <label className="block text-xs text-slate-400 mb-1">Input Type</label>
                  <select value={field.type} onChange={(e) => updateApplicationField(idx, 'type', e.target.value)} className="w-full bg-[#0B1221] border border-white/10 rounded-lg px-3 py-2 text-white text-sm">
                    <option value="text">Text</option>
                    <option value="email">Email</option>
                    <option value="tel">Phone</option>
                    <option value="textarea">Long Text</option>
                    <option value="select">Dropdown (Experience)</option>
                    <option value="file">File Upload</option>
                  </select>
                </div>
                <div className="w-24 pt-6 flex justify-center">
                  <label className="flex items-center text-sm text-slate-300 cursor-pointer">
                    <input type="checkbox" checked={field.required} onChange={(e) => updateApplicationField(idx, 'required', e.target.checked)} className="mr-2" />
                    Req
                  </label>
                </div>
                <div className="pt-5">
                  <button type="button" onClick={() => removeApplicationField(idx)} className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
            {applicationFields.length === 0 && <p className="text-slate-500 italic text-sm">No custom fields defined. Basic form will be empty unless configured.</p>}
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="bg-gradient-to-r from-orange-600 to-rose-600 text-white px-8 py-3 rounded-xl font-bold flex items-center hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all disabled:opacity-50">
            {saving ? 'Saving...' : <><Save className="w-5 h-5 mr-2" /> Save Career</>}
          </button>
        </div>
      </form>
    </div>
  );
}
