import type { AgentTaskLog, InvoiceData, WhatsAppConversation, InventoryItem, Appointment } from './types';

export const STORE_PROFILE = {
  name: "Malabar Spices & General Provisions",
  nameMl: "മലബാർ സ്പൈസസ് & ജനറൽ പ്രൊവിഷൻസ്",
  owner: "Suresh Kumar",
  ownerMl: "സുരേഷ് കുമാർ",
  location: "G.T. Road, Thrissur, Kerala - 680001",
  gstin: "32ABCPB9876C1Z1",
  phone: "+91 94471 23456",
  monthlyRevenue: 384500,
  cashInHand: 42800,
  pendingInvoices: 3,
  whatsappQueriesToday: 48,
  tasksAutoCompleted: 94.2
};

export const MOCK_VOICE_PRESETS = [
  {
    id: 'voice-1',
    title: 'Add Fresh Stock (Tomato)',
    titleMl: 'പുതിയ തക്കാളി സ്റ്റോക്കിൽ ചേർക്കുക',
    malayalamAudioText: 'രാവിലെ വന്ന തക്കാളി 15 കിലോ കൂടി സ്റ്റോക്കിൽ ചേർക്കൂ, വില കിലോയ്ക്ക് 40 രൂപ.',
    englishTranslation: 'Add 15 kg of morning tomato to inventory at ₹40 per kg.',
    duration: '0:04',
    category: 'Inventory Update',
    confidence: 96.8
  },
  {
    id: 'voice-2',
    title: 'Confirm Appointment for Client',
    titleMl: 'അപ്പോയിന്റ്മെന്റ് സ്ഥിരീകരിക്കുക',
    malayalamAudioText: 'നാളെ ഉച്ചയ്ക്ക് 2 മണിക്ക് സുരേഷിന്റെ അപ്പോയിന്റ്മെന്റ് സ്ഥിരീകരിച്ച് WhatsApp അയക്കൂ.',
    englishTranslation: 'Confirm Suresh appointment tomorrow at 2 PM and send confirmation over WhatsApp.',
    duration: '0:05',
    category: 'Appointment & CRM',
    confidence: 98.2
  },
  {
    id: 'voice-3',
    title: 'Send Invoice to Customer',
    titleMl: 'കൈലാസ് പ്രൊവിഷൻസിന് ബിൽ അയക്കുക',
    malayalamAudioText: 'കൈലാസ് പ്രൊവിഷൻസിന് ഇന്നത്തെ ₹38,055 രൂപയുടെ ടാക്സ് ഇൻവോയ്സ് WhatsApp-ൽ ഉടൻ അയക്കൂ.',
    englishTranslation: 'Send today tax invoice of ₹38,055 to Kailas Provisions via WhatsApp immediately.',
    duration: '0:06',
    category: 'WhatsApp & Billing',
    confidence: 99.1
  },
  {
    id: 'voice-4',
    title: 'Check Cardamom Stock & Price',
    titleMl: 'ഏലക്കായുടെ സ്റ്റോക്ക് പരിശോധിക്കുക',
    malayalamAudioText: 'ഗ്രീൻ ഏലക്കായുടെ കയ്യിലുള്ള സ്റ്റോക്കും വിൽക്കുന്ന വിലയും ഒന്ന് പരിശോധിക്കൂ.',
    englishTranslation: 'Check available stock and selling price for Green Cardamom.',
    duration: '0:04',
    category: 'Inventory Query',
    confidence: 95.4
  },
  {
    id: 'voice-5',
    title: 'Send Payment Reminder',
    titleMl: 'പഴയ ബാക്കി തുക ഓർമ്മിപ്പിക്കുക',
    malayalamAudioText: 'രാഘവന്റെ പഴയ ബാക്കി തുക ₹1,250 ഓർമ്മിപ്പിച്ച് മാന്യമായി മലയാളത്തിൽ ഒരു മെസ്സേജ് അയക്കൂ.',
    englishTranslation: 'Send a polite Malayalam payment reminder to Raghavan for pending ₹1,250 balance.',
    duration: '0:05',
    category: 'WhatsApp CRM',
    confidence: 97.5
  }
];

