import React, { useState } from 'react';
import { SiteConfig } from '../../types';
import { Edit, Trash2, Plus, ArrowLeft, Check, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import TemplateDemoPreview from './TemplateDemoPreview';

interface TemplateItem {
  id: number;
  title: string;
  type: string;
  demoUrl: string;
  position: number;
  status: 'Active' | 'Inactive';
}

interface TemplateManagerTableProps {
  config: SiteConfig;
  onSaveConfig: (updatedConfig: Partial<SiteConfig>) => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

const TEMPLATE_DEMOS: Record<string, { name: string; url: string; previewComponent?: string }> = {
  'Hero style three': {
    name: 'Hero style three',
    url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
  },
  'Benefit': {
    name: 'Benefit',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
  },
  'Explore categories': {
    name: 'Explore categories',
    url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
  },
  'Product gallery six': {
    name: 'Product gallery six',
    url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80',
  },
  'Banner style four': {
    name: 'Banner style four',
    url: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=600&q=80',
  },
  'Header style 1': {
    name: 'Header style 1 (PiPO BaZaR Emerald Search)',
    url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80',
  },
  'Header style 2': {
    name: 'Header style 2 (RRR BAZAR Capsule Search)',
    url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
  },
  'Header style 3': {
    name: 'Header style 3 (TOPUPBUZZ Wallet Pill)',
    url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
  },
  'Header style 4': {
    name: 'Header style 4 (UC GHOR Green Login)',
    url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80',
  },
  'Header style 5': {
    name: 'Header style 5 (RR TOPUP Dropdowns & Icons)',
    url: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=600&q=80',
  },
  'Header style 6': {
    name: 'Header style 6 (BEST TOPUP Diamond Style)',
    url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80',
  },
  'Footer style 1': {
    name: 'Footer style 1',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
  },
  'Footer style 2': {
    name: 'Footer style 2',
    url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
  },
  'Footer style 3': {
    name: 'Footer style 3',
    url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
  },
  'Footer style 4': {
    name: 'Footer style 4',
    url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80',
  },
  'Product gallery seven': {
    name: 'Product gallery seven',
    url: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=600&q=80',
  },
  'Product gallery eight': {
    name: 'Product gallery eight',
    url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80',
  },
  'Explore brands': {
    name: 'Explore brands',
    url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
  },
};

export default function TemplateManagerTable({ config, onSaveConfig, showToast }: TemplateManagerTableProps) {
  const getHeaderStyleName = (style?: string) => {
    if (style === 'style-2' || style === 'Header style 2' || style === 'cyberpunk') return 'Header style 2';
    if (style === 'style-3' || style === 'Header style 3' || style === 'esports') return 'Header style 3';
    if (style === 'style-4' || style === 'Header style 4' || style === 'minimal') return 'Header style 4';
    if (style === 'style-5' || style === 'Header style 5') return 'Header style 5';
    if (style === 'style-6' || style === 'Header style 6') return 'Header style 6';
    return 'Header style 1';
  };

  const getFooterStyleName = (style?: string) => {
    if (style === 'style-2' || style === 'cyberpunk') return 'Footer style 2';
    if (style === 'style-3' || style === 'esports') return 'Footer style 3';
    if (style === 'style-4' || style === 'minimal') return 'Footer style 4';
    return 'Footer style 1';
  };

  const [items, setItems] = useState<TemplateItem[]>([
    {
      id: 1,
      title: 'Hero Style Three',
      type: 'Hero style three',
      demoUrl: TEMPLATE_DEMOS['Hero style three'].url,
      position: 0,
      status: 'Active',
    },
    {
      id: 2,
      title: 'Benefit Section',
      type: 'Benefit',
      demoUrl: TEMPLATE_DEMOS['Benefit'].url,
      position: 1,
      status: 'Active',
    },
    {
      id: 3,
      title: 'Explore Categories',
      type: 'Explore categories',
      demoUrl: TEMPLATE_DEMOS['Explore categories'].url,
      position: 2,
      status: 'Active',
    },
    {
      id: 4,
      title: 'Product Gallery Six',
      type: 'Product gallery six',
      demoUrl: TEMPLATE_DEMOS['Product gallery six'].url,
      position: 3,
      status: 'Active',
    },
    {
      id: 5,
      title: 'Banner Style Four',
      type: 'Banner style four',
      demoUrl: TEMPLATE_DEMOS['Banner style four'].url,
      position: 4,
      status: 'Active',
    },
    {
      id: 6,
      title: 'Main Header Navigation',
      type: getHeaderStyleName(config.activeHeaderTemplate),
      demoUrl: TEMPLATE_DEMOS[getHeaderStyleName(config.activeHeaderTemplate)]?.url || TEMPLATE_DEMOS['Header style 1'].url,
      position: 5,
      status: 'Active',
    },
    {
      id: 7,
      title: 'Footer Section',
      type: getFooterStyleName(config.activeFooterTemplate),
      demoUrl: TEMPLATE_DEMOS[getFooterStyleName(config.activeFooterTemplate)]?.url || TEMPLATE_DEMOS['Footer style 1'].url,
      position: 6,
      status: 'Active',
    },
    {
      id: 8,
      title: "Men's Fashion",
      type: 'Product gallery six',
      demoUrl: TEMPLATE_DEMOS['Product gallery six'].url,
      position: 7,
      status: 'Active',
    },
    {
      id: 9,
      title: "Women's Fashion",
      type: 'Product gallery six',
      demoUrl: TEMPLATE_DEMOS['Product gallery six'].url,
      position: 8,
      status: 'Active',
    },
    {
      id: 10,
      title: 'Explore Brands',
      type: 'Explore brands',
      demoUrl: TEMPLATE_DEMOS['Explore brands'].url,
      position: 9,
      status: 'Active',
    },
  ]);

  const [editingItem, setEditingItem] = useState<TemplateItem | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // Form states for editing
  const [formType, setFormType] = useState<string>('');
  const [formTitle, setFormTitle] = useState<string>('');
  const [formPosition, setFormPosition] = useState<number>(0);
  const [formStatus, setFormStatus] = useState<'Active' | 'Inactive'>('Active');

  const startEdit = (item: TemplateItem) => {
    setEditingItem(item);
    setFormType(item.type);
    setFormTitle(item.title);
    setFormPosition(item.position);
    setFormStatus(item.status);
  };

  const handleCreateNew = () => {
    const newItem: TemplateItem = {
      id: items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1,
      title: 'New Template Section',
      type: 'Hero style three',
      demoUrl: TEMPLATE_DEMOS['Hero style three'].url,
      position: items.length,
      status: 'Active',
    };
    startEdit(newItem);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this template item?')) {
      setItems(items.filter((i) => i.id !== id));
      showToast('Template item deleted!', 'success');
    }
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const demoObj = TEMPLATE_DEMOS[formType] || TEMPLATE_DEMOS['Hero style three'];
    const updatedItem: TemplateItem = {
      ...editingItem,
      type: formType,
      title: formTitle,
      position: Number(formPosition),
      status: formStatus,
      demoUrl: demoObj.url,
    };

    const exists = items.some((i) => i.id === editingItem.id);
    let newItemsList: TemplateItem[];
    if (exists) {
      newItemsList = items.map((i) => (i.id === editingItem.id ? updatedItem : i));
    } else {
      newItemsList = [...items, updatedItem];
    }

    setItems(newItemsList);

    // Sync site config if Header or Footer or Card layout changed
    if (formType.startsWith('Header style')) {
      let headerVal: string = 'style-1';
      if (formType === 'Header style 2') headerVal = 'style-2';
      if (formType === 'Header style 3') headerVal = 'style-3';
      if (formType === 'Header style 4') headerVal = 'style-4';
      if (formType === 'Header style 5') headerVal = 'style-5';
      if (formType === 'Header style 6') headerVal = 'style-6';
      onSaveConfig({ activeHeaderTemplate: headerVal as any });
    } else if (formType.startsWith('Footer style')) {
      let footerVal: 'style-1' | 'style-2' | 'style-3' | 'style-4' = 'style-1';
      if (formType === 'Footer style 2') footerVal = 'style-2';
      if (formType === 'Footer style 3') footerVal = 'style-3';
      if (formType === 'Footer style 4') footerVal = 'style-4';
      onSaveConfig({ activeFooterTemplate: footerVal });
    }

    showToast('Template layout updated successfully!', 'success');
    setEditingItem(null);
  };

  // Pagination logic
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const displayedItems = items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="w-full bg-slate-50/50 p-4 md:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6 text-slate-800 animate-fadeIn">
      
      {/* EDIT FORM VIEW (Matching Image 2) */}
      {editingItem ? (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                title="Back to Table"
              >
                <ArrowLeft size={18} />
              </button>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  {items.some((i) => i.id === editingItem.id) ? 'Edit Template Section' : 'Create New Template Section'}
                </h3>
                <p className="text-xs text-slate-500">Configure template type, title, position order and active status</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setEditingItem(null)}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSaveForm} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Inputs (Image 2 exact design) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Type * */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer shadow-xs"
                    required
                  >
                    <optgroup label="Header Designs (Admin Selection)">
                      <option value="Header style 1">Header style 1 (PiPO BaZaR Emerald Search)</option>
                      <option value="Header style 2">Header style 2 (RRR BAZAR Capsule Search)</option>
                      <option value="Header style 3">Header style 3 (TOPUPBUZZ Wallet Pill)</option>
                      <option value="Header style 4">Header style 4 (UC GHOR Green Login)</option>
                      <option value="Header style 5">Header style 5 (RR TOPUP Dropdowns & Icons)</option>
                      <option value="Header style 6">Header style 6 (BEST TOPUP Diamond Style)</option>
                    </optgroup>

                    <optgroup label="Footer Designs (Admin Selection)">
                      <option value="Footer style 1">Footer style 1 (Standard Modern)</option>
                      <option value="Footer style 2">Footer style 2 (Cyber Terminal)</option>
                      <option value="Footer style 3">Footer style 3 (Esports Dark)</option>
                      <option value="Footer style 4">Footer style 4 (Minimal Pill)</option>
                    </optgroup>

                    <optgroup label="Page Content Sections">
                      <option value="Hero style three">Hero style three</option>
                      <option value="Benefit">Benefit</option>
                      <option value="Explore categories">Explore categories</option>
                      <option value="Product gallery six">Product gallery six</option>
                      <option value="Product gallery seven">Product gallery seven</option>
                      <option value="Product gallery eight">Product gallery eight</option>
                      <option value="Banner style four">Banner style four</option>
                      <option value="Explore brands">Explore brands</option>
                    </optgroup>
                  </select>
                </div>

                {/* Title * */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Enter section title"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-xs"
                    required
                  />
                </div>

                {/* Position */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Position</label>
                  <input
                    type="number"
                    value={formPosition}
                    onChange={(e) => setFormPosition(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-xs"
                  />
                </div>

                {/* Status * */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Status <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as 'Active' | 'Inactive')}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer shadow-xs"
                    required
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

              </div>

              <div className="pt-4 flex items-center gap-3 border-t border-slate-100">
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-md shadow-emerald-600/20 cursor-pointer flex items-center gap-2"
                >
                  <Check size={16} /> Save Template
                </button>
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* Right Demo Preview Card (Image 2 exact preview box) */}
            <div className="lg:col-span-5 space-y-2">
              <label className="block text-xs font-bold text-slate-700">Demo Preview</label>
              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 p-2.5 shadow-xs group">
                <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80">
                  <TemplateDemoPreview type={formType} className="w-full h-full" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent flex items-end p-3 pointer-events-none">
                    <span className="text-[10px] font-extrabold text-white uppercase tracking-wider bg-slate-900/80 px-2.5 py-1 rounded-md backdrop-blur-xs">
                      {formType}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </form>
        </div>
      ) : (
        /* TABLE LIST VIEW (Matching Image 1) */
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          
          {/* Header Bar */}
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Template Sections List</h3>
              <p className="text-xs text-slate-500 font-medium">Manage home page layout sections, titles, order and template styles</p>
            </div>
            
            <button
              onClick={handleCreateNew}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto"
            >
              <Plus size={16} /> Add Section
            </button>
          </div>

          {/* Clean White Table (Image 1 Exact Layout) */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/60 text-[12px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-3.5 px-6 w-16">Id</th>
                  <th className="py-3.5 px-6">Title</th>
                  <th className="py-3.5 px-6">Type</th>
                  <th className="py-3.5 px-6 w-32">Demo</th>
                  <th className="py-3.5 px-6 w-24">Position</th>
                  <th className="py-3.5 px-6 w-28">Status</th>
                  <th className="py-3.5 px-6 w-28 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {displayedItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Id */}
                    <td className="py-3.5 px-6 font-semibold text-slate-500">{item.id}</td>

                    {/* Title */}
                    <td className="py-3.5 px-6 font-bold text-slate-900">{item.title}</td>

                    {/* Type */}
                    <td className="py-3.5 px-6 font-medium text-slate-600">{item.type}</td>

                    {/* Demo Thumbnail */}
                    <td className="py-3.5 px-6">
                      <div className="w-24 h-12 rounded-lg border border-slate-200 overflow-hidden bg-slate-100 shadow-2xs hover:scale-105 transition-transform duration-200 cursor-pointer" onClick={() => startEdit(item)}>
                        <TemplateDemoPreview type={item.type} className="w-full h-full" />
                      </div>
                    </td>

                    {/* Position */}
                    <td className="py-3.5 px-6 font-bold text-slate-700">{item.position}</td>

                    {/* Status Pill Badge */}
                    <td className="py-3.5 px-6">
                      {item.status === 'Active' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-600 border border-emerald-200/80">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-slate-100 text-slate-500 border border-slate-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                          Inactive
                        </span>
                      )}
                    </td>

                    {/* Action Buttons (Image 1 Edit & Delete) */}
                    <td className="py-3.5 px-6">
                      <div className="flex items-center justify-center gap-2">
                        {/* Edit Button (Green) */}
                        <button
                          onClick={() => startEdit(item)}
                          className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 transition-colors cursor-pointer"
                          title="Edit Template"
                        >
                          <Edit size={15} />
                        </button>

                        {/* Delete Button (Red) */}
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-500 border border-rose-200 transition-colors cursor-pointer"
                          title="Delete Template"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer Bar (Image 1 Pagination) */}
          <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-semibold">
            <div>
              Showing {items.length ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
              {Math.min(currentPage * itemsPerPage, items.length)} of {items.length} results
            </div>

            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                <button
                  key={pg}
                  onClick={() => setCurrentPage(pg)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    currentPage === pg
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {pg}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
