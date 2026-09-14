# Grape College V4

大学课程管理平台，当前版本包含：
- 一周课表视图（周一至周日）
- 课程管理与课程时间/教室
- 每节课独立学习记录
- 课堂笔记、可编辑作业、可编辑疑惑点
- 历史记录全文搜索（课程、笔记、作业、疑惑）
- 多学期管理与切换
- 本地自动保存
- 可选 Supabase 云端同步与邮箱账号
- Excel/CSV 课表导入

## 直接部署
将 `index.html`、`style.css`、`app.js` 放在 GitHub Pages 根目录即可。

## 云端保存（Supabase）
本项目默认使用浏览器本地存储；如果想跨设备同步：
1. 创建 Supabase 项目。
2. 在 SQL Editor 执行：

```sql
create table public.coursehub_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.coursehub_data enable row level security;

create policy "users can read own data"
on public.coursehub_data for select
using (auth.uid() = user_id);

create policy "users can insert own data"
on public.coursehub_data for insert
with check (auth.uid() = user_id);

create policy "users can update own data"
on public.coursehub_data for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
```
3. 在 Supabase Auth 中开启 Email 登录。
4. 打开 Grape College → 设置 → 云端保存，填写 Project URL 和 Anon Key → 连接云端 → 登录/注册。

注意：只使用 Supabase 的公开 anon key，不要把 service_role key 放进网页。

## Excel 导入建议字段
`课程名称`、`教师`、`教室`、`星期`、`开始时间`、`结束时间`。星期可填写 `周一`～`周日` 或 `1`～`7`。