export const INITIAL_AGENT_LOGS: AgentTaskLog[] = [
  {
    id: 'task-101',
    inputPrompt: 'Add 15 kg of tomato to stock at ₹40/kg',
    inputPromptMl: 'രാവിലെ വന്ന തക്കാളി 15 കിലോ കൂടി സ്റ്റോക്കിൽ ചേർക്കൂ, വില കിലോയ്ക്ക് 40 രൂപ.',
    inputType: 'voice',
    language: 'ml',
    toolUsed: 'db_write',
    status: 'SUCCESS',
    confidence: 96.8,
    executionTimeMs: 380,
    timestamp: '10:42 AM Today',
    outputSummary: 'Updated Tomato stock: +15 kg (Total in hand: 45 kg), Selling Price set to ₹40/kg. Store records saved.',
    outputSummaryMl: 'തക്കാളി സ്റ്റോക്ക് പുതുക്കി: +15 kg (ആകെ: 45 kg), വിൽപന വില ₹40/kg. സ്റ്റോക്കിൽ വിജയകരമായി ചേർത്തു.',
    steps: [
      {
        step: 'generate',
        title: 'Voice Understanding',
        titleMl: 'ശബ്ദം തിരിച്ചറിയൽ',
        description: 'Recognized natural Malayalam voice command: Add 15 kg of morning tomato at ₹40/kg with 96.8% accuracy.',
        status: 'completed',
        timestamp: '10:42:01 AM',
        confidence: 96.8,
        durationMs: 168
      },
      {
        step: 'execute',
        title: 'Inventory Action',
        titleMl: 'സ്റ്റോക്ക് അപ്ഡേറ്റ്',
        description: 'Updated store records: Country Tomato stock increased from 30 kg to 45 kg. Selling rate set to ₹40/kg.',
        status: 'completed',
        timestamp: '10:42:02 AM',
        durationMs: 78
      },
      {
        step: 'critique',
        title: 'Accuracy & Price Verification',
        titleMl: 'വില പരിശോധന',
        description: 'Verified numbers: Quantity is positive and price (₹40/kg) matches your recent daily market rate (₹36 - ₹44/kg). All checks passed.',
        status: 'critique-pass',
        timestamp: '10:42:02 AM',
        durationMs: 95
      },
      {
        step: 'refine',
        title: 'Confirmation & Save',
        titleMl: 'സ്ഥിരീകരണം',
        description: 'Saved changes securely. Instant notification prepared for your daily summary.',
        status: 'completed',
        timestamp: '10:42:03 AM',
        durationMs: 71
      }
    ]
  },
  {
    id: 'task-102',
    inputPrompt: 'Send today invoice to Kailas Provisions via WhatsApp',
    inputPromptMl: 'കൈലാസ് പ്രൊവിഷൻസിന് ഇന്നത്തെ ₹38,055 രൂപയുടെ ടാക്സ് ഇൻവോയ്സ് WhatsApp-ൽ ഉടൻ അയക്കൂ.',
    inputType: 'voice',
    language: 'ml',
    toolUsed: 'whatsapp_send',
    status: 'SUCCESS',
    confidence: 99.1,
    executionTimeMs: 340,
    timestamp: '09:15 AM Today',
    outputSummary: 'Sent bill of ₹38,055 with payment link to Kailas Provisions (+91 98462 88123) over WhatsApp.',
    outputSummaryMl: 'കൈലാസ് പ്രൊവിഷൻസിന് (+91 98462 88123) ₹38,055 തുകയുടെ ബിൽ WhatsApp വഴി വിജയകരമായി അയച്ചു.',
    steps: [
      {
        step: 'generate',
        title: 'Contact & Bill Matching',
        titleMl: 'ഉപഭോക്താവിനെ കണ്ടെത്തൽ',
        description: 'Identified customer "Kailas Provisions" and matched Invoice #MS/23-24/1156 for ₹38,055.',
        status: 'completed',
        timestamp: '09:15:01 AM',
        confidence: 99.1,
        durationMs: 152
      },
      {
        step: 'execute',
        title: 'Customer WhatsApp Connect',
        titleMl: 'വാട്സ്ആപ്പ് കണക്ഷൻ',
        description: 'Prepared digital bill preview and secure UPI payment link for customer.',
        status: 'completed',
        timestamp: '09:15:02 AM',
        durationMs: 64
      },
      {
        step: 'critique',
        title: 'Phone Number & Amount Check',
        titleMl: 'നമ്പറും തുകയും പരിശോധിക്കൽ',
        description: 'Verified recipient phone number (+91 98462 88123) and confirmed invoice total of ₹38,055 matches the bill items.',
        status: 'critique-pass',
        timestamp: '09:15:02 AM',
        durationMs: 82
      },
      {
        step: 'refine',
        title: 'Message Delivered',
        titleMl: 'സന്ദേശം എത്തിച്ചു',
        description: 'Delivered bill directly to customer on WhatsApp. Customer received instant receipt.',
        status: 'completed',
        timestamp: '09:15:03 AM',
        durationMs: 90
      }
    ]
  },
  {
    id: 'task-103',
    inputPrompt: 'Parse supplier invoice image MS/23-24/1156',
    inputPromptMl: 'സപ്ലയർ ഇൻവോയ്സ് ഫോട്ടോ പരിശോധിച്ച് വിവരങ്ങൾ രേഖപ്പെടുത്തുക.',
    inputType: 'text',
    language: 'en',
    toolUsed: 'invoice_parse',
    status: 'SUCCESS',
    confidence: 98.7,
    executionTimeMs: 620,
    timestamp: 'Yesterday 04:30 PM',
    outputSummary: 'Scanned 5 spice items totaling ₹32,250.00 + 18% GST (₹5,805.00) = ₹38,055.00. Mathematical checksum 100% exact.',
    outputSummaryMl: '5 ഉൽപ്പന്നങ്ങൾ അടങ്ങിയ ബിൽ വിജയകരമായി രേഖപ്പെടുത്തി. ആകെ തുക ₹38,055.00 കൃത്യമാണെന്ന് പരിശോധിച്ചു.',
    steps: [
      {
        step: 'generate',
        title: 'Smart Document Reading',
        titleMl: 'ബിൽ വായന',
        description: 'Read supplier bill image. Extracted vendor Malabar Spices, GSTIN 32ABCPB9876C1Z1, and invoice number.',
        status: 'completed',
        timestamp: '04:30:01 PM',
        confidence: 98.7,
        durationMs: 380
      },
      {
        step: 'execute',
        title: 'Item Extraction',
        titleMl: 'സാധനങ്ങളുടെ വിവരങ്ങൾ',
        description: 'Extracted 5 commodity rows: Green Cardamom (8kg), Black Pepper (15kg), Clove (5kg), Turmeric (20kg), Fennel Seeds (10kg).',
        status: 'completed',
        timestamp: '04:30:02 PM',
        durationMs: 140
      },
      {
        step: 'critique',
        title: 'Mathematical Accuracy Verification',
        titleMl: 'കണക്കുകൂട്ടൽ പരിശോധന',
        description: 'Summed all items (₹32,250.00) + 18% GST (₹5,805.00) = ₹38,055.00. Exact match with receipt total. Zero discrepancy found.',
        status: 'critique-pass',
        timestamp: '04:30:02 PM',
        durationMs: 122
      },
      {
        step: 'refine',
        title: 'Inventory Sync',
        titleMl: 'സ്റ്റോക്കിൽ ചേർത്തു',
        description: 'All 5 spice quantities automatically added to your store inventory.',
        status: 'completed',
        timestamp: '04:30:03 PM',
        durationMs: 100
      }
    ]
  }
];

