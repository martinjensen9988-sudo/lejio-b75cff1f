-- ============================================
-- STEP 1: DROP ALL EXISTING FRI_* TABLES
-- ============================================
-- Run this FIRST in Azure Portal Query Editor
-- Location: Azure Portal > SQL Database (lejio-fri) > Query Editor

DROP TABLE IF EXISTS fri_api_keys;
DROP TABLE IF EXISTS fri_audit_logs;
DROP TABLE IF EXISTS fri_custom_domains;
DROP TABLE IF EXISTS fri_page_blocks;
DROP TABLE IF EXISTS fri_pages;
DROP TABLE IF EXISTS fri_payments;
DROP TABLE IF EXISTS fri_invoices;
DROP TABLE IF EXISTS fri_bookings;
DROP TABLE IF EXISTS fri_vehicle_maintenance;
DROP TABLE IF EXISTS fri_vehicles;
DROP TABLE IF EXISTS fri_customers;
DROP TABLE IF EXISTS fri_lessor_team_members;
DROP TABLE IF EXISTS fri_lessors;

-- Verify all tables are dropped:
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME LIKE 'fri_%'
ORDER BY TABLE_NAME;
