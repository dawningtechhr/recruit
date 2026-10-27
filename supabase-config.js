// Supabase 連線設定（公開資訊：網址與 publishable 金鑰本來就可以放在網頁裡；資料安全靠資料庫的 RLS 權限）
// ⚠ 這裡絕對不可以放 service_role（secret）金鑰。
window.SB = {
  url: 'https://otawamnzxqnnhnojpcun.supabase.co',
  anonKey: 'sb_publishable_9WpcfBT73mldAnGMGXPKpA_UDPhC7Rw'
};
