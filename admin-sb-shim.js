/* 敦新科技｜三個測驗後台（AI／邏輯／人格）改讀 Supabase 的轉接層
 *
 * 舊後台頁面原本用 api({action:...}) 呼叫 Apps Script。這支檔案提供相同介面的 DXSB.api(kind, payload)，
 * 內容改成讀寫 Supabase（使用整合後台已登入的管理員身分，權限由資料庫的 RLS 把關），
 * 所以舊頁面的報告、圖表、排序、PDF 等畫面程式完全不用重寫。
 *
 * 只支援：讀取紀錄、刪除紀錄。管理員帳號管理已統一到整合後台，這裡一律停用。
 */
(function () {
  var TABLES = { ai: 'assessments_ai', logic: 'assessments_logic', personality: 'assessments_personality' };
  var EMBED = new URLSearchParams(location.search).get('embed') === '1';
  var sb = supabase.createClient(SB.url, SB.anonKey, { auth: { persistSession: true, autoRefreshToken: true, storageKey: 'dx-sb-session' } });
  var idMap = { ai: {}, logic: {}, personality: {} };            // 舊頁面用數字「列號」指定要刪的紀錄；這裡對回資料表的 uuid

  function expired() {
    if (EMBED) parent.postMessage({ type: 'dx-expired' }, '*');
    return new Error('登入已逾時，請重新登入');
  }
  function when(row) {                                            // 舊頁面解析「測驗日期」字串；沒有時用建立時間補上
    if (row.test_date) return row.test_date;
    return new Date(row.created_at).toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' }).replace(/\s/g, ' ');
  }
  var MAP = {
    ai: function (r, i) {
      var e = Array.isArray(r.essays) ? r.essays : [], essays = [];
      for (var k = 0; k < 5; k++) essays.push({ q: (e[k] && e[k].q) || '', a: (e[k] && e[k].a) || '' });
      return { _sheetRow: i + 2, id: r.id, name: r.name || '', phone: r.phone || '', job: r.job || '', date: r.interview_date || '', role: r.role || '', elapsed: r.elapsed || '',
        mcqCorrect: r.mcq_correct, basicCorrect: r.basic_correct, midCorrect: r.mid_correct, hardCorrect: r.hard_correct, answerRate: r.answer_rate || '', testDate: when(r), essays: essays };
    },
    logic: function (r, i) {
      return { _sheetRow: i + 2, id: r.id, name: r.name || '', phone: r.phone || '', job: r.job || '', date: r.interview_date || '', elapsed: r.elapsed || '',
        abstract: r.abstract, visual: r.visual, quant: r.quant, critical: r.critical, weightedScore: r.weighted_score, mainDim: r.main_dim || '',
        answerRate: r.answer_rate || '', answered: r.answered, total: r.total, testDate: when(r) };
    },
    personality: function (r, i) {
      return { _sheetRow: i + 2, id: r.id, name: r.name || '', phone: r.phone || '', job: r.job || '', date: r.interview_date || '', elapsed: r.elapsed || '',
        mainTrait: r.main_trait || '', answerRate: r.answer_rate || '', answered: r.answered, total: r.total, testDate: when(r), scores: r.scores || {} };
    },
  };

  async function list(kind) {
    var s = await sb.auth.getSession();
    if (!s.data || !s.data.session) throw expired();
    var rows = [];
    for (var from = 0; ; from += 1000) {
      var r = await sb.from(TABLES[kind]).select('*').order('created_at', { ascending: true }).order('id', { ascending: true }).range(from, from + 999);
      if (r.error) { if (/JWT|expired/i.test(r.error.message)) throw expired(); throw new Error(r.error.message); }
      rows = rows.concat(r.data);
      if (r.data.length < 1000) break;
    }
    idMap[kind] = {};
    var records = rows.map(function (row, i) { var o = MAP[kind](row, i); idMap[kind][o._sheetRow] = row.id; return o; });
    return { status: 'success', records: records };
  }

  async function del(kind, idx) {
    var id = idMap[kind][Number(idx)];
    if (!id) throw new Error('找不到這筆紀錄，請重新整理後再試');
    var r = await sb.from(TABLES[kind]).delete().eq('id', id).select('id');
    if (r.error) throw new Error(r.error.message);
    if (!r.data || !r.data.length) throw new Error('刪除失敗：沒有權限，或紀錄已不存在');
    return { status: 'success' };
  }

  window.DXSB = {
    EMBED: EMBED,
    api: async function (kind, payload) {
      var a = String((payload && payload.action) || '');
      if (/^get\w*Records$/.test(a)) return list(kind);
      if (/^delete\w*Record$/.test(a)) return del(kind, payload.idx);
      if (a === 'getAdmins') return { status: 'success', admins: [] };
      if (a === 'login') throw new Error('Invalid credentials');          // 連線測試用；登入統一在整合後台
      throw new Error('此功能已停用，請到「HR 管理後台 → 管理員設定」操作');
    },
  };
})();
