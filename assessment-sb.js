/* 敦新科技｜測驗成績送出（三個測驗共用）
 * 用法：DX.submit('ai' | 'logic' | 'personality', 與舊系統相同的成績物件)
 * - 送到 Supabase 的 submit-assessment 函式；失敗會自動重試 3 次，仍失敗就在畫面上方顯示紅色提示與「重新送出」按鈕
 * - 同一頁面只會產生一個送件編號，重試或重複按都不會重複寫入
 */
(function () {
  var ERRMAP = {
    busy: '目前送出人數較多，請稍後按「重新送出」',
    too_many_requests: '送出次數過多，請稍後按「重新送出」',
    origin_not_allowed: '此網站不被允許送出資料，請通知面試人員',
    missing_name: '缺少姓名，請通知面試人員',
  };
  var id = 'S-' + (window.crypto && crypto.randomUUID ? crypto.randomUUID() : Date.now() + '-' + Math.random().toString(16).slice(2));
  var banner = null;

  function show(msg, retry) {
    if (!banner) {
      banner = document.createElement('div');
      banner.setAttribute('role', 'alert');
      banner.style.cssText = 'position:fixed;left:0;right:0;top:0;z-index:99999;background:#8b2020;color:#fff;padding:12px 16px;font:14px/1.6 "Noto Sans TC","Microsoft JhengHei",sans-serif;text-align:center';
      document.body.appendChild(banner);
    }
    banner.textContent = '';
    var t = document.createElement('span'); t.textContent = msg; banner.appendChild(t);
    if (retry) {
      var b = document.createElement('button'); b.textContent = '重新送出';
      b.style.cssText = 'margin-left:12px;padding:4px 14px;border:0;border-radius:6px;background:#fff;color:#8b2020;font-weight:600;cursor:pointer';
      b.onclick = retry; banner.appendChild(b);
    }
  }
  function hide() { if (banner && banner.parentNode) banner.parentNode.removeChild(banner); banner = null; }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  async function once(kind, data) {
    var res = await fetch(window.SB.url + '/functions/v1/submit-assessment', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind: kind, id: id, data: data }),
    });
    var j = await res.json().catch(function () { return {}; });
    if (res.ok && j.ok) return { ok: true };
    return { ok: false, msg: ERRMAP[j.error] || '', fatal: res.status >= 400 && res.status < 500 && res.status !== 429 };
  }

  async function submit(kind, data) {
    data = JSON.parse(JSON.stringify(data));                 // 不要把網頁內部物件帶出去；也避免之後被改動
    delete data.action;
    var delays = [0, 2000, 5000];
    var last = { msg: '' };
    for (var i = 0; i < delays.length; i++) {
      if (delays[i]) await wait(delays[i]);
      try { last = await once(kind, data); } catch (e) { last = { ok: false, msg: '' }; }
      if (last.ok) { hide(); window.__dxSubmitted = true; return true; }
      if (last.fatal) break;                                  // 4xx（資料有問題）重試也沒用
    }
    show((last.msg || '成績送出失敗（可能是網路問題）') + '。請勿關閉此頁面，按「重新送出」，或通知面試人員。', function () { show('送出中…'); submit(kind, data); });
    return false;
  }

  window.DX = window.DX || {};
  window.DX.submit = submit;
})();