export const MOCK_INVOICE_DATA: InvoiceData = {
  id: 'inv-1156',
  invoiceNo: 'MS/23-24/1156',
  date: '26/10/2023',
  vendorName: 'MALABAR SPICES & GENERAL MERCHANT',
  vendorNameMl: 'മലബാർ സ്പൈസസ് & ജനറൽ മെർച്ചന്റ്',
  vendorGstin: '32ABCPB9876C1Z1',
  vendorAddress: 'G.T. Road, Thrissur - 680001, Kerala',
  buyerName: 'KAILAS PROVISIONS (B2B)',
  buyerGstin: '32AQWPR1234F1Z0',
  imageUrl: '/sample_invoice.jpg',
  status: 'verified',
  guardrailsPassed: true,
  varianceAmount: 0.00,
  subTotal: 32250.00,
  cgst: 2902.50,
  sgst: 2902.50,
  grandTotal: 38055.00,
  items: [
    {
      id: 'i-1',
      name: 'Green Cardamom',
      nameMl: 'ഏലം (Green Cardamom)',
      hsn: '6170060',
      qty: '8kg',
      unit: 'kg',
      rate: 1450.00,
      amount: 11600.00,
      confidence: 99.4
    },
    {
      id: 'i-2',
      name: 'Black Pepper',
      nameMl: 'കുരുമുളക് (Black Pepper)',
      hsn: '6170300',
      qty: '15kg',
      unit: 'kg',
      rate: 680.00,
      amount: 10200.00,
      confidence: 99.1
    },
    {
      id: 'i-3',
      name: 'Clove',
      nameMl: 'ഗ്രാമ്പൂ (Clove)',
      hsn: '6170360',
      qty: '5kg',
      unit: 'kg',
      rate: 890.00,
      amount: 4450.00,
      confidence: 98.8
    },
    {
      id: 'i-4',
      name: 'Turmeric Powder',
      nameMl: 'മഞ്ഞൾപ്പൊടി (Turmeric)',
      hsn: '8170120',
      qty: '20kg',
      unit: 'kg',
      rate: 190.00,
      amount: 3800.00,
      confidence: 99.5
    },
    {
      id: 'i-5',
      name: 'Fennel Seeds',
      nameMl: 'പെരുംജീരകം (Fennel Seeds)',
      hsn: '6170200',
      qty: '10kg',
      unit: 'kg',
      rate: 220.00,
      amount: 2200.00,
      confidence: 98.2
    }
  ]
};

