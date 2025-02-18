create or replace function activate_premium_coupon(
  p_email text,
  p_coupon_code text
) returns void as $$
begin
  -- 이용권 사용 처리
  update premium_coupons
  set 
    is_used = true,
    used_at = now(),
    used_by = p_email
  where code = p_coupon_code
  and is_used = false;

  -- 프리미엄 계정 활성화
  insert into premium_accounts (email, activated_at, coupon_code)
  values (p_email, now(), p_coupon_code)
  on conflict (email) 
  do update set
    activated_at = now(),
    coupon_code = p_coupon_code;
end;
$$ language plpgsql security definer; 