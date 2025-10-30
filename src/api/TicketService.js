import httpService from '@/core/http.service';
import { message } from 'antd';

// Mock data store for demonstration purposes
let mockTickets = [
  {
    id: 'TKT001',
    subject: 'Laptop not booting up',
    description: 'My work laptop is not booting. It shows a blank screen after the manufacturer logo.',
    priority: 'High',
    category: 'Technical',
    status: 'Open',
    createdAt: '2023-10-26T10:00:00Z',
    updatedAt: '2023-10-26T10:00:00Z',
    attachments: [],
    comments: [
      { id: 'CMT001', author: 'Support Agent', content: 'Please try restarting in safe mode.', timestamp: '2023-10-26T10:30:00Z' }
    ]
  },
  {
    id: 'TKT002',
    subject: 'Invoice #202309-005 discrepancy',
    description: 'The amount on the latest invoice does not match the agreed-upon services.',
    priority: 'Medium',
    category: 'Billing',
    status: 'Pending Review',
    createdAt: '2023-10-25T14:30:00Z',
    updatedAt: '2023-10-25T14:30:00Z',
    attachments: [],
    comments: []
  }
];

const TicketService = {
  async getTickets() {
    try {
      // In a real app, this would be: const response = await httpService.get('/tickets');
      // return response.data;
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call delay
      return mockTickets.filter(ticket => ticket.status !== 'Closed').sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (error) {
      console.error('Error fetching tickets:', error);
      message.error('Failed to fetch tickets.');
      throw error;
    }
  },

  async getTicketById(id) {
    try {
      // const response = await httpService.get(`/tickets/${id}`);
      // return response.data;
      await new Promise(resolve => setTimeout(resolve, 500));
      const ticket = mockTickets.find(t => t.id === id);
      if (!ticket) {
        throw new Error('Ticket not found');
      }
      return { ...ticket }; // Return a clone to prevent direct modification
    } catch (error) {
      console.error(`Error fetching ticket ${id}:`, error);
      message.error(`Failed to fetch ticket ${id}.`);
      throw error;
    }
  },

  async createTicket(data) {
    try {
      // const response = await httpService.post('/tickets', data);
      // return response.data;
      await new Promise(resolve => setTimeout(resolve, 500));
      const newTicket = {
        id: `TKT${String(mockTickets.length + 1).padStart(3, '0')}`,
        ...data,
        status: 'Open', // Default status for new tickets
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        comments: [],
        attachments: data.attachments?.map(file => ({ name: file.name, url: URL.createObjectURL(file.originFileObj) })) || []
      };
      mockTickets.push(newTicket);
      message.success('Ticket created successfully!');
      return newTicket;
    } catch (error) {
      console.error('Error creating ticket:', error);
      message.error('Failed to create ticket.');
      throw error;
    }
  },

  async updateTicket(id, data) {
    try {
      // const response = await httpService.put(`/tickets/${id}`, data);
      // return response.data;
      await new Promise(resolve => setTimeout(resolve, 500));
      const index = mockTickets.findIndex(t => t.id === id);
      if (index > -1) {
        mockTickets[index] = {
          ...mockTickets[index],
          ...data,
          updatedAt: new Date().toISOString()
        };
        message.success('Ticket updated successfully!');
        return mockTickets[index];
      } else {
        throw new Error('Ticket not found');
      }
    } catch (error) {
      console.error(`Error updating ticket ${id}:`, error);
      message.error(`Failed to update ticket ${id}.`);
      throw error;
    }
  },

  async addComment(ticketId, commentContent) {
    try {
      // const response = await httpService.post(`/tickets/${ticketId}/comments`, { content: commentContent });
      // return response.data;
      await new Promise(resolve => setTimeout(resolve, 500));
      const ticket = mockTickets.find(t => t.id === ticketId);
      if (ticket) {
        const newComment = {
          id: `CMT${String(ticket.comments.length + 1).padStart(3, '0')}`,
          author: 'Current User', // Placeholder
          content: commentContent,
          timestamp: new Date().toISOString()
        };
        ticket.comments.push(newComment);
        ticket.updatedAt = new Date().toISOString();
        message.success('Comment added successfully!');
        return newComment;
      } else {
        throw new Error('Ticket not found');
      }
    } catch (error) {
      console.error(`Error adding comment to ticket ${ticketId}:`, error);
      message.error('Failed to add comment.');
      throw error;
    }
  }
};

export default TicketService;
