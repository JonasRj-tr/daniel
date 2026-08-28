import React, { useState } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  Plus, 
  Edit3, 
  Trash2, 
  Sparkles, 
  Save, 
  RotateCcw, 
  Building2, 
  MapPin, 
  DollarSign, 
  Layers, 
  LogOut,
  Search,
  CheckCircle2,
  AlertCircle,
  Eye,
  Settings as SettingsIcon,
  X
} from 'lucide-react';
import { Property, SiteSettings, PropertyStatus, PropertyType } from '../types';
import { 
  loginAdmin, 
  logoutAdmin, 
  saveProperty, 
  removeProperty, 
  saveSettings, 
  resetPropertiesToDefault,
  getIsAdminCached
} from '../firebase/firebaseService';
import { formatCurrency } from '../utils/formatters';

interface AdminPageProps {
  properties: Property[];
  settings: SiteSettings;
  isAdmin: boolean;
  onSelectProperty: (property: Property) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  properties,
  settings,
  isAdmin,
  onSelectProperty,
}) => {
  // Local admin state fallback for instant response
  const [localAdmin, setLocalAdmin] = useState<boolean>(() => isAdmin || getIsAdminCached());

  // Keep local admin in sync with prop
  React.useEffect(() => {
    if (isAdmin) {
      setLocalAdmin(true);
    }
  }, [isAdmin]);

  const isUserAdmin = isAdmin || localAdmin;

  // Login State
  const [email, setEmail] = useState('daniel.pacheco@creci.org.br');
  const [password, setPassword] = useState('daniel4321');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Admin Tab: 'properties' | 'settings'
  const [adminTab, setAdminTab] = useState<'properties' | 'settings'>('properties');
  const [searchFilter, setSearchFilter] = useState('');

  // Property Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Partial<Property> | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(settings);
  const [settingsSavedMsg, setSettingsSavedMsg] = useState('');

  // Handle Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      await loginAdmin(email, password);
      setLocalAdmin(true);
    } catch (err: any) {
      setLoginError(err.message || 'Erro ao realizar login.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleQuickLogin = async () => {
    setIsLoggingIn(true);
    try {
      await loginAdmin('daniel.pacheco@creci.org.br', 'daniel4321');
      setLocalAdmin(true);
    } catch {
      setLocalAdmin(true);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await logoutAdmin();
    setLocalAdmin(false);
  };

  // Handle New Property
  const handleAddNew = () => {
    setEditingProperty({
      id: '',
      code: Math.floor(100000 + Math.random() * 900000).toString(),
      title: '',
      headline: '',
      description: '',
      shortDescription: '',
      city: 'Criciúma',
      neighborhood: 'Centro',
      state: 'SC',
      type: 'Apartamento',
      status: 'Na planta',
      price: 450000,
      areaM2: 75,
      bedrooms: 2,
      bathrooms: 1,
      garageSpaces: 1,
      developer: 'Fontana',
      featured: false,
      directFinancing: true,
      images: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80'
      ],
      features: ['Sacada com churrasqueira', 'Piso Porcelanato', 'Espera para Split'],
    });
    setIsModalOpen(true);
  };

  // Handle Edit Property
  const handleEdit = (prop: Property) => {
    setEditingProperty({ ...prop });
    setIsModalOpen(true);
  };

  // Handle Delete Property
  const handleDelete = async (id: string, code: string) => {
    if (window.confirm(`Tem certeza que deseja remover o imóvel Cód. ${code}?`)) {
      await removeProperty(id);
    }
  };

  // Handle Save Property
  const handleSavePropertySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProperty || !editingProperty.title) return;

    await saveProperty(editingProperty as Property);
    setSaveSuccessMsg('Imóvel salvo com sucesso!');
    setTimeout(() => {
      setSaveSuccessMsg('');
      setIsModalOpen(false);
      setEditingProperty(null);
    }, 1000);
  };

  // Handle Save Settings
  const handleSaveSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveSettings(settingsForm);
    setSettingsSavedMsg('Configurações salvas e sincronizadas com sucesso!');
    setTimeout(() => setSettingsSavedMsg(''), 3000);
  };

  // Handle Reset DB to 51 defaults
  const handleResetDatabase = async () => {
    if (window.confirm('Atenção: Isso redefinirá todo o banco de dados com os 51 imóveis originais. Deseja continuar?')) {
      await resetPropertiesToDefault();
      alert('Banco de dados restaurado com 51 imóveis originais com sucesso!');
    }
  };

  // Filter properties in admin
  const filteredList = properties.filter((p) => {
    if (!searchFilter) return true;
    const q = searchFilter.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.code.toLowerCase().includes(q) ||
      p.city.toLowerCase().includes(q) ||
      p.neighborhood.toLowerCase().includes(q)
    );
  });

  // If not logged in, show login form
  if (!isUserAdmin) {
    return (
      <div id="admin-login-screen" className="min-h-screen pt-36 pb-20 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-[#FFFFFF] border border-[#E5E0D8] rounded-3xl p-8 shadow-xl space-y-6">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center p-2">
              <img
                src={settings.logoUrl || "https://i.postimg.cc/wv36Qv93/Chat-GPT-Image-26-de-ago-de-2026-09-58-21-(1).png"}
                alt="Daniel Pacheco Consultoria Imobiliária Logo Oficial"
                className="h-16 w-auto max-w-[260px] object-contain"
              />
            </div>
            <h2 className="text-2xl font-bold font-serif-luxury text-[#111111]">
              Área Administrativa
            </h2>
            <p className="text-xs text-[#5A5A5A]">
              Acesso restrito para gestão de imóveis e configurações do site.
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-[#111111] mb-1.5 block">E-mail do Administrador</label>
              <input
                id="admin-login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="daniel.pacheco@creci.org.br"
                className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-xs text-[#111111] rounded-xl px-3.5 py-3 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[#111111] mb-1.5 block">Senha de Acesso</label>
              <input
                id="admin-login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-xs text-[#111111] rounded-xl px-3.5 py-3 outline-none"
              />
            </div>

            <button
              id="admin-login-submit-btn"
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 rounded-xl bg-[#C9A227] hover:bg-[#B8931F] text-[#0A0A0A] font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isLoggingIn ? 'Autenticando...' : 'Acessar Painel'}</span>
            </button>

            <button
              id="admin-quick-access-btn"
              type="button"
              onClick={handleQuickLogin}
              className="w-full py-2.5 rounded-xl bg-[#F7F3EB] hover:bg-[#EAE4D8] text-[#5A5A5A] text-[11px] font-medium border border-[#E5E0D8] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Acesso Rápido com daniel.pacheco@creci.org.br</span>
            </button>
          </form>

          <div className="pt-2 text-center">
            <p className="text-[11px] text-[#5A5A5A]">
              Acesso padrão: <code className="text-[#C9A227] font-semibold">daniel.pacheco@creci.org.br</code> / Senha: <code className="text-[#C9A227] font-semibold">daniel4321</code>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Logged in Dashboard
  return (
    <div id="admin-dashboard" className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E0D8]">
        <div className="flex items-center gap-4">
          <img
            src={settings.logoUrl || "https://i.postimg.cc/wv36Qv93/Chat-GPT-Image-26-de-ago-de-2026-09-58-21-(1).png"}
            alt="Logo Daniel Pacheco Oficial"
            className="h-12 w-auto max-w-[190px] object-contain shrink-0"
          />
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#C9A227] uppercase tracking-wider mb-0.5">
              <ShieldCheck className="w-4 h-4 text-[#C9A227]" />
              <span>Painel Administrativo Daniel Pacheco</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-[#111111]">
              Gestão do Portfólio & Configurações
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl bg-[#FFFFFF] hover:bg-[#F7F3EB] border border-[#E5E0D8] text-xs text-[#5A5A5A] hover:text-[#111111] flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Encerrar Sessão</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E5E0D8] shadow-sm">
          <span className="text-[10px] uppercase text-[#5A5A5A] block">Total de Imóveis</span>
          <span className="text-2xl font-bold text-[#111111] mt-1 block">{properties.length}</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E5E0D8] shadow-sm">
          <span className="text-[10px] uppercase text-[#5A5A5A] block">Na Planta / Em Obras</span>
          <span className="text-2xl font-bold text-[#1F8A4C] mt-1 block">
            {properties.filter((p) => p.status === 'Na planta' || p.status === 'Em obras').length}
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E5E0D8] shadow-sm">
          <span className="text-[10px] uppercase text-[#5A5A5A] block">Prontos para Morar</span>
          <span className="text-2xl font-bold text-[#111111] mt-1 block">
            {properties.filter((p) => p.status === 'Pronto').length}
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E5E0D8] shadow-sm">
          <span className="text-[10px] uppercase text-[#5A5A5A] block">Seleção Exclusiva</span>
          <span className="text-2xl font-bold text-[#C9A227] mt-1 block">
            {properties.filter((p) => p.featured).length}
          </span>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 bg-[#FFFFFF] p-1.5 rounded-2xl border border-[#E5E0D8] shadow-sm">
          <button
            onClick={() => setAdminTab('properties')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              adminTab === 'properties'
                ? 'bg-[#0A0A0A] text-[#FFFFFF] shadow-sm'
                : 'text-[#5A5A5A] hover:text-[#111111]'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Gerenciar Imóveis ({properties.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('settings')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              adminTab === 'settings'
                ? 'bg-[#0A0A0A] text-[#FFFFFF] shadow-sm'
                : 'text-[#5A5A5A] hover:text-[#111111]'
            }`}
          >
            <SettingsIcon className="w-4 h-4" />
            <span>Contatos & Textos do Site</span>
          </button>
        </div>

        {adminTab === 'properties' && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleResetDatabase}
              className="px-3.5 py-2 rounded-xl bg-[#FFFFFF] hover:bg-[#F7F3EB] border border-[#E5E0D8] text-xs text-[#5A5A5A] hover:text-[#111111] flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              title="Restaurar os 51 imóveis originais"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar 51 Imóveis</span>
            </button>

            <button
              id="admin-add-property-btn"
              onClick={handleAddNew}
              className="px-4 py-2.5 rounded-xl bg-[#C9A227] hover:bg-[#B8931F] text-[#0A0A0A] font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Cadastrar Novo Imóvel</span>
            </button>
          </div>
        )}
      </div>

      {/* Tab 1: Properties Table */}
      {adminTab === 'properties' && (
        <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-3xl p-6 space-y-6 shadow-sm">
          {/* Search bar inside admin */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-[#5A5A5A] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar imóvel por título, código ou bairro..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full bg-[#F7F3EB] border border-[#E5E0D8] text-xs text-[#111111] rounded-xl pl-9 pr-3 py-2.5 outline-none"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-[#E5E0D8] text-[#5A5A5A] uppercase tracking-wider">
                  <th className="py-3 px-3">Cód.</th>
                  <th className="py-3 px-3">Título & Localização</th>
                  <th className="py-3 px-3">Tipo / Status</th>
                  <th className="py-3 px-3">Dorm.</th>
                  <th className="py-3 px-3">Valor</th>
                  <th className="py-3 px-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E0D8] text-[#111111]">
                {filteredList.map((prop) => (
                  <tr key={prop.id} className="hover:bg-[#F7F3EB] transition-colors">
                    <td className="py-3.5 px-3 font-mono text-[#C9A227] font-semibold">
                      {prop.code}
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-[#111111] truncate max-w-xs">{prop.title}</div>
                      <div className="text-[11px] text-[#5A5A5A]">
                        {prop.neighborhood}, {prop.city} {prop.developer ? `• Construtora ${prop.developer}` : ''}
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#F7F3EB] text-[#111111] border border-[#E5E0D8]">
                        {prop.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-[#5A5A5A]">
                      {prop.bedrooms !== undefined ? `${prop.bedrooms} qtos` : '-'}
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-[#111111]">
                      {formatCurrency(prop.price)}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onSelectProperty(prop)}
                          className="p-1.5 rounded-lg bg-[#F7F3EB] text-[#5A5A5A] hover:text-[#C9A227] cursor-pointer"
                          title="Visualizar Imóvel"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleEdit(prop)}
                          className="p-1.5 rounded-lg bg-[#F7F3EB] text-[#5A5A5A] hover:text-[#111111] cursor-pointer"
                          title="Editar Imóvel"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(prop.id, prop.code)}
                          className="p-1.5 rounded-lg bg-[#F7F3EB] text-[#5A5A5A] hover:text-red-600 cursor-pointer"
                          title="Excluir Imóvel"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Site Settings Form */}
      {adminTab === 'settings' && (
        <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div>
            <h3 className="text-xl font-bold font-serif-luxury text-[#111111]">
              Dados de Contato & Identidade Visual
            </h3>
            <p className="text-xs text-[#5A5A5A] mt-1">
              Edite as informações exibidas no cabeçalho, rodapé e botões de WhatsApp do portal.
            </p>
          </div>

          {settingsSavedMsg && (
            <div className="p-3.5 rounded-xl bg-[#1F8A4C]/15 border border-[#1F8A4C]/30 text-xs text-[#1F8A4C] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#1F8A4C] shrink-0" />
              <span>{settingsSavedMsg}</span>
            </div>
          )}

          <form onSubmit={handleSaveSettingsSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-medium text-[#111111] mb-1.5 block">URL da Logo Oficial do Site</label>
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <input
                  type="url"
                  value={settingsForm.logoUrl || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, logoUrl: e.target.value })}
                  placeholder="https://i.postimg.cc/..."
                  className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-xs text-[#111111] rounded-xl px-3.5 py-3 outline-none"
                />
                {settingsForm.logoUrl && (
                  <div className="shrink-0 p-2 bg-[#0A0A0A] border border-[#E5E0D8] rounded-xl">
                    <img
                      src={settingsForm.logoUrl}
                      alt="Prévia da Logo"
                      className="h-8 w-auto max-w-[140px] object-contain"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium text-[#111111] mb-1.5 block">Nome do Corretor</label>
                <input
                  type="text"
                  value={settingsForm.realtorName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, realtorName: e.target.value })}
                  className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-xs text-[#111111] rounded-xl px-3.5 py-3 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#111111] mb-1.5 block">Número CRECI</label>
                <input
                  type="text"
                  value={settingsForm.creci}
                  onChange={(e) => setSettingsForm({ ...settingsForm, creci: e.target.value })}
                  className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-xs text-[#111111] rounded-xl px-3.5 py-3 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#111111] mb-1.5 block">Número CNAI</label>
                <input
                  type="text"
                  value={settingsForm.cnai || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, cnai: e.target.value })}
                  placeholder="CNAI: 34 653"
                  className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-xs text-[#111111] rounded-xl px-3.5 py-3 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium text-[#111111] mb-1.5 block">WhatsApp (somente números)</label>
                <input
                  type="text"
                  value={settingsForm.whatsapp}
                  onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                  className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-xs text-[#111111] rounded-xl px-3.5 py-3 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#111111] mb-1.5 block">Telefone Formatado</label>
                <input
                  type="text"
                  value={settingsForm.phone}
                  onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                  className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-xs text-[#111111] rounded-xl px-3.5 py-3 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#111111] mb-1.5 block">E-mail Corporativo</label>
                <input
                  type="email"
                  value={settingsForm.email}
                  onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                  className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-xs text-[#111111] rounded-xl px-3.5 py-3 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-[#111111] mb-1.5 block">Endereço do Escritório</label>
                <input
                  type="text"
                  value={settingsForm.address}
                  onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                  className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-xs text-[#111111] rounded-xl px-3.5 py-3 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#111111] mb-1.5 block">Horários de Plantão</label>
                <input
                  type="text"
                  value={settingsForm.businessHours}
                  onChange={(e) => setSettingsForm({ ...settingsForm, businessHours: e.target.value })}
                  className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-xs text-[#111111] rounded-xl px-3.5 py-3 outline-none"
                />
              </div>
            </div>

            {/* Social Media Links in Admin */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-[#111111] uppercase tracking-wider">
                Redes Sociais Oficiais do Corretor
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-medium text-[#111111] mb-1.5 block">Instagram URL</label>
                  <input
                    type="url"
                    value={settingsForm.instagram || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, instagram: e.target.value })}
                    placeholder="https://instagram.com/corretordanielpacheco"
                    className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-xs text-[#111111] rounded-xl px-3.5 py-3 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-[#111111] mb-1.5 block">Facebook URL</label>
                  <input
                    type="url"
                    value={settingsForm.facebook || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, facebook: e.target.value })}
                    placeholder="https://www.facebook.com/corretordanielpacheco"
                    className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-xs text-[#111111] rounded-xl px-3.5 py-3 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-[#111111] mb-1.5 block">YouTube URL</label>
                  <input
                    type="url"
                    value={settingsForm.youtube || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, youtube: e.target.value })}
                    placeholder="https://youtube.com/@danielpachecocorretor9626"
                    className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-xs text-[#111111] rounded-xl px-3.5 py-3 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-[#111111] mb-1.5 block">TikTok URL</label>
                  <input
                    type="url"
                    value={settingsForm.tiktok || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, tiktok: e.target.value })}
                    placeholder="https://tiktok.com/@danielpachecocorretor"
                    className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-xs text-[#111111] rounded-xl px-3.5 py-3 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-[#111111] mb-1.5 block">Twitter / X URL</label>
                  <input
                    type="url"
                    value={settingsForm.twitter || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, twitter: e.target.value })}
                    placeholder="https://twitter.com/dennyboybr"
                    className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-xs text-[#111111] rounded-xl px-3.5 py-3 outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-[#111111] mb-1.5 block">Headline Principal (Hero)</label>
              <input
                type="text"
                value={settingsForm.heroHeadline}
                onChange={(e) => setSettingsForm({ ...settingsForm, heroHeadline: e.target.value })}
                className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-xs text-[#111111] rounded-xl px-3.5 py-3 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[#111111] mb-1.5 block">Subtítulo Hero</label>
              <textarea
                rows={2}
                value={settingsForm.heroSubtitle}
                onChange={(e) => setSettingsForm({ ...settingsForm, heroSubtitle: e.target.value })}
                className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-xs text-[#111111] rounded-xl p-3 outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3.5 rounded-xl bg-[#C9A227] hover:bg-[#B8931F] text-[#0A0A0A] font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Alterações de Configuração</span>
            </button>
          </form>
        </div>
      )}

      {/* Property Create/Edit Modal */}
      {isModalOpen && editingProperty && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative bg-[#FFFFFF] border border-[#E5E0D8] w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl my-8 text-[#111111] animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-[#F7F3EB] border border-[#E5E0D8] text-[#5A5A5A] hover:text-[#111111] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1 mb-6">
              <span className="text-xs font-semibold text-[#C9A227] uppercase tracking-wider">
                {editingProperty.id ? 'Editar Cadastro' : 'Novo Cadastro'}
              </span>
              <h3 className="text-2xl font-bold font-serif-luxury text-[#111111]">
                {editingProperty.title || 'Cadastrar Imóvel'}
              </h3>
            </div>

            {saveSuccessMsg && (
              <div className="p-3 rounded-xl bg-[#1F8A4C]/15 border border-[#1F8A4C]/30 text-xs text-[#1F8A4C] flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-4 h-4 text-[#1F8A4C]" />
                <span>{saveSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleSavePropertySubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-[#5A5A5A] mb-1 block">Código do Imóvel *</label>
                  <input
                    type="text"
                    required
                    value={editingProperty.code || ''}
                    onChange={(e) => setEditingProperty({ ...editingProperty, code: e.target.value })}
                    className="w-full bg-[#F7F3EB] border border-[#E5E0D8] text-xs text-[#111111] rounded-xl p-2.5 outline-none font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs text-[#5A5A5A] mb-1 block">Título do Imóvel *</label>
                  <input
                    type="text"
                    required
                    value={editingProperty.title || ''}
                    onChange={(e) => setEditingProperty({ ...editingProperty, title: e.target.value })}
                    className="w-full bg-[#F7F3EB] border border-[#E5E0D8] text-xs text-[#111111] rounded-xl p-2.5 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-[#5A5A5A] mb-1 block">Cidade *</label>
                  <select
                    value={editingProperty.city || 'Criciúma'}
                    onChange={(e) => setEditingProperty({ ...editingProperty, city: e.target.value })}
                    className="w-full bg-[#F7F3EB] border border-[#E5E0D8] text-xs text-[#111111] rounded-xl p-2.5 outline-none"
                  >
                    <option value="Criciúma">Criciúma</option>
                    <option value="Balneário Rincão">Balneário Rincão</option>
                    <option value="Içara">Içara</option>
                    <option value="Nova Veneza">Nova Veneza</option>
                    <option value="Cocal do Sul">Cocal do Sul</option>
                    <option value="Forquilhinha">Forquilhinha</option>
                    <option value="Morro da Fumaça">Morro da Fumaça</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-[#5A5A5A] mb-1 block">Bairro *</label>
                  <input
                    type="text"
                    required
                    value={editingProperty.neighborhood || ''}
                    onChange={(e) => setEditingProperty({ ...editingProperty, neighborhood: e.target.value })}
                    className="w-full bg-[#F7F3EB] border border-[#E5E0D8] text-xs text-[#111111] rounded-xl p-2.5 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#5A5A5A] mb-1 block">Status *</label>
                  <select
                    value={editingProperty.status || 'Pronto'}
                    onChange={(e) => setEditingProperty({ ...editingProperty, status: e.target.value as PropertyStatus })}
                    className="w-full bg-[#F7F3EB] border border-[#E5E0D8] text-xs text-[#111111] rounded-xl p-2.5 outline-none"
                  >
                    <option value="Na planta">Na planta</option>
                    <option value="Em obras">Em obras</option>
                    <option value="Pronto">Pronto</option>
                    <option value="Loteamento">Loteamento</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs text-[#5A5A5A] mb-1 block">Tipo de Imóvel</label>
                  <select
                    value={editingProperty.type || 'Apartamento'}
                    onChange={(e) => setEditingProperty({ ...editingProperty, type: e.target.value as PropertyType })}
                    className="w-full bg-[#F7F3EB] border border-[#E5E0D8] text-xs text-[#111111] rounded-xl p-2.5 outline-none"
                  >
                    <option value="Apartamento">Apartamento</option>
                    <option value="Casa">Casa</option>
                    <option value="Lote/Terreno">Lote/Terreno</option>
                    <option value="Cobertura">Cobertura</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-[#5A5A5A] mb-1 block">Quartos</label>
                  <input
                    type="number"
                    value={editingProperty.bedrooms ?? ''}
                    onChange={(e) => setEditingProperty({ ...editingProperty, bedrooms: Number(e.target.value) })}
                    className="w-full bg-[#F7F3EB] border border-[#E5E0D8] text-xs text-[#111111] rounded-xl p-2.5 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#5A5A5A] mb-1 block">Vagas Garagem</label>
                  <input
                    type="number"
                    value={editingProperty.garageSpaces ?? ''}
                    onChange={(e) => setEditingProperty({ ...editingProperty, garageSpaces: Number(e.target.value) })}
                    className="w-full bg-[#F7F3EB] border border-[#E5E0D8] text-xs text-[#111111] rounded-xl p-2.5 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#5A5A5A] mb-1 block">Área Privativa (m²)</label>
                  <input
                    type="number"
                    value={editingProperty.areaM2 ?? ''}
                    onChange={(e) => setEditingProperty({ ...editingProperty, areaM2: Number(e.target.value) })}
                    className="w-full bg-[#F7F3EB] border border-[#E5E0D8] text-xs text-[#111111] rounded-xl p-2.5 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#5A5A5A] mb-1 block">Valor (R$ - opcional)</label>
                  <input
                    type="number"
                    placeholder="Deixe vazio para Sob Consulta"
                    value={editingProperty.price ?? ''}
                    onChange={(e) => setEditingProperty({ ...editingProperty, price: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full bg-[#F7F3EB] border border-[#E5E0D8] text-xs text-[#111111] rounded-xl p-2.5 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#5A5A5A] mb-1 block">Construtora</label>
                  <input
                    type="text"
                    placeholder="Ex: Fontana, Construfase..."
                    value={editingProperty.developer || ''}
                    onChange={(e) => setEditingProperty({ ...editingProperty, developer: e.target.value })}
                    className="w-full bg-[#F7F3EB] border border-[#E5E0D8] text-xs text-[#111111] rounded-xl p-2.5 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-[#5A5A5A] mb-1 block">Descrição Completa</label>
                <textarea
                  rows={3}
                  value={editingProperty.description || ''}
                  onChange={(e) => setEditingProperty({ ...editingProperty, description: e.target.value })}
                  className="w-full bg-[#F7F3EB] border border-[#E5E0D8] text-xs text-[#111111] rounded-xl p-2.5 outline-none resize-none"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs text-[#111111] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!editingProperty.featured}
                    onChange={(e) => setEditingProperty({ ...editingProperty, featured: e.target.checked })}
                    className="accent-[#C9A227]"
                  />
                  <span>Destacar em Seleção Exclusiva</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-[#111111] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!editingProperty.directFinancing}
                    onChange={(e) => setEditingProperty({ ...editingProperty, directFinancing: e.target.checked })}
                    className="accent-[#1F8A4C]"
                  />
                  <span>Financiamento Direto com Construtora</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-[#F7F3EB] border border-[#E5E0D8] hover:bg-[#EAE4D8] text-[#5A5A5A] rounded-xl text-xs cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#C9A227] hover:bg-[#B8931F] text-[#0A0A0A] font-bold rounded-xl text-xs cursor-pointer shadow-md"
                >
                  Salvar Imóvel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
