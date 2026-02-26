
-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Categories Table (Self-referencing for tree structure)
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    icon VARCHAR(50),
    image TEXT,
    description TEXT,
    parent_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Brands Table
CREATE TABLE brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL
);

-- 3. Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(50) DEFAULT 'CUSTOMER', -- CUSTOMER, PARTNER, ADMIN
    phone VARCHAR(20),
    national_id VARCHAR(15),
    wallet_balance BIGINT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Addresses Table
CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(100),
    receiver_name VARCHAR(255),
    phone VARCHAR(20),
    province VARCHAR(100),
    city VARCHAR(100),
    full_address TEXT,
    postal_code VARCHAR(20),
    is_default BOOLEAN DEFAULT false
);

-- 5. Products Table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    name_en VARCHAR(255),
    brand_id UUID REFERENCES brands(id),
    category_id UUID REFERENCES categories(id),
    image TEXT,
    price BIGINT NOT NULL,
    wholesale_price BIGINT,
    discount_percentage INT DEFAULT 0,
    stock INT DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 5.0,
    specs JSONB, -- Storing technical specs as JSONB for flexibility
    slug VARCHAR(255) UNIQUE,
    meta_title TEXT,
    meta_description TEXT,
    is_special_offer BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Product Variants Table (Matrix: Color/Warranty)
CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    color_name VARCHAR(100),
    color_hex VARCHAR(20),
    warranty_name VARCHAR(255),
    price BIGINT,
    wholesale_price BIGINT,
    stock INT DEFAULT 0
);

-- 7. Orders Table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    address_id UUID REFERENCES addresses(id),
    total_amount BIGINT NOT NULL,
    shipping_method VARCHAR(100),
    payment_method VARCHAR(100),
    status VARCHAR(50) DEFAULT 'PENDING',
    payment_status VARCHAR(50) DEFAULT 'UNPAID',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Order Items Table
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    variant_id UUID REFERENCES product_variants(id),
    quantity INT NOT NULL,
    price_at_purchase BIGINT NOT NULL
);

-- 9. Blog Posts Table
CREATE TABLE blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT,
    image TEXT,
    author_id UUID REFERENCES users(id),
    category VARCHAR(100),
    tags TEXT[],
    read_time INT,
    views INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'DRAFT',
    publish_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
