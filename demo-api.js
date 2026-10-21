/* ════════════════════════════════════════════════════════════════
   示範模式資料層（僅在尚未填入 Apps Script 網址時使用）
   讓 resume.html、resume-admin.html、hr-admin.html 在沒有 Google 試算表時也能預覽與操作。
   資料只存在這台電腦的瀏覽器（localStorage），不會送到任何地方。
   填入正式 API_URL 後這個檔案就不會被用到，可保留或刪除。
   示範帳號：admin / admin123
   ════════════════════════════════════════════════════════════════ */
(function (g) {
  var KEY = 'dx_demo_db_v1';
  function init() { return { resumes: [], photos: {}, tokens: {}, seeded: false, admins: [{ name: '系統管理員', acc: 'admin', pw: 'admin123', role: 'super', email: '', _row: 2 }] }; }
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || init(); } catch (e) { return init(); } }
  function save(db) { try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) {} }
  function stamp(d) { var p = function (n) { return ('0' + n).slice(-2); }; d = d || new Date(); return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds()); }

  function seed(db) {                       // 第一次開後台時放一筆範例履歷，方便預覽版面與 Word
    if (db.seeded || !g.RS) return;
    db.seeded = true;
    var d = {
      'job.title': '產品經理（範例）', 'job.date': stamp().slice(0, 10), 'channel': '104人力銀行',
      'basic.name_zh': '王小明（範例）', 'basic.name_en': 'Ming Wang', 'basic.id_no': 'A123456789', 'basic.birth': '1990-05-05',
      'basic.gender': '男', 'basic.marital': '單身', 'basic.military': '役畢', 'basic.nation': '中華民國', 'basic.mobile': '0912345678',
      'basic.email': 'demo@example.com', 'addr.reg': '台北市信義區範例路 1 號', 'addr.mail': '台北市信義區範例路 1 號',
      'emg.name': '王媽媽', 'emg.rel': '母親', 'emg.tel': '0922333444',
      'lang.0.listen': '2 很好', 'lang.0.speak': '3 好', 'lang.0.read': '2 很好', 'lang.0.write': '3 好',
      'fam.0.rel': '父', 'fam.0.name': '王爸爸', 'fam.0.age': '62', 'fam.0.job': '退休',
      'edu.univ.school': '範例大學', 'edu.univ.dept': '資訊管理學系', 'edu.univ.shift': '日間', 'edu.univ.from': '2008-09', 'edu.univ.to': '2012-06', 'edu.univ.status': '畢業',
      'pc.0.item': 'Excel', 'pc.0.level': '非常熟悉', 'pc.0.exp': '有', 'cert.0.name': 'PMP', 'cert.0.org': 'PMI', 'cert.0.ym': '2020-03', 'cert.0.has': '有',
      'ref.0.name': '李主管', 'ref.0.company': '範例股份有限公司', 'ref.0.title': '部門經理', 'ref.0.tel': '0933111222', 'ref.0.rel': '前直屬主管',
      'job.0.company': '範例股份有限公司', 'job.0.size': '200 人', 'job.0.dept': '產品部', 'job.0.title': '產品專員', 'job.0.from': '2012-07', 'job.0.to': '2024-12',
      'job.0.mgr': '否', 'job.0.duties': '負責產品規劃、專案管理與跨部門溝通。', 'job.0.reason': '尋求更大發展', 'job.0.fixed': '50000', 'job.0.allow': '2000', 'job.0.total': '52000',
      'job.0.fixed_m': '14', 'job.0.bonus_m': '1.5', 'job.0.total_m': '15.5',
      'exp.monthly': '60000', 'exp.start': '2026-12-01',
      'cr.check': '無', 'cr.card': '無', 'cr.other': '無', 'rel.relative': '無', 'rel.director': '無', 'rel.china': '無', 'rel.noncompete': '無', 'rel.ip': '無',
      'consent': '1', 'signature': '王小明', 'sign_date': stamp().slice(0, 10)
    };
    var rec = RS.toRec(d); rec['ID'] = 'DEMO-SAMPLE-0001'; rec['提交時間'] = stamp(); rec['_row'] = 2; rec['_hasPhoto'] = false;
    db.resumes.push(rec);
  }

  function route(d) {
    var db = load(), a = d.action;
    if (a === 'login') {
      for (var i = 0; i < db.admins.length; i++) {
        var x = db.admins[i];
        if (x.acc === d.acc && x.pw === d.pw) {
          var t = 'demo' + Math.random().toString(36).slice(2) + Date.now().toString(36);
          db.tokens[t] = x.acc; save(db);
          return { status: 'success', token: t, admin: { name: x.name, acc: x.acc, email: x.email, role: x.role } };
        }
      }
      return { status: 'error', message: 'Invalid credentials' };
    }
    if (a === 'saveResume') {
      if (db.resumes.some(function (r) { return r.ID === d.id; })) return { status: 'success', duplicate: true };
      var rec = {}; for (var k in d.rec) rec[k] = d.rec[k];
      rec['ID'] = d.id; rec['提交時間'] = stamp(); rec['_row'] = db.resumes.length + 2; rec['_hasPhoto'] = !!d.photo;
      db.resumes.push(rec); if (d.photo) db.photos[d.id] = d.photo; save(db);
      return { status: 'success', id: d.id };
    }
    if (a === 'checkResume') return { status: 'success', exists: db.resumes.some(function (r) { return r.ID === d.id; }) };
    if (!db.tokens[d.token]) return { status: 'error', message: 'SESSION_EXPIRED' };
    if (a === 'getResumes') { seed(db); save(db); return { status: 'success', records: db.resumes }; }
    if (a === 'getPhoto') return { status: 'success', photo: db.photos[d.id] || '' };
    if (a === 'deleteResume') { db.resumes = db.resumes.filter(function (r) { return r.ID !== d.id; }); delete db.photos[d.id]; save(db); return { status: 'success' }; }
    if (a === 'getAdmins') return { status: 'success', admins: db.admins.map(function (x) { return { name: x.name, acc: x.acc, email: x.email, role: x.role, _row: x._row }; }) };
    if (a === 'saveAdmin') {
      if (db.admins.some(function (x) { return x.acc === d.acc; })) return { status: 'error', message: '帳號已存在' };
      db.admins.push({ name: d.name, acc: d.acc, pw: d.pw, role: d.role, email: d.email || '', _row: db.admins.length + 2 }); save(db); return { status: 'success' };
    }
    if (a === 'updateAdmin') {
      db.admins.forEach(function (x) { if (x._row === Number(d._row)) { x.name = d.name; x.acc = d.acc; x.email = d.email || ''; x.role = d.role; if (d.pw && d.pw !== '__keep__') x.pw = d.pw; } });
      save(db); return { status: 'success' };
    }
    if (a === 'deleteAdmin') {
      if (db.admins.length <= 1) return { status: 'error', message: '至少保留一位管理員' };
      db.admins = db.admins.filter(function (x) { return x._row !== Number(d._row); }); save(db); return { status: 'success' };
    }
    return { status: 'success' };
  }
  g.DemoAPI = { route: route, reset: function () { try { localStorage.removeItem(KEY); } catch (e) {} } };
})(window);
