import { supabase } from './supabase';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as XLSX from 'xlsx';

class ExportService {
  constructor() {
    this.exportPermissions = new Map();
  }

  async generateExcelFile(boxes) {
    try {
      // Prepare data for Excel
      const data = boxes.map(box => ({
        'Barcode ID': box.barcode_id,
        'Client Name': box.client_name,
        'Goods Description': box.goods_description,
        'Length (cm)': box.length,
        'Width (cm)': box.width,
        'Height (cm)': box.height,
        'Weight (kg)': box.weight,
        'Created At': new Date(box.created_at).toLocaleString(),
      }));
      
      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(data);
      
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Boxes');
      
      // Generate Excel file
      const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
      
      // Save file to local storage
      const fileName = `LogiX_Export_${new Date().toISOString().split('T')[0]}.xlsx`;
      const filePath = `${FileSystem.documentDirectory}${fileName}`;
      
      await FileSystem.writeAsStringAsync(filePath, wbout, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      return filePath;
    } catch (error) {
      console.error('Error generating Excel file:', error);
      throw error;
    }
  }

  async shareFile(filePath, recipientEmail, message) {
    try {
      // Generate a unique access token
      const accessToken = this.generateAccessToken();
      
      // Store the export permission
      this.exportPermissions.set(accessToken, {
        filePath,
        recipientEmail,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days expiry
      });

      // Upload file to Supabase Storage
      const fileName = filePath.split('/').pop();
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('exports')
        .upload(`${accessToken}/${fileName}`, filePath);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('exports')
        .getPublicUrl(`${accessToken}/${fileName}`);

      // Send email with download link
      await this.sendExportEmail(recipientEmail, publicUrl, message);

      return {
        success: true,
        accessToken,
        expiresAt: this.exportPermissions.get(accessToken).expiresAt,
      };
    } catch (error) {
      console.error('Error sharing file:', error);
      throw error;
    }
  }

  async revokeAccess(accessToken) {
    try {
      // Delete file from storage
      const { error: deleteError } = await supabase.storage
        .from('exports')
        .remove([`${accessToken}`]);

      if (deleteError) throw deleteError;

      // Remove permission
      this.exportPermissions.delete(accessToken);

      return { success: true };
    } catch (error) {
      console.error('Error revoking access:', error);
      throw error;
    }
  }

  generateAccessToken() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  async sendExportEmail(recipientEmail, downloadUrl, message) {
    try {
      const { error } = await supabase.functions.invoke('send-export-email', {
        body: {
          recipientEmail,
          downloadUrl,
          message,
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error sending export email:', error);
      throw error;
    }
  }

  async cleanupExpiredExports() {
    const now = new Date();
    for (const [token, permission] of this.exportPermissions.entries()) {
      if (permission.expiresAt < now) {
        await this.revokeAccess(token);
      }
    }
  }
}

export const exportService = new ExportService(); 