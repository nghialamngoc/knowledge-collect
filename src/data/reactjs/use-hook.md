# React Use Hook - Hướng dẫn chi tiết

Hook `use` là một hook mới được giới thiệu trong React 19, cho phép bạn đọc giá trị từ một resource như Promise hoặc Context.

## Tổng quan

```javascript
const value = use(resource)
```

Hook `use` khác với các hook khác ở chỗ:

- Có thể được gọi bên trong loops và điều kiện
- Có thể được gọi từ bất kỳ function nào được gọi từ một Component hoặc Hook
- **Khi được gọi với Promise**: cần Suspense và Error Boundaries
- **Khi được gọi với Context**: không cần Suspense, hoạt động như useContext

## 1. Sử dụng với Promise

### Cú pháp cơ bản

```javascript
import { use } from 'react'

function MyComponent() {
  const data = use(fetchData()) // fetchData() returns a Promise
  return <div>{data}</div>
}
```

### Ví dụ thực tế với Promise

```javascript
import { use, Suspense } from 'react'

// Function trả về Promise
async function fetchUserData(userId) {
  const response = await fetch(`/api/users/${userId}`)
  if (!response.ok) {
    throw new Error('Failed to fetch user')
  }
  return response.json()
}

function UserProfile({ userId }) {
  // use hook sẽ "unwrap" Promise
  const user = use(fetchUserData(userId))

  return (
    <div>
      <h1>{user.name}</h1>
      <p>Email: {user.email}</p>
      <p>Age: {user.age}</p>
    </div>
  )
}

function App() {
  return (
    <Suspense fallback={<div>Loading user...</div>}>
      <UserProfile userId={123} />
    </Suspense>
  )
}
```

### Xử lý lỗi với Error Boundary

```javascript
import { use, Suspense } from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong!</div>
    }

    return this.props.children
  }
}

function DataComponent() {
  // Nếu Promise reject, Error Boundary sẽ catch
  const data = use(fetchRiskyData())
  return <div>{data}</div>
}

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <DataComponent />
      </Suspense>
    </ErrorBoundary>
  )
}
```

## 2. Sử dụng với Context

Hook `use` cũng có thể đọc Context, tương tự như `useContext` nhưng linh hoạt hơn. **Quan trọng**: Khi sử dụng với Context, **KHÔNG cần** Suspense.

### Ví dụ với Context (không cần Suspense)

````javascript
import { use, createContext } from 'react';

const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function Button() {
  // Không cần Suspense khi sử dụng với Context
  const { theme, setTheme } = use(ThemeContext);

  return (
    <button
      style={{
        background: theme === 'dark' ? 'black' : 'white',
        color: theme === 'dark' ? 'white' : 'black'
      }}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      Toggle Theme
    </button>
  );
}

// App không cần Suspense cho Context
function App() {
  return (
    <ThemeProvider>
      <Button />
    </ThemeProvider>
  );
}

### Ví dụ sử dụng có điều kiện với Context

```javascript
function ConditionalThemeButton({ shouldUseTheme }) {
  let theme = 'default';

  // use có thể được gọi có điều kiện (khác với useContext)
  // Vẫn không cần Suspense
  if (shouldUseTheme) {
    theme = use(ThemeContext);
  }

  return <button>Theme: {theme}</button>;
}

// Vẫn không cần Suspense
function App() {
  return (
    <ThemeProvider>
      <ConditionalThemeButton shouldUseTheme={true} />
    </ThemeProvider>
  );
}
````

## 3. Sử dụng trong Loops và Điều kiện

Một trong những điểm mạnh của `use` là có thể được gọi trong loops và điều kiện.

```javascript
function MultipleDataComponent({ dataIds }) {
  const results = []

  // Có thể sử dụng use trong loop
  for (const id of dataIds) {
    const data = use(fetchData(id))
    results.push(data)
  }

  return (
    <div>
      {results.map((data, index) => (
        <div key={index}>{data.name}</div>
      ))}
    </div>
  )
}

function ConditionalDataComponent({ shouldFetch, dataId }) {
  let data = null

  // Có thể sử dụng use có điều kiện
  if (shouldFetch) {
    data = use(fetchData(dataId))
  }

  return <div>{data ? data.name : 'No data'}</div>
}
```

## 4. Caching và Optimization

React tự động cache kết quả của Promise để tránh fetch lại không cần thiết.

```javascript
// Promise với cùng tham số sẽ được cache
function UserList() {
  const user1 = use(fetchUser(1)) // Fetch lần đầu
  const user1Again = use(fetchUser(1)) // Sử dụng cache
  const user2 = use(fetchUser(2)) // Fetch mới

  return (
    <div>
      <div>{user1.name}</div>
      <div>{user2.name}</div>
    </div>
  )
}
```

## 5. Patterns và Best Practices

### Pattern: Data Fetching với Suspense

```javascript
import { use, Suspense } from 'react'

// Tạo resource trước khi render
function createResource(promise) {
  return promise
}

function App() {
  // Tạo resource ngay khi component mount
  const userResource = createResource(fetchUser(1))
  const postsResource = createResource(fetchPosts())

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserProfile userResource={userResource} />
      <PostsList postsResource={postsResource} />
    </Suspense>
  )
}

function UserProfile({ userResource }) {
  const user = use(userResource)
  return <div>{user.name}</div>
}

