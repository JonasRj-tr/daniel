import React from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  Calculator, 
  TrendingUp, 
  Sparkles, 
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import { SiteSettings } from '../types';
import { createWhatsAppUrl } from '../utils/formatters';

interface ComoEscolherPageProps {
  settings: SiteSettings;
  onOpenCuratedModal: () => void;
}

export const ComoEscolherPage: React.FC<ComoEscolherPageProps> = ({
  settings,
  onOpenCuratedModal,
}) => {
  const whatsappUrl = createWhatsAppUrl(
    settings.whatsapp || '5548998001744',
    'Olá Daniel! Li o guia "Como Escolher" no seu site e gostaria de tirar algumas dúvidas sobre financiamento direto.'
  );

  return (
    <div id="como-escolher-page" className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181818] border border-[#C9A86C]/40 text-xs text-[#C9A86C]">
          <BookOpen className="w-3.5 h-3.5 text-[#C9A86C]" />
          <span>Guia do Comprador & Investidor Inteligente</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-serif-luxury text-[#F8F5F0]">
          Como Escolher o Imóvel Perfeito
        </h1>
        <p className="text-xs sm:text-sm text-[#A0A0A0] leading-relaxed">
          Tudo o que você precisa saber sobre financiamento direto com construtoras, segurança jurídica, rentabilidade na planta e escolha de bairros no Sul de SC.
        </p>
      </div>

      {/* Comparative Table: Direto com Construtora vs Bancário */}
      <div className="bg-[#121212] border border-[#262626] rounded-3xl p-6 sm:p-10 space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#C9A86C]">
            Comparativo Técnico
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-[#F8F5F0]">
            Financiamento Direto vs Financiamento Bancário
          </h2>
          <p className="text-xs text-[#888]">
            Entenda as diferenças práticas de aprovação, custos e flexibilidade.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-[#2B2B2B] text-[#888] uppercase tracking-wider">
                <th className="py-3 px-4">Critério</th>
                <th className="py-3 px-4 text-emerald-400 bg-emerald-950/20 rounded-t-xl">
                  Financiamento Direto com Construtora
                </th>
                <th className="py-3 px-4 text-[#A0A0A0]">Financiamento Bancário Tradicional</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F1F1F] text-[#D0D0D0]">
              <tr>
                <td className="py-4 px-4 font-semibold text-white">Burocracia & Análise</td>
                <td className="py-4 px-4 bg-emerald-950/10 text-emerald-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Aprovação rápida e simplificada diretamente com a incorporadora</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-[#999]">
                  Exigência de farta documentação, comprovação de renda rígida e score bancário
                </td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-semibold text-white">Flexibilidade de Pagamento</td>
                <td className="py-4 px-4 bg-emerald-950/10 text-emerald-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Entrada adaptada, balões anuais, chaves e possibilidade de permuta</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-[#999]">
                  Tabelas pré-fixadas (SAC ou Price), parcelas fixas sem adaptação sazonal
                </td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-semibold text-white">Custos Cartorários Iniciais</td>
                <td className="py-4 px-4 bg-emerald-950/10 text-emerald-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Contrato particular registrado, ITBI e escritura somente na entrega/quitação</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-[#999]">
                  ITBI, taxa de avaliação bancária e custos de registro cobrados logo no início
                </td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-semibold text-white">Correção Monetária</td>
                <td className="py-4 px-4 bg-emerald-950/10 text-emerald-300">
                  <span>CUB/SC durante a obra; INPC / IPCA + juros brandos após entrega</span>
                </td>
                <td className="py-4 px-4 text-[#999]">
                  TR + Taxas de juros de 10% a 12% ao ano desde o primeiro mês
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4 Pillars of Legal Security */}
      <div className="space-y-6">
        <div className="text-left space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#C9A86C]">
            Tranquilidade Patrimonial
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-[#F8F5F0]">
            Os 4 Pilares da Segurança Jurídica
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-[#121212] border border-[#222] space-y-3">
            <span className="font-serif-luxury text-3xl font-bold text-[#C9A86C]">01</span>
            <h3 className="text-base font-bold text-white">Registro de Incorporação (R.I.)</h3>
            <p className="text-xs text-[#888] leading-relaxed">
              Garantia de que o projeto foi aprovado pela prefeitura e registrado no Cartório de Registro de Imóveis da comarca.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#121212] border border-[#222] space-y-3">
            <span className="font-serif-luxury text-3xl font-bold text-[#C9A86C]">02</span>
            <h3 className="text-base font-bold text-white">Patrimônio de Afetação</h3>
            <p className="text-xs text-[#888] leading-relaxed">
              Blindagem financeira que garante que os recursos pagos pelos compradores sejam usados exclusivamente na própria obra.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#121212] border border-[#222] space-y-3">
            <span className="font-serif-luxury text-3xl font-bold text-[#C9A86C]">03</span>
            <h3 className="text-base font-bold text-white">Memorial Descritivo</h3>
            <p className="text-xs text-[#888] leading-relaxed">
              Documento legal que detalha todas as marcas e especificações dos revestimentos, esquadrias e áreas comuns.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#121212] border border-[#222] space-y-3">
            <span className="font-serif-luxury text-3xl font-bold text-[#C9A86C]">04</span>
            <h3 className="text-base font-bold text-white">Habite-se & CND</h3>
            <p className="text-xs text-[#888] leading-relaxed">
              Certificado de conclusão da obra e certidões negativas de débitos que autorizam a entrega oficial das chaves.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#1A1A1A] to-[#111] border border-[#C9A86C]/40 text-center space-y-5">
        <h3 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-[#F8F5F0]">
          Deseja uma simulação de compra personalizada?
        </h3>
        <p className="text-xs sm:text-sm text-[#A0A0A0] max-w-xl mx-auto">
          Daniel Pacheco analisa sua capacidade de desembolso e indica exatamente os empreendimentos mais vantajosos para sua meta.
        </p>
        <div className="pt-2 flex justify-center gap-4 flex-wrap">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 bg-[#25D366] text-[#0A0A0A] font-bold text-xs rounded-xl hover:bg-[#20bd5a] transition-all"
          >
            Tirar Dúvidas com Daniel no WhatsApp
          </a>
          <button
            onClick={onOpenCuratedModal}
            className="px-6 py-3.5 bg-[#C9A86C] text-[#0A0A0A] font-bold text-xs rounded-xl hover:bg-[#B89748] transition-all"
          >
            Preencher Consultoria VIP
          </button>
        </div>
      </div>
    </div>
  );
};
