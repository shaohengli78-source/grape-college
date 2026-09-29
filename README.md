# Grape College

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
- 08:00–22:00 课表，手机可按星期切换
- iCloud 云盘文件备份与恢复（无需填写项目密钥）

## iPhone 备份与恢复
在「设置 → 备份学习资料」点「创建备份」，在分享菜单选「存储到文件」，位置选「iCloud 云盘」。换设备时，点「从备份恢复」，在文件选择器里打开之前的 JSON 文件。恢复会替换当前设备的数据，请先备份。每次修改后要重新创建备份；此方式不会自动同步。

## 直接部署
将 `index.html`、`style.css`、`app.js` 放在 GitHub Pages 根目录即可。

## 云端保存（Supabase）
本项目默认使用浏览器本地存储。无需配置的手动云盘备份见上文；如果需要自动跨设备同步：
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
