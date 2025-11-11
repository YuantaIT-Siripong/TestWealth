# Database Schema Documentation

## Overview

This document describes the database schema for the WealthOps Inquiries and Offer module. The database uses PostgreSQL (MySQL compatible).

## Schema Design Principles

1. **Normalized Structure**: 3NF normalization for transactional data
2. **Audit Trail**: History tables for inquiries and offers
3. **Soft Deletes**: Use status flags instead of hard deletes
4. **Timestamps**: All tables have created_at and updated_at
5. **Foreign Keys**: Enforce referential integrity where applicable

## Entity Relationship Diagram

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Clients   │────────<│  Inquiries  │>────────│   Offers    │
└─────────────┘         └─────────────┘         └─────────────┘
      │                       │                       │
      │                       │                       │
      ▼                       ▼                       ▼
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│ Investments │         │   Products  │         │  Employees  │
└─────────────┘         └─────────────┘         └─────────────┘
```

## Table Definitions

### 1. inquiries (Primary CRUD Table)

Stores all client inquiries from various sources.

```sql
CREATE TABLE inquiries (
  id VARCHAR(50) PRIMARY KEY,
  source VARCHAR(20) NOT NULL CHECK (source IN ('API', 'Web', 'Mobile', 'Email', 'Phone', 'Walk-in')),
  client_id VARCHAR(50) NOT NULL,
  product_id VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Pending', 'Converted', 'Rejected', 'Cancelled')),
  requested_amount DECIMAL(15, 2) NOT NULL CHECK (requested_amount > 0),
  additional_remark TEXT,
  created_by VARCHAR(50) NOT NULL,
  assigned_to VARCHAR(50),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  
  -- Indexes
  INDEX idx_client_id (client_id),
  INDEX idx_product_id (product_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at),
  INDEX idx_assigned_to (assigned_to),
  
  -- Foreign keys (to reference data)
  FOREIGN KEY (client_id) REFERENCES clients(id),
  FOREIGN KEY (product_id) REFERENCES products(product_code),
  FOREIGN KEY (created_by) REFERENCES employees(id),
  FOREIGN KEY (assigned_to) REFERENCES employees(id)
);

-- Trigger to auto-update updated_at
CREATE TRIGGER update_inquiries_updated_at
  BEFORE UPDATE ON inquiries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

**Field Descriptions**:
- `id`: Auto-generated format: "INQ-YYYYMMDD-XXX"
- `source`: Origin of the inquiry
- `client_id`: Reference to client who made the inquiry
- `product_id`: Product being inquired about
- `status`: Current inquiry status
- `requested_amount`: Amount client wants to invest
- `additional_remark`: Free text notes
- `created_by`: Employee who created the record
- `assigned_to`: Employee assigned to handle the inquiry
- `deleted_at`: Soft delete timestamp

### 2. offers (Primary CRUD Table)

Stores offers created in response to inquiries.

```sql
CREATE TABLE offers (
  id VARCHAR(50) PRIMARY KEY,
  inquiry_id VARCHAR(50) NOT NULL,
  client_id VARCHAR(50) NOT NULL,
  product_id VARCHAR(50) NOT NULL,
  investment_amount DECIMAL(15, 2) NOT NULL CHECK (investment_amount > 0),
  expected_return VARCHAR(50) NOT NULL,
  maturity_date DATE NOT NULL,
  additional_remarks TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'Proposal' CHECK (status IN ('Proposal', 'Draft', 'Wait', 'Sent', 'Accepted', 'Confirmed', 'Rejected', 'Expired')),
  final_approval_flag BOOLEAN NOT NULL DEFAULT FALSE,
  created_by VARCHAR(50) NOT NULL,
  approved_by VARCHAR(50),
  sent_date TIMESTAMP,
  response_date TIMESTAMP,
  expiry_date DATE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  
  -- Indexes
  INDEX idx_inquiry_id (inquiry_id),
  INDEX idx_client_id (client_id),
  INDEX idx_product_id (product_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at),
  INDEX idx_expiry_date (expiry_date),
  
  -- Foreign keys
  FOREIGN KEY (inquiry_id) REFERENCES inquiries(id),
  FOREIGN KEY (client_id) REFERENCES clients(id),
  FOREIGN KEY (product_id) REFERENCES products(product_code),
  FOREIGN KEY (created_by) REFERENCES employees(id),
  FOREIGN KEY (approved_by) REFERENCES employees(id)
);

-- Trigger to auto-update updated_at
CREATE TRIGGER update_offers_updated_at
  BEFORE UPDATE ON offers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger to set expiry_date on status change to 'Sent'
CREATE TRIGGER set_offer_expiry_date
  BEFORE UPDATE ON offers
  FOR EACH ROW
  WHEN (NEW.status = 'Sent' AND OLD.status != 'Sent')
  EXECUTE FUNCTION set_expiry_date();
```