export const MOCK_WHATSAPP_CONVERSATIONS: WhatsAppConversation[] = [
  {
    id: 'conv-1',
    customerName: 'Kailas Provisions (ചാലക്കുടി)',
    customerPhone: '+91 98462 88123',
    location: 'Chalakudy, Thrissur',
    unreadCount: 0,
    lastMessageTime: '10:48 AM',
    isSessionActive: true,
    sessionExpiryHours: 20,
    messages: [
      {
        id: 'm-1',
        sender: 'customer',
        text: 'സുരേഷേ, ഇന്നത്തെ ഫ്രഷ് ഗ്രീൻ ഏലക്കായുടെ വില കിലോയ്ക്ക് എത്രയാണ്?',
        textMl: 'സുരേഷേ, ഇന്നത്തെ ഫ്രഷ് ഗ്രീൻ ഏലക്കായുടെ വില കിലോയ്ക്ക് എത്രയാണ്?',
        time: '10:30 AM'
      },
      {
        id: 'm-2',
        sender: 'agent',
        text: 'നമസ്കാരം കൈലാസ്! ഇന്നത്തെ എ ഗ്രേഡ് ഗ്രീൻ ഏലക്കായുടെ വില കിലോയ്ക്ക് ₹1,450 ആണ്. ഞങ്ങളുടെ കൈവശം നിലവിൽ 8 കിലോ ഫ്രഷ് സ്റ്റോക്ക് ലഭ്യമാണ്. എത്ര അളവ് മാറ്റി വെക്കണം?',
        textMl: 'നമസ്കാരം കൈലാസ്! ഇന്നത്തെ എ ഗ്രേഡ് ഗ്രീൻ ഏലക്കായുടെ വില കിലോയ്ക്ക് ₹1,450 ആണ്. ഞങ്ങളുടെ കൈവശം നിലവിൽ 8 കിലോ ഫ്രഷ് സ്റ്റോക്ക് ലഭ്യമാണ്. എത്ര അളവ് മാറ്റി വെക്കണം?',
        time: '10:30 AM',
        status: 'read'
      },
      {
        id: 'm-3',
        sender: 'customer',
        text: 'ശരി, എന്നാൽ 8 കിലോയും എനിക്ക് വേണം. ബിൽ ഇങ്ങോട്ട് അയക്കൂ.',
        textMl: 'ശരി, എന്നാൽ 8 കിലോയും എനിക്ക് വേണം. ബിൽ ഇങ്ങോട്ട് അയക്കൂ.',
        time: '10:35 AM'
      },
      {
        id: 'm-4',
        sender: 'agent',
        text: 'ബില്ലും തുകയും തയ്യാറാക്കി കഴിഞ്ഞു! ഇൻവോയ്സ് MS/23-24/1156 പ്രകാരം ആകെ തുക ₹38,055 (നികുതി സഹിതം). താഴെ കാണുന്ന ലിങ്കിൽ ക്ലിക്ക് ചെയ്ത് UPI വഴി പണമടയ്ക്കാം.',
        textMl: 'ബില്ലും തുകയും തയ്യാറാക്കി കഴിഞ്ഞു! ഇൻവോയ്സ് MS/23-24/1156 പ്രകാരം ആകെ തുക ₹38,055 (നികുതി സഹിതം). താഴെ കാണുന്ന ലിങ്കിൽ ക്ലിക്ക് ചെയ്ത് UPI വഴി പണമടയ്ക്കാം.',
        time: '10:36 AM',
        status: 'read',
        hasPaymentLink: true,
        paymentAmount: 38055
      },
      {
        id: 'm-5',
        sender: 'customer',
        text: 'പണം അയച്ചു, സ്ക്രീൻഷോട്ട് നോക്കൂ.',
        textMl: 'പണം അയച്ചു, സ്ക്രീൻഷോട്ട് നോക്കൂ.',
        time: '10:48 AM'
      }
    ]
  },
  {
    id: 'conv-2',
    customerName: 'Dr. Anjali (ആയുർവേദ ക്ലിനിക്ക്)',
    customerPhone: '+91 97455 33211',
    location: 'Swaraj Round, Thrissur',
    unreadCount: 1,
    lastMessageTime: '09:20 AM',
    isSessionActive: true,
    sessionExpiryHours: 23,
    messages: [
      {
        id: 'm-201',
        sender: 'customer',
        text: 'നാളെ ഉച്ചയ്ക്ക് 2 മണിക്ക് 10 ലിറ്റർ വെളിച്ചെണ്ണയും 5 കിലോ കുരുമുളകും റെഡിയാക്കി വെക്കാമോ?',
        textMl: 'നാളെ ഉച്ചയ്ക്ക് 2 മണിക്ക് 10 ലിറ്റർ വെളിച്ചെണ്ണയും 5 കിലോ കുരുമുളകും റെഡിയാക്കി വെക്കാമോ?',
        time: '09:18 AM'
      },
      {
        id: 'm-202',
        sender: 'agent',
        text: 'തീർച്ചയായും ഡോക്ടർ! നാളെ ഉച്ചയ്ക്ക് 2 മണിക്ക് 10L ശുദ്ധമായ വെളിച്ചെണ്ണയും 5kg വയനാടൻ കുരുമുളകും പാക്ക് ചെയ്തു വെക്കാം. ബുക്കിംഗ് സ്ഥിരീകരിച്ചു.',
        textMl: 'തീർച്ചയായും ഡോക്ടർ! നാളെ ഉച്ചയ്ക്ക് 2 മണിക്ക് 10L ശുദ്ധമായ വെളിച്ചെണ്ണയും 5kg വയനാടൻ കുരുമുളകും പാക്ക് ചെയ്തു വെക്കാം. ബുക്കിംഗ് സ്ഥിരീകരിച്ചു.',
        time: '09:20 AM',
        status: 'read'
      }
    ]
  },
  {
    id: 'conv-3',
    customerName: 'Raghavan Pillai (റീട്ടെയിൽ കസ്റ്റമർ)',
    customerPhone: '+91 94460 77192',
    location: 'Ollur, Thrissur',
    unreadCount: 0,
    lastMessageTime: 'Yesterday',
    isSessionActive: false,
    sessionExpiryHours: 0,
    messages: [
      {
        id: 'm-301',
        sender: 'agent',
        text: 'പ്രിയ രാഘവേട്ടാ, മലബാർ സ്റ്റോഴ്സിൽ നിന്നുള്ള ഓർമ്മപ്പെടുത്തൽ: കഴിഞ്ഞ മാസത്തെ പലചരക്ക് ബില്ലിലെ ബാക്കി തുക ₹1,250 ദയവായി സൗകര്യപ്പെടുമ്പോൾ നേരിട്ടോ UPI വഴിയോ നൽകുമല്ലോ.',
        textMl: 'പ്രിയ രാഘവേട്ടാ, മലബാർ സ്റ്റോഴ്സിൽ നിന്നുള്ള ഓർമ്മപ്പെടുത്തൽ: കഴിഞ്ഞ മാസത്തെ പലചരക്ക് ബില്ലിലെ ബാക്കി തുക ₹1,250 ദയവായി സൗകര്യപ്പെടുമ്പോൾ നേരിട്ടോ UPI വഴിയോ നൽകുമല്ലോ.',
        time: 'Yesterday 05:12 PM',
        status: 'read',
        hasPaymentLink: true,
        paymentAmount: 1250
      },
      {
        id: 'm-302',
        sender: 'customer',
        text: 'ശരി സുരേഷേ, നാളെ രാവിലെ കടയിൽ വന്ന് തന്നേക്കാം.',
        textMl: 'ശരി സുരേഷേ, നാളെ രാവിലെ കടയിൽ വന്ന് തന്നേക്കാം.',
        time: 'Yesterday 06:05 PM'
      }
    ]
  }
];

