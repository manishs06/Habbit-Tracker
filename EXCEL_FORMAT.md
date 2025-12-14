# Excel File Format Guide

This document describes the supported Excel file formats and best practices for uploading files to Excel Manager.

## Supported File Formats

- **.xlsx** - Excel 2007 and later (Recommended)
- **.xls** - Excel 97-2003
- **.csv** - Comma-separated values

## File Size Limits

- Maximum file size: **10MB**
- For larger files, consider splitting into multiple sheets or files

## File Structure Recommendations

### Best Practices

1. **Headers in First Row**
   - Always include column headers in the first row
   - Use clear, descriptive header names
   - Avoid special characters in headers

2. **Data Types**
   - The system automatically detects column types (number, date, string)
   - For best results:
     - Use consistent data formats within columns
     - Format dates as dates (not text)
     - Use numbers for numeric data

3. **Multiple Sheets**
   - Files can contain multiple sheets
   - Each sheet is processed independently
   - Sheet names should be descriptive

4. **Empty Cells**
   - Empty cells are supported
   - They will appear as empty strings in the application

### Example Structure

```
| Name        | Age | Email              | Salary  | Join Date |
|-------------|-----|--------------------|---------|-----------|
| John Doe    | 30  | john@example.com   | 50000   | 2020-01-15|
| Jane Smith  | 25  | jane@example.com   | 60000   | 2019-06-20|
| Bob Johnson | 35  | bob@example.com    | 55000   | 2021-03-10|
```

## Data Type Detection

The system automatically detects column types:

- **Number**: Columns with numeric values
- **Date**: Columns with date values
- **String**: Text data (default)

## Chart Visualization

For best chart results:

1. **Line/Bar Charts**
   - Requires one categorical column (X-axis)
   - Requires one numeric column (Y-axis)
   - Example: Date vs Sales, Category vs Count

2. **Pie Charts**
   - Requires one categorical column
   - Shows distribution of categories
   - Example: Product categories, Regions

## Common Issues

### Issue: Data not displaying correctly
- **Solution**: Ensure first row contains headers
- Check for merged cells (may cause issues)

### Issue: Dates not recognized
- **Solution**: Format dates in Excel before uploading
- Use standard date formats (YYYY-MM-DD, MM/DD/YYYY)

### Issue: Numbers treated as text
- **Solution**: Format cells as numbers in Excel
- Remove any text formatting or special characters

## Sample Files

You can create sample Excel files with the following structure:

### Sales Data Example
- Sheet: "Sales"
- Columns: Date, Product, Quantity, Price, Total

### Employee Data Example
- Sheet: "Employees"
- Columns: Name, Department, Salary, Start Date

### Inventory Example
- Sheet: "Inventory"
- Columns: Item, Category, Stock, Price

## Tips

1. **Clean Data**: Remove unnecessary formatting before upload
2. **Consistent Format**: Keep data formats consistent within columns
3. **Descriptive Names**: Use clear sheet and column names
4. **Backup**: Keep original files as backup
5. **Test**: Upload a small test file first to verify format

## Limitations

- Maximum 10MB file size
- Very large datasets may take time to process
- Complex Excel formulas are not preserved (only values)
- Charts and images in Excel files are not imported