function PostsList({ postsResource }) {
  const posts = use(postsResource)
  return (
    <div>
      {posts.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  )
}
```

### Pattern: Conditional Data Fetching

```javascript
function SearchResults({ query, shouldSearch }) {
  if (!shouldSearch || !query) {
    return <div>No search performed</div>
  }

  // Chỉ fetch khi cần thiết
  const results = use(searchAPI(query))

  return (
    <div>
      {results.map(result => (
        <div key={result.id}>{result.title}</div>
      ))}
    </div>
  )
}
```

### Pattern: Waterfall vs Parallel Fetching

```javascript
// Waterfall (sequential) - chậm
function WaterfallComponent({ userId }) {
  const user = use(fetchUser(userId))
  const posts = use(fetchUserPosts(user.id)) // Chờ user fetch xong

  return (
    <div>
      {user.name} has {posts.length} posts
    </div>
  )
}

// Parallel - nhanh hơn
function ParallelComponent({ userId }) {
  const userPromise = fetchUser(userId)
  const postsPromise = fetchUserPosts(userId) // Không cần chờ

  const user = use(userPromise)
  const posts = use(postsPromise)

  return (
    <div>
      {user.name} has {posts.length} posts
    </div>
  )
}
```

## 6. So sánh với các Hook khác

### `use` vs `useEffect` + `useState`

```javascript
// Cách cũ với useEffect
function OldWayComponent({ userId }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchUser(userId)
      .then(setUser)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [userId])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return <div>{user?.name}</div>
}

// Cách mới với use
function NewWayComponent({ userId }) {
  const user = use(fetchUser(userId))
  return <div>{user.name}</div>
}

// Cần wrap với Suspense và Error Boundary
function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <NewWayComponent userId={1} />
      </Suspense>
    </ErrorBoundary>
  )
}
```

### `use` vs `useContext`

```javascript
const MyContext = createContext()

// useContext - chỉ dùng ở top level
function ComponentWithUseContext() {
  const value = useContext(MyContext) // Phải ở top level

  // Không thể gọi useContext có điều kiện
  return <div>{value}</div>
}

// use - linh hoạt hơn
function ComponentWithUse({ condition }) {
  let value = 'default'

  if (condition) {
    value = use(MyContext) // Có thể gọi có điều kiện
  }

  return <div>{value}</div>
}
```

## 7. Hạn chế và Lưu ý

### Hạn chế

- Hook `use` chỉ có sẵn từ React 19
- Khi sử dụng với Promise, cần wrap component với Suspense
- Error handling cần Error Boundary
- Không thể sử dụng với Promise được tạo bên trong render

### Lưu ý quan trọng

```javascript
// ❌ Sai - tạo Promise trong render
function BadComponent() {
  const data = use(fetch('/api/data')) // Tạo Promise mới mỗi render
  return <div>{data}</div>
}

// ✅ Đúng - tạo Promise bên ngoài
const dataPromise = fetch('/api/data')

function GoodComponent() {
  const data = use(dataPromise) // Sử dụng Promise đã tạo
  return <div>{data}</div>
}

// ✅ Hoặc pass Promise từ component cha
function ParentComponent() {
  const dataPromise = useMemo(() => fetch('/api/data'), [])

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChildComponent dataPromise={dataPromise} />
    </Suspense>
  )
}

function ChildComponent({ dataPromise }) {
  const data = use(dataPromise)
  return <div>{data}</div>
}
```

## 8. Migration từ useEffect

### Trước khi có `use`

```javascript
function UserProfile({ userId }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    fetchUser(userId)
      .then(userData => {
        if (!cancelled) {
          setUser(userData)
          setLoading(false)
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err)
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [userId])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!user) return null

  return <div>Hello, {user.name}!</div>
}
```

### Sau khi có `use`

```javascript
function UserProfile({ userId }) {
  const user = use(fetchUser(userId))
  return <div>Hello, {user.name}!</div>
}

// Cần wrap với Suspense và Error Boundary ở cấp cao hơn
function App() {
  return (
    <ErrorBoundary fallback={<div>Something went wrong!</div>}>
      <Suspense fallback={<div>Loading...</div>}>
        <UserProfile userId={1} />
      </Suspense>
    </ErrorBoundary>
  )
}
```

## Tóm tắt: Khi nào cần Suspense với `use`

| Loại Resource | Cần Suspense? | Cần Error Boundary? | Lý do                         |
| ------------- | ------------- | ------------------- | ----------------------------- |
| **Promise**   | ✅ Có         | ✅ Có               | Promise có thể pending/reject |
| **Context**   | ❌ Không      | ❌ Không            | Context luôn có sẵn giá trị   |

### Ví dụ minh họa

```javascript
// ❌ Promise - CẦN Suspense
function DataComponent() {
  const data = use(fetchData()) // Promise
  return <div>{data}</div>
}

function App1() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DataComponent />
    </Suspense>
  )
}

// ✅ Context - KHÔNG cần Suspense
function ThemeComponent() {
  const theme = use(ThemeContext) // Context
  return <div>Theme: {theme}</div>
}

function App2() {
  return (
    <ThemeProvider>
      <ThemeComponent /> {/* Không cần Suspense */}
    </ThemeProvider>
  )
}
```

## Kết luận

Hook `use` là một bước tiến quan trọng trong React, giúp:

- Đơn giản hóa data fetching
- Tích hợp tốt với Suspense và Error Boundaries (khi dùng với Promise)
- Linh hoạt hơn trong việc sử dụng (có thể gọi có điều kiện, trong loops)
- Thay thế useContext một cách linh hoạt hơn (khi dùng với Context)
- Giảm boilerplate code so với useEffect + useState

**Nhớ rằng**:

- **Promise** → Cần Suspense + Error Boundary
- **Context** → Không cần Suspense, chỉ cần Provider
