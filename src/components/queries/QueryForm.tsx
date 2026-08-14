import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { Query, QueryCategory, QueryPriority } from '../../types';
import { Upload, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

interface QueryFormProps {
  preselectedSupplierId?: string;
  onSuccess: (query: Query) => void;
  onCancel?: () => void;
}

export default function QueryForm({ preselectedSupplierId, onSuccess, onCancel }: QueryFormProps) {
  const { suppliers, addQuery } = useApp();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    supplierId: preselectedSupplierId || '',
    category: '' as QueryCategory | '',
    subject: '',
    description: '',
    priority: 'Medium' as QueryPriority,
    dueDate: '',
  });

  const categories: QueryCategory[] = [
    'Allergen Information', 
    'Certification', 
    'Ingredient Safety', 
    'Documentation', 
    'Contamination', 
    'Product Compliance'
  ];

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.supplierId) newErrors.supplierId = 'Supplier is required';
    if (!formData.category) newErrors.category = 'Query type is required';
    if (!formData.subject || formData.subject.length < 5) newErrors.subject = 'Subject must be at least 5 characters';
    if (!formData.description || formData.description.length < 20) newErrors.description = 'Description must be at least 20 characters';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const setPriority = (priority: QueryPriority) => {
    setFormData(prev => ({ ...prev, priority }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    
    // Simulate network delay
    setTimeout(() => {
      const newQuery = addQuery({
        supplierId: formData.supplierId,
        subject: formData.subject,
        description: formData.description,
        queryType: formData.category as QueryCategory,
        priority: formData.priority,
        dueDate: formData.dueDate || undefined,
      });
      setIsSubmitting(false);
      if (newQuery) {
        onSuccess(newQuery);
      }
    }, 1500);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-8 rounded-2xl glass-card border border-border-medium bg-charcoal-light/50 relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-soft via-emerald to-emerald-soft"></div>
      
      <div className="mb-8">
        <h2 className="text-display-md text-white font-display mb-2">Raise a new query</h2>
        <p className="text-body-lg text-gray-400">Ask your supplier for the information you need to keep every product safe and compliant.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Supplier & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative group">
            <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Supplier *</label>
            <div className="relative">
              <select
                name="supplierId"
                value={formData.supplierId}
                onChange={handleChange}
                className={`w-full bg-charcoal-deep/80 border ${errors.supplierId ? 'border-red-high' : 'border-border-medium'} rounded-lg px-4 py-3 text-off-white outline-none focus:border-emerald focus:ring-1 focus:ring-emerald transition-all appearance-none cursor-pointer`}
                aria-invalid={!!errors.supplierId}
              >
                <option value="" disabled>Select a supplier</option>
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            {errors.supplierId && <p className="text-red-high text-xs mt-1.5 flex items-center"><AlertCircle size={12} className="mr-1"/> {errors.supplierId}</p>}
          </div>

          <div className="relative group">
            <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Query Type *</label>
            <div className="relative">
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full bg-charcoal-deep/80 border ${errors.category ? 'border-red-high' : 'border-border-medium'} rounded-lg px-4 py-3 text-off-white outline-none focus:border-emerald focus:ring-1 focus:ring-emerald transition-all appearance-none cursor-pointer`}
                aria-invalid={!!errors.category}
              >
                <option value="" disabled>Select query type</option>
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            {errors.category && <p className="text-red-high text-xs mt-1.5 flex items-center"><AlertCircle size={12} className="mr-1"/> {errors.category}</p>}
          </div>
        </div>

        {/* Subject */}
        <div className="relative group">
          <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Subject *</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="E.g. Missing allergen declaration for Batch 4A"
            className={`w-full bg-charcoal-deep/80 border ${errors.subject ? 'border-red-high' : 'border-border-medium'} rounded-lg px-4 py-3 text-off-white outline-none focus:border-emerald focus:ring-1 focus:ring-emerald transition-all placeholder:text-gray-600`}
            aria-invalid={!!errors.subject}
          />
          {errors.subject && <p className="text-red-high text-xs mt-1.5 flex items-center"><AlertCircle size={12} className="mr-1"/> {errors.subject}</p>}
        </div>

        {/* Description */}
        <div className="relative group">
          <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Provide specific details about your query..."
            className={`w-full bg-charcoal-deep/80 border ${errors.description ? 'border-red-high' : 'border-border-medium'} rounded-lg px-4 py-3 text-off-white outline-none focus:border-emerald focus:ring-1 focus:ring-emerald transition-all resize-none placeholder:text-gray-600`}
            aria-invalid={!!errors.description}
          />
          {errors.description && <p className="text-red-high text-xs mt-1.5 flex items-center"><AlertCircle size={12} className="mr-1"/> {errors.description}</p>}
        </div>

        {/* Priority & Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Priority</label>
            <div className="flex bg-charcoal-deep/80 border border-border-medium rounded-lg p-1">
              {(['Low', 'Medium', 'High'] as QueryPriority[]).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setPriority(level)}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                    formData.priority === level 
                      ? 'bg-charcoal-light text-white shadow-sm border border-border-medium' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Response Due Date (Optional)</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full bg-charcoal-deep/80 border border-border-medium rounded-lg px-4 py-3 text-off-white outline-none focus:border-emerald focus:ring-1 focus:ring-emerald transition-all"
              style={{ colorScheme: 'dark' }}
            />
          </div>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Attachments</label>
          <div className="border-2 border-dashed border-border-medium hover:border-emerald/50 bg-charcoal-deep/40 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors group">
            <div className="h-12 w-12 rounded-full bg-charcoal-light flex items-center justify-center mb-3 group-hover:bg-emerald/10 transition-colors">
              <Upload className="text-gray-400 group-hover:text-emerald transition-colors" size={24} />
            </div>
            <p className="text-sm text-gray-300 font-medium mb-1">Drop supporting documents here</p>
            <p className="text-xs text-gray-500">PDF, JPG, PNG up to 10MB</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4 pt-4 border-t border-border-medium">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 text-sm font-medium text-gray-300 hover:text-white transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center px-6 py-3 bg-emerald hover:bg-emerald-soft text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-emerald/20 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin mr-2" />
                Submitting...
              </>
            ) : (
              <>
                Submit Query
                <ArrowRight size={18} className="ml-2" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
