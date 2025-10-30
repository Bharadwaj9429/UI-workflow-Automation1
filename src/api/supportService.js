import httpService from '@/core/http.service';

const BASE_URL = '/tickets'; // e.g., /tickets

const supportService = {
  async createTicket(data) {
    try {
      const response = await httpService.post(BASE_URL, data);
      return response.data;
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw error;
    }
  },

  async getTickets() {
    try {
      const response = await httpService.get(BASE_URL);
      // Mock data for demonstration
      const mockData = [
        { id: '1', subject: 'Login issue', description: 'Cannot log in to the portal.', priority: 'High', status: 'Open', estimatedHours: 2, createdAt: '2023-01-01T10:00:00Z' },
        { id: '2', subject: 'Forgot password link broken', description: 'Reset password link not working.', priority: 'Medium', status: 'In Progress', estimatedHours: 1, createdAt: '2023-01-02T11:30:00Z' },
        { id: '3', subject: 'Feature request: Dark mode', description: 'Please add a dark mode option.', priority: 'Low', status: 'Resolved', estimatedHours: 5, createdAt: '2023-01-03T14:00:00Z' }
      ];
      return response.data || mockData;
    } catch (error) {
      console.error('Error fetching tickets:', error);
      throw error;
    }
  },

  async getTicketById(id) {
    try {
      const response = await httpService.get(`${BASE_URL}/${id}`);
      // Mock data for demonstration
      const mockData = { id, subject: 'Login issue', description: 'Cannot log in to the portal. Getting a 500 error.', priority: 'High', status: 'Open', estimatedHours: 2, attachments: [{ uid: '1', name: 'error_screenshot.png', status: 'done', url: '/api/files/1' }], comments: [{id:'c1', author:'User1', text:'Have you tried clearing cache?', timestamp:'2023-01-01T10:30:00Z'}] };
      return response.data || mockData;
    } catch (error) {
      console.error('Error fetching ticket by ID:', error);
      throw error;
    }
  },

  async updateTicket(id, data) {
    try {
      const response = await httpService.put(`${BASE_URL}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating ticket:', error);
      throw error;
    }
  },

  async deleteTicket(id) {
    try {
      const response = await httpService.delete(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting ticket:', error);
      throw error;
    }
  },
  async addCommentToTicket(ticketId, commentText) {
    try {
      const response = await httpService.post(`${BASE_URL}/${ticketId}/comments`, { text: commentText });
      console.log('Comment added:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },
};

export default supportService;
