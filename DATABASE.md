# Drury 188-189 Database Documentation

The application uses a hybrid data architecture combining **Google Firebase Firestore** for real-time cloud synchronization and **LocalStorage** for offline persistence and high-performance initial loads.

---

## 🏗️ Architecture Summary

- **Primary DB**: Cloud Firestore (NoSQL)
- **Persistence Layer**: `onSnapshot` listeners sync with `localStorage` (key: `drury_*`)
- **State Management**: React Context (`StoreContext` in `lib/store.tsx`)
- **Authentication**: Role-based (Admin, Barista, Member) - Credentials in `curator` admin.

---

## 📁 Collections & Schemas

### 1. `posts`
*Journal entries for the Sanctuary Journal.*
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Firestore Document ID |
| `title` | `string` | Article title |
| `date` | `string` | Publication date (e.g., "Oct 12, 2024") |
| `category` | `string` | e.g. "Community", "News", "Coffee" |
| `excerpt` | `string` | Short summary |
| `image` | `url` | Unsplash or uploaded asset |
| `status` | `enum` | `Published`, `Pending`, `Draft` |
| `isFeatured`| `boolean`| Highlighted in Hero/Masonry |

---

### 2. `napkins`
*Community-created art from the Napkin Art Project.*
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Original record ID (e.g. "042") |
| `artist` | `string` | Name of the guest/artist |
| `image` | `url` | Photo of the napkin art |
| `type` | `string` | Art style (Portrait, Abstract, Sketch) |
| `desc` | `string` | Backstory or caption |
| `status` | `enum` | `Published`, `Pending`, `Draft` |
| `rotate` | `number` | Display rotation in degrees |

---

### 3. `menu`
*Full restaurant menu with ordering support.*
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Firestore Document ID |
| `name` | `string` | Dish or drink name |
| `description`| `string` | Ingredients or notes (e.g. "VG", "GF") |
| `price` | `string` | Formatted price (e.g. "£9.50") |
| `category` | `enum` | Brunch, Extras, Eggs, Sweets, Coffee, etc. |
| `image` | `url` | Product photography |
| `status` | `enum` | `Published`, `Draft` |

---

### 4. `artisans`
*Staff profiles and VIP members.*
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Record ID |
| `name` | `string` | Full name |
| `email` | `string` | Contact email |
| `role` | `enum` | `Admin`, `Barista`, `Member` |
| `status` | `enum` | `Active`, `Inactive`, `Pending` |
| `joinDate` | `string` | Date they joined the community |
| `avatar` | `url` | Portrait image |

---

### 5. `config/settings`
*Global singleton for site-wide metadata.*
| Field | Type | Description |
| :--- | :--- | :--- |
| `studioName` | `string` | Primary branding (Drury 188-189) |
| `tagline` | `string` | Main slogan |
| `description`| `string` | SEO Meta description |
| `email` | `string` | Contact address |
| `weekdayHours`| `string` | e.g. "08:00 - 18:00" |
| `weekendHours`| `string` | e.g. "09:00 - 17:00" |

---

### 6. `subscribers`
*Mailing list for the community newsletter.*
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Document ID |
| `email` | `string` | Subscriber email (unique) |
| `status` | `enum` | `active`, `inactive` |
| `createdAt` | `timestamp` | Time of subscription |

---

### 7. `inquiries`
*Real-time inquiries from the Visit and Contact pages.*
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Document ID |
| `name` | `string` | Sender's full name |
| `email` | `string` | Sender's email |
| `phone` | `string` | Optional contact number |
| `location` | `string` | Intent (e.g. "Covent Garden (Walk-in)") |
| `date` | `string` | Planned visit date (ISO or null) |
| `message` | `string` | Message content |
| `status` | `enum` | `new`, `read`, `archived` |
| `createdAt` | `timestamp` | Time of submission |

---

## 💾 Local Persistence Keys
- `drury_posts`
- `drury_napkins`
- `drury_menu`
- `drury_artisans`
- `drury_settings`
- `drury_subscribers`
- `drury_inquiries`
- `drury_cart`
- `drury_user`
