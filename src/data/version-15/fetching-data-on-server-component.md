---
title: 'Fetching Data trong Server Components'
author: 'Tanjiro.Lam'
date: '2024-05-24'
tags: ['nextjs  ']
---

# Fetching Data trong Server Components

Server Components là một tính năng cốt lõi trong React, được tích hợp chặt chẽ trong Next.js App Router, cho phép fetching data trực tiếp trên server, giảm tải cho client, cải thiện hiệu suất và SEO. Bài viết này giải thích chi tiết cách fetching data sử dụng **fetch API**, **ORM hoặc database**, cơ chế **streaming**, và các pattern **sequential**, **parallel**, và **preload**.

## 1. Sử dụng fetch API

`fetch` API là phương pháp tích hợp sẵn trong JavaScript, được Next.js mở rộng để hỗ trợ caching và revalidation, rất phù hợp để lấy dữ liệu từ các API bên ngoài hoặc nội bộ trong Server Components.

```jsx
// app/page.js
async function Page() {
  const res = await fetch('https://api.example.com/data', {
    cache: 'force-cache' // Cache dữ liệu tĩnh
  });
  const data = await res.json();

  return (
    <div>
      <h1>Data từ API</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default Page;
```

### 1.1. Cách hoạt động

Server Components hỗ trợ `async/await`, cho phép gọi `fetch` trực tiếp trong component mà không cần các hook như `useEffect`. Next.js tích hợp cơ chế caching để giảm số lần gọi API và hỗ trợ revalidation (Incremental Static Regeneration - ISR) để làm mới dữ liệu theo thời gian.

### 1.2. Các tùy chọn cache

- **`cache: 'force-cache'`**: Cache dữ liệu vĩnh viễn, phù hợp với dữ liệu tĩnh. Đây là tùy chọn mặc định trong Next.js.
- **`cache: 'no-store'`**: Không cache, yêu cầu fetch dữ liệu mới mỗi request, phù hợp với dữ liệu động như thông tin thời gian thực.
- **`next: { revalidate: <seconds> }`**: Revalidate dữ liệu sau một khoảng thời gian, hỗ trợ ISR để cân bằng giữa hiệu suất và tính cập nhật.

**Ví dụ: Sử dụng ISR với revalidate**

```jsx
// app/page.js
async function Page() {
  const res = await fetch('https://api.example.com/news', {
    next: { revalidate: 3600 } // Revalidate sau 1 giờ
  });
  const data = await res.json();

  return (
    <div>
      <h1>Tin tức</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default Page;
```

### 1.3. Ưu điểm và Lưu ý

- **Ưu điểm**: Dễ sử dụng, tích hợp sẵn, hỗ trợ caching mạnh mẽ, phù hợp với cả REST và GraphQL APIs.
- **Lưu ý**:
  - Cần xử lý lỗi bằng try-catch để tránh crash ứng dụng.
  - Sử dụng biến môi trường (`process.env`) để lưu trữ API keys an toàn, đặc biệt khi API yêu cầu xác thực.

**Ví dụ: Xử lý lỗi với fetch API**

```jsx
// app/page.js
async function Page() {
  try {
    const res = await fetch('https://api.example.com/protected-data', {
      headers: { Authorization: `Bearer ${process.env.API_TOKEN}` },
      cache: 'no-store'
    });
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();
    return <div>{JSON.stringify(data)}</div>;
  } catch (error) {
    return <div>Error: {error.message}</div>;
  }
}

export default Page;
```

## 2. Sử dụng ORM hoặc Database

Server Components cho phép truy cập trực tiếp vào database (như PostgreSQL, MongoDB) hoặc thông qua các ORM (như Prisma, Drizzle) mà không cần API trung gian, giúp giảm độ trễ và đơn giản hóa kiến trúc ứng dụng.

### 2.1. Cách hoạt động

Vì Server Components chạy trên server, chúng có thể thực hiện truy vấn database trực tiếp trong component. Các ORM cung cấp cú pháp type-safe và dễ dùng, trong khi raw SQL (thông qua các thư viện như `@vercel/postgres`) cho phép linh hoạt hơn trong các truy vấn phức tạp.