export const MOCK_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-1',
    name: 'Green Cardamom (A Grade)',
    nameMl: 'ഗ്രീൻ ഏലക്ക (A ഗ്രേഡ്)',
    category: 'Spices',
    categoryMl: 'സുഗന്ധവ്യഞ്ജനങ്ങൾ',
    currentStock: 8,
    unit: 'kg',
    reorderLevel: 5,
    unitPrice: 1450,
    costPrice: 1200,
    lastRestocked: '26 Oct 2023'
  },
  {
    id: 'inv-2',
    name: 'Wayanad Black Pepper',
    nameMl: 'വയനാടൻ കുരുമുളക്',
    category: 'Spices',
    categoryMl: 'സുഗന്ധവ്യഞ്ജനങ്ങൾ',
    currentStock: 35,
    unit: 'kg',
    reorderLevel: 10,
    unitPrice: 680,
    costPrice: 560,
    lastRestocked: '26 Oct 2023'
  },
  {
    id: 'inv-3',
    name: 'Pure Cold Pressed Coconut Oil',
    nameMl: 'ശുദ്ധമായ വെളിച്ചെണ്ണ',
    category: 'Oils',
    categoryMl: 'എണ്ണകൾ',
    currentStock: 4,
    unit: 'Liters',
    reorderLevel: 15,
    unitPrice: 240,
    costPrice: 195,
    lastRestocked: '18 Oct 2023'
  },
  {
    id: 'inv-4',
    name: 'Alleppey Turmeric Powder',
    nameMl: 'ആലപ്പുഴ മഞ്ഞൾപ്പൊടി',
    category: 'Spices',
    categoryMl: 'സുഗന്ധവ്യഞ്ജനങ്ങൾ',
    currentStock: 28,
    unit: 'kg',
    reorderLevel: 8,
    unitPrice: 190,
    costPrice: 140,
    lastRestocked: '26 Oct 2023'
  },
  {
    id: 'inv-5',
    name: 'Jeerakasala Biryani Rice',
    nameMl: 'ജീരകശാല ബിരിയാണി അരി',
    category: 'Grains',
    categoryMl: 'ധാന്യങ്ങൾ',
    currentStock: 120,
    unit: 'kg',
    reorderLevel: 30,
    unitPrice: 130,
    costPrice: 105,
    lastRestocked: '24 Oct 2023'
  },
  {
    id: 'inv-6',
    name: 'Idukki Whole Clove',
    nameMl: 'ഇടുക്കി ഗ്രാമ്പൂ',
    category: 'Spices',
    categoryMl: 'സുഗന്ധവ്യഞ്ജനങ്ങൾ',
    currentStock: 12,
    unit: 'kg',
    reorderLevel: 4,
    unitPrice: 890,
    costPrice: 720,
    lastRestocked: '26 Oct 2023'
  },
  {
    id: 'inv-7',
    name: 'Fresh Country Tomato',
    nameMl: 'നാടൻ തക്കാളി',
    category: 'Vegetables',
    categoryMl: 'പച്ചക്കറികൾ',
    currentStock: 45,
    unit: 'kg',
    reorderLevel: 15,
    unitPrice: 40,
    costPrice: 28,
    lastRestocked: 'Today (via Voice)'
  }
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-1',
    customerName: 'Suresh & Brother Wholesalers',
    phone: '+91 94471 90812',
    service: 'B2B Weekly Spice Order Consultation',
    serviceMl: 'മൊത്തക്കച്ചവട ഓർഡർ ചർച്ച',
    date: 'Tomorrow, 02 Oct',
    timeSlot: '02:00 PM - 02:45 PM',
    status: 'confirmed',
    notes: 'Booked via Malayalam Voice command.'
  },
  {
    id: 'apt-2',
    customerName: 'Anjali Ayurvedic Pharmacy',
    phone: '+91 97455 33211',
    service: 'Herbal Raw Material Delivery & Quality Check',
    serviceMl: 'ഔഷധ ചേരുവകളുടെ ഗുണനിലവാര പരിശോധന',
    date: 'Wednesday, 04 Oct',
    timeSlot: '11:00 AM - 12:00 PM',
    status: 'confirmed',
    notes: 'Requested pure cold-pressed coconut oil sample check.'
  },
  {
    id: 'apt-3',
    customerName: 'Kailas Provisions Delivery Van',
    phone: '+91 98462 88123',
    service: 'Store Pickup & Loading for Chalakudy route',
    serviceMl: 'ചാലക്കുടി റൂട്ടിലേക്കുള്ള ലോഡിങ്',
    date: 'Today, 01 Oct',
    timeSlot: '05:30 PM - 06:00 PM',
    status: 'pending',
    notes: 'Pending final payment clearance via UPI.'
  }
];