**Field Descriptions**:
- `id`: Auto-generated format: "OFF-YYYYMMDD-XXX"
- `inquiry_id`: Reference to source inquiry
- `investment_amount`: Offered investment amount
- `expected_return`: Expected return rate
- `maturity_date`: When the investment matures
- `final_approval_flag`: Whether offer has been approved internally
- `approved_by`: Employee who approved the offer
- `sent_date`: When offer was sent to client
- `response_date`: When client responded
- `expiry_date`: When offer expires (auto-set to sent_date + 30 days)

### 3. inquiry_history (Audit Trail)

Tracks all changes to inquiries.

```sql
CREATE TABLE inquiry_history (
  id SERIAL PRIMARY KEY,
  inquiry_id VARCHAR(50) NOT NULL,
  field_name VARCHAR(100) NOT NULL,
  old_value TEXT,
  new_value TEXT,
  changed_by VARCHAR(50) NOT NULL,
  changed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  -- Indexes
  INDEX idx_inquiry_id (inquiry_id),
  INDEX idx_changed_at (changed_at),
  
  -- Foreign keys
  FOREIGN KEY (inquiry_id) REFERENCES inquiries(id),
  FOREIGN KEY (changed_by) REFERENCES employees(id)
);
```

### 4. offer_history (Audit Trail)

Tracks all changes to offers.

```sql
CREATE TABLE offer_history (
  id SERIAL PRIMARY KEY,
  offer_id VARCHAR(50) NOT NULL,
  field_name VARCHAR(100) NOT NULL,
  old_value TEXT,
  new_value TEXT,
  changed_by VARCHAR(50) NOT NULL,
  changed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  -- Indexes
  INDEX idx_offer_id (offer_id),
  INDEX idx_changed_at (changed_at),
  
  -- Foreign keys
  FOREIGN KEY (offer_id) REFERENCES offers(id),
  FOREIGN KEY (changed_by) REFERENCES employees(id)
);
```

### 5. templates (Reference/Static Data)

Pre-defined offer templates.

```sql
CREATE TABLE templates (
  template_id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  -- Indexes
  INDEX idx_is_active (is_active)
);
```

### 6. clients (Reference/Mock Data)

Client profile information.

```sql
CREATE TABLE clients (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(200) NOT NULL UNIQUE,
  phone VARCHAR(50),
  status VARCHAR(20) NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Suspended')),
  registration_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_activity_date TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  -- Indexes
  INDEX idx_email (email),
  INDEX idx_status (status)
);
```

### 7. employees (Reference/Mock Data)

Employee/admin user information.

```sql
CREATE TABLE employees (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(200) NOT NULL UNIQUE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('Admin', 'Manager', 'Agent')),
  department VARCHAR(100),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  -- Indexes
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_is_active (is_active)
);
```

### 8. investments (Reference/Mock Data)

Client investment profiles for suitability assessment.

```sql
CREATE TABLE investments (
  client_id VARCHAR(50) PRIMARY KEY,
  kyc VARCHAR(20) NOT NULL CHECK (kyc IN ('Completed', 'Pending', 'Expired', 'Not Started')),
  suit VARCHAR(20) NOT NULL CHECK (suit IN ('Conservative', 'Moderate', 'Aggressive')),
  risk VARCHAR(20) NOT NULL CHECK (risk IN ('Low', 'Medium', 'High')),
  amlo VARCHAR(20) NOT NULL CHECK (amlo IN ('Pass', 'Pending', 'Fail')),
  total_aum DECIMAL(15, 2) NOT NULL DEFAULT 0,
  last_review_date DATE,
  next_review_date DATE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  -- Foreign keys
  FOREIGN KEY (client_id) REFERENCES clients(id)
);
```

### 9. products (Reference/Mock Data)

Financial product catalog.

```sql
CREATE TABLE products (
  product_code VARCHAR(50) PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('Fund', 'Bond', 'Equity', 'Alternative')),
  risk_level VARCHAR(20) NOT NULL CHECK (risk_level IN ('Low', 'Medium', 'High')),
  min_investment DECIMAL(15, 2) NOT NULL,
  expected_return VARCHAR(50),
  maturity_period VARCHAR(50),
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  -- Indexes
  INDEX idx_category (category),
  INDEX idx_risk_level (risk_level),
  INDEX idx_is_active (is_active)
);
```

## Database Functions and Triggers

### Update Timestamp Function

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### Set Offer Expiry Date Function

```sql
CREATE OR REPLACE FUNCTION set_expiry_date()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'Sent' AND OLD.status != 'Sent' THEN
    NEW.expiry_date = CURRENT_DATE + INTERVAL '30 days';
    NEW.sent_date = CURRENT_TIMESTAMP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### Audit Trail Trigger Function (Inquiry)

```sql
CREATE OR REPLACE FUNCTION log_inquiry_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO inquiry_history (inquiry_id, field_name, old_value, new_value, changed_by)
    VALUES (NEW.id, 'status', OLD.status, NEW.status, NEW.created_by);
  END IF;
  
  IF OLD.assigned_to IS DISTINCT FROM NEW.assigned_to THEN
    INSERT INTO inquiry_history (inquiry_id, field_name, old_value, new_value, changed_by)
    VALUES (NEW.id, 'assigned_to', OLD.assigned_to, NEW.assigned_to, NEW.created_by);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER inquiry_audit_trigger
  AFTER UPDATE ON inquiries
  FOR EACH ROW
  EXECUTE FUNCTION log_inquiry_changes();