```jsx
// app/page.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function Page() {
  const users = await prisma.user.findMany();

  return (
    <div>
      <h1>Danh sách Users</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default Page;
```

### 2.2. Ưu điểm và Lưu ý

- **Ưu điểm**:
  - Hiệu suất cao do truy cập trực tiếp database, loại bỏ độ trễ của mạng.
  - Đơn giản hóa kiến trúc bằng cách không cần tạo API endpoint.
  - Type-safety với các ORM như Prisma, giúp giảm lỗi lập trình.
- **Lưu ý**:
  - Chỉ sử dụng trong Server Components, vì Client Components không thể truy cập database.
  - Quản lý kết nối database bằng connection pooling để tránh quá tải.
  - Ngăn chặn SQL injection bằng ORM hoặc parameterized queries.
  - Tối ưu hóa truy vấn bằng cách sử dụng phân trang hoặc giới hạn bản ghi để tránh lấy dữ liệu không cần thiết.

## 3. Streaming trong Server Components

Streaming là cơ chế cho phép Server Components gửi dữ liệu từng phần đến client thay vì đợi toàn bộ dữ liệu được xử lý, cải thiện trải nghiệm người dùng bằng cách hiển thị giao diện sớm hơn.

### 3.1. Cách hoạt động

Streaming sử dụng React `<Suspense>` để hiển thị giao diện tạm thời (fallback, như loading spinner) trong khi dữ liệu đang được fetch. Next.js tự động stream các phần của trang khi chúng sẵn sàng, tận dụng tính chất async của Server Components để gửi dữ liệu từng phần.

```jsx
// app/page.js
import { Suspense } from 'react';

async function DataComponent() {
  const res = await fetch('https://api.example.com/slow-data', {
    cache: 'no-store'
  });
  const data = await res.json();
  return <div>{JSON.stringify(data)}</div>;
}

function Page() {
  return (
    <div>
      <h1>Streaming Example</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <DataComponent />
      </Suspense>
    </div>
  );
}

export default Page;
```

### 3.2. Ưu điểm và Lưu ý

- **Ưu điểm**:
  - Cải thiện thời gian hiển thị giao diện (Time to First Byte - TTFB), đặc biệt với dữ liệu lớn hoặc API chậm.
  - Mang lại trải nghiệm mượt mà hơn cho người dùng.
- **Lưu ý**:
  - Cần cấu trúc component cẩn thận để tận dụng Suspense hiệu quả.
  - Fallback UI nên đơn giản để tránh làm nặng client.

## 4. Các Pattern Fetching Data

### 4.1. Sequential Data Fetching

Sequential fetching thực hiện các request dữ liệu theo thứ tự tuần tự, nghĩa là một request phải hoàn thành trước khi bắt đầu request tiếp theo. Phương pháp này đơn giản nhưng có thể làm tăng thời gian tải tổng thể nếu có nhiều request, vì tổng thời gian bằng tổng thời gian của tất cả request.

```jsx
// app/page.js
async function Page() {
  const res1 = await fetch('https://api.example.com/data1');
  const data1 = await res1.json();
  const res2 = await fetch('https://api.example.com/data2');
  const data2 = await res2.json();

  return (
    <div>
      <h1>Sequential Data</h1>
      <div>Data 1: {JSON.stringify(data1)}</div>
      <div>Data 2: {JSON.stringify(data2)}</div>
    </div>
  );
}

export default Page;
```

### 4.2. Parallel Data Fetching

Parallel fetching sử dụng `Promise.all` để thực hiện nhiều request đồng thời, thay vì tuần tự. Điều này giảm tổng thời gian tải xuống còn bằng thời gian của request chậm nhất, thay vì tổng thời gian của tất cả request. Phương pháp này phức tạp hơn một chút nhưng hiệu quả hơn khi cần lấy dữ liệu từ nhiều nguồn.