export const MOCK_STORE_SETTINGS = {
  storeStatus: {
    status: 'Online & Active 24/7',
    statusMl: 'പ്രവർത്തന സജ്ജം (24 മണിക്കൂറും)',
    dataSecurity: '100% Private Encrypted Store Data',
    dataSecurityMl: 'പൂർണ്ണ സുരക്ഷിതത്വം (എൻക്രിപ്റ്റ് ചെയ്ത വിവരങ്ങൾ)',
    dailyBackup: 'Automatic Cloud Backup: Completed at 04:00 AM',
    dailyBackupMl: 'ദിവസേനയുള്ള ബാക്കപ്പ്: രാവിലെ 4:00 മണിക്ക് പൂർത്തിയായി',
    systemSpeed: 'Superfast Instant Response (~0.3s)',
    systemSpeedMl: 'മിന്നൽ വേഗത (~0.3 സെക്കൻഡ്)',
    uptime: '99.98% Available'
  },
  contactPreferences: {
    notifyWhatsapp: true,
    notifyLowStock: true,
    autoInvoiceGeneration: true,
    upiId: 'malabarspices@okaxis',
    dailySettlementTime: '10:00 PM'
  }
};

export const MOCK_SYSTEM_HEALTH = {
  totalMonthlyBurn: 765,
  vps: {
    cpuUsage: 14.2,
    ramUsage: 30,
    diskUsage: 18
  },
  llm: {
    rpmQuotaUsed: '2 / 15 RPM',
    dailyTokensUsed: '134,820'
  }
};
