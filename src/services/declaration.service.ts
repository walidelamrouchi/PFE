import axios from 'axios';

const API_URL = 'http://localhost/PFE/api';

export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface ObjetData {
  title: string;
  description: string;
  category_id: number;
  image_url: string;
}

export interface DeclarationData {
  objet: ObjetData;
  type: "lost" | "found";
  location: string;
  date_incident: string;
  contact_email: string;
  auth_question?: string;
  auth_answer?: string;
  user_id: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

interface UploadResponse {
  success: boolean;
  message: string;
  filename: string;
  url: string;
}

export interface DeclarationListItem {
  declaration_id: number;
  type: 'lost' | 'found';
  location: string;
  date_incident: string;
  contact_email: string;
  declaration_created_at: string;
  objet_id: number;
  title: string;
  description: string;
  image_url: string;
  category_id: number;
  objet_created_at: string;
  category_name: string;
  category_description: string;
  auth_question?: string;   
  auth_answer?: string; 
  returned?: number;
  user_id: number;
}

class DeclarationService {
  private getAuthHeader() {
    const user = localStorage.getItem('user');
    if (!user) return {};
    const { id } = JSON.parse(user);
    return { 'X-User-ID': id };
  }

  async getCategories(): Promise<Category[]> {
    const response = await axios.get<ApiResponse<Category[]>>(`${API_URL}/declarations/categories.php`);
    return response.data.data || [];
  }

  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await axios.post<UploadResponse>(`${API_URL}/declarations/upload.php`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...this.getAuthHeader()
      },
    });

    if (!response.data.success) {
      throw new Error(response.data.message || 'Erreur lors de l\'upload de l\'image');
    }

    return response.data.url;
  }

  async createDeclaration(data: DeclarationData): Promise<ApiResponse<void>> {
    const response = await axios.post<ApiResponse<void>>(`${API_URL}/declarations/declare.php`, data, {
      headers: this.getAuthHeader()
    });
    return response.data;
  }

  async getMyDeclarations(): Promise<DeclarationListItem[]> {
    const response = await axios.get<ApiResponse<DeclarationListItem[]>>(`${API_URL}/declarations/list.php`, {
      headers: this.getAuthHeader()
    });
    return response.data.data || [];
  }

  async getDeclarationDetail(id: number): Promise<DeclarationListItem | null> {
    const response = await axios.get<ApiResponse<DeclarationListItem>>(`${API_URL}/declarations/detail.php?id=${id}`, {
      headers: this.getAuthHeader()
    });
    return response.data.data || null;
  }

  async updateDeclaration(id: number, data: DeclarationData): Promise<ApiResponse<void>> {
    const response = await axios.put<ApiResponse<void>>(`${API_URL}/declarations/update.php?id=${id}`, data, {
      headers: this.getAuthHeader()
    });
    return response.data;
  }

  async markAsReturned(id: number): Promise<ApiResponse<void>> {
    const response = await axios.post<ApiResponse<void>>(`${API_URL}/declarations/mark_returned.php`, { id }, {
      headers: this.getAuthHeader()
    });
    return response.data;
  }

  async deleteDeclaration(id: number): Promise<ApiResponse<void>> {
    const response = await axios.delete<ApiResponse<void>>(`${API_URL}/declarations/delete.php?id=${id}`, {
      headers: this.getAuthHeader()
    });
    return response.data;
  }
}

export default new DeclarationService(); 