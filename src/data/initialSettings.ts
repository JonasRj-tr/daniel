import { SiteSettings } from '../types';

export const DEFAULT_SETTINGS: SiteSettings = {
  realtorName: 'Daniel Pacheco',
  creci: 'CRECI: 38 813',
  cnai: 'CNAI: 34 653',
  logoUrl: 'https://i.postimg.cc/wv36Qv93/Chat-GPT-Image-26-de-ago-de-2026-09-58-21-(1).png',
  phone: '(48) 99800-1744',
  whatsapp: '5548998001744',
  email: 'daniel.pacheco@creci.org.br',
  instagram: 'https://instagram.com/corretordanielpacheco',
  facebook: 'https://www.facebook.com/corretordanielpacheco',
  twitter: 'https://twitter.com/dennyboybr',
  youtube: 'https://youtube.com/@danielpachecocorretor9626',
  tiktok: 'https://tiktok.com/@danielpachecocorretor',
  address: 'Rua Marcelo Lodetti 55 Condominio Ed. Florença - Criciúma - SC, 88801-510',
  businessHours: 'Segunda a Sexta: 08:00 às 18:00 | Sábado e Domingo: Fechado (Atendimento somente sob agendamento)',
  heroHeadline: 'Encontre o lugar certo.',
  heroSubtitle: 'Empreendimentos oficiais e imóveis prontos, selecionados para diferentes momentos de compra no Sul de Santa Catarina.',
  aboutTitle: 'Consultoria Imobiliária com olhar técnico e foco em valorização',
  aboutText: 'Com sólida atuação no mercado do Sul de Santa Catarina, a assessoria do corretor Daniel Pacheco é pautada pela transparência, análise minuciosa de oportunidades na planta e facilidade no financiamento direto com as melhores construtoras da região.',
  signatureSubtitle: 'Imóveis para morar e investir com os mais altos padrões de acabamento, localização e retorno.',
};

export interface CityGuide {
  id: string;
  name: string;
  tagline: string;
  description: string;
  highlights: string[];
  image: string;
  averageGrowth: string;
}

export const CITIES_DATA: CityGuide[] = [
  {
    id: 'criciuma',
    name: 'Criciúma',
    tagline: 'O polo econômico e cultural do Sul Catarinense',
    description: 'Capital do carvão e da cerâmica, Criciúma se destaca por sua infraestrutura médica de ponta, polos universitários (UNESC, Esucri), parques urbanos premiados (Parque das Nações, Parque dos Imigrantes, Parque Prefeito Altair Guidi) e forte valorização imobiliária nos bairros Centro, Cruzeiro do Sul, Comerciário, Santa Bárbara e São Luiz.',
    highlights: ['Centro Financeiro e Médico', '3 Grandes Parques Urbanos', 'Alta Liquidez para Locação', 'Shoppings e Gastronomia'],
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=2560&q=95',
    averageGrowth: '+14% a.a.',
  },
  {
    id: 'balneario-rincao',
    name: 'Balneário Rincão',
    tagline: 'O litoral mais vibrante e valorizado da região',
    description: 'Balneário Rincão é o refúgio à beira-mar de Criciúma e região, com calçadão beira-mar moderno, lagoas paradisíacas (Lagoa dos Esteves) e alta procura por apartamentos de alto padrão na Zona Norte e Centro durante todo o ano.',
    highlights: ['Orla Marítima Revitalizada', 'Lagoa dos Esteves e Esportes Náuticos', 'Alta Valorização de Veraneio', 'Apenas 20 min de Criciúma'],
    image: 'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=2560&q=95',
    averageGrowth: '+18% a.a.',
  },
  {
    id: 'icara',
    name: 'Içara',
    tagline: 'Conexão estratégica, expansão industrial e loteamentos',
    description: 'Vizinha imediata de Criciúma e rota de acesso ao litoral, Içara é o município que mais atrai novos loteamentos residenciais planejados e empreendimentos com financiamento direto facilitado.',
    highlights: ['Loteamentos com parcelamento direto', 'Hub Logístico e SC-445', 'Qualidade de Vida e Espaço', 'Proximidade ao Rincão'],
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2560&q=95',
    averageGrowth: '+12% a.a.',
  },
  {
    id: 'nova-veneza',
    name: 'Nova Veneza',
    tagline: 'Capital Nacional da Gastronomia Típica Italiana',
    description: 'Com atmosfera europeia única, gôndola oficial de Veneza e eventos consagrados como a Festa da Gastronomia, Nova Veneza atrai quem busca casas e terrenos com alto valor arquitetônico, sossego e charme turístico.',
    highlights: ['Gastronomia Italiana Reconhecida', 'Turismo e Arquitetura', 'Bairro Caravaggio em Alta', 'Sossego e Ar Puro'],
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=2560&q=95',
    averageGrowth: '+15% a.a.',
  },
  {
    id: 'cocal-do-sul',
    name: 'Cocal do Sul',
    tagline: 'Tradição industrial, cerâmica e tranquilidade familiar',
    description: 'Conhecida pela força industrial da cerâmica Eliane e qualidade de vida, Cocal do Sul oferece excelente equilíbrio entre custo-benefício e proximidade dos grandes centros.',
    highlights: ['Polo Cerâmico de Renome', 'Ambiente Familiar e Seguro', 'Apartamentos Acessíveis na Linha Tigre'],
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2560&q=95',
    averageGrowth: '+11% a.a.',
  },
  {
    id: 'forquilhinha',
    name: 'Forquilhinha',
    tagline: 'Herança germânica, parques e desenvolvimento contínuo',
    description: 'Com forte cultura germânica, praças floridas e cervejarias artesanais, Forquilhinha é uma cidade charmosa com apartamentos centrais de excelente metragem.',
    highlights: ['Cultura Germânica e Gastronomia', 'Centro Organizado', 'Imóveis com 2 Vagas de Garagem'],
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2560&q=95',
    averageGrowth: '+10% a.a.',
  },
  {
    id: 'morro-da-fumaca',
    name: 'Morro da Fumaça',
    tagline: 'Localização estratégica no eixo da BR-101',
    description: 'Polo cerâmico e comercial em expansão com acesso imediato à BR-101, oferecendo casas residenciais com pátios generosos e custos atrativos.',
    highlights: ['Acesso Imediato à BR-101', 'Casas com Quintal', 'Custo-benefício Imbatível'],
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=2560&q=95',
    averageGrowth: '+9% a.a.',
  },
];

