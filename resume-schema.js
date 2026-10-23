/* ════════════════════════════════════════════════════════════════
   敦新科技 線上履歷 — 欄位定義（單一來源）
   resume.html（求職者填寫）與 resume-admin.html（後台檢視／Word）共用。
   修改欄位只需改這個檔案；Google 試算表的欄位標題 = 這裡的 label，
   新增欄位時試算表會自動新增欄位，不需改 Apps Script。
   ════════════════════════════════════════════════════════════════ */
(function (g) {
  var SC = ['1 優秀', '2 很好', '3 好', '4 尚可', '5 差'];
  function F(k, l, type, o) { var f = { k: k, l: l, type: type || 'text' }; if (o) for (var x in o) f[x] = o[x]; return f; }
  function yn(k, l) { return [F(k, l, 'radio', { opts: ['無', '有'], req: 1 }), F(k + '.note', l + '－說明', 'text', { ph: '若「有」請說明', wide: 1 })]; }
  function cat(a, b) { return a.concat(b); }

  var sections = [
    { id: 'job', n: 1, title: '應徵資料', blocks: [
      { t: 'fields', fields: [
        F('job.title', '應徵職務', 'text', { req: 1 }),
        F('job.date', '填表日期', 'date', { req: 1, auto: 'today' }),
        F('channel', '招募管道', 'radio', { req: 1, wide: 1, opts: ['104人力銀行', '其他網站', '推薦-員工', '推薦-親友', '獵才顧問', '離職回任', '校園活動', '其他'] }),
        F('channel.ref', '推薦人姓名（員工／親友）'),
        F('channel.other', '其他管道說明')
      ] }
    ] },
    { id: 'basic', n: 2, title: '基本資料', hint: '標示 * 為必填。', blocks: [
      { t: 'fields', fields: cat([
        F('photo', '照片', 'photo', { wide: 1 }),
        F('basic.name_zh', '中文姓名', 'text', { req: 1 }),
        F('basic.name_en', '英文名', 'text', { req: 1 }),
        F('basic.passport', '護照全名'),
        F('basic.id_no', '身份證字號', 'text', { ph: 'A123456789', upper: 1, max: 12 }),
        F('basic.birth', '出生日期（西元）', 'date'),
        F('basic.gender', '性別', 'select', { req: 1, opts: ['男', '女'] }),
        F('basic.marital', '婚姻', 'select', { req: 1, opts: ['單身', '已婚'] }),
        F('basic.military', '兵役', 'select', { opts: ['役畢', '免役', '未役', '不適用'] }),
        F('basic.nation', '國籍', 'text', { req: 1, ph: '中華民國' }),
        F('basic.blood', '血型', 'select', { opts: ['A', 'B', 'O', 'AB'] }),
        F('basic.height', '身高（cm）', 'number'),
        F('basic.weight', '體重（kg）', 'number'),
        F('basic.hobby', '興趣專長', 'text', { wide: 1 }),
        F('basic.identity', '身分別', 'radio', { req: 1, opts: ['身心障礙', '原住民', '皆無'], wide: 1 }),
        F('basic.mobile', '行動電話', 'tel', { req: 1, ph: '0912345678' }),
        F('basic.email', 'E-mail', 'email', { req: 1 }),
        F('addr.reg', '戶籍地址', 'text', { req: 1, wide: 1 }),
        F('addr.reg_tel', '戶籍電話', 'tel'),
        F('addr.same', '通訊地址同戶籍地址', 'check'),
        F('addr.mail', '通訊地址', 'text', { req: 1, wide: 1 }),
        F('addr.mail_tel', '通訊電話', 'tel'),
        F('emg.name', '緊急連絡人', 'text'),
        F('emg.rel', '緊急連絡人關係', 'text'),
        F('emg.tel', '緊急連絡人電話', 'tel')
      ], []) }
    ] },
    { id: 'lang', n: 3, title: '語文能力', hint: '請以數字表示：1 優秀、2 很好、3 好、4 尚可、5 差。', blocks: [
      { t: 'cards', key: 'lang', tbl: 1, view: 'card', ids: [0, 1, 2], names: ['英文', '其他語文1', '其他語文2'], fields: [
        F('name', '語文名稱', 'text', { only: [1, 2] }),
        F('listen', '聽', 'select', { opts: SC, reqOnly: [0] }), F('speak', '說', 'select', { opts: SC, reqOnly: [0] }),
        F('read', '讀', 'select', { opts: SC, reqOnly: [0] }), F('write', '寫', 'select', { opts: SC, reqOnly: [0] })
      ] }
    ] },
    { id: 'fam', n: 4, title: '家庭狀況', hint: '請填寫主要家庭成員。', blocks: [
      { t: 'cards', key: 'fam', view: 'table', ids: [0, 1, 2, 3, 4, 5], names: ['家庭成員1', '家庭成員2', '家庭成員3', '家庭成員4', '家庭成員5', '家庭成員6'], fields: [
        F('rel', '稱謂'), F('name', '姓名'), F('age', '年齡', 'number'), F('job', '職業')
      ] }
    ] },
    { id: 'edu', n: 5, title: '教育程度', hint: '請填寫高中以上學歷（至少一筆）。', blocks: [
      { t: 'cards', key: 'edu', tbl: 1, view: 'card', ids: ['grad', 'univ', 'college', 'high'], names: ['研究所', '大學', '專科', '高中'], fields: [
        F('school', '學校名稱'), F('dept', '科系'), F('shift', '日夜', 'select', { opts: ['日間', '夜間', '在職專班'] }),
        F('from', '入學年月', 'month'), F('to', '畢（肄）業年月', 'month'), F('status', '畢／肄', 'select', { opts: ['畢業', '肄業', '就讀中'] }),
        F('club', '社團活動', 'text', { wide: 1 })
      ] }
    ] },
    { id: 'pc', n: 6, title: '電腦技能', hint: '較專精之電腦軟硬體、應用系統及程式語言，請填寫瞭解程度與實作經驗。', blocks: [
      { t: 'cards', key: 'pc', view: 'table', ids: [0, 1, 2, 3, 4], names: ['電腦技能1', '電腦技能2', '電腦技能3', '電腦技能4', '電腦技能5'], fields: [
        F('item', '軟硬體／系統／程式語言'), F('level', '瞭解程度', 'select', { opts: ['非常熟悉', '熟悉', '只讀過'] }), F('exp', '實作經驗', 'select', { opts: ['有', '沒有'] })
      ] }
    ] },
    { id: 'cert', n: 7, title: '專業資格考試或認證', hint: '請填寫通過之專業證照、政府／民間考試名稱。', blocks: [
      { t: 'cards', key: 'cert', view: 'table', ids: [0, 1, 2, 3, 4], names: ['證照1', '證照2', '證照3', '證照4', '證照5'], fields: [
        F('name', '證照／考試名稱'), F('org', '認證單位'), F('ym', '認證年月', 'month'), F('has', '證書', 'select', { opts: ['有', '無'] })
      ] }
    ] },
    { id: 'ref', n: 8, title: '任用諮詢', hint: '請提供二位可供諮詢之人士並取得其同意，其中一名必須為過去工作中之直屬主管。至少需完整填寫一位（五個欄位皆須填寫）。', blocks: [
      { t: 'cards', key: 'ref', tbl: 1, view: 'card', ids: [0, 1], names: ['諮詢人1', '諮詢人2'], fields: [
        F('name', '姓名'), F('company', '公司'), F('title', '職稱'), F('tel', '聯絡電話', 'tel'), F('rel', '關係')
      ] }
    ] },
    { id: 'job_hist', n: 9, title: '工作經歷', hint: '請從最近的工作開始填寫，最多四筆。薪資資料僅供人資核薪使用。', blocks: [
      { t: 'fields', fields: [F('job.none', '無工作經歷（應屆畢業）', 'check', { wide: 1 })] },
      { t: 'cards', key: 'job', view: 'card', ids: [0, 1, 2, 3], names: ['工作經歷1', '工作經歷2', '工作經歷3', '工作經歷4'], fields: [
        F('company', '公司名稱'), F('size', '人數規模'), F('dept', '部門'), F('title', '職稱'),
        F('from', '起（年月）', 'month'), F('to', '迄（年月）', 'month'),
        F('mgr', '擔任主管', 'select', { opts: ['否', '是'] }), F('mgr_n', '管理人數', 'number'),
        F('duties', '工作內容', 'area', { wide: 1 }), F('reason', '離職原因', 'area', { wide: 1 }),
        F('fixed', '固定月薪（元）', 'number'), F('allow', '津貼（元）', 'number'), F('other', '其他（元）', 'number'),
        F('total', '合計月薪（元）', 'number', { sum: ['fixed', 'allow', 'other'] }),
        F('fixed_m', '固定月薪（個月）', 'number', { step: '0.1' }), F('perf_m', '績效獎金（個月）', 'number', { step: '0.1' }), F('bonus_m', '年終獎金（個月）', 'number', { step: '0.1' }),
        F('total_m', '合計年薪（個月）', 'number', { sum: ['fixed_m', 'perf_m', 'bonus_m'] })
      ] }
    ] },
    { id: 'exp', n: 10, title: '期望待遇與到職', blocks: [
      { t: 'fields', fields: [
        F('exp.monthly', '期望月全薪（元）', 'number', { req: 1 }), F('exp.annual', '期望年薪（元）', 'number', { req: 1 }), F('exp.months', '全年以幾個月計', 'number', { step: '0.1' }),
        F('exp.start', '可到職日期', 'date', { req: 1 }), F('exp.days', '接獲錄取通知後第幾天開始任職', 'number', { req: 1 })
      ] }
    ] },
    { id: 'credit', n: 11, title: '信用資料與關係人', hint: '請如實填寫；選「有」者請於後方說明。', blocks: [
      { t: 'fields', eq: 1, sub: '信用資料', fields: cat(cat(yn('cr.check', '有無支票退補／拒往記錄'), yn('cr.card', '有無信用卡強制停用記錄')), yn('cr.other', '有無其它信用及違法記錄')) },
      { t: 'fields', eq: 1, sub: '關係人', fields: cat(cat(cat(cat(
        yn('rel.relative', '1.有無親戚在本公司服務（姓名／關係／所在單位）'),
        yn('rel.director', '2.在其他公司擔任負責人、董事、監察人（公司／職務）')),
        yn('rel.china', '3.在大陸地區有投資業務（公司／投資狀況）')),
        yn('rel.noncompete', '4.與前任公司有簽署競業條款（內容簡述）')),
        yn('rel.ip', '5.任職前擁有或涉及智慧財產權（商標、專利、著作、營業秘密）或專門技術（know-how）')) }
    ] },
    { id: 'decl', n: 12, title: '【蒐集、處理及利用個人資料告知事項聲明書】', blocks: [
      { t: 'consent' },
      { t: 'fields', fields: [
        F('consent', '同意個資告知事項', 'check', { req: 1, hidden: 1 }),
        // 簽章與日期留白，面試時現場手寫；後台檢視／Word／PDF 該列為 2 倍高方便簽名。試算表欄位標題維持「填表人簽章」不變。
        F('signature', '填表人簽章', 'text', { dis: 1, show: 1, blank: 1, tall: 1, dl: '填寫人簽章(面試時現場簽名)', vl: '填寫人簽章' }),
        F('sign_date', '簽章日期', 'text', { dis: 1, show: 1, blank: 1, tall: 1 })     // 用文字欄位，避免瀏覽器顯示「年/月/日」預設文字
      ] }
    ] }
  ];

  /* ── 攤平成欄位清單 ── */
  // 欄位若有 reqOnly（例如只有「英文」那張卡片必填），依卡片順序決定是否必填
  function cardField(f, i) { return f.reqOnly ? Object.assign({}, f, { req: f.reqOnly.indexOf(i) >= 0 ? 1 : 0 }) : f; }
  var list = [], k2l = {}, l2k = {};
  function add(key, label, f) {
    var e = { key: key, label: label, type: f.type, f: f };
    list.push(e); k2l[key] = label; l2k[label] = key;
  }
  sections.forEach(function (s) {
    s.blocks.forEach(function (b) {
      if (b.t === 'fields') b.fields.forEach(function (f) { if (f.type !== 'photo') add(f.k, f.l, f); });
      if (b.t === 'cards') b.ids.forEach(function (id, i) {
        b.fields.forEach(function (f) {
          if (f.only && f.only.indexOf(i) < 0) return;
          add(b.key + '.' + id + '.' + f.k, b.names[i] + ' ' + f.l, cardField(f, i));
        });
      });
    });
  });

  function toRec(data) {
    var rec = {};
    list.forEach(function (e) {
      var v = data[e.key];
      if (v == null) v = '';
      if (e.type === 'check') v = (v === '1' || v === 1 || v === true) ? '是' : '';
      rec[e.label] = String(v);
    });
    return rec;
  }
  function fromRec(rec) {
    var d = {};
    list.forEach(function (e) {
      var v = rec[e.label];
      if (v == null || v === '') return;
      if (e.type === 'check') { if (v === '是') d[e.key] = '1'; return; }
      d[e.key] = String(v);
    });
    return d;
  }


  /* ── 聲明書：個人資料告知事項全文（求職者頁、後台檢視、Word、PDF 共用）── */
  var AGREE = '本人已充分詳閱、瞭解並同意「蒐集、處理及利用個人資料告知事項」，且擔保以上所提供之資料均為事實，無隱匿或虛偽之情事，若有違反本人願接受公司取消錄取資格或於聘僱後解僱，且本人須自負民刑事責任，絕無異議。';
  var consent = [
    { h: '1. 蒐集之特定目的', ps: ['敦新科技股份有限公司基於保險（包括人身保險、全民健康保險、勞工保險等）、人事管理（包含甄選、離職及所屬員工基本資訊、現職、學經歷、考試分發、終身學習訓練進修、考績獎懲、薪資待遇、差勤、福利措施、褫奪公權、特殊查核或其他人事措施）、非公務機關依法定義務所進行個人資料之蒐集處理及利用、資（通）訊與資料庫管理之需求及執行業務所需（例如：履行原廠及客戶合規要求之通報義務）。'] },
    { h: '2. 蒐集之個人資料類別', ps: [
      '(1) 識別類：C001 辨識個人者（例如：姓名）、C003 政府資料中之辨識者（例如：身分證統一編號）。',
      '(2) 特徵類：C011 個人描述（例如：出生年月日）、C012 身體描述（例如身高、體重）。',
      '(3) 家庭情形：C021 家庭情形（例如：婚姻、家庭）。(4) 社會情況：C031 住家及設施、C035 休閒生活及興趣。(5) 教育、考選、技術或其他專業：C051 學校紀錄（例如：教育）、C052 資格或技術、C056 著作。',
      '(6) 受僱情形：C061 現行之受僱情形、C062 僱用經過、C063 離職經過、C064 工作經驗。',
      '(7) 財務細節：C083 信用評等、C086 票據信用。'] },
    { h: '3. 個人資料使用之期間、地區、對象及方式', ps: [
      '<b>期間</b>：(1) 個人資料蒐集特定目的之存續期間；(2) 因執行業務所必須之保存期間；或 (3) 依相關法令或依個別契約之保存所定之保存年限。',
      '<b>地區</b>：本公司所在地或營業區域。',
      '<b>對象</b>：本公司依法令規定或使用之特定目的所提供之第三人。',
      '<b>方式</b>：符合個人資料相關法令以自動化機器或非自動化之利用方式蒐集、處理、國際傳輸與利用（例如使用數位檔案、實體紙本及其他合於當時科學技術之適當方式為之等）。'] },
    { n: '4.', ps: ['若您錄取成為本公司員工時，就前揭個人資料或未來向您蒐集之個人資料，本公司將依內部個人資料保護管理之相關辦法及程序進行保護。'] },
    { n: '5.', ps: ['您同意並保證於報到時所提供之第三人（例如：家屬、緊急連絡人及人事背景查核相關人員）個人資料已事先取得該第三人之同意。'] },
    { n: '6.', ps: ['本公司得依法就勞工健康檢查所定期限及項目之檢查結果，進行紀錄之保存、處理及利用，且不會逾越特定目的之範圍。'] },
    { n: '7.', ps: ['您可透過親臨現場方式行使個人資料保護法第三條當事人權利規定，包含行使個人資料查詢、閱覽、複製本、補充、更正、刪除及停止蒐集、處理與利用之要求。'] },
    { n: '8.', ps: ['您得自由選擇是否針對本份文件所要求之各欄位提供個人資料，惟若拒絕提供相關必要之個人資料，本公司將無法進行必要之審核作業，可能會對應徵申請的處理及結果有所影響。'] }
  ];
  function consentHTML() {               // 求職者填寫頁（沿用頁面上的 .consent 樣式）
    return consent.map(function (c) {
      return c.h ? '<h5>' + c.h + '</h5>' + c.ps.map(function (x) { return '<p>' + x + '</p>'; }).join('')
                 : '<p><b>' + c.n + '</b> ' + c.ps[0] + '</p>';
    }).join('');
  }

  /* ── 唯讀檢視（後台視窗、列印、Word 共用；全部使用行內樣式）──
     o.compact = true 時為 Word 用的緊湊版型（小字、窄邊距、多欄並排），目標約 2 頁 A4。 */
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>'); }
  function showVal(f, v) { if (f.type === 'check') return v ? '是' : ''; return v; }
  function viewHTML(d, o) {
    o = o || {};
    var c = !!o.compact;
    var FS = o.fs || (c ? '10pt' : '10.5pt'), PAD = o.pad || (c ? '0 3px' : '4px 6px'), LH = o.lh ? 'line-height:' + o.lh + ';' : (c ? 'line-height:1.1;' : '');
    var CB = 'border:1px solid #888;padding:' + PAD + ';font-size:' + FS + ';vertical-align:' + (o.valign || 'top') + ';' + LH;
    var TL = CB + 'background:#f2f0eb;font-weight:bold;color:#3d3a34;';
    var PER = c ? 3 : 2, LW = c ? 11 : 17, VW = c ? 22.3 : 33;
    var padPx = parseFloat(String(PAD).split(' ')[0]) || 0, lhF = Math.max(parseFloat(o.lh) || 1.5, 1.25);
    var tallH = Math.round(2 * (parseFloat(FS) * lhF + padPx * 1.5));     // 一般列高（pt）的 2 倍
    var TB = 'width:100%;border-collapse:collapse;margin-bottom:' + (c ? '2px' : '8px');
    var SUB = 'font-size:' + (c ? '10pt' : '11pt') + ';font-weight:bold;margin:' + (c ? '3px 0 1px' : '8px 0 4px') + ';color:#c9540f';
    var EMPTY = 'font-size:' + (c ? '10pt' : '10pt') + ';color:#7a7570;margin:' + (c ? '1px 0 3px' : '2px 0 8px');

    function pairsTable(items) {          // items: [{l,v,wide}]
      var rows = '', i = 0, span = PER * 2 - 1;
      while (i < items.length) {
        if (items[i].wide) {
          rows += '<tr><td style="' + TL + 'width:' + LW + '%">' + esc(items[i].l) + '</td><td style="' + CB + '" colspan="' + span + '">' + esc(items[i].v) + '</td></tr>'; i++; continue;
        }
        var row = '', n = 0, tall = false;
        while (i < items.length && !items[i].wide && n < PER) {
          if (items[i].tall) tall = true;
          row += '<td style="' + TL + 'width:' + LW + '%">' + esc(items[i].l) + '</td><td style="' + CB + 'width:' + VW + '%">' + esc(items[i].v) + '</td>'; i++; n++;
        }
        if (n < PER) row += '<td style="' + CB + '" colspan="' + ((PER - n) * 2) + '"></td>';
        if (tall) row = row.replace(/<td style="/g, '<td style="height:' + tallH + 'pt;');     // 該列高度為一般列的 2 倍
        rows += '<tr' + (tall ? ' style="height:' + tallH + 'pt"' : '') + '>' + row + '</tr>';
      }
      return '<table style="' + TB + '" border="1" cellspacing="0" cellpadding="1">' + rows + '</table>';
    }
    function eqTable(items) {             // 標題與答案各占 50% 寬（信用資料、關係人）
      var rows = items.map(function (x) { return '<tr><td style="' + TL + 'width:50%">' + esc(x.l) + '</td><td style="' + CB + 'width:50%">' + esc(x.v) + '</td></tr>'; }).join('');
      return '<table style="' + TB + '" border="1" cellspacing="0" cellpadding="1">' + rows + '</table>';
    }
    function langRows(b) {                // 語文能力：無標題列，每種語文一列，例如「英文 ｜ 聽 很好 ｜ 說 很好 ｜ 讀 很好 ｜ 寫 很好」
      var L = [['listen', '聽'], ['speak', '說'], ['read', '讀'], ['write', '寫']], rows = '';
      b.ids.forEach(function (id, i) {
        var g = function (k) { return d[b.key + '.' + id + '.' + k] || ''; };
        if (!g('name') && !L.some(function (x) { return g(x[0]) !== ''; })) return;
        rows += '<tr><td style="' + TL + 'width:20%">' + esc(g('name') || b.names[i]) + '</td>' + L.map(function (x) {
          var v = g(x[0]).replace(/^\d\s*/, '');
          return '<td style="' + CB + 'width:20%">' + (v ? esc(x[1] + ' ' + v) : '') + '</td>';
        }).join('') + '</tr>';
      });
      return rows ? '<table style="' + TB + '" border="1" cellspacing="0" cellpadding="1">' + rows + '</table>' : '<p style="' + EMPTY + '">（未填寫）</p>';
    }
    function gridTable(head, rows) {
      return '<table style="' + TB + '" border="1" cellspacing="0" cellpadding="1"><tr>' +
        head.map(function (x) { return '<td style="' + TL + '">' + esc(x) + '</td>'; }).join('') + '</tr>' +
        rows.map(function (r) { return '<tr>' + r.map(function (x) { return '<td style="' + CB + '">' + esc(x) + '</td>'; }).join('') + '</tr>'; }).join('') + '</table>';
    }
    function cardsAsRows(b) {               // 緊湊版：每張卡片一列（語文、學歷、諮詢人）
      var cols = [], hasFT = b.fields.some(function (f) { return f.k === 'from'; }) && b.fields.some(function (f) { return f.k === 'to'; });
      b.fields.forEach(function (f) {
        if (hasFT && f.k === 'to') return;
        if (hasFT && f.k === 'from') cols.push({ l: '起訖年月', g: function (id) { var a = d[b.key + '.' + id + '.from'] || '', z = d[b.key + '.' + id + '.to'] || ''; return (a || z) ? a + '～' + z : ''; } });
        else cols.push({ l: f.l, g: function (id) { return d[b.key + '.' + id + '.' + f.k] || ''; } });
      });
      var rows = [];
      b.ids.forEach(function (id, i) {
        var vals = cols.map(function (x) { return x.g(id); });
        if (vals.some(function (x) { return x !== ''; })) rows.push([b.names[i]].concat(vals));
      });
      return rows.length ? gridTable([''].concat(cols.map(function (x) { return x.l; })), rows) : '<p style="' + EMPTY + '">（未填寫）</p>';
    }

    // 頁首：左側為標題／提交資訊（o.head），右上角為個人照片
    var ps = c ? 'width="66" height="88"' : 'width="110" height="147"', h = '';
    if (o.head || o.photo) {
      h += '<table data-nb style="width:100%;border-collapse:collapse;margin-bottom:6px" border="0" cellspacing="0" cellpadding="0"><tr>' +
        '<td data-nb valign="top" style="vertical-align:top;padding:0;border:0">' + (o.head || '') + '</td>' +
        (o.photo ? '<td data-nb valign="top" align="right" style="width:' + (c ? 74 : 120) + 'px;text-align:right;vertical-align:top;padding:0;border:0"><img src="' + o.photo + '" ' + ps + ' style="border:1px solid #999"></td>' : '') +
        '</tr></table>';
    }
    sections.forEach(function (s) {
      var body = '';
      s.blocks.forEach(function (b) {
        if (b.t === 'consent') {
          var cp = 'font-size:' + FS + ';margin:' + (c ? '1px 0' : '3px 0') + ';line-height:' + (o.lh || '1.5');
          consent.forEach(function (it) {
            if (it.h) {
              body += '<p style="' + cp + ';font-weight:bold">' + esc(it.h) + '</p>';
              it.ps.forEach(function (x) { body += '<p style="' + cp + '">' + x + '</p>'; });
            } else {
              body += '<p style="' + cp + '"><b>' + it.n + '</b> ' + it.ps[0] + '</p>';
            }
          });
          body += '<p style="' + cp + ';margin-top:8px;font-weight:bold">' + (d.consent === '1' ? '☑ ' : '☐ （尚未勾選）') + AGREE + '</p>';
        } else if (b.t === 'fields') {
          var items = [];
          b.fields.forEach(function (f) {
            if (f.type === 'photo' || f.hidden) return;
            var v = f.blank ? '' : showVal(f, d[f.k] || '');       // 標記為留白的欄位（簽章、簽章日期）一律顯示空白，不論資料庫裡有沒有舊值
            if (v === '' && !f.req && !f.show) return;
            items.push({ l: f.vl || f.l, v: v === '' ? (f.blank ? '' : '—') : v, tall: !!f.tall, wide: f.wide && (f.type === 'text' || f.type === 'area' || f.type === 'radio') });
          });
          if (b.sub) body += '<p style="' + SUB + '">' + esc(b.sub) + '</p>';
          if (items.length) body += b.eq ? eqTable(items) : pairsTable(items);
        } else if (b.t === 'cards') {
          if (b.view === 'table') {
            var rows = [];
            b.ids.forEach(function (id) {
              var vals = b.fields.map(function (f) { return d[b.key + '.' + id + '.' + f.k] || ''; });
              if (vals.some(function (x) { return x !== ''; })) rows.push(vals);
            });
            body += rows.length ? gridTable(b.fields.map(function (f) { return f.l; }), rows) : '<p style="' + EMPTY + '">（未填寫）</p>';
          } else if (b.key === 'lang') {
            body += langRows(b);
          } else if (c && b.tbl) {
            body += cardsAsRows(b);
          } else {
            var any = false;
            b.ids.forEach(function (id, i) {
              var items2 = [];
              b.fields.forEach(function (f) {
                if (f.only && f.only.indexOf(i) < 0) return;
                var v = d[b.key + '.' + id + '.' + f.k] || '';
                if (v !== '') items2.push({ l: f.l, v: v, wide: !!f.wide && !(c && f.k === 'reason') });
              });
              if (!items2.length) return;
              any = true;
              body += '<p style="' + SUB + '">' + esc(b.names[i]) + '</p>' + pairsTable(items2);
            });
            if (!any) body += '<p style="' + EMPTY + '">（未填寫）</p>';
          }
        }
      });
      var photo = '';
      h += '<div style="margin-bottom:' + (c ? '3px' : '14px') + '">' +
        '<p style="font-size:' + (c ? '12pt' : '13pt') + ';font-weight:bold;margin:' + (c ? '3px 0 1px' : '12px 0 6px') + ';padding-bottom:' + (c ? '1px' : '3px') + ';border-bottom:' + (c ? '1.5px' : '2px') + ' solid #e8671a;color:#1a1814">' + s.n + '. ' + esc(s.title) + '</p>' +
        photo + body + '<div style="clear:both"></div></div>';
    });
    return h;
  }


  /* ── 表單 HTML 產生器（求職者填寫頁、後台「編輯」共用）──
     opts.skip：要略過的區段 id（後台編輯時略過 'decl' 聲明書）；opts.consentHTML：聲明書全文 */
  function ctl(name, f) {
    var a = (f.ro ? ' readonly' : '') + (f.dis ? ' disabled' : '');
    if (f.type === 'select')
      return '<select name="' + name + '"><option value="">請選擇</option>' + f.opts.map(function (o) { return '<option>' + o + '</option>'; }).join('') + '</select>';
    if (f.type === 'radio')
      return '<div class="rg">' + f.opts.map(function (o) { return '<label><input type="radio" name="' + name + '" value="' + o + '">' + o + '</label>'; }).join('') + '</div>';
    if (f.type === 'area') return '<textarea name="' + name + '"></textarea>';
    if (f.type === 'check') return '<div class="rg"><label><input type="checkbox" name="' + name + '" value="1">' + esc(f.l) + '</label></div>';
    var at = (f.ph ? ' placeholder="' + f.ph + '"' : '') + (f.max ? ' maxlength="' + f.max + '"' : '') + (f.step ? ' step="' + f.step + '"' : '') + (f.upper ? ' style="text-transform:uppercase"' : '') + a;
    if (f.sum) at += ' readonly tabindex="-1"';
    return '<input type="' + f.type + '" name="' + name + '"' + at + '>';
  }
  function fieldHTML(name, f, label) {
    if (f.type === 'photo')
      return '<div class="fg wide" data-f="photo"><label>' + label + '</label><div class="photo"><div class="box" id="photoBox">2 吋照片<br>（上傳電子檔）</div><div><input type="file" id="photoFile" accept="image/*"><small>系統會自動縮圖；可先不上傳。</small></div><input type="hidden" name="photo"></div></div>';
    if (f.type === 'check' && f.hidden) return '';
    var lab = f.type === 'check' ? '' : '<label>' + (f.dl || label) + (f.req ? '<span class="rq">*</span>' : '') + '</label>';
    return '<div class="fg' + (f.wide ? ' wide' : '') + '" data-f="' + name + '">' + lab + ctl(name, f) + '</div>';
  }
  function formHTML(opts) {
    opts = opts || {};
    var skip = opts.skip || [], h = '';
    sections.forEach(function (s) {
      if (skip.indexOf(s.id) >= 0) return;
      var body = '';
      s.blocks.forEach(function (b) {
        if (b.t === 'consent') {
          body += '<div class="consent">' + (opts.consentHTML || '') + '</div>' +
            '<div class="fg" data-f="consent" style="margin-bottom:14px"><div class="rg"><label><input type="checkbox" name="consent" value="1">' + AGREE + '<span style="color:var(--danger)">*</span></label></div></div>';
        } else if (b.t === 'fields') {
          if (b.sub) body += '<div class="sub-title">' + b.sub + '</div>';
          body += '<div class="grid">' + b.fields.map(function (f) { return fieldHTML(f.k, f, f.l); }).join('') + '</div>';
        } else if (b.t === 'cards') {
          b.ids.forEach(function (id, i) {
            body += '<div class="rowcard"><h4>' + b.names[i] + '</h4><div class="grid">' +
              b.fields.filter(function (f) { return !f.only || f.only.indexOf(i) >= 0; })
                .map(function (f) { return fieldHTML(b.key + '.' + id + '.' + f.k, cardField(f, i), f.l); }).join('') + '</div></div>';
          });
        }
      });
      h += '<section class="form-card"><h3>' + s.n + '. ' + s.title + '</h3>' + (s.hint ? '<p class="hint">' + s.hint + '</p>' : '') + body + '</section>';
    });
    return h;
  }

  g.RS = { formHTML: formHTML, consent: consent, consentHTML: consentHTML, agree: AGREE, sections: sections, list: list, keyToLabel: k2l, labelToKey: l2k, toRec: toRec, fromRec: fromRec, viewHTML: viewHTML, esc: esc };
})(window);
