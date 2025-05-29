---
title: 'Server Components và Client Components trong Next.js'
author: 'Tanjiro.Lam'
date: '2024-05-24'
tags: ['nextjs  ']
---

# Server Components và Client Components trong Next.js

Dưới đây là tổng quan và chi tiết về **Server Components** và **Client Components** trong Next.js, dựa trên kiến thức cập nhật đến ngày 24/05/2025. Next.js, từ phiên bản 13 với App Router, đã giới thiệu React Server Components (RSC) như một tính năng cốt lõi, thay đổi cách xây dựng ứng dụng React.

---

## 1. Tổng quan

### Server Components

- **Định nghĩa**: Các thành phần React được render hoàn toàn trên server.
- **Mặc định**: Tất cả component trong thư mục `app/` của Next.js là Server Components, trừ khi chỉ định khác.
- **Đặc điểm**:
  - -Không gửi mã JavaScript xuống client, giảm kích thước bundle và cải thiện hiệu suất.
  - -Phù hợp để fetch dữ liệu, xử lý logic server-side, và giữ bí mật (secrets) như API keys.

### Client Components

- **Định nghĩa**: Các thành phần React được render và hydrat hóa trên client (trình duyệt).
- **Yêu cầu**: Cần directive `'use client'` ở đầu file để chạy trên client.
- **Đặc điểm**:
  - -Hỗ trợ tương tác với `useState`, `useEffect`, event handlers (`onClick`), và browser APIs (`window`, `localStorage`).
  - -Có thể pre-render trên server, sau đó hydrat hóa trên client để trở thành tương tác.

### Mục tiêu chung

- Kết hợp lợi ích của server-side rendering (SSR) và client-side interactivity (CSR) để tối ưu hiệu suất, SEO, và trải nghiệm người dùng.

---

## 2. Sự khác biệt chính

| **Tiêu chí**          | **Server Components**                  | **Client Components**                            |
| --------------------- | -------------------------------------- | ------------------------------------------------ |
| **Nơi render**        | Chỉ trên server                        | Pre-render trên server, hydrat hóa trên client   |
| **JavaScript bundle** | Không gửi xuống client                 | Gửi xuống client để hydrat hóa                   |
| **Tương tác**         | Không hỗ trợ (không có state, effect)  | Hỗ trợ đầy đủ (state, effect, event)             |
| **API truy cập**      | Chỉ server-side APIs (fetch, database) | Cả server-side và client-side APIs               |
| **Directive**         | Không cần (mặc định)                   | Cần `'use client'`                               |
| **SEO**               | Tốt (HTML được render sẵn)             | Tốt (nếu pre-render), nhưng phụ thuộc hydrat hóa |
| **Hiệu suất**         | Cao (ít JS gửi xuống client)           | Thấp hơn (cần tải JS để hydrat hóa)              |

---

## 3. Cách hoạt động

### Server Components

- -Render trên server thành HTML và React Server Component Payload (RSC Payload) – định dạng nhị phân chứa kết quả render và placeholders cho Client Components.
- -Dữ liệu được fetch trực tiếp trong component (với `async/await`), không cần API trung gian.
- -Kết quả được stream xuống client, có thể kết hợp với `Suspense` để render từng phần.

### Client Components

- -Pre-render trên server để tạo HTML ban đầu, sau đó gửi xuống client cùng JavaScript bundle.
- -Hydrat hóa gắn event handlers và state để biến HTML tĩnh thành ứng dụng tương tác.
- -Logic client-side (như `useEffect`) chỉ chạy sau khi hydrat hóa hoàn tất.

### Mối quan hệ giữa hai loại

- -Server Components có thể truyền props (serializable) cho Client Components.
- -Client Components có thể bao gồm Server Components làm children (qua `children` prop), nhưng không nên import trực tiếp Server Component vào Client Component (sẽ chuyển thành Client Component).

---

## 4. Khi nào sử dụng

### Server Components

- -Fetch dữ liệu từ database hoặc API (gần nguồn dữ liệu).
- -Render nội dung tĩnh hoặc không yêu cầu tương tác (danh sách bài viết, metadata).
- -Cần bảo mật (API keys, secrets) vì không gửi xuống client.
- -**Ví dụ**: Component hiển thị danh sách sản phẩm từ database.

### Client Components

- -Cần tương tác người dùng (form, button, modal).
- -Sử dụng browser APIs (`window`, `navigator`, `localStorage`).
- -Quản lý state cục bộ hoặc global (qua Context, Redux).
- -**Ví dụ**: Component đếm số lần click hoặc form đăng nhập.

---

## 5. Cách định nghĩa

### Server Component (mặc định)

```tsx
export default function Page() {
  return <div>Hello from Server Component</div>;
}
```