```

### Audit Trail Trigger Function (Offer)

```sql
CREATE OR REPLACE FUNCTION log_offer_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO offer_history (offer_id, field_name, old_value, new_value, changed_by)
    VALUES (NEW.id, 'status', OLD.status, NEW.status, NEW.created_by);
  END IF;
  
  IF OLD.final_approval_flag IS DISTINCT FROM NEW.final_approval_flag THEN
    INSERT INTO offer_history (offer_id, field_name, old_value, new_value, changed_by)
    VALUES (NEW.id, 'final_approval_flag', OLD.final_approval_flag::TEXT, NEW.final_approval_flag::TEXT, NEW.created_by);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER offer_audit_trigger
  AFTER UPDATE ON offers
  FOR EACH ROW
  EXECUTE FUNCTION log_offer_changes();
```

## Sample Queries

### Get Inquiries with Client and Product Details

```sql
SELECT 
  i.id,
  i.source,
  i.status,
  i.requested_amount,
  c.name AS client_name,
  c.email AS client_email,
  p.name AS product_name,
  p.risk_level,
  e.name AS assigned_to_name,
  i.created_at
FROM inquiries i
  INNER JOIN clients c ON i.client_id = c.id
  INNER JOIN products p ON i.product_id = p.product_code
  LEFT JOIN employees e ON i.assigned_to = e.id
WHERE i.deleted_at IS NULL
ORDER BY i.created_at DESC;
```

### Get Offers with Full Details

```sql
SELECT 
  o.id,
  o.status,
  o.investment_amount,
  o.expected_return,
  o.maturity_date,
  c.name AS client_name,
  p.name AS product_name,
  i.id AS inquiry_id,
  e1.name AS created_by_name,
  e2.name AS approved_by_name,
  o.final_approval_flag,
  o.created_at
FROM offers o
  INNER JOIN clients c ON o.client_id = c.id
  INNER JOIN products p ON o.product_id = p.product_code
  INNER JOIN inquiries i ON o.inquiry_id = i.id
  INNER JOIN employees e1 ON o.created_by = e1.id
  LEFT JOIN employees e2 ON o.approved_by = e2.id
WHERE o.deleted_at IS NULL
ORDER BY o.created_at DESC;
```

### Get Inquiry History

```sql
SELECT 
  ih.changed_at,
  ih.field_name,
  ih.old_value,
  ih.new_value,
  e.name AS changed_by_name
FROM inquiry_history ih
  INNER JOIN employees e ON ih.changed_by = e.id
WHERE ih.inquiry_id = 'INQ-20231115-001'
ORDER BY ih.changed_at DESC;
```

### Dashboard Statistics

```sql
-- Inquiry statistics
SELECT 
  status,
  COUNT(*) as count,
  SUM(requested_amount) as total_amount
FROM inquiries
WHERE deleted_at IS NULL
GROUP BY status;

-- Offer conversion rate
SELECT 
  COUNT(DISTINCT i.id) as total_inquiries,
  COUNT(DISTINCT o.id) as total_offers,
  ROUND(COUNT(DISTINCT o.id) * 100.0 / COUNT(DISTINCT i.id), 2) as conversion_rate
FROM inquiries i
  LEFT JOIN offers o ON i.id = o.inquiry_id AND o.deleted_at IS NULL
WHERE i.deleted_at IS NULL;
```

## Indexes Strategy

1. **Primary Keys**: Automatically indexed
2. **Foreign Keys**: Indexed for join performance
3. **Filter Columns**: Status, dates, active flags
4. **Search Columns**: Email, client/product names

## Data Retention Policy

- **Active Records**: Kept indefinitely
- **Soft Deleted**: Retained for 2 years
- **Audit Logs**: Retained for 7 years
- **Hard Delete**: After retention period via scheduled job

## Backup Strategy

1. **Daily Full Backups**: All tables
2. **Hourly Incremental**: Transaction tables (inquiries, offers)
3. **Point-in-Time Recovery**: Enabled
4. **Backup Retention**: 30 days

## Migration Files

Create migrations in order:

1. `001_create_reference_tables.sql` - templates, clients, employees, products, investments
2. `002_create_transaction_tables.sql` - inquiries, offers
3. `003_create_audit_tables.sql` - inquiry_history, offer_history
4. `004_create_functions_triggers.sql` - All functions and triggers
5. `005_create_indexes.sql` - Additional indexes

## Seeding Data

Order of seeding:
1. employees (required for foreign keys)
2. clients
3. investments (requires clients)
4. products
5. templates
6. Sample inquiries (optional)
7. Sample offers (optional)

---

**Note**: This schema is designed for PostgreSQL but can be adapted for MySQL by adjusting:
- `SERIAL` → `AUTO_INCREMENT`
- `BOOLEAN` → `TINYINT(1)`
- Function syntax
- Trigger syntax