export interface FAQItem {
  question: string;
  answer: string;
}

export const FAQ_LIST: FAQItem[] = [
  {
    question: 'Como funciona o Financiamento Direto com a Construtora?',
    answer: 'No financiamento direto, você negocia diretamente com a construtora sem a burocracia bancária tradicional. As condições gerais envolvem entrada facilitada (10% a 20%), parcelas mensais durante a obra e reforços semestrais/anuais (balões), corrigidos pelo CUB/SC até a entrega das chaves e INPC/IPCA + juros após a entrega.',
  },
  {
    question: 'Por que investir em apartamentos na planta no Sul de SC?',
    answer: 'Comprar na planta oferece valorização patrimonial média entre 20% e 40% durante o período de obras, possibilidade de personalização da planta, fluxo de pagamento escalonado e garantia de imóvel 100% novo com as mais modernas tecnologias construtivas.',
  },
  {
    question: 'Qual a diferença entre a assessoria de um corretor curador e uma imobiliária tradicional?',
    answer: 'Daniel Pacheco atua com seleção criteriosa e atendimento consultivo direto. Em vez de apresentar centenas de opções genéricas, filtramos apenas os empreendimentos oficiais com real potencial de valorização, histórico sólido da construtora e alinhamento com seu perfil financeiro.',
  },
  {
    question: 'Quais cidades da região possuem maior potencial de valorização?',
    answer: 'Criciúma (bairros Centro, Santa Bárbara e Cruzeiro do Sul) oferece máxima liquidez e infraestrutura urbana; Balneário Rincão lidera a valorização de veraneio e estilo de vida beira-mar; Nova Veneza atrai pelo apelo gastronômico e Içara se destaca na expansão de loteamentos.',
  },
  {
    question: 'Como agendar uma visita guiada aos decorados ou imóveis prontos?',
    answer: 'Você pode solicitar o agendamento através do nosso botão de WhatsApp ou preenchendo o formulário de consultoria. Atendemos com horário exclusivo, inclusive aos finais de semana e feriados para clientes que vêm de outras cidades.',
  },
];