```jsx
// app/page.js
async function Page() {
  const [res1, res2] = await Promise.all([
    fetch('https://api.example.com/data1'),
    fetch('https://api.example.com/data2')
  ]);
  const data1 = await res1.json();
  const data2 = await res2.json();

  return (
    <div>
      <h1>Parallel Data</h1>
      <div>Data 1: {JSON.stringify(data1)}</div>
      <div>Data 2: {JSON.stringify(data2)}</div>
    </div>
  );
}

export default Page;
```

### 4.3. Preload Pattern

Preload pattern cho phép bắt đầu fetching dữ liệu sớm, trước khi component được render, giúp tận dụng thời gian chờ và cải thiện hiệu suất. Logic preload có thể được tách riêng để tái sử dụng ở nhiều nơi, thường kết hợp với streaming và Suspense để tối ưu trải nghiệm người dùng.

```jsx
// app/page.js
function preloadData() {
  return Promise.all([fetch('https://api.example.com/data1'), fetch('https://api.example.com/data2')]);
}

async function Page() {
  const [res1, res2] = await preloadData();
  const data1 = await res1.json();
  const data2 = await res2.json();

  return (
    <div>
      <h1>Preload Data</h1>
      <div>Data 1: {JSON.stringify(data1)}</div>
      <div>Data 2: {JSON.stringify(data2)}</div>
    </div>
  );
}

export default Page;
```

## 5. So sánh các Phương pháp

| Phương pháp      | Ưu điểm                                 | Nhược điểm                                  |
| ---------------- | --------------------------------------- | ------------------------------------------- |
| **fetch API**    | Dễ dùng, tích hợp caching, linh hoạt    | Phụ thuộc vào mạng và API bên ngoài         |
| **ORM/Database** | Hiệu suất cao, type-safe, không cần API | Cần cấu hình database, không cache mặc định |
| **Streaming**    | Cải thiện TTFB, trải nghiệm mượt mà     | Cần cấu trúc Suspense cẩn thận              |
| **Sequential**   | Đơn giản, dễ triển khai                 | Chậm nếu có nhiều request                   |
| **Parallel**     | Nhanh hơn, giảm thời gian tải           | Phức tạp hơn sequential                     |
| **Preload**      | Tối ưu thời gian chờ, tái sử dụng tốt   | Cần quản lý logic preload riêng             |

## 6. Best Practices

1. **Chọn phương pháp phù hợp**:

   - Sử dụng `fetch API` khi lấy dữ liệu từ API bên ngoài.
   - Sử dụng ORM/database cho dữ liệu nội bộ để tối ưu hiệu suất.
   - Áp dụng streaming với Suspense cho dữ liệu lớn hoặc API chậm.

2. **Xử lý lỗi**:

   - Sử dụng try-catch để xử lý lỗi cho cả `fetch` và truy vấn database.
   - Kiểm tra trạng thái phản hồi (`res.ok`) với `fetch` để xử lý lỗi HTTP.

3. **Tối ưu hóa hiệu suất**:

   - Sử dụng parallel fetching hoặc preload để giảm thời gian tải.
   - Áp dụng caching (`force-cache`, ISR) cho `fetch API`.
   - Tối ưu truy vấn database bằng phân trang hoặc giới hạn bản ghi.

4. **Bảo mật**:
   - Lưu API keys trong biến môi trường (`process.env`) khi sử dụng `fetch`.
   - Sử dụng ORM hoặc parameterized queries để ngăn chặn SQL injection.

## 7. Kết luận

Fetching data trong Server Components với `fetch API` và ORM/database cung cấp các phương pháp mạnh mẽ để xây dựng ứng dụng hiệu quả. Streaming cải thiện trải nghiệm người dùng bằng cách hiển thị giao diện sớm hơn, trong khi các pattern như sequential, parallel, và preload giúp tối ưu hóa hiệu suất fetching. Bằng cách áp dụng các phương pháp này và tuân theo best practices, bạn có thể tạo ra các ứng dụng Next.js nhanh, đáng tin cậy và dễ bảo trì.
